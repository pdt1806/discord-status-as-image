import { Box, Center, Divider, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Helmet } from "react-helmet-async";

import MainContent from "../../components/MainContent";
import FAQs from "./FAQs";
import HowTo from "./HowTo";
import Intro from "./Intro";
import Love from "./Love";
import classes from "./index.module.css";

const Home = () => {
  const isMobile = useMediaQuery("(max-width: 1080px)");

  return (
    <>
      <Helmet>
        <title>Discord Status as Image</title>
        <link rel="icon" type="image/png" href="/images/disi-logo-circle.png" />
        <link rel="canonical" href="https://disi.bennynguyen.dev/" />
      </Helmet>

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
