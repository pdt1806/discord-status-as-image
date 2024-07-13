import { Avatar, Box, Flex, Image, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { formatDate, setSmallCardTitleSize } from '../../utils/tools';
import { setStatusImg } from '../LargeCard/utils';
import classes from '../style/profile.module.css';
import innerClasses from './index.module.css';
import { textColorFn, updateStatus } from './utils';

const SmallCard = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [displayName, setDisplayName] = useState(params.get('displayName'));
  const [avatar, setAvatar] = useState(params.get('avatar'));
  const [status, setStatus] = useState(params.get('status'));
  const [createdDate, setCreatedDate] = useState(params.get('createdDate'));
  const [statusImage, setStatusImage] = useState(setStatusImg(status || 'offline'));

  const id = params.get('id');
  const discordLabel = params.get('discordlabel');

  const [backgroundColor, setBackgroundColor] = useState(
    params.get('bg')
      ? `#${params.get('bg')}`
      : params.get('accentColor')
        ? `#${params.get('accentColor')}`
        : '#2b2d31'
  );

  const [backgroundGradient, setBackgroundGradient] = useState('');
  const [textColor, setTextColor] = useState('');

  useEffect(() => {
    textColorFn(params, backgroundColor, setTextColor, setBackgroundGradient);
  }, [backgroundColor]);

  useEffect(() => {
    if (!params.get('displayName')) {
      updateStatus(
        id || '',
        params,
        setDisplayName,
        setAvatar,
        setStatus,
        setStatusImage,
        setCreatedDate,
        setBackgroundColor
      );
    }
    textColorFn(params, backgroundColor, setTextColor, setBackgroundGradient);
  }, []);

  useEffect(() => {
    const intervalID = setInterval(() => {
      updateStatus(
        id || '',
        params,
        setDisplayName,
        setAvatar,
        setStatus,
        setStatusImage,
        setCreatedDate,
        setBackgroundColor
      );
    }, 15000);

    return () => clearInterval(intervalID);
  }, []);

  const titleSize = setSmallCardTitleSize(displayName || '');

  const ratio = window.innerWidth / 1350;

  return (
    <a href={`https://discord.com/users/${id}`} target="_blank" rel="noreferrer">
      <Box
        style={{
          background: backgroundGradient || backgroundColor,
          transform: `${ratio < 1 ? `scale(${ratio})` : ''}`,
        }}
        className={innerClasses.smallCard}
      >
        <Image alt="Avatar" src={avatar} className={classes.avatar} />
        <Avatar className={innerClasses.statusImage} src={statusImage} />
        <Box style={{ transform: 'translateX(-10px)' }}>
          <Flex mih={130} direction="column" justify="end">
            <Title
              mt="auto"
              fw={500}
              size={titleSize}
              c={
                status !== 'offline' || (status === 'offline' && textColor === 'white')
                  ? textColor
                  : '#5d5f6b'
              }
              ff="Noto Sans TC"
            >
              {displayName}
            </Title>
          </Flex>
          {createdDate && (
            <Box mt="lg" display="flex" style={{ alignItems: 'center' }}>
              <Image
                alt="discord-logo"
                src="/images/discord.svg"
                className={innerClasses.discordLogo}
                style={{
                  filter:
                    textColor === 'white'
                      ? 'invert(1)'
                      : status !== 'offline'
                        ? 'brightness(0) saturate(100%) invert(7%) sepia(6%) saturate(1299%) hue-rotate(177deg) brightness(96%) contrast(85%)'
                        : 'brightness(0) saturate(100%) invert(34%) sepia(6%) saturate(770%) hue-rotate(194deg) brightness(102%) contrast(87%)',
                }}
              />
              <Title
                size={40}
                c={
                  status !== 'offline' || (status === 'offline' && textColor === 'white')
                    ? textColor
                    : '#5d5f6b'
                }
                fw={400}
                ff="Noto Sans TC"
              >
                {formatDate(createdDate)}
              </Title>
            </Box>
          )}
          {discordLabel && (
            <Image
              alt="discord-logo"
              src="/images/discord-label.svg"
              className={innerClasses.discordLabel}
              style={{
                transform: `translate(603.3px, ${createdDate ? '30px' : '70px'})`,
              }}
            />
          )}
        </Box>
      </Box>
    </a>
  );
};

export default SmallCard;
