import { refinerAPI, testing } from '../../env/env';
import { blendColors, hexToRgb } from '../../utils/tools';

const getRgbString = (hexColor: string) => {
  const rgb = hexToRgb(hexColor);
  return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '';
};

export function notBG1TextColor(backgroundColor: string | undefined) {
  const textColorRaw = hexToRgb(backgroundColor || '');
  return textColorRaw!.r * 0.299 + textColorRaw!.g * 0.587 + textColorRaw!.b * 0.114 > 186
    ? '#202225'
    : 'white';
}

export function BG1TextColor(params: URLSearchParams) {
  const gradient1 = getRgbString(params.get('bg1') || '');
  const gradient2 = getRgbString(params.get('bg2') || '');
  const backgroundGradient =
    `linear-gradient(180deg, rgb(${gradient1}) 0%, rgb(${gradient2}) 100%)` || '';
  const textColorRaw = hexToRgb(
    blendColors(params.get('bg1') || '', params.get('bg2') || '') || ''
  );
  return [
    backgroundGradient,
    textColorRaw!.r * 0.299 + textColorRaw!.g * 0.587 + textColorRaw!.b * 0.114 > 186
      ? '#202225'
      : 'white',
  ];
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
