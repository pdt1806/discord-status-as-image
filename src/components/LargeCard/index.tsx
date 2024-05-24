import { Avatar, Box, Divider, Image, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getBannerImage } from '../../pocketbase_client';
import { formatDate, setLargeCardTitleSize } from '../../utils/tools';
import classes from '../style/profile.module.css';
import innerClasses from './index.module.css';
import { BG1TextColor, notBG1TextColor, setStatusImg, updateStatus } from './utils';

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
    params.get('accentColor') && `#${params.get('accentColor')}`
  );
  const id = params.get('id');
  const backgroundColor = params.get('bg') ? `#${params.get('bg')}` : '#2b2d31';
  const discordLabel = params.get('discordlabel');
  const bannerColor = params.get('bannerColor') ? `#${params.get('bannerColor')}` : '#212121';
  const mood = params.get('mood');
  const aboutMe = decodeURIComponent(params.get('aboutMe') || '');
  const pronouns = decodeURIComponent(params.get('pronouns') || '');
  const bannerID = params.get('bannerID');

  let backgroundGradient;
  let textColor;
  if (params.get('bg1') && params.get('bg2')) {
    const colors = BG1TextColor(params);
    [backgroundGradient, textColor] = colors;
  } else textColor = notBG1TextColor(backgroundColor);

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

  setTimeout(() => {
    try {
      updateStatus(updateStatusArgs);
    } catch {
      // pass
    }
  }, 15000);

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
            className={classes.colorBanner}
          />
        )}
        <Box style={{ transform: 'scale(0.8) translate(20px, -180px)', position: 'absolute' }}>
          <Image alt="Avatar" src={avatar} className={classes.avatar} />
          <Avatar src={statusImage} className={innerClasses.statusImage} />
        </Box>
        <Box className={innerClasses.friendRequest}>Send Friend Request</Box>
        <Box
          style={{ backgroundColor: textColor === 'white' ? '#111111' : '#ffffff' }}
          className={innerClasses.name}
        >
          <Box mb={15}>
            <Title fw={600} size={titleSize} c={textColor}>
              {displayName}
            </Title>
            <Title fw={500} mt={10} size={titleSize - 15} c={textColor}>
              {username}
            </Title>
            {pronouns && (
              <Title fw={400} mt={15} size={25} c={textColor}>
                {pronouns}
              </Title>
            )}
            {mood && (
              <Title fw={400} mt={35} size={25} c={textColor}>
                {mood}
              </Title>
            )}
          </Box>
          {(aboutMe || createdDate) && <Divider w={687} mb={30} mt={30} />}
          {aboutMe && (
            <Box>
              <Title size={20} c={textColor}>
                ABOUT ME
              </Title>
              <Text c={textColor} lineClamp={5} className={innerClasses.aboutMe}>
                {aboutMe}
              </Text>
            </Box>
          )}
          {createdDate && (
            <Box>
              <Title mt={30} size={20} c={textColor}>
                DISCORD MEMBER SINCE
              </Title>
              <Text c={textColor} lineClamp={4} mt="sm" style={{ fontSize: '22px' }}>
                {formatDate(createdDate)}
              </Text>
            </Box>
          )}
        </Box>
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
