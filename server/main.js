import express from 'express';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer-core';

const app = express();

const root = 'http://localhost:2011';

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

app.get('/', (req, res) => {
  res.send({ message: 'API of Discord Status as Image' });
});

app.get('/smallcard/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { bg, bg1, bg2, degree, created } = req.query;
    let link = bg1
      ? `${root}/smallcard?bg=${bg}&bg1=${bg1}&bg2=${bg2}&degree=${degree}&`
      : bg
        ? `${root}/smallcard?bg=${bg}&`
        : `${root}/smallcard?`;

    fetch(`http://127.0.0.1:7000/user/${id}`)
      .then((response) => {
        try {
          if (response.status == 404) {
            res.status(404).send('User not found');
            return null;
          }
          return response.json();
        } catch {
          res.status(500).send('Internal Server Error');
          return null;
        }
      })
      .then(async (data) => {
        try {
          created ? (link += `createdDate=${data['created_at']}&`) : null;
          const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            userDataDir: './loaded',
            args: minimal_args,
          });
          const page = await browser.newPage();
          await page.setViewport({ width: 1350, height: 450 });
          await page.goto(
            `${link}username=${data['username']}&avatar=${data['avatar']}&status=${data['status']}&id=${id}`,
            { waitUntil: ['networkidle0'] }
          );
          const screenshotBuffer = await page.screenshot({
            clip: { x: 0, y: 0, width: 1350, height: 450 },
          });
          res.set('Content-Type', 'image/png');
          res.send(screenshotBuffer);
          await browser.close();
        } catch {
          res.status(500).send('Internal Server Error');
        }
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(1911, () => console.log('Server is running on http://localhost:1911'));
