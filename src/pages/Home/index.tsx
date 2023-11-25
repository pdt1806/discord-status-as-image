import MainContent from '@/components/MainContent';
import { isMobile } from '@/utils/tools';
import { Box, Center, Text, Title } from '@mantine/core';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import classes from './index.module.css';

const Home = () => {
  useEffect(() => {
    if (window.location.pathname !== '/') window.location.pathname = '/';
  }, []);

  return (
    <Box
      w="100vw"
      h={!isMobile ? '100vh' : '100%'}
      display={'flex'}
      style={{
        background: "url('/images/background.png') center center fixed",
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box className={classes.home}>
        <Title size={!isMobile ? 60 : 40} ta={'center'} pt={isMobile ? 'xl' : '0'}>
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
        <Text mt="md" mb="md">
          Created by{' '}
          <Link
            to="https://github.com/pdt1806"
            target="_blank"
            style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
          >
            pdt1806
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Home;
