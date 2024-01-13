import MainContent from '@/components/MainContent';
import { isMobile } from '@/utils/tools';
import { Box, Center, Divider, Image, List, Text, Title } from '@mantine/core';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    if (window.location.pathname !== '/') window.location.pathname = '/';
  }, []);

  return (
    <>
      <Box
        h="min-content"
        p="xl"
        mt={isMobile ? '0' : 'xl'}
        mb={isMobile ? '0' : 'md'}
        ml="auto"
        mr="auto"
        w={isMobile ? '100%' : '85%'}
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
      <Divider w="90%" ml="auto" mr="auto" mb="sm" mt="xl" />
      <Box
        w="70%"
        display="flex"
        style={{ flexDirection: 'column' }}
        ml="auto"
        mr="auto"
        mt="xl"
        mb="xl"
      >
        <Title ta="center" mb="lg">
          Discord Status as Image
        </Title>
        <Text ta="center">
          Turn your Discord status into a simple, eye-catching image for easy sharing and display.
          With your username and just a few clicks, setting things up is quick and easy!
        </Text>
        <Title mt="xl" mb="md" order={3}>
          Why should you get a DISI card?
        </Title>
        <Text>
          You can easily embed the image into your website or markdown file, and your Discord status
          will be shown and updated automatically for people who are not yet your friends. Moreover,
          they can click on the image and send you a friend request.
        </Text>
        <Title mt="xl" mb="md" order={3}>
          How to get one?
        </Title>
        <List type="ordered">
          <List.Item mb="xs">Join the Discord Server to have your live status captured.</List.Item>
          <List.Item>Fill out the form.</List.Item>
          <List mb="xs" withPadding>
            <List.Item>Your username is required.</List.Item>
            <List.Item>
              If you choose to have a gradient background, the colors and the angle are required.
            </List.Item>
            <List.Item>
              If you choose to get a large card, the banner color is also required.
            </List.Item>
          </List>
          <List.Item>Click the "Generate" button and you are all set.</List.Item>
        </List>
        <Title mt="xl" mb="md" order={3}>
          Notes from Developer
        </Title>
        <List>
          <List.Item mb="xs">The provided status image is not guaranteed to be accurate.</List.Item>
          <List.Item mb="xs">
            The image does not come with a border radius and colored border; you can add them when
            embedding the image into websites.
          </List.Item>
          <List.Item mb="xs">
            Gradient background angle is not applicable to large cards in order to match the design
            on Discord.
          </List.Item>
          <List.Item>
            To achieve the best results, it is recommended to use a banner image with an aspect
            ratio of 2.69:1 and position the main content in the center. Currently, the uploaded
            image cannot be cropped.
          </List.Item>
        </List>
        <Title mt="xl" mb="md" order={3}>
          Love my Work?
        </Title>
        <Text mb="xs">
          If you enjoy my work, please consider supporting me by "buying me a coffee" or via GitHub
          Sponsors. It means a lot to me!
        </Text>
        <Link
          to="https://bennynguyen.dev"
          target="_blank"
          style={{ color: 'white', textDecoration: 'none' }}
        >
          <Text mb="md" fw="bold">
            Check out my other works here! 👉 🌐
          </Text>
        </Link>
        <Box display={'flex'} style={{ flexDirection: isMobile ? 'column' : 'row' }}>
          <a
            href="https://www.buymeacoffee.com/pdteggman"
            target="_blank"
            style={{
              width: 'auto ',
            }}
          >
            <Image
              src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&amp;emoji=☕&amp;slug=pdteggman&amp;button_colour=FFDD00&amp;font_colour=000000&amp;font_family=Poppins&amp;outline_colour=000000&amp;coffee_colour=ffffff"
              alt="Buy me a coffee"
              h="48px"
              w="225px"
            />
          </a>

          {isMobile ? (
            <iframe
              src="https://github.com/sponsors/pdt1806/button"
              title="Sponsor pdt1806"
              height="32"
              width="114"
              style={{
                border: '0',
                borderRadius: '6px',
                marginLeft: isMobile ? '0' : '10px',
                marginTop: isMobile ? '10px' : '0',
              }}
            ></iframe>
          ) : (
            <iframe
              src="https://github.com/sponsors/pdt1806/card"
              title="Sponsor pdt1806"
              height="225"
              width="600"
              style={{
                border: '0',
                backgroundColor: 'white',
                borderRadius: '12px',
                marginLeft: '10px',
              }}
            ></iframe>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Home;
