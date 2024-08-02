import { Box, Flex, Image, Title } from '@mantine/core';
import classes from '../index.module.css';

export default function ActivityBox({
  background,
  textColor,
}: {
  background: string;
  textColor: string;
}) {
  return (
    <Box
      c={textColor}
      className={classes.aboutMeBox}
      style={{
        backgroundColor: background,
        backdropFilter: 'brightness(0.8)',
      }}
    >
      <Flex justify="space-between" align="center">
        <Title order={3} ff="Noto Sans TC">
          Listening to Spotify
        </Title>
        <Image src="/images/logos/spotify.svg" alt="Spotify" width={30} height={30} />
      </Flex>
    </Box>
  );
}
