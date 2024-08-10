import { UseFormReturnType } from '@mantine/form';
import { DISIForm, EmojiType } from './types';

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function blendColors(colorA: string, colorB: string) {
  const colorAMatch = colorA.match(/\w\w/g);
  const colorBMatch = colorB.match(/\w\w/g);
  if (!colorAMatch || !colorBMatch) return;
  const [rA, gA, bA] = colorAMatch.map((c) => parseInt(c, 16));
  const [rB, gB, bB] = colorBMatch.map((c) => parseInt(c, 16));
  const r = Math.round(rA + (rB - rA) * 0.5)
    .toString(16)
    .padStart(2, '0');
  const g = Math.round(gA + (gB - gA) * 0.5)
    .toString(16)
    .padStart(2, '0');
  const b = Math.round(bA + (bB - bA) * 0.5)
    .toString(16)
    .padStart(2, '0');
  // eslint-disable-next-line consistent-return
  return `#${r}${g}${b}`;
}

export function bgIsLight(color: { r: number; g: number; b: number }) {
  const { r, g, b } = color;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186;
}

export const monthsKey = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  10: 'October',
  11: 'November',
  12: 'December',
} as const;

export function formatDate(date: string) {
  return `${monthsKey[date.slice(0, 2) as keyof typeof monthsKey].slice(0, 3)}${' '}
  ${date.slice(3, 5)}, ${date.slice(6, 10)}`;
}

export function limitTextarea(value: string) {
  return value
    .split('\n')
    .map((line) => line.slice(0, 57))
    .slice(0, 5)
    .join('\n');
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
      if (event.target && event.target.result) {
        const dataUrl = event.target.result.toString();
        return resolve(dataUrl);
      }
      reject(new Error('Failed to read the file.'));
      return null;
    });

    reader.addEventListener('error', reject);

    reader.readAsDataURL(file);
  });
}

export function setSmallCardTitleSize(displayName: string | undefined) {
  const length = displayName?.length;

  if (!length) return 45;

  if (length > 30) return 45;
  if (length > 25) return 50;
  if (length > 20) return 60;
  if (length > 15) return 80;
  return 100;
}

export function setLargeCardTitleSize(displayName: string | undefined) {
  const length = displayName?.length;

  if (!length) return 25;

  if (length > 30) return 25;
  if (length > 25) return 30;
  if (length > 20) return 35;
  if (length > 15) return 40;
  return 45;
}

export function formatAndUpdateHex({
  value,
  propertyName,
  form,
}: {
  value: string;
  propertyName: string;
  form: UseFormReturnType<DISIForm, (values: DISIForm) => DISIForm>;
}) {
  const property = form.values[propertyName as keyof DISIForm];
  if (/^([A-Fa-f0-9]{1,6})?$/.test(value) && !property) {
    value = `#${value.toUpperCase()}`;
  }
  if (/^#([A-Fa-f0-9]{1,6})?$/.test(value) || value === '') {
    form.setValues({
      ...form.values,
      [propertyName]: value.toUpperCase(),
    });
  }
}

export const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

export const fetchMaintenanceMessage = async () => {
  let message: string[] = [];
  try {
    const response = await fetch(
      'https://api.allorigins.win/raw?url=https://pastebin.com/raw/xPgJnKkA',
      { cache: 'no-store' }
    );
    if (response.ok) {
      const text = await response.text();
      text.length > 0 && (message = text.split('\n'));
    }
  } catch (e) {
    // pass
  }
  return message;
};

const formatMilliseconds = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours > 0
    ? `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    : `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const getElapsedProgessListening = (timestamps: { start: string; end: string }) => {
  const startTime = new Date(timestamps.start).getTime();
  const endTime = new Date(timestamps.end).getTime();
  const currentTime = new Date().getTime();

  const elapsedTime = currentTime - startTime;

  const totalTime = endTime - startTime;

  return {
    elapsedTime: formatMilliseconds(elapsedTime <= totalTime ? elapsedTime : totalTime),
    totalTime: formatMilliseconds(totalTime),
    progress: (elapsedTime / totalTime) * 100,
  };
};

export const formatActivityImageUrl = (encodedUrl: string) => {
  const startIndex = encodedUrl.indexOf('https/');
  const url = decodeURIComponent(encodedUrl.slice(startIndex).replace('https/', ''));
  return url ? `https://${url}` : '';
};

export const getPlayingTimestamp = (timestamps: { start: number }) => {
  const currentTime = new Date().getTime();

  const elapsedTime = currentTime - timestamps.start;

  return formatMilliseconds(elapsedTime);
};

export const getImageURLfromCDN = (appID: string, imageID: string) =>
  `https://cdn.discordapp.com/app-assets/${appID}/${imageID}.png`;

export const getEmojiURLfromCDN = (emoji: EmojiType) => {
  const { id, animated } = emoji;

  return animated
    ? `https://cdn.discordapp.com/emojis/${id}.gif`
    : `https://cdn.discordapp.com/emojis/${id}.png`;
};
