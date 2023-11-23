import MainContent from '@/components/MainContent';
import { idealHeight, isMobile } from '@/utils/tools';
import { Box, Center, Title } from '@mantine/core';
import { useEffect } from 'react';
import classes from './index.module.css';

const Home = () => {
  useEffect(() => {
    if (window.location.pathname !== '/') window.location.pathname = '/';
  }, []);

  return (
    <Box
      w="100vw"
      h={!isMobile ? (!idealHeight ? '100%' : '100vh') : '100%'}
      display={'flex'}
      style={{
        background: "url('/images/background.png') center center fixed",
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box className={classes.home}>
        <Title size={!isMobile ? 60 : 40} ta={'center'} pt={isMobile || !idealHeight ? 'xl' : '0'}>
          Discord Status as Image
        </Title>
        <Box
          mt="xl"
          h="min-content"
          p="xl"
          maw="85%"
          style={{ backgroundColor: '#00000050', borderRadius: !isMobile ? '25px' : '0' }}
        >
          <Center w="100%" h="100%">
            <MainContent />
          </Center>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
