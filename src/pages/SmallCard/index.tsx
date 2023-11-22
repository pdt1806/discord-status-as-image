import { blendColors, hexToRgb } from '@/utils/tools';
import { Avatar, Box, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SmallCard = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [username, setUsername] = useState(params.get('username'));
  const [avatar, setAvatar] = useState(params.get('avatar'));
  const [status, setStatus] = useState(params.get('status'));
  const id = params.get('id');
  const backgroundColor = params.get('bg') ? `#${params.get('bg')}` : '#2B2D31';
  let backgroundGradient;
  let textColor;
  if (!params.get('bg1') && !params.get('bg2')) {
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
    fetch(`https://refiner-api.bennynguyen.us/user/${id}`, {
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
      });
  }

  useEffect(() => {
    updateStatus();
    console.log(params.get('bg'));
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
      return '45';
    } else if (username?.length! > 25) {
      return '50';
    } else if (username?.length! > 20) {
      return '60';
    } else if (username?.length! > 15) {
      return '80';
    }
    return '100';
  }

  let titleSize = setTitleSize();

  const [statusImage, setStatusImage] = useState(setStatusImg(status || 'offline'));

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
        }}
        display="flex"
      >
        <Avatar h={'70%'} w={273} alt="Avatar" src={avatar} />
        <Box
          w={100}
          h={100}
          style={{
            borderRadius: '50%',
            transform: 'translate(-85px, 100px)',
            background: backgroundGradient
              ? parseInt(params.get('angle')!) > 179
                ? `#${params.get('bg2')}`
                : `#${params.get('bg1')}`
              : backgroundColor,
          }}
        />
        <Avatar
          w={75}
          h={75}
          src={statusImage}
          style={{
            transform: 'translate(-172px, 100px)',
            background: 'transparent',
          }}
        />
        <Box
          style={{
            transform: 'translateX(-100px)',
          }}
        >
          <Title fw={500} size={titleSize} c={status != 'offline' ? textColor : '#5d5f6b'}>
            {username}
          </Title>
        </Box>
      </Box>
    </a>
  );
};

export default SmallCard;
