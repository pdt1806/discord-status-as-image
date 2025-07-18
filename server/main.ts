/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
import express, { Request, Response } from 'express';
import playwright, { Browser, Page } from 'playwright';
import { expect } from 'playwright/test';
import { debugging, refinerAPI, web } from '../src/utils/const';
import { blendColors, setSmallCardTitleSize } from '../src/utils/tools';
import { iconsListSmall } from './icons';
import { uploadBannerImage } from './pocketbase_server';
import { smallcardSvgContent } from './svgContent';
import {
  base64toFile,
  fetchRefinerData,
  getLargeCardLink,
  getSmallCardLink,
  minimal_args,
  monoBackgroundTextColor,
  urlToBase64,
} from './utils';

const root = web[debugging];

const origin = debugging ? '*' : 'https://disi.bennynguyen.dev';

const refinerEndpoint = await detectRefinerEndpoint();

const app = express();

const smallPages = new Map<string, Page>();
const largePages = new Map<string, Page>();

let browser: Browser;

// ----------------------------------------------

app.use((_, res, next) => {
  res.header({
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: 'Mon, 01 Jan 1990 00:00:00 GMT',
    'Last-Modified': 'Mon, 01 Jan 2999 00:00:00 GMT',
    'Surrogate-Control': 'no-store',
  });
  next();
});

app.use(express.json({ limit: '16mb' }));

app.set('etag', false);

app.get('/', (_: Request, res: Response) => {
  res.send({ message: 'API of Discord Status as Image' });
});

// ----------------------------------------------

async function detectRefinerEndpoint() {
  const responseOnServer = await fetch(refinerAPI.true); // detect if Refiner API is up and running locally
  if (!responseOnServer.ok) {
    console.log('Refiner API is not running locally. Using production Refiner API.');
    return refinerAPI.false;
  }
  console.log('Refiner API is running locally. Using local Refiner API.');
  return refinerAPI.true;
}

await (async () => {
  browser = await playwright.chromium.launch({
    headless: true,
    args: minimal_args,
  });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function selectPage(id: string, type: string): Promise<[Page, boolean]> {
  const reference = type === 'small' ? smallPages : largePages;
  if (reference.has(id)) return [reference.get(id)!, false];

  const context = await browser.newContext();
  const page = await context.newPage();
  type === 'small'
    ? await page.setViewportSize({ width: 1350, height: 450 })
    : await page.setViewportSize({ width: 807, height: 1500 });
  reference.set(id, page);
  return [page, true]; // true means the page is newly created
}

function logTimestamp(
  type: string,
  format: string,
  id: string,
  refinerTime: number,
  browserTime: number
) {
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  console.log(
    `[${timestamp} UTC] ${type}, ${format}, ${id}, Refiner: ${refinerTime}ms, Browser: ${browserTime}ms, Total: ${refinerTime + browserTime}ms`
  );
}

// ----------------------------------------------

app.get('/smallcard/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send('Bad Request');
      return null;
    }

    try {
      const startRefiner = Date.now();
      const requiresFullData = req.query.wantAccentColor === 'true';
      const data = await fetchRefinerData(refinerEndpoint, id, requiresFullData);
      if (data === null) {
        res.status(404).send('User not found');
        return null;
      }
      const fullLink = await getSmallCardLink(
        root,
        id,
        data,
        req.query as { [key: string]: string }
      );
      if (!fullLink) {
        res.status(500).send('Internal Server Error');
        return;
      }
      const refinerTime = Date.now() - startRefiner;

      const startBrowser = Date.now();
      const [page, firstTime]: [Page, boolean] = await selectPage(id, 'small');

      if (firstTime) {
        await page.goto(fullLink, { waitUntil: 'networkidle' });
      } else {
        await page.goto(fullLink);
        await page.locator('#avatar').waitFor();
        const images = await page.getByRole('img').all();
        await Promise.all(
          images.map(async (img) => {
            await expect(img).not.toHaveJSProperty('naturalWidth', 0);
          })
        );
      }

      const screenshotBuffer = await page.screenshot({
        clip: { x: 0, y: 0, width: 1350, height: 450 },
        type: 'png',
      });
      res.set('Content-Type', 'image/png');
      res.send(screenshotBuffer);
      const browserTime = Date.now() - startBrowser;

      logTimestamp('Small', 'PNG', id, refinerTime, browserTime);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/smallcard_svg/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send('Bad Request');
      return null;
    }

    const {
      bg,
      bg1,
      bg2,
      angle,
      created,
      activity: wantActivity,
      mood: wantMood,
      discordLabel,
      wantAccentColor,
    } = req.query as { [key: string]: string };
    try {
      const startRefiner = Date.now();
      const requiresFullData = wantAccentColor === 'true';
      const data = await fetchRefinerData(refinerEndpoint, id, requiresFullData);
      if (data === null) {
        res.status(404).send('User not found');
        return null;
      }
      const refinerTime = Date.now() - startRefiner;

      const startBrowser = Date.now();
      const avatar = await urlToBase64(data.avatar);
      const background = bg
        ? `#${bg}`
        : wantAccentColor && data.accent_color
          ? data.accent_color
          : '#2b2d31';

      let textColor = 'white';
      if (bg1) {
        const blendColor = blendColors(`#${bg1}`, `#${bg2}`);
        textColor = monoBackgroundTextColor(blendColor!);
      }
      if (bg) textColor = monoBackgroundTextColor(`#${bg}`);
      if (wantAccentColor && data.accent_color) {
        textColor = monoBackgroundTextColor(data.accent_color);
      }

      if (data.status === 'offline' && textColor === '#202225') textColor = '#5d5f6b';
      const statusImage = iconsListSmall[data.status as keyof typeof iconsListSmall];
      const displayName = data.display_name;
      const titleSize = setSmallCardTitleSize(data.display_name);
      const createdDate = created ? data.created_at : null;
      const activity = wantActivity ? data.activity : null;
      const mood = wantMood ? data.mood : null;
      const svgContent = smallcardSvgContent({
        width: 360,
        height: 120,
        bg1,
        bg2,
        background,
        angle,
        avatar,
        displayName,
        statusImage,
        createdDate,
        activity,
        mood,
        discordLabel,
        textColor,
        titleSize,
      });

      res.set({
        'Content-Type': 'image/svg+xml',
      });
      res.send(svgContent);
      const browserTime = Date.now() - startBrowser;

      logTimestamp('Small', 'SVG', id, refinerTime, browserTime);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/largecard/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send('Bad Request');
      return null;
    }

    try {
      const startRefiner = Date.now();
      const requiresFullData = [req.query.wantBannerImage, req.query.wantAccentColor].includes(
        'true'
      );
      const data = await fetchRefinerData(refinerEndpoint, id, requiresFullData);
      if (data === null) {
        res.status(404).send('User not found');
        return null;
      }
      const fullLink = await getLargeCardLink(
        root,
        id,
        data,
        req.query as { [key: string]: string }
      );
      if (!fullLink) {
        res.status(500).send('Internal Server Error');
        return;
      }
      const refinerTime = Date.now() - startRefiner;

      const startBrowser = Date.now();
      const [page, firstTime]: [Page, boolean] = await selectPage(id, 'large');

      if (firstTime) {
        await page.goto(fullLink, { waitUntil: 'networkidle' });
      } else {
        await page.goto(fullLink);
        await page.locator('#avatar').waitFor();
        const images = await page.getByRole('img').all();
        await Promise.all(
          images.map(async (img) => {
            await expect(img).not.toHaveJSProperty('naturalWidth', 0);
          })
        );
      }

      const maxHeight = await page.evaluate(() => {
        const elements = document.querySelectorAll('#disi-large-card');

        let maxElementHeight = 0;
        elements.forEach((element) => {
          const { height } = element.getBoundingClientRect();
          maxElementHeight = Math.max(maxElementHeight, height);
        });

        return maxElementHeight;
      });

      const screenshotBuffer = await page.screenshot({
        clip: { x: 0, y: 0, width: 807, height: maxHeight },
        type: 'png',
      });
      res.set('Content-Type', 'image/png');
      res.send(screenshotBuffer);
      const browserTime = Date.now() - startBrowser;

      logTimestamp('Large', 'PNG', id, refinerTime, browserTime);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/uploadbanner', async (req, res) => {
  try {
    const { image } = req.body as { image: string };
    if (!image) {
      res.status(400).send('Bad Request');
      return null;
    }
    const blob = base64toFile(image);
    if (!blob) {
      res.status(400).send('Bad Request');
      return null;
    }
    const id = await uploadBannerImage(blob);
    res.status(200).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).send((error as Error).message);
  }
});

app.listen(1911, () => console.log('Server is running on http://localhost:1911'));
