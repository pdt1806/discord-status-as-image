import { Box, Center, Flex, Image, Overlay, Text, Title } from '@mantine/core';

export default function Intro({ isMobile }: { isMobile: boolean | undefined }) {
  return (
    <Center>
      <Box style={{ position: 'relative' }} w={isMobile ? '90%' : '80%'} mih={500}>
        <Overlay h="auto" mt="xl" mb="md" radius="md" p="lg">
          <Flex align="center" direction="column" justify="center" h="100%">
            <Image
              src="/images/disi-logo.png"
              alt="Discord Status as Image"
              h={150}
              w={150}
              style={{ borderRadius: '15%' }}
              mb="md"
            />
            <Title mb="lg" ta="center">
              Discord Status as Image
            </Title>
            <Text mb="xl" ta="center">
              Turn your Discord status into a simple, eye-catching image for easy sharing and
              display. With your username and just a few clicks, setting things up is quick and
              easy!
            </Text>
          </Flex>
        </Overlay>
        <Image
          src="/images/showcase/disi-showcase-1.png"
          mih={500}
          h="auto"
          mt="xl"
          mb="md"
          radius="md"
        />
      </Box>
    </Center>
  );
}
