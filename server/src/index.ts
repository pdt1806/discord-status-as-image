import cors, { CorsOptions } from "cors";
import express, { Request, Response } from "express";
import { LRUCache } from "lru-cache";
import playwright, { Browser, Page } from "playwright";
import { uploadBannerImage } from "./pocketbase";
import { debugging, minimal_args, origins, web as root } from "./utils/const";
import { base64toFile, joinedParams, logTimestamp } from "./utils/tools";

// ----------------------------------------------

const app = express();

const MAX_CONCURRENT_PAGES = 100;

const smallPages = new LRUCache<string, Page>({
  // cap by number of tabs
  max: MAX_CONCURRENT_PAGES,
});

const largePages = new LRUCache<string, Page>({
  // cap by number of tabs
  max: MAX_CONCURRENT_PAGES,
});

// ----------------------------------------------
// express

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // direct URL access
    if (!origin) return callback(null, true);

    // from prod frontend or when debugging
    if (origins.includes(origin) || debugging) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

// no cache; new image every time
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

let browser: Browser;

await (async () => {
  browser = await playwright.chromium.launch({
    headless: true,
    args: minimal_args,
  });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

const selectPage = async (
  id: string,
  url: string,
  type: string,
): Promise<[Page, boolean]> => {
  const reference = type === "small" ? smallPages : largePages;
  // get cached page by url instead of just id, allowing multiple pages of the same id
  if (reference.has(url)) return [reference.get(url)!, false];

  const context = await browser.newContext();

  await context.addInitScript(() => {
    window.__PLAYWRIGHT_SERVER__ = true;
  });

  const page = await context.newPage();

  type === "small" &&
    (await page.setViewportSize({ width: 1350, height: 450 }));

  reference.set(url, page);

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
  firstTime
    ? await page.goto(link)
    : await page.evaluate(
        async () =>
          window.refreshDiscordStatus && (await window.refreshDiscordStatus()),
      );
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

    const [page, firstTime]: [Page, boolean] = await selectPage(
      id,
      frontendLink,
      type,
    );

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

// ----------------------------------------------
// api endpoints

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
