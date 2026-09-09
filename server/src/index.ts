import cors, { CorsOptions } from "cors";
import express, { Request, Response } from "express";
import { LRUCache } from "lru-cache";
import playwright, { Browser, Page } from "playwright";
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
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
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
  // cap by RAM usage (100MB)
  maxSize: 100 * 1024 * 1024,
  sizeCalculation: (value) => {
    return value.body.length;
  },
});

const selectPage = async (
  id: string,
  type: string,
): Promise<[Page, boolean]> => {
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

  type === "small" &&
    (await page.setViewportSize({ width: 1350, height: 450 }));

  reference.set(id, page);

  return [page, true];
};

const waitForImgs = async (page: Page, link: string) => {
  await page.locator("#avatar").waitFor({ state: "visible" });

  if (link.includes("largecard"))
    // verify the path before checking the params
    (link.includes("bannerID") || link.includes("bannerImage")) &&
      (await page.locator("#banner").waitFor({ state: "visible" }));

  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll("img"));

    return images.every((img) => img.complete && img.naturalWidth > 0);
  });
};

const processPage = async (page: Page, firstTime: boolean, link: string) => {
  if (firstTime || page.url() !== link) {
    await page.goto(link);
  } else {
    await page.evaluate(async () => {
      if (window.refreshDiscordStatus) await window.refreshDiscordStatus();
    });
  }
  await waitForImgs(page, link);
};

// ----------------------------------------------
// main logic

const processCard = async (
  req: Request,
  res: Response,
  type: "small" | "large",
) => {
  try {
    const startTime = performance.now();

    const id: string = String(req.params.id);
    if (!id) {
      res.status(400).send("Bad Request");
      return null;
    }

    const frontendLink = `${root}/${type}card?id=${id}&${joinedParams(req)}`;

    const [page, firstTime]: [Page, boolean] = await selectPage(id, type);

    await processPage(page, firstTime, frontendLink);

    const screenshotBuffer = await page
      .locator(`#disi-${type}-card`)
      .screenshot({ type: "png" });

    res.set("Content-Type", "image/png");
    res.send(screenshotBuffer);

    const totalTime = Math.round(performance.now() - startTime);

    logTimestamp(type, "png", id, totalTime);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

app.get(
  "/smallcard/:id",
  async (req: Request, res: Response) => await processCard(req, res, "small"),
);

app.get(
  "/largecard/:id",
  async (req: Request, res: Response) => await processCard(req, res, "large"),
);

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

app.listen(1911, () =>
  console.log(
    `NODE_ENV=${process.env.NODE_ENV}\nServer is running on http://localhost:1911`,
  ),
);
