import { blendColors, hexToRgb } from '@/utils/tools';
import { Avatar, Box, Divider, Image, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classes from '../style/avatar.module.css';

const LargeCard = (props: { scale: number }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [username, setUsername] = useState(params.get('username'));
  const [avatar, setAvatar] = useState(params.get('avatar'));
  const [status, setStatus] = useState(params.get('status'));
  const [createdDate, setCreatedDate] = useState(params.get('createdDate'));
  const [activity, setActivity] = useState(params.get('activity'));
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
      gradient1 && gradient2 && params.get('degree')
        ? `linear-gradient(${params.get(
            'degree'
          )}deg, rgb(${gradient1}) 0%, rgb(${gradient2}) 100%)`
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
    fetch(`https://refiner-api.bennynguyen.us/user/${id}`, {
      // refiner-api
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setAvatar(data.avatar);
        setStatus(data.status);
        setStatusImage(setStatusImg(data.status));
        if (params.get('created') == 'true') {
          setCreatedDate(data.created_at);
        }
        if (params.get('showActivity') == 'true') {
          setActivity(data.activity);
        }
      });
  }

  useEffect(() => {
    updateStatus();
  }, []);

  setTimeout(() => {
    try {
      updateStatus();
    } catch {}
  }, 30000);

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
    if (username?.length! > 30) {
      return 35;
    } else if (username?.length! > 25) {
      return 40;
    } else if (username?.length! > 20) {
      return 45;
    } else if (username?.length! > 15) {
      return 50;
    }
    return 60;
  }

  let titleSize = setTitleSize();

  const [statusImage, setStatusImage] = useState(setStatusImg(status || 'offline'));

  const ratio = window.innerWidth / 807;

  return (
    <a href={`https://discord.com/users/${id}`} target="_blank">
      <Box
        w={807}
        h={1000}
        style={{
          background: backgroundGradient ? backgroundGradient : backgroundColor,
          position: 'absolute',
          alignItems: 'center',
          transform: `${ratio < 1 ? `scale(${ratio})` : ''}`,
          transformOrigin: 'top left',
        }}
      >
        <Box w={807} h={210} style={{ backgroundColor: '#335500' }}></Box>
        <Box style={{ transform: 'scale(0.8) translate(20px, -180px)', position: 'absolute' }}>
          <Image alt="Avatar" src={avatar} className={classes.avatar} />
          <Avatar
            w={75}
            h={75}
            src={statusImage}
            style={{
              transform: `translate(204px, -70px) `,
              background: 'transparent',
            }}
          />
        </Box>
        <Box
          style={{
            position: 'absolute',
            backgroundColor: 'black',
            transform: 'translate(30px, 140px)',
            borderRadius: '20px',
            zIndex: 0,
          }}
          w={747}
          h={620}
        >
          <Box style={{ position: 'absolute', transform: 'translate(30px, 20px)' }}>
            <Title
              fw={500}
              size={titleSize}
              c={
                status != 'offline' || (status == 'offline' && textColor == 'white')
                  ? textColor
                  : '#5d5f6b'
              }
            >
              {username}
            </Title>
            {/* {createdDate ? (
            <Box mt="sm" display="flex" style={{ alignItems: 'center' }}>
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
                {monthNames[createdDate.slice(0, 2) as keyof typeof monthNames]}{' '}
                {createdDate.slice(3, 5)}, {createdDate.slice(6, 10)}
              </Title>
            </Box>
          ) : null} */}
            <Title
              fw={40}
              size={titleSize - 20}
              c={
                status != 'offline' || (status == 'offline' && textColor == 'white')
                  ? textColor
                  : '#5d5f6b'
              }
            >
              {username}
            </Title>
            <Title
              fw={300}
              mt={5}
              size={30}
              c={
                status != 'offline' || (status == 'offline' && textColor == 'white')
                  ? textColor
                  : '#5d5f6b'
              }
            >
              egg/eggu
            </Title>
          </Box>
          <Divider w={700} style={{ transform: 'translate(23.5px, 230px)' }} />
          <Box style={{ transform: 'translate(30px, 255px)' }}>
            <Title
              size={25}
              c={
                status != 'offline' || (status == 'offline' && textColor == 'white')
                  ? textColor
                  : '#5d5f6b'
              }
            >
              ABOUT ME
            </Title>
            <Text
              c="white"
              mt="sm"
              lineClamp={4}
              style={{ fontSize: '22px', maxWidth: '700px', wordWrap: 'break-word' }}
            ></Text>
          </Box>
        </Box>
      </Box>
    </a>
  );
};

export default LargeCard;

LargeCard.defaultProps = {
  scale: 1,
};
