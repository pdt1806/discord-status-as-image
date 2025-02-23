import { UseFormReturnType } from '@mantine/form';
import { debugging, disiAPI, refinerAPI } from '../../../env/env';
import { getBannerImage } from '../../../pocketbase_client';
import { fileToBase64 } from '../../../utils/tools';
import { DISIForm } from '../../../utils/types';

const users: { username: string; id: string }[] = [];

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

  let userID: string;

  userID =
    users.find((user: { username: string; id: string }) => user.username === form.values.username)
      ?.id || '';

  if (userID === '') {
    const res = await fetch(`${refinerAPI[debugging]}/username/${form.values.username}`);

    if (res.status === 404) throw new Error('User not found');

    const userData = await res.json();
    users.push({
      username: form.values.username as string,
      id: userData.id,
    });
    userID = userData.id;
  }

  setUserID(userID);

  let newBannerID = '';
  if (bannerFile && customBannerMode === 'upload') {
    const body = {
      image: await fileToBase64(bannerFile),
    };
    const response = await fetch(`${disiAPI[debugging]}/uploadbanner`, {
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

  let newTail =
    colorMode === 'Gradient'
      ? `&bg1=${form.values.backgroundGradient1.replace(
          '#',
          ''
        )}&bg2=${form.values.backgroundGradient2.replace('#', '')}`
      : form.values.backgroundSingle
        ? `&bg=${form.values.backgroundSingle.replace('#', '')}`
        : '';
  form.values.activity && (newTail += '&activity=true');
  form.values.mood && (newTail += '&mood=true');
  form.values.created && (newTail += '&created=true');

  const smallTail =
    newTail +
    (colorMode === 'Gradient' ? `&angle=${form.values.backgroundGradientAngle}` : '') +
    (colorMode === 'Discord Accent Color' ? '&wantAccentColor=true' : '') +
    (form.values.discordLabel ? '&discordLabel=true' : '') +
    (form.values.displayUsername ? '&displayUsername=true' : '');

  const largeTail =
    newTail +
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
    (form.values.discordLabel ? '&discordLabel=true' : '');

  setSmallTail(smallTail);
  setSmallCardLink(`${disiAPI[debugging]}/smallcard/${userID}?${smallTail}`);
  if (wantLargeCard) {
    setLargeTail(largeTail);
    setLargeCardLink(`${disiAPI[debugging]}/largecard/${userID}?${largeTail}`);
  }
};
