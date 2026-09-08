import cors, { CorsOptions } from "cors";
import express, { Request, Response } from "express";
import { LRUCache } from "lru-cache";
import playwright, { Browser, Page } from "playwright";
import { expect } from "playwright/test";
import { uploadBannerImage } from "./pocketbase";
import { debugging, minimal_args, origins, web as root } from "./utils/const";
import { base64toFile, joinedParams, logTimestamp } from "./utils/tools";

const app = express();

const smallPages = new Map<string, Page>();
const largePages = new Map<string, Page>();

let browser: Browser;

// ----------------------------------------------
// express

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);

    if (origins.includes(origin) || debugging) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.use((_, res, next) => {
  res.header({
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "Mon, 01 Jan 1990 00:00:00 GMT",
    "Last-Modified": "Mon, 01 Jan 2999 00:00:00 GMT",
    "Surrogate-Control": "no-store",
  });
  next();
});

app.use(express.json({ limit: "16mb" }));

app.set("etag", false);

app.get("/", (_: Request, res: Response) => {
  res.send({ message: "API of Discord Status as Image" });
});

// ----------------------------------------------
// playwright

await (async () => {
  browser = await playwright.chromium.launch({
    headless: true,
    args: minimal_args,
  });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

const imageCache = new LRUCache<string, { body: Buffer; contentType: string }>({
  // cap by RAM usage (50MB)
  maxSize: 50 * 1024 * 1024,
  sizeCalculation: (value) => {
    return value.body.length;
  },
});

async function selectPage(id: string, type: string): Promise<[Page, boolean]> {
  const reference = type === "small" ? smallPages : largePages;
  if (reference.has(id)) return [reference.get(id)!, false];

  const context = await browser.newContext();

  await context.addInitScript(() => {
    window.__PLAYWRIGHT_SERVER__ = true;
  });

  const page = await context.newPage();

  // force Playwright to intercept all requests on this page
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (request.resourceType() === "image") {
      const url = request.url();

      // instantly serve from node memory
      if (imageCache.has(url)) {
        // console.log(`image found in cache. serving from cache (${url})`);
        const cached = imageCache.get(url)!;
        return route.fulfill({
          body: cached.body,
          contentType: cached.contentType,
        });
      }

      // otherwise, fetch it once and save it
      const response = await route.fetch();
      imageCache.set(url, {
        body: await response.body(),
        contentType: response.headers()["content-type"] || "image/png",
      });
      return route.fulfill({ response });
    }
    return route.continue();
  });

  type === "small"
    ? await page.setViewportSize({ width: 1350, height: 450 })
    : await page.setViewportSize({ width: 807, height: 1500 });
  reference.set(id, page);

  return [page, true];
}

const processPage = async (page: playwright.Page, firstTime: boolean, link: string) => {
  if (firstTime) {
    await page.goto(link, { waitUntil: "networkidle" });
  } else if (page.url() !== link) {
    await page.goto(link);
    await page.locator("#avatar").waitFor();
    const images = await page.getByRole("img").all();
    await Promise.all(
      images.map(async (img) => {
        await expect(img).not.toHaveJSProperty("naturalWidth", 0);
      }),
    );
  } else {
    await page.evaluate(async () => {
      if (window.refreshDiscordStatus) await window.refreshDiscordStatus();
    });

    await page.locator("#avatar").waitFor();
    const images = await page.getByRole("img").all();
    await Promise.all(
      images.map(async (img) => {
        await expect(img).not.toHaveJSProperty("naturalWidth", 0);
      }),
    );
  }
};

// ----------------------------------------------
// main logic

app.get("/smallcard/:id", async (req: Request, res: Response) => {
  try {
    const id: string = String(req.params.id);
    if (!id) {
      res.status(400).send("Bad Request");
      return null;
    }

    try {
      const frontendLink = `${root}/smallcard?id=${id}&${joinedParams(req)}`;

      if (!frontendLink) {
        res.status(500).send("Internal Server Error");
        return;
      }

      const startBrowser = Date.now();
      const [page, firstTime]: [Page, boolean] = await selectPage(id, "small");

      await processPage(page, firstTime, frontendLink);

      const screenshotBuffer = await page.screenshot({
        clip: { x: 0, y: 0, width: 1350, height: 450 },
        type: "png",
      });
      res.set("Content-Type", "image/png");
      res.send(screenshotBuffer);
      const browserTime = Date.now() - startBrowser;

      logTimestamp("Small", "PNG", id, browserTime);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/largecard/:id", async (req: Request, res: Response) => {
  try {
    const id: string = String(req.params.id);
    if (!id) {
      res.status(400).send("Bad Request");
      return null;
    }

    try {
      const frontendLink = `${root}/largecard?id=${id}&${joinedParams(req)}`;

      if (!frontendLink) {
        res.status(500).send("Internal Server Error");
        return;
      }

      const startBrowser = Date.now();
      const [page, firstTime]: [Page, boolean] = await selectPage(id, "large");

      await processPage(page, firstTime, frontendLink);

      const maxHeight = await page.evaluate(() => {
        const elements = document.querySelectorAll("#disi-large-card");

        let maxElementHeight = 0;
        elements.forEach((element) => {
          const { height } = element.getBoundingClientRect();
          maxElementHeight = Math.max(maxElementHeight, height);
        });

        return maxElementHeight;
      });

      const screenshotBuffer = await page.screenshot({
        clip: { x: 0, y: 0, width: 807, height: maxHeight },
        type: "png",
      });
      res.set("Content-Type", "image/png");
      res.send(screenshotBuffer);
      const browserTime = Date.now() - startBrowser;

      logTimestamp("Large", "PNG", id, browserTime);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/uploadbanner", async (req, res) => {
  try {
    const { image } = req.body as { image: string };
    if (!image) {
      res.status(400).send("Bad Request");
      return null;
    }
    const blob = base64toFile(image);
    if (!blob) {
      res.status(400).send("Bad Request");
      return null;
    }
    const id = await uploadBannerImage(blob);
    res.status(200).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).send((error as Error).message);
  }
});

app.listen(1911, () => console.log(`MODE: ${process.env.NODE_ENV}\nServer is running on http://localhost:1911`));
