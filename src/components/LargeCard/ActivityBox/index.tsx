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
        case 'streaming':
        case 'watching':
        case 'competing':
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
      }}
    >
      {activity.type === 'listening' && (
        <>
          <Flex justify="space-between" align="center">
            <Title order={3} ff="Noto Sans TC">
              Listening to {activity.platform ?? activity.name}
            </Title>
            {activity.platform && (
              <Image src="/images/logos/spotify.svg" alt="Spotify" width={30} height={30} />
            )}
          </Flex>
          <Group gap="md" mt="lg">
            <Image
              src={
                activity.platform
                  ? activity.album.cover
                  : formatActivityImageUrl(activity.assets.large_image)
              }
              alt="Large Image"
              style={{
                height: '150px',
                aspectRatio: '1/1',
                borderRadius: 10,
              }}
            />
            <Box maw={500}>
              <Title ff="Noto Sans TC" order={3}>
                {activity.platform ? activity.name : activity.details}
              </Title>
              <Space h={3} />
              <Text ff="Noto Sans TC" fz={22}>
                {`by ${activity.platform ? activity.artists.join(', ') : activity.state}`}
              </Text>
              {activity.platform && (
                <Text ff="Noto Sans TC" fz={22}>{`on ${activity.album.name}`}</Text>
              )}
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
              <Text ff="Noto Sans TC" fz={22}>
                {listeningProgress.elapsedTime}
              </Text>
              <Text ff="Noto Sans TC" fz={22}>
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
            {activity.assets && <OtherAssets activity={activity} />}
            <Box maw={500}>
              <Title ff="Noto Sans TC" order={3} lineClamp={1}>
                {activity.name}
              </Title>
              <Space h={3} />
              <Text ff="Noto Sans TC" fz={22} lineClamp={1}>
                {activity.details}
              </Text>
              <Text ff="Noto Sans TC" fz={22} lineClamp={1}>
                {activity.state}
              </Text>
              {activity.timestamps.start && (
                <Text ff="Noto Sans TC" fz={22} lineClamp={1}>
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
            {activity.assets && <OtherAssets activity={activity} />}
            <Box maw={500}>
              <Title ff="Noto Sans TC" order={3} lineClamp={1}>
                {activity.details}
              </Title>
              <Space h={3} />
              <Text ff="Noto Sans TC" fz={22} lineClamp={1}>
                playing {activity.game}
              </Text>
              {activity.timestamps.start && (
                <Text ff="Noto Sans TC" fz={22} lineClamp={1}>
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
            {activity.assets && <OtherAssets activity={activity} />}
            <Box maw={500}>
              <Title ff="Noto Sans TC" order={3} lineClamp={2}>
                {activity.details}
              </Title>
              <Space h={3} />
              <Text ff="Noto Sans TC" fz={22} lineClamp={1}>
                {activity.state}
              </Text>
              {activity.timestamps.start && (
                <Text ff="Noto Sans TC" fz={22} lineClamp={1}>
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
  const { large_image, small_image } = activity.assets;

  return (
    <Box>
      <Image
        src={
          large_image
            ? large_image.includes('https')
              ? formatActivityImageUrl(large_image)
              : getImageURLfromCDN(activity.application_id, large_image)
            : small_image
              ? small_image.includes('https')
                ? formatActivityImageUrl(small_image)
                : getImageURLfromCDN(activity.application_id, small_image)
              : ''
        }
        alt="Large Image"
        style={{
          height: '150px',
          aspectRatio: '1/1',
          borderRadius: 10,
        }}
      />
      {small_image && large_image && (
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
              small_image.includes('https')
                ? formatActivityImageUrl(small_image)
                : getImageURLfromCDN(activity.application_id, small_image)
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
