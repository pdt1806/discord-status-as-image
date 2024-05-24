import { Avatar, Box, Flex, Image, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { refinerAPI, testing } from '../../env/env';
import {
  bgIsLight,
  blendColors,
  formatDate,
  hexToRgb,
  setSmallCardTitleSize,
} from '../../utils/tools';
import { setStatusImg } from '../LargeCard/utils';
import classes from '../style/profile.module.css';
import innerClasses from './index.module.css';

const SmallCard = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [displayName, setDisplayName] = useState(params.get('displayName'));
  const [avatar, setAvatar] = useState(params.get('avatar'));
  const [status, setStatus] = useState(params.get('status'));
  const [createdDate, setCreatedDate] = useState(params.get('createdDate'));
  const [statusImage, setStatusImage] = useState(setStatusImg(status || 'offline'));

  const id = params.get('id');
  const backgroundColor = params.get('bg') ? `#${params.get('bg')}` : '#2b2d31';
  const discordLabel = params.get('discordlabel');
  let backgroundGradient;
  let textColor;
  if (!params.get('bg1')) {
    const textColorRaw = hexToRgb(backgroundColor || '');
    textColor = bgIsLight(textColorRaw!) ? '#202225' : 'white';
  } else {
    const gradient1Raw = hexToRgb(params.get('bg1') || '');
    const gradient2Raw = hexToRgb(params.get('bg2') || '');
    const gradient1 = gradient1Raw ? `${gradient1Raw.r}, ${gradient1Raw.g}, ${gradient1Raw.b}` : '';
    const gradient2 = gradient2Raw ? `${gradient2Raw.r}, ${gradient2Raw.g}, ${gradient2Raw.b}` : '';
    backgroundGradient =
      gradient1 && gradient2 && params.get('angle')
        ? `linear-gradient(${params.get('angle')}deg, rgb(${gradient1}) 0%, rgb(${gradient2}) 100%)`
        : '';
    const textColorRaw = hexToRgb(
      blendColors(params.get('bg1') || '', params.get('bg2') || '') || ''
    );
    textColor = bgIsLight(textColorRaw!) ? '#202225' : 'white';
  }

  function updateStatus() {
    fetch(`${testing ? refinerAPI.dev : refinerAPI.prod}/user/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDisplayName(data.display_name);
        setAvatar(data.avatar);
        setStatus(data.status);
        setStatusImage(setStatusImg(data.status));
        if (params.get('created') === 'true') {
          setCreatedDate(data.created_at);
        }
      });
  }

  useEffect(() => {
    if (!params.get('displayName')) updateStatus();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      try {
        updateStatus();
      } catch {
        // pass
      }
    }, 15000);
  });

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
