import { Avatar, Box, Flex, Group, Image, Progress, Space, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import {
  formatActivityImageUrl,
  getElapsedProgessListening,
  getImageURLfromCDN,
  getPlayingTimestamp,
} from '../../../utils/tools';
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

  const [playingTimestamp, setPlayingTimestamp] = useState(
    getPlayingTimestamp(activity.timestamps)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      switch (activity.type) {
        case 'listening':
          setListeningProgress(getElapsedProgessListening(activity.timestamps));
          break;
        case 'playing':
          setPlayingTimestamp(getPlayingTimestamp(activity.timestamps));
          break;
        default:
          break;
      }
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
                height: '150px',
                aspectRatio: '1/1',
                borderRadius: 10,
              }}
            />
            <Box maw={500}>
              <Title ff="Noto Sans TC" order={3}>
                {activity.name}
              </Title>
              <Space h={3} />
              <Text ff="Noto Sans TC" fz="lg">{`by ${activity.artists.join(', ')}`}</Text>
              <Text ff="Noto Sans TC" fz="lg">{`on ${activity.album.name}`}</Text>
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
              <Text ff="Noto Sans TC" fz="lg">
                {listeningProgress.elapsedTime}
              </Text>
              <Text ff="Noto Sans TC" fz="lg">
                {listeningProgress.totalTime}
              </Text>
            </Flex>
          </Group>
        </>
      )}
      {activity.type === 'playing' && (
        <>
          <Title order={3} ff="Noto Sans TC">
            Playing a game
          </Title>
          <Group gap="lg" mt="lg">
            <OtherAssets activity={activity} />
            <Box maw={500}>
              <Title ff="Noto Sans TC" order={3} lineClamp={1}>
                {activity.name}
              </Title>
              <Space h={3} />
              <Text ff="Noto Sans TC" fz="lg" lineClamp={1}>
                {activity.details}
              </Text>
              <Text ff="Noto Sans TC" fz="lg" lineClamp={1}>
                {activity.state}
              </Text>
              {activity.timestamps.start && activity.timestamps.end && (
                <Text ff="Noto Sans TC" fz="lg" lineClamp={1}>
                  {playingTimestamp} elapsed
                </Text>
              )}
            </Box>
          </Group>
        </>
      )}
      {activity.type === 'streaming' && (
        <>
          <Title order={3} ff="Noto Sans TC">
            Live on {activity.platform}
          </Title>
          <Group gap="lg" mt="lg">
            {activity.assets.large_image && <OtherAssets activity={activity} />}
            <Box maw={500}>
              <Title ff="Noto Sans TC" order={3} lineClamp={1}>
                {activity.details}
              </Title>
              <Space h={3} />
              <Text ff="Noto Sans TC" fz="lg" lineClamp={1}>
                playing {activity.game}
              </Text>
              {activity.timestamps.start && activity.timestamps.end && (
                <Text ff="Noto Sans TC" fz="lg" lineClamp={1}>
                  {playingTimestamp} elapsed
                </Text>
              )}
            </Box>
          </Group>
        </>
      )}
      {['watching', 'competing'].includes(activity.type) && (
        <>
          {activity.type === 'watching' ? (
            <Title order={3} ff="Noto Sans TC">
              Watching {activity.name}
            </Title>
          ) : (
            <Title order={3} ff="Noto Sans TC">
              Competing in {activity.name}
            </Title>
          )}
          <Group gap="lg" mt="lg">
            {activity.assets.large_image && <OtherAssets activity={activity} />}
            <Box maw={500}>
              <Title ff="Noto Sans TC" order={3} lineClamp={2}>
                {activity.details}
              </Title>
              <Space h={3} />
              <Text ff="Noto Sans TC" fz="lg" lineClamp={1}>
                {activity.state}
              </Text>
              {activity.timestamps.start && activity.timestamps.end && (
                <Text ff="Noto Sans TC" fz="lg" lineClamp={1}>
                  {playingTimestamp} elapsed
                </Text>
              )}
            </Box>
          </Group>
        </>
      )}
    </Box>
  );
}

function OtherAssets({ activity }: { activity: ActivityType }) {
  return (
    <Box>
      <Image
        src={
          activity.assets.large_image.includes('https')
            ? formatActivityImageUrl(activity.assets.large_image)
            : getImageURLfromCDN(activity.application_id, activity.assets.large_image)
        }
        alt="Large Image"
        style={{
          height: '150px',
          aspectRatio: '1/1',
          borderRadius: 10,
        }}
      />
      {activity.assets.small_image && (
        <Flex
          w="100%"
          mt={-35}
          style={{
            transform: 'translateX(5px)',
          }}
        >
          <Avatar
            ml="auto"
            src={
              activity.assets.small_image.includes('https')
                ? formatActivityImageUrl(activity.assets.small_image)
                : getImageURLfromCDN(activity.application_id, activity.assets.small_image)
            }
            alt="Small Image"
            size={40}
            bg="black"
          />
        </Flex>
      )}
    </Box>
  );
}
