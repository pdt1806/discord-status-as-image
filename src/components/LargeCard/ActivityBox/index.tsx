import {
  Box,
  Flex,
  Group,
  Image,
  Progress,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  formatActivityImageUrl,
  getElapsedProgessListening,
  getImageURLfromCDN,
  getPlayingTimestamp,
} from "../../../utils/tools";
import { ActivityType } from "../../../utils/types";
import classes from "../index.module.css";

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
    getElapsedProgessListening(activity.timestamps),
  );

  const [playingTimestamp, setPlayingTimestamp] = useState(
    getPlayingTimestamp(activity.timestamps),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      switch (activity.type) {
        case "listening":
          setListeningProgress(getElapsedProgessListening(activity.timestamps));
          break;
        case "playing":
        case "streaming":
        case "watching":
        case "competing":
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
      {activity.type === "listening" && (
        <>
          <Group gap="sm">
            <Title order={3} ff="gg sans" size={25}>
              Listening to {activity.platform ?? activity.name}
            </Title>
            {/* {activity.platform == "Spotify" && (
              <Image
                src="/images/logos/spotify.svg"
                alt="Spotify"
                style={{ width: 30, height: 30 }}
                mt={-2}
              />
            )} */}
          </Group>
          <Group gap="lg" mt="lg">
            <Image
              src={
                activity.platform
                  ? activity.album.cover
                  : formatActivityImageUrl(activity.assets.large_image)
              }
              alt="Large Image"
              style={{
                height: 150,
                width: 150,
                aspectRatio: "1/1",
                borderRadius: 10,
              }}
            />
            <Box style={{ width: "75%" }}>
              <Title ff="gg sans" order={3} fz={28} lineClamp={1}>
                {activity.platform ? activity.name : activity.details}
              </Title>
              <Space h={3} />
              <Text ff="gg sans" fz={25}>
                {`by ${activity.platform ? activity.artists.join(", ") : activity.state}`}
              </Text>
              {/* {activity.platform && (
                <Text ff="gg sans" fz={25}>{`on ${activity.album.name}`}</Text>
              )} */}
            </Box>
          </Group>
          <Flex mt="md" justify="space-between" align="center" w="100%">
            <Text ff="gg sans mono" fz={22}>
              {listeningProgress.elapsedTime}
            </Text>
            <Progress
              mx="md"
              radius="xl"
              value={listeningProgress.progress}
              color={textColor}
              bg="var(--mantine-color-dimmed)"
              w="100%"
            />
            <Text ff="gg sans mono" fz={22}>
              {listeningProgress.totalTime}
            </Text>
          </Flex>
        </>
      )}
      {activity.type === "playing" && (
        <>
          <Title order={3} ff="gg sans" size={25}>
            Playing
          </Title>
          <Group gap="lg" mt="lg">
            {activity.assets && <OtherAssets activity={activity} />}
            <Box maw={500}>
              <Title ff="gg sans" order={3} lineClamp={1} fz={28}>
                {activity.name}
              </Title>
              <Space h={3} />
              <Text ff="gg sans" fz={25} lineClamp={1}>
                {activity.details}
              </Text>
              <Text ff="gg sans" fz={25} lineClamp={1}>
                {activity.state}
              </Text>
              {activity.timestamps.start && (
                <Text ff="gg sans" fz={25} lineClamp={1}>
                  {playingTimestamp} elapsed
                </Text>
              )}
            </Box>
          </Group>
        </>
      )}
      {activity.type === "streaming" && (
        <>
          <Title order={3} ff="gg sans" size={25}>
            Live on {activity.platform}
          </Title>
          <Group gap="lg" mt="lg">
            {activity.assets && <OtherAssets activity={activity} />}
            <Box maw={500}>
              <Title ff="gg sans" order={3} lineClamp={1} fz={28}>
                {activity.details}
              </Title>
              <Space h={3} />
              <Text ff="gg sans" fz={25} lineClamp={1}>
                playing {activity.game}
              </Text>
              {activity.timestamps.start && (
                <Text ff="gg sans" fz={25} lineClamp={1}>
                  {playingTimestamp} elapsed
                </Text>
              )}
            </Box>
          </Group>
        </>
      )}
      {["watching", "competing"].includes(activity.type) && (
        <>
          {activity.type === "watching" ? (
            <Title order={3} ff="gg sans" size={25}>
              Watching {activity.name}
            </Title>
          ) : (
            <Title order={3} ff="gg sans">
              Competing in {activity.name}
            </Title>
          )}
          <Group gap="lg" mt="lg">
            {activity.assets && <OtherAssets activity={activity} />}
            <Box maw={500}>
              <Title ff="gg sans" order={3} lineClamp={2} fz={28}>
                {activity.details}
              </Title>
              <Space h={3} />
              <Text ff="gg sans" fz={25} lineClamp={1}>
                {activity.state}
              </Text>
              {activity.timestamps.start && (
                <Text ff="gg sans" fz={25} lineClamp={1}>
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

  const resolveImageUrl = (imageName?: string) => {
    if (!imageName) return "";

    return imageName.includes("https")
      ? formatActivityImageUrl(imageName)
      : getImageURLfromCDN(activity.application_id, imageName);
  };

  const primaryImageUrl = resolveImageUrl(large_image ?? small_image);
  const secondaryImageUrl = resolveImageUrl(small_image);

  return (
    <Box>
      <Image
        src={primaryImageUrl}
        alt="Large Image"
        style={{
          height: "150px",
          aspectRatio: "1/1",
          borderRadius: 10,
        }}
      />
      {small_image && large_image && (
        <Flex
          w="100%"
          mt={-45}
          style={{
            transform: "translateX(10px)",
          }}
        >
          <Image
            ml="auto"
            src={secondaryImageUrl}
            alt="Small Image"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
            bg="black"
          />
        </Flex>
      )}
    </Box>
  );
}
