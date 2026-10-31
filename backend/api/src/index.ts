import cors, { CorsOptions } from "cors";
import express, { Request, Response } from "express";
import { LRUCache } from "lru-cache";
import playwright, { Browser, Page } from "playwright";
import { debugging, minimal_args, origins, web as root } from "./utils/const";
import {
  base64toFile,
  joinedParams,
  logTimestamp,
  uploadImageToR2,
} from "./utils/tools";

// ----------------------------------------------

const app = express();

const MAX_CONCURRENT_PAGES = 10;

type CachedPage = {
  page: Page;
  activeRequests: number;
  evicted: boolean;
  closed: boolean;
};

const closeEvictedPage = (entry: CachedPage) => {
  if (!entry.evicted || entry.activeRequests > 0 || entry.closed) return;

  entry.closed = true;
  void entry.page
    .context()
    .close()
    .catch((error) => console.error("Failed to close an evicted page", error));
};

const disposePage = (entry: CachedPage) => {
  entry.evicted = true;
  closeEvictedPage(entry);
};

const smallPages = new LRUCache<string, CachedPage>({
  // cap by number of tabs
  max: MAX_CONCURRENT_PAGES,
  dispose: disposePage,
});

const largePages = new LRUCache<string, CachedPage>({
  // cap by number of tabs
  max: MAX_CONCURRENT_PAGES,
  dispose: disposePage,
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
): Promise<[Page, boolean, () => void]> => {
  const reference = type === "small" ? smallPages : largePages;
  // get cached page by url instead of just id, allowing multiple pages of the same id
  const cachedPage = reference.get(url);
  if (cachedPage) {
    cachedPage.activeRequests += 1;
    return [
      cachedPage.page,
      false,
      () => {
        cachedPage.activeRequests -= 1;
        closeEvictedPage(cachedPage);
      },
    ];
  }

  const context = await browser.newContext();

  await context.addInitScript(() => {
    window.__PLAYWRIGHT_SERVER__ = true;
  });

  const page = await context.newPage();

  type === "small" &&
    (await page.setViewportSize({ width: 1350, height: 450 }));

  const entry: CachedPage = {
    page,
    activeRequests: 1,
    evicted: false,
    closed: false,
  };
  reference.set(url, entry);

  return [
    page,
    true,
    () => {
      entry.activeRequests -= 1;
      closeEvictedPage(entry);
    },
  ];
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
  let timeout: ReturnType<typeof setTimeout> | undefined;

  await Promise.race([
    (async () => {
      firstTime
        ? await page.goto(link)
        : await page.evaluate(
            async () =>
              window.refreshDiscordStatus &&
              (await window.refreshDiscordStatus()),
          );
      await waitForImgs(page, link);
    })(),
    new Promise<void>((resolve) => {
      timeout = setTimeout(resolve, 1500); // abort all waiting after 1500ms
    }),
  ]);

  if (timeout) clearTimeout(timeout);
};

// ----------------------------------------------
// main logic

const processCard = async (
  req: Request,
  res: Response,
  type: "small" | "large",
) => {
  let finishPageRequest: (() => void) | undefined;

  try {
    const startTime = performance.now();

    const id: string = String(req.params.id);
    if (!id) {
      res.status(400).send("Bad Request");
      return null;
    }

    const frontendLink = `${root}/${type}card?id=${id}&${joinedParams(req)}`;

    const [page, firstTime, finishRequest] = await selectPage(
      id,
      frontendLink,
      type,
    );
    finishPageRequest = finishRequest;

    await processPage(page, firstTime, frontendLink);

    const screenshotBuffer = await page
      .locator(`#disi-${type}-card`)
      .screenshot({ type: "png", animations: "disabled" });

    res.set("Content-Type", "image/png");
    res.send(screenshotBuffer);

    const totalTime = Math.round(performance.now() - startTime);

    logTimestamp(type, "png", id, totalTime);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    finishPageRequest?.();
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

app.post("/banners", async (req, res) => {
  try {
    const { image, userId } = req.body as { image: string; userId: string };
    if (!image || !userId) {
      res.status(400).send("Bad Request");
      return null;
    }
    const blob = base64toFile(image);
    if (!blob) {
      res.status(400).send("Bad Request");
      return null;
    }
    const id = await uploadImageToR2(userId, "banners", blob);
    res.status(201).json({ id });
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
