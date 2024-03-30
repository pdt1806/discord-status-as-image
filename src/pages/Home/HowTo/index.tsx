import { Box, Flex, Image, Text, Title } from '@mantine/core';

export default function HowTo({ isMobile }: { isMobile: boolean | undefined }) {
  return (
    <Flex align="center" mb="xl" direction={isMobile ? 'column' : 'row'}>
      <Box w={isMobile ? '100%' : '45%'}>
        <Title mt="xl" mb="md" order={2}>
          Why should you get a DISI card?
        </Title>
        <Text>
          You can easily embed the image into your website or markdown file, and your Discord status
          will be shown and updated automatically for people who are not yet your friends. Moreover,
          they can click on the image and send you a friend request.
        </Text>
      </Box>
      <Image
        src="/images/showcase/disi-showcase-2.png"
        w={isMobile ? '100%' : '50%'}
        maw={isMobile ? '600px' : 'none'}
        h="auto"
        mt="xl"
        mb="xl"
        radius="md"
        ml="auto"
        mr={isMobile ? 'auto' : '0'}
      />
    </Flex>
  );
}
