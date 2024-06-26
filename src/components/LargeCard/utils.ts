import { refinerAPI, testing } from '../../env/env';
import { blendColors, hexToRgb } from '../../utils/tools';

const getRgbString = (hexColor: string) => {
  const rgb = hexToRgb(hexColor);
  return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '';
};

export function isDark(color: { r: number; g: number; b: number }) {
  const { r, g, b } = color;
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}

export function notBG1TextColor(backgroundColor: string | undefined) {
  const textColorRaw = hexToRgb(backgroundColor || '');
  return isDark(textColorRaw!) ? '#202225' : 'white';
}

export function BG1TextColor(params: URLSearchParams) {
  const gradient1 = getRgbString(params.get('bg1') || '');
  const gradient2 = getRgbString(params.get('bg2') || '');
  const backgroundGradient =
    `linear-gradient(180deg, rgb(${gradient1}) 0%, rgb(${gradient2}) 100%)` || '';
  const textColorRaw = hexToRgb(
    blendColors(params.get('bg1') || '', params.get('bg2') || '') || ''
  );
  return [backgroundGradient, isDark(textColorRaw!) ? '#202225' : 'white'];
}

export function adjustHexColor(hex: string, amount: number) {
  hex = hex.replace(/^#/, '');

  const num = parseInt(hex, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  const newColor = (r << 16) + (g << 8) + b;
  return `#${newColor.toString(16).padStart(6, '0')}`;
}

export function setStatusImg(status?: string) {
  switch (status) {
    case 'online':
      return '/images/icons/online.svg';
    case 'idle':
      return '/images/icons/idle.svg';
    case 'dnd':
      return '/images/icons/dnd.svg';
    case 'offline':
      return '/images/icons/offline.svg';
    default:
      return '/images/icons/offline.svg';
  }
}

export function updateStatus({
  params,
  id,
  setUsername,
  setDisplayName,
  setAvatar,
  setStatus,
  setStatusImage,
  setCreatedDate,
  setBannerImage,
  setAccentColor,
}: {
  params: URLSearchParams;
  id: string | null;
  setUsername: (username: string) => void;
  setDisplayName: (displayName: string) => void;
  setAvatar: (avatar: string) => void;
  setStatus: (status: string) => void;
  setStatusImage: (statusImage: string) => void;
  setCreatedDate: (createdDate: string) => void;
  setBannerImage: (bannerImage: string) => void;
  setAccentColor: (accentColor: string) => void;
}) {
  fetch(`${testing ? refinerAPI.dev : refinerAPI.prod}/user/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then(async (data) => {
      setUsername(data.username);
      setDisplayName(data.display_name);
      setAvatar(data.avatar);
      setStatus(data.status);
      setStatusImage(setStatusImg(data.status));
      if (params.get('created') === 'true') setCreatedDate(data.created_at);
      if (params.get('wantBannerImage') === 'true') {
        setBannerImage(data.banner);
        setAccentColor(data.accent_color);
      }
      if (params.get('wantAccentColor')) setAccentColor(data.accent_color);
    });
}
