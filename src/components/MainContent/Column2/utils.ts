import { UseFormReturnType } from '@mantine/form';
import { disiAPI, refinerAPI, testing } from '../../../env/env';
import { getBannerImage } from '../../../pocketbase_client';
import { fileToBase64 } from '../../../utils/tools';
import { DISIForm } from '../../../utils/types';

export const generatingCards = async (
  form: UseFormReturnType<DISIForm, (values: DISIForm) => DISIForm>,
  customBannerMode: string,
  bannerFile: File | null,
  bannerPBID: string,
  setUserID: (id: string) => void,
  colorMode: string,
  setSmallTail: (tail: string) => void,
  setLargeTail: (tail: string) => void,
  setSmallCardLink: (link: string) => void,
  setLargeCardLink: (link: string) => void,
  wantLargeCard: boolean,
  bannerMode: string,
  externalImageURL: string,
  setBannerFile: (file: File | null) => void
) => {
  if (customBannerMode === 'upload' && !bannerFile) throw new Error('Please upload a banner');
  if (customBannerMode === 'pbid' && !(await getBannerImage(bannerPBID, true))) {
    throw new Error('Invalid banner ID');
  }

  const res = await fetch(
    `${testing ? refinerAPI.dev : refinerAPI.prod}/username/${form.values.username}`
  );
  if (res.status === 404) throw new Error('User not found');

  const data = await res.json();
  setUserID(data.id);

  const newTail =
    colorMode === 'Gradient'
      ? `&bg1=${form.values.backgroundGradient1.replace(
          '#',
          ''
        )}&bg2=${form.values.backgroundGradient2.replace('#', '')}`
      : form.values.backgroundSingle
        ? `&bg=${form.values.backgroundSingle.replace('#', '')}`
        : '';

  let newBannerID = '';
  if (bannerFile && customBannerMode === 'upload') {
    const body = {
      image: await fileToBase64(bannerFile),
    };
    const response = await fetch(`${testing ? disiAPI.dev : disiAPI.prod}/uploadbanner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status !== 200) throw new Error('Something went wrong');
    const json = await response.json();
    newBannerID = json.id;
    setBannerFile(null);
  }

  let smallTail =
    newTail +
    (colorMode === 'Gradient' ? `&angle=${form.values.backgroundGradientAngle}` : '') +
    (form.values.discordLabel ? '&discordlabel=true' : '') +
    (colorMode === 'Discord Accent Color' ? '&wantAccentColor=true' : '');

  switch (form.values.smallCardDetailMode) {
    case 'Show Activity':
      smallTail += '&wantActivity=true';
      break;
    case 'Show Mood (a.k.a. custom status)':
      smallTail += '&wantMood=true';
      break;
    case 'Show account created date':
      smallTail += '&wantCreated=true';
      break;
    default:
      break;
  }

  const largeTail =
    newTail +
    (form.values.largeCardActivity ? '&wantActivity=true' : '') +
    (form.values.largeCardMood ? '&wantMood=true' : '') +
    (form.values.largeCardCreated ? '&wantCreated=true' : '') +
    (form.values.aboutMe ? `&aboutMe=${encodeURIComponent(form.values.aboutMe)}` : '') +
    (form.values.pronouns ? `&pronouns=${encodeURIComponent(form.values.pronouns)}` : '') +
    (bannerMode === 'Custom Color' && form.values.bannerColor
      ? `&bannerColor=${form.values.bannerColor.replace('#', '')}`
      : '') +
    (bannerMode === 'Discord Accent Color' ? '&wantAccentColor=true' : '') +
    (bannerMode === 'Discord Image Banner (Nitro User Only)' ? '&wantBannerImage=true' : '') +
    (customBannerMode === 'upload' ? `&bannerID=${newBannerID}` : '') +
    (customBannerMode === 'pbid' ? `&bannerID=${bannerPBID}` : '') +
    (customBannerMode === 'exturl' ? `&bannerImage=${externalImageURL}` : '') +
    (form.values.discordLabel ? '&discordlabel=true' : '');
  setSmallTail(smallTail);
  setLargeTail(largeTail);
  setSmallCardLink(`${testing ? disiAPI.dev : disiAPI.prod}/smallcard/${data.id}?${smallTail}`);
  wantLargeCard &&
    setLargeCardLink(`${testing ? disiAPI.dev : disiAPI.prod}/largecard/${data.id}?${largeTail}`);
};
