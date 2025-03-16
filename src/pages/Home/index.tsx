import { Alert, Box, Center, Divider, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import MainContent from '../../components/MainContent';
import { fetchMaintenanceMessage } from '../../utils/tools';
import { MaintenanceMessageType } from '../../utils/types';
import FAQs from './FAQs';
import HowTo from './HowTo';
import Intro from './Intro';
import Love from './Love';
import classes from './index.module.css';

const Home = () => {
  const isMobile = useMediaQuery('(max-width: 1080px)');

  const [maintenanceMessage, setMaintenanceMessage] = useState<MaintenanceMessageType | null>(null);

  useEffect(() => {
    (async () => {
      const message = await fetchMaintenanceMessage();
      setMaintenanceMessage(message);
    })();

    if (window.location.pathname !== '/') window.location.pathname = '/';
  }, []);

  return (
    <>
      <Helmet>
        <title>Discord Status as Image</title>
        <link rel="icon" type="image/png" href="/images/disi-logo-circle.png" />
        <link rel="canonical" href="https://disi.bennynguyen.dev/" />
      </Helmet>
      {maintenanceMessage?.scheduled.active && (
        <Alert color="red" className={classes.alert}>
          <Text c="white" fw="bold" ta="center">
            Scheduled maintenance: {maintenanceMessage.scheduled.date}
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
