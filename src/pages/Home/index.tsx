import { Alert, Box, Center, Divider, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import MainContent from '../../components/MainContent';
import { fetchMaintenanceMessage } from '../../utils/tools';
import FAQs from './FAQs';
import HowTo from './HowTo';
import Intro from './Intro';
import Love from './Love';
import classes from './index.module.css';

const Home = () => {
  const isMobile = useMediaQuery('(max-width: 1080px)');

  const [maintenanceMessage, setMaintenanceMessage] = useState<string[]>([]);

  useEffect(() => {
    const fetchMessage = async () => {
      setMaintenanceMessage(await fetchMaintenanceMessage());
    };

    fetchMessage();
    if (window.location.pathname !== '/') window.location.pathname = '/';
  }, []);

  return (
    <>
      <Helmet>
        <title>Discord Status as Image</title>
        <link rel="icon" type="image/png" href="/images/disi-logo-circle.png" />
        <link rel="canonical" href="https://disi.bennynguyen.dev/" />
      </Helmet>
      {!!maintenanceMessage[3] && maintenanceMessage[4].includes('SCHEDULED') && (
        <Alert color="red" className={classes.alert}>
          <Text c="white" fw="bold" ta="center">
            {maintenanceMessage[3]}
          </Text>
        </Alert>
      )}
      <Box className={classes.mainContent}>
        <Center w="100%" h="100%">
          <MainContent />
        </Center>
      </Box>
      <Center>
        <Text ta="center" m="md">
          <strong>Discord Status as Image</strong> is not affiliated with Discord.
        </Text>
      </Center>
      <Divider w="90%" ml="auto" mr="auto" mb="sm" mt="xl" color="#333" />
      <Intro isMobile={isMobile} />
      <Box className={classes.info}>
        <HowTo />
        <FAQs />
        <Love isMobile={isMobile} />
      </Box>
    </>
  );
};

export default Home;
