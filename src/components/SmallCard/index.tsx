import { refinerAPI, testing } from '@/env/env';
import { blendColors, formatDate, hexToRgb } from '@/utils/tools';
import { Avatar, Box, Image, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classes from '../style/profile.module.css';

const SmallCard = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [displayName, setDisplayName] = useState(params.get('displayName'));
  const [avatar, setAvatar] = useState(params.get('avatar'));
  const [status, setStatus] = useState(params.get('status'));
  const [createdDate, setCreatedDate] = useState(params.get('createdDate'));
  const id = params.get('id');
  const backgroundColor = params.get('bg') ? `#${params.get('bg')}` : '#2b2d31';
  let backgroundGradient;
  let textColor;
  if (!params.get('bg1')) {
    const textColorRaw = hexToRgb(backgroundColor || '');
    textColor =
      textColorRaw!.r * 0.299 + textColorRaw!.g * 0.587 + textColorRaw!.b * 0.114 > 186
        ? '#202225'
        : 'white';
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
    textColor =
      textColorRaw!.r * 0.299 + textColorRaw!.g * 0.587 + textColorRaw!.b * 0.114 > 186
        ? '#202225'
        : 'white';
  }

  function updateStatus() {
    fetch(`${testing ? refinerAPI['dev'] : refinerAPI['prod']}/user/${id}`, {
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
        if (params.get('created') == 'true') {
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
      } catch {}
    }, 15000);
  });

  function setStatusImg(status?: string) {
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

  function setTitleSize() {
    if (displayName?.length! > 30) {
      return '45';
    } else if (displayName?.length! > 25) {
      return '50';
    } else if (displayName?.length! > 20) {
      return '60';
    } else if (displayName?.length! > 15) {
      return '80';
    }
    return '100';
  }

  let titleSize = setTitleSize();

  const [statusImage, setStatusImage] = useState(setStatusImg(status || 'offline'));

  const ratio = window.innerWidth / 1350;

  return (
    <a href={`https://discord.com/users/${id}`} target="_blank">
      <Box
        w={1350}
        h={450}
        style={{
          background: backgroundGradient ? backgroundGradient : backgroundColor,
          position: 'absolute',
          alignItems: 'center',
          padding: '30px 30px 30px 70px',
          transform: `${ratio < 1 ? `scale(${ratio})` : ''}`,
          transformOrigin: 'top left',
        }}
        display="flex"
      >
        <Image alt="Avatar" src={avatar} className={classes.avatar} />
        <Avatar
          w={75}
          h={75}
          src={statusImage}
          style={{
            transform: 'translate(-72px, 100px)',
            background: 'transparent',
          }}
        />
        <Box
          style={{
            transform: 'translateX(-10px)',
          }}
        >
          <Title
            fw={500}
            size={titleSize}
            c={
              status != 'offline' || (status == 'offline' && textColor == 'white')
                ? textColor
                : '#5d5f6b'
            }
          >
            {displayName}
          </Title>
          {createdDate ? (
            <Box mt="lg" display="flex" style={{ alignItems: 'center' }}>
              <Image
                alt="discord-logo"
                src="/images/discord.svg"
                w={60}
                h={60}
                mr="lg"
                style={{
                  filter: textColor == 'white' ? 'invert(1)' : 'invert(0)',
                }}
              />
              <Title size={40} c={textColor} fw={400}>
                {formatDate(createdDate)}
              </Title>
            </Box>
          ) : null}
        </Box>
      </Box>
    </a>
  );
};

export default SmallCard;
