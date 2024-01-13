import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer-core';
import { testing } from '../src/env/env';
import { getBannerImage } from '../src/pocketbase_client/index';
import { uploadBannerImage } from './pocketbase_server';
import { base64toBlob, fetchData } from './utils';

const root = testing ? 'http://localhost:5173' : 'http://localhost:2011';

const origin = testing ? '*' : 'https://disi.bennynguyen.dev';

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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json({ limit: '16mb' }));

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'API of Discord Status as Image' });
});

app.get('/smallcard/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { bg, bg1, bg2, angle, created } = req.query;
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
      created && (link += `createdDate=${data['created_at']}&`);
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        userDataDir: './loaded',
        args: minimal_args,
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1350, height: 450 });
      await page.goto(
        `${link}displayName=${data['display_name']}&avatar=${data['avatar']}&status=${data['status']}&id=${id}`,
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
      bannerColor,
      bannerID,
      bannerImage,
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
      created && (link += `createdDate=${data['created_at']}&`);
      if (bannerID) {
        const banner = await getBannerImage(bannerID, false);
        banner && (link += `bannerImage=${banner}&`);
      }
      if (wantBannerImage) {
        data['banner'] && (link += `bannerImage=${data['banner']}&`);
        data['accent_color'] && (link += `accentColor=${data['accent_color'].replace('#', '')}&`);
      }
      bannerImage && (link += `bannerImage=${bannerImage}&`);
      wantAccentColor &&
        data['accent_color'] &&
        (link += `accentColor=${data['accent_color'].replace('#', '')}&`);
      bannerColor && (link += `bannerColor=${bannerColor}&`);
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        userDataDir: './loaded',
        args: minimal_args,
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 807, height: 1200 });
      await page.goto(
        `${link}username=${data['username']}&displayName=${data['display_name']}&avatar=${data['avatar']}&status=${data['status']}&id=${id}`,
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
    const blob = base64toBlob(image);
    if (!blob) {
      res.status(400).send('Bad Request');
      return null;
    }
    const id = await uploadBannerImage(blob);
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(1911, () => console.log('Server is running on http://localhost:1911'));
