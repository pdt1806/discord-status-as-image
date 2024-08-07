import { ActionIcon, Avatar, Box, Flex, Group, Image, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { IconMessageCircle2Filled, IconUserPlus } from '@tabler/icons-react';
import { getBannerImage } from '../../pocketbase_client';
import { formatDate, hexToRgb, setLargeCardTitleSize } from '../../utils/tools';
import { ActivityType, MoodType } from '../../utils/types';
import classes from '../style/profile.module.css';
import ActivityBox from './ActivityBox';
import innerClasses from './index.module.css';
import MoodBox from './Mood';
import {
  BG1TextColor,
  adjustHexColor,
  isDark,
  notBG1TextColor,
  setStatusImg,
  updateStatus,
} from './utils';

const LargeCard = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [username, setUsername] = useState(params.get('username'));
  const [displayName, setDisplayName] = useState(params.get('displayName'));
  const [avatar, setAvatar] = useState(params.get('avatar'));
  const [status, setStatus] = useState(params.get('status'));
  const [createdDate, setCreatedDate] = useState(params.get('createdDate'));
  const [bannerImage, setBannerImage] = useState(params.get('bannerImage'));
  const [statusImage, setStatusImage] = useState(setStatusImg(status || 'offline'));
  const [accentColor, setAccentColor] = useState(
    params.get('accentColor') && `#${params.get('accentColor')}` // for api -> png
  );
  const id = params.get('id');
  const backgroundColor = params.get('bg') ? `#${params.get('bg')}` : '#111214';
  const discordLabel = params.get('discordLabel');
  const bannerColor = params.get('bannerColor') ? `#${params.get('bannerColor')}` : '#212121';
  const aboutMe = decodeURIComponent(params.get('aboutMe') || '');
  const pronouns = decodeURIComponent(params.get('pronouns') || '');
  const bannerID = params.get('bannerID');
  const [activity, setActivity] = useState<ActivityType | null>(
    localStorage.getItem('activity') ? JSON.parse(localStorage.getItem('activity')!) : null
  );
  const [mood, setMood] = useState<MoodType | null>(
    localStorage.getItem('mood') ? JSON.parse(localStorage.getItem('mood')!) : null
  );

  const bg1 = params.get('bg1');
  const bg2 = params.get('bg2');

  let backgroundGradient;
  let textColor;
  if (bg1 && bg2) {
    const colors = BG1TextColor(params);
    [backgroundGradient, textColor] = colors;
  } else textColor = notBG1TextColor(backgroundColor);

  const dimmedColor = textColor === 'white' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.75)';

  let buttonColor = null;
  if (bg1 && bg2) {
    buttonColor = adjustHexColor(bg1, 100 * (isDark(hexToRgb(bg1)!) ? -1 : 1));
  } else if (backgroundColor) {
    buttonColor = adjustHexColor(
      backgroundColor,
      100 * (isDark(hexToRgb(backgroundColor)!) ? -1 : 1)
    );
  }

  const updateStatusArgs = {
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
    setActivity,
    setMood,
  };

  useEffect(() => {
    async function getBanner() {
      if (!bannerID) return;
      const banner: string = ((await getBannerImage(bannerID, false)) as string) || '';
      if (!banner) return;
      setBannerImage(banner);
    }

    updateStatus(updateStatusArgs);
    getBanner();
  }, []);

  useEffect(() => {
    const intervalID = setInterval(() => {
      updateStatus(updateStatusArgs);
    }, 15000);

    return () => clearInterval(intervalID);
  }, []);

  const titleSize = setLargeCardTitleSize(displayName || '');

  const ratio = window.innerWidth / 807;

  return (
    <a href={`https://discord.com/users/${id}`} target="_blank" rel="noreferrer">
      <Box
        id="disi-large-card"
        className={innerClasses.largeCard}
        style={{
          background: backgroundGradient || backgroundColor,
          transform: `${ratio < 1 ? `scale(${ratio})` : ''}`,
        }}
      >
        {bannerImage ? (
          <Image src={bannerImage} className={classes.banner} id="banner" />
        ) : (
          <Box
            id="banner"
            style={{ backgroundColor: accentColor ?? bannerColor }}
            className={classes.banner}
          />
        )}
        <Box style={{ transform: 'scale(0.8) translate(20px, -180px)', position: 'absolute' }}>
          <Image alt="Avatar" src={avatar} className={classes.avatar} />
          <Avatar src={statusImage} className={innerClasses.statusImage} />
        </Box>
        {(!mood ||
          mood.state === 'Custom Status' ||
          mood.state.length <= (mood.emoji ? 15 : 19)) && (
          <Group gap="xs" className={innerClasses.addMessageGroup}>
            <ActionIcon h={40.8} w={40.8} bg={buttonColor ?? '#4e5057'}>
              <IconMessageCircle2Filled size={20} style={{ margin: 0, padding: 0 }} />
            </ActionIcon>
            <Box
              className={innerClasses.friendRequest}
              style={{ backgroundColor: buttonColor ?? '#5865f2' }}
            >
              <Group gap="xs">
                <IconUserPlus size={20} />
                <Text>Add Friend</Text>
              </Group>
            </Box>
          </Group>
        )}
        <Box mb={15} className={innerClasses.name}>
          <Title fw={600} size={titleSize} c={textColor} ff="Noto Sans TC">
            {displayName}
          </Title>
          <Flex mt={15}>
            <Title fw={400} size={25} c={dimmedColor} ff="Noto Sans TC">
              {username}
            </Title>
            {pronouns && (
              <>
                <Title fw={700} mx={5} size={25} c={dimmedColor} ff="Noto Sans TC">
                  •
                </Title>
                <Title fw={400} size={25} c={dimmedColor} ff="Noto Sans TC">
                  {pronouns}
                </Title>
              </>
            )}
          </Flex>
        </Box>
        {mood && <MoodBox mood={mood} textColor={textColor} />}
        {activity &&
          ['playing', 'listening', 'streaming', 'watching', 'competing'].includes(
            activity.type
          ) && (
            <ActivityBox
              background={
                textColor === 'white'
                  ? bg1 && bg2
                    ? 'rgba(0,0,0,0.3)'
                    : '#232528'
                  : bg1 && bg2
                    ? 'rgba(255,255,255,0.7)'
                    : '#f5f5f5'
              }
              textColor={textColor}
              activity={activity}
            />
          )}
        {(aboutMe || createdDate) && (
          <Box
            className={innerClasses.aboutMeBox}
            style={{
              backgroundColor:
                textColor === 'white'
                  ? bg1 && bg2
                    ? 'rgba(0,0,0,0.3)'
                    : '#232528'
                  : bg1 && bg2
                    ? 'rgba(255,255,255,0.7)'
                    : '#f5f5f5',
            }}
          >
            <Stack gap="xl">
              {aboutMe && (
                <Box>
                  <Title size={20} c={textColor} ff="Noto Sans TC">
                    About Me
                  </Title>
                  <Text c={textColor} lineClamp={5} className={innerClasses.aboutMe}>
                    {aboutMe}
                  </Text>
                </Box>
              )}
              {createdDate && (
                <Box>
                  <Title size={20} c={textColor} ff="Noto Sans TC">
                    Member Since
                  </Title>
                  <Text
                    c={textColor}
                    lineClamp={4}
                    mt="sm"
                    style={{ fontSize: '22px' }}
                    ff="Noto Sans TC"
                  >
                    {formatDate(createdDate)}
                  </Text>
                </Box>
              )}
            </Stack>
          </Box>
        )}
        {discordLabel && (
          <Image
            alt="discord-logo"
            src="/images/discord-label.svg"
            className={innerClasses.discordLabel}
          />
        )}
      </Box>
    </a>
  );
};

export default LargeCard;
