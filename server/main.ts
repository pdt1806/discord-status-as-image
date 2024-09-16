/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer-core';
import { debugging } from '../src/env/env';
import { getBannerImage } from '../src/pocketbase_client/index';
import { bgIsLight, blendColors, hexToRgb, setSmallCardTitleSize } from '../src/utils/tools';
import { RefinerResponse } from '../src/utils/types';
import { iconsListSmall } from './icons';
import { uploadBannerImage } from './pocketbase_server';
import { smallcardSvgContent } from './svgContent';
import { base64toFile, fetchData, urlToBase64 } from './utils';

const root = debugging ? 'http://localhost:5173' : 'https://disi.bennynguyen.dev';

const origin = debugging ? '*' : 'https://disi.bennynguyen.dev';

const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
  '--headless',
];

const app = express();

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

app.get('/smallcard/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { bg, bg1, bg2, angle, created, activity, mood, discordLabel, wantAccentColor } =
      req.query;
    let link = bg1
      ? `${root}/smallcard?bg=${bg}&bg1=${bg1}&bg2=${bg2}&angle=${angle}&`
      : bg
        ? `${root}/smallcard?bg=${bg}&`
        : `${root}/smallcard?`;
    try {
      const data = await fetchData(id);
      if (data === null) {
        res.status(404).send('User not found');
        return null;
      }
      created && (link += `createdDate=${data.created_at}&`);
      discordLabel && (link += 'discordLabel=true&');
      wantAccentColor && data.accent_color && (link += `bg=${data.accent_color.replace('#', '')}&`);
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: minimal_args,
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1350, height: 450 });
      await page.goto(
        `${link}displayName=${data.display_name}&avatar=${data.avatar}&status=${data.status}&id=${id}`
      );
      activity
        ? await page.evaluate((data: RefinerResponse) => {
            localStorage.setItem('activity', JSON.stringify(data.activity));
          }, data)
        : await page.evaluate(() => {
            localStorage.removeItem('activity');
          });
      mood
        ? await page.evaluate((data: RefinerResponse) => {
            localStorage.setItem('mood', JSON.stringify(data.mood));
          }, data)
        : await page.evaluate(() => {
            localStorage.removeItem('mood');
          });
      await page.goto(
        `${link}displayName=${data.display_name}&avatar=${data.avatar}&status=${data.status}&id=${id}`,
        { waitUntil: ['networkidle0'] }
      );
      const screenshotBuffer = await page.screenshot({
        clip: { x: 0, y: 0, width: 1350, height: 450 },
      });
      res.set('Content-Type', 'image/png');
      res.send(screenshotBuffer);
      await browser.close();
    } catch (error) {
      res.status(500).send('Internal Server Error');
      console.error(error);
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

const monoBackgroundTextColor = (bg: string) => {
  const color = hexToRgb(bg);
  return bgIsLight(color!) ? '#202225' : 'white';
};

app.get('/smallcard_svg/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
      const data = await fetchData(id);
      if (data === null) {
        res.status(404).send('User not found');
        return null;
      }
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
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/largecard/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      bg,
      bg1,
      bg2,
      created,
      aboutMe,
      pronouns,
      wantBannerImage,
      wantAccentColor,
      activity,
      mood,
      bannerColor,
      bannerID,
      bannerImage,
      discordLabel,
    } = req.query as { [key: string]: string };
    let link = bg1
      ? `${root}/largecard?bg=${bg}&bg1=${bg1}&bg2=${bg2}&`
      : bg
        ? `${root}/largecard?bg=${bg}&`
        : `${root}/largecard?`;
    link += aboutMe ? `aboutMe=${encodeURIComponent(aboutMe)}&` : '';
    link += pronouns ? `pronouns=${pronouns}&` : '';
    try {
      const data = await fetchData(id);
      if (data === null) {
        res.status(404).send('User not found');
        return null;
      }
      created && (link += `createdDate=${data.created_at}&`);
      discordLabel && (link += 'discordLabel=true&');
      if (bannerID) {
        const banner = await getBannerImage(bannerID, false);
        banner && (link += `bannerImage=${banner}&`);
      }
      if (wantBannerImage) {
        data.banner && (link += `bannerImage=${data.banner}&`);
        data.accent_color && (link += `accentColor=${data.accent_color.replace('#', '')}&`);
      }
      bannerImage && (link += `bannerImage=${bannerImage}&`);
      wantAccentColor &&
        data.accent_color &&
        (link += `accentColor=${data.accent_color.replace('#', '')}&`);
      bannerColor && (link += `bannerColor=${bannerColor}&`);
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: minimal_args,
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 807, height: 1200 });
      await page.goto(
        `${link}username=${data.username}&displayName=${data.display_name}&avatar=${data.avatar}&status=${data.status}&id=${id}`
      );
      activity
        ? await page.evaluate((data: RefinerResponse) => {
            localStorage.setItem('activity', JSON.stringify(data.activity));
          }, data)
        : await page.evaluate(() => {
            localStorage.removeItem('activity');
          });
      mood
        ? await page.evaluate((data: RefinerResponse) => {
            localStorage.setItem('mood', JSON.stringify(data.mood));
          }, data)
        : await page.evaluate(() => {
            localStorage.removeItem('mood');
          });
      await page.goto(
        `${link}username=${data.username}&displayName=${data.display_name}&avatar=${data.avatar}&status=${data.status}&id=${id}`,
        { waitUntil: ['networkidle0'] }
      );
      await page.waitForSelector('#banner');
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
      });
      res.set('Content-Type', 'image/png');
      res.send(screenshotBuffer);
      await browser.close();
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
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
    res.status(500).send((error as Error).message);
  }
});

app.listen(1911, () => console.log('Server is running on http://localhost:1911'));
