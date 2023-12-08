import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import { isMobile } from '@/utils/tools';
import { Box, Center } from '@mantine/core';
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    if (window.location.pathname !== '/') window.location.pathname = '/';
  }, []);

  return (
    <Box
      w="100vw"
      bg="#303030"
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <Header />
      <Box style={{ flexGrow: '1' }} />
      <Box
        h="min-content"
        p="xl"
        ml="auto"
        mr="auto"
        maw={isMobile ? '100%' : '85%'}
        style={{
          backgroundColor: '#00000050',
          borderRadius: !isMobile ? '25px' : '0',
          color: 'white',
        }}
      >
        <Center w="100%" h="100%">
          <MainContent />
        </Center>
      </Box>
      <Box style={{ flexGrow: '1' }} />
      <Footer />
    </Box>
  );
};

export default Home;
