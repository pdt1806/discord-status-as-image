import { debugging, refinerAPI } from '../../utils/const';
import { bgIsLight, blendColors, hexToRgb } from '../../utils/tools';
import { ActivityType, MoodType } from '../../utils/types';
import { setStatusImg } from '../LargeCard/utils';

export function updateStatus({
  id,
  params,
  displayUsername,
  setDisplayName,
  setAvatar,
  setStatus,
  setStatusImage,
  setCreatedDate,
  setBackgroundColor,
  setActivity,
  setMood,
}: {
  id: string | null;
  params: URLSearchParams;
  displayUsername: boolean;
  setDisplayName: (name: string) => void;
  setAvatar: (avatar: string) => void;
  setStatus: (status: string) => void;
  setStatusImage: (statusImage: string) => void;
  setCreatedDate: (date: string) => void;
  setBackgroundColor: (color: string) => void;
  setActivity: (activity: ActivityType) => void;
  setMood: (mood: MoodType) => void;
}) {
  const fullRequired = params.get('wantAccentColor');
  fetch(`${refinerAPI[debugging]}/user/${id}${fullRequired ? '?full=true' : ''}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setDisplayName(displayUsername ? data.username : data.display_name);
      setAvatar(data.avatar);
      setStatus(data.status);
      setStatusImage(setStatusImg(data.status));
      if (params.get('created')) {
        setCreatedDate(data.created_at);
      }
      if (params.get('wantAccentColor')) setBackgroundColor(data.accent_color);
      if (params.get('activity')) setActivity(data.activity);
      if (params.get('mood')) setMood(data.mood);
    });
}

export function textColorFn(
  params: URLSearchParams,
  backgroundColor: string,
  setTextColor: (color: string) => void,
  setBackgroundGradient: (color: string) => void
) {
  if (!params.get('bg1')) {
    const textColorRaw = hexToRgb(backgroundColor || '');
    setTextColor(bgIsLight(textColorRaw!) ? '#202225' : 'white');
  } else {
    const gradient1Raw = hexToRgb(params.get('bg1') || '');
    const gradient2Raw = hexToRgb(params.get('bg2') || '');
    const gradient1 = gradient1Raw ? `${gradient1Raw.r}, ${gradient1Raw.g}, ${gradient1Raw.b}` : '';
    const gradient2 = gradient2Raw ? `${gradient2Raw.r}, ${gradient2Raw.g}, ${gradient2Raw.b}` : '';
    setBackgroundGradient(
      gradient1 && gradient2 && params.get('angle')
        ? `linear-gradient(${params.get('angle')}deg, rgb(${gradient1}) 0%, rgb(${gradient2}) 100%)`
        : ''
    );
    const textColorRaw = hexToRgb(
      blendColors(params.get('bg1') || '', params.get('bg2') || '') || ''
    );
    setTextColor(bgIsLight(textColorRaw!) ? '#202225' : 'white');
  }
}
