import { Avatar, Box, Title } from '@mantine/core';
import { useLocation } from 'react-router-dom';

const SmallCard = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const username = params.get('username');
  const avatar = params.get('avatar');
  const status = params.get('status');

  function setStatus() {
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

  const statusImage = setStatus();

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
      <Avatar
        w={75}
        h={75}
        src={statusImage}
        style={{
          transform: 'translate(-85px, 100px)',
          outline: '10px solid #2B2D31',
          backgroundColor: '#2B2D31',
        }}
      />
      <Box>
        <Title fw={500} size={130} c="white">
          {username}
        </Title>
      </Box>
    </Box>
  );
};

export default SmallCard;
