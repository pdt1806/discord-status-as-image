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
        setStatusImage(setStatusImg());
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

  function setStatusImg() {
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

  const [statusImage, setStatusImage] = useState(setStatusImg());

  return (
    <Box
      w={1350}
      h={450}
      style={{
        backgroundColor: '#2B2D31',
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
          backgroundColor: '#2B2D31',
        }}
      />
      <Avatar
        w={75}
        h={75}
        src={statusImage}
        style={{
          transform: 'translate(-172px, 100px)',
          backgroundColor: '#2B2D31',
        }}
      />
      <Box
        style={{
          transform: 'translateX(-100px)',
        }}
      >
        <Title fw={500} size={titleSize} c={status != 'offline' ? 'white' : '#5d5f6b'}>
          {username}
        </Title>
      </Box>
    </Box>
  );
};

export default SmallCard;
