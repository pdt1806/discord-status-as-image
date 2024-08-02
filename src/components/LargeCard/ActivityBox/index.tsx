import { Box, Flex, Group, Image, Progress, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getElapsedProgessListening } from '../../../utils/tools';
import { ActivityType } from '../../../utils/types';
import classes from '../index.module.css';

export default function ActivityBox({
  background,
  textColor,
  activity,
}: {
  background: string;
  textColor: string;
  activity: ActivityType;
}) {
  const [listeningProgress, setListeningProgress] = useState(
    getElapsedProgessListening(activity.timestamps)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setListeningProgress(getElapsedProgessListening(activity.timestamps));
    }, 1000);

    return () => clearInterval(interval);
  }, [activity]);

  return (
    <Box
      c={textColor}
      className={classes.aboutMeBox}
      style={{
        backgroundColor: background,
        backdropFilter: 'brightness(0.8)',
      }}
    >
      {activity.type === 'listening' && (
        <>
          <Flex justify="space-between" align="center">
            <Title order={3} ff="Noto Sans TC">
              Listening to {activity.platform}
            </Title>
            <Image src="/images/logos/spotify.svg" alt="Spotify" width={30} height={30} />
          </Flex>
          <Group gap="md" mt="lg">
            <Image
              src={activity.album.cover}
              alt="Large Image"
              style={{
                width: '150px',
                borderRadius: 10,
              }}
            />
            <Box maw={520}>
              <Title order={3}>{activity.name}</Title>
              <Text fz="lg">{`by ${activity.artists.join(', ')}`}</Text>
              <Text fz="lg">{`on ${activity.album.name}`}</Text>
            </Box>
            <Progress
              mt="md"
              radius="xl"
              value={listeningProgress.progress}
              color={textColor}
              bg="var(--mantine-color-dimmed)"
              w="100%"
            />
            <Flex justify="space-between" align="center" w="100%">
              <Text fz="lg">{listeningProgress.elapsedTime}</Text>
              <Text fz="lg">{listeningProgress.totalTime}</Text>
            </Flex>
          </Group>
        </>
      )}
    </Box>
  );
}
