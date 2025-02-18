import { Response } from 'express';
import { debugging, refinerAPI } from '../src/env/env';
import { getBannerImage } from '../src/pocketbase_client';
import { RefinerResponse } from '../src/utils/types';

export function base64toFile(base64: string): File | null {
  const match = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);

  if (!match) return null;

  const contentType = match[1];
  const byteCharacters = atob(match[2]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: contentType });

  const fileName = `${Math.random().toString(36).substring(2, 8)}`;

  return new File([blob], fileName, { type: contentType });
}

export const fetchRefinerData = async (
  id: string,
  full: boolean
): Promise<RefinerResponse | null> => {
  const response = await fetch(`${refinerAPI[debugging]}/user/${id}${full ? '?full=true' : ''}`);
  try {
    if (response.status === 404) {
      return null;
    }
  } catch {
    throw new Error('Internal Server Error');
  }
  return response.json();
};

export async function urlToBase64(imgUrl: string): Promise<string> {
  const fetchImageUrl = await fetch(imgUrl);
  const responseArrBuffer = await fetchImageUrl.arrayBuffer();
  const toBase64 = `data:${fetchImageUrl.headers.get('Content-Type') || 'image/png'};base64,${Buffer.from(responseArrBuffer).toString('base64')}`;
  return toBase64;
}

export const minimal_args = [
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

  // '--disable-web-security',
  // '--allow-running-insecure-content',
];

export const getSmallCardLink = async (
  root: string,
  id: string,
  res: Response,
  {
    bg,
    bg1,
    bg2,
    angle,
    created,
    activity,
    mood,
    discordLabel,
    wantAccentColor,
  }: { [key: string]: string }
) => {
  let link = bg1
    ? `${root}/smallcard?bg=${bg}&bg1=${bg1}&bg2=${bg2}&angle=${angle}&`
    : bg
      ? `${root}/smallcard?bg=${bg}&`
      : `${root}/smallcard?`;
  const requiresFullData = wantAccentColor === 'true';
  const data = await fetchRefinerData(id, requiresFullData);
  if (data === null) {
    res.status(404).send('User not found');
    return null;
  }
  created && (link += `createdDate=${data.created_at}&`);
  discordLabel && (link += 'discordLabel=true&');
  wantAccentColor && data.accent_color && (link += `bg=${data.accent_color.replace('#', '')}&`);
  activity && (link += `activityData=${encodeURIComponent(JSON.stringify(data.activity))}&`);
  mood && (link += `moodData=${encodeURIComponent(JSON.stringify(data.mood))}&`);
  link += `urls=${encodeURIComponent(JSON.stringify(data.urls))}&`;
  return `${link}displayName=${data.display_name}&avatar=${data.avatar.replace('size=512', 'size=256')}&status=${data.status}&id=${id}`;
};

export const getLargeCardLink = async (
  root: string,
  id: string,
  res: Response,
  {
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
  }: { [key: string]: string }
) => {
  let link = bg1
    ? `${root}/largecard?bg=${bg}&bg1=${bg1}&bg2=${bg2}&`
    : bg
      ? `${root}/largecard?bg=${bg}&`
      : `${root}/largecard?`;
  link += aboutMe ? `aboutMe=${encodeURIComponent(aboutMe)}&` : '';
  link += pronouns ? `pronouns=${pronouns}&` : '';
  const requiresFullData = [wantBannerImage, wantAccentColor].includes('true');
  const data = await fetchRefinerData(id, requiresFullData);
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
  activity && (link += `activityData=${encodeURIComponent(JSON.stringify(data.activity))}&`);
  mood && (link += `moodData=${encodeURIComponent(JSON.stringify(data.mood))}&`);
  link += `urls=${encodeURIComponent(JSON.stringify(data.urls))}&`;
  return `${link}username=${data.username}&displayName=${data.display_name}&avatar=${data.avatar.replace('size=512', 'size=256')}&status=${data.status}&id=${id}`;
};
