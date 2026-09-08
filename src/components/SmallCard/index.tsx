import { Box, Flex, Group, Image, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import TwemojiImport from "react-twemoji";
import { formatDate, getEmojiURLfromCDN, setSmallCardTitleSize, setStatusImg, updateStatus } from "../../utils/tools";
import { ActivityType, MoodType } from "../../utils/types";
import DiscordAvatar from "../DiscordAvatar";
import ServerTag from "../ServerTag";
import innerClasses from "./index.module.css";
import { textColorFn } from "./utils";

const Twemoji = (TwemojiImport as any).default || TwemojiImport;

const SmallCard = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [displayName, setDisplayName] = useState(params.get("displayName"));
  const [avatar, setAvatar] = useState(params.get("avatar"));
  const [avatarDecoration, setAvatarDecoration] = useState(params.get("avatarDecoration"));
  const [primaryGuild, setPrimaryGuild] = useState(
    params.get("primaryGuild") ? JSON.parse(decodeURIComponent(params.get("primaryGuild")!)) : null,
  );
  const [status, setStatus] = useState(params.get("status"));
  const [createdDate, setCreatedDate] = useState(params.get("createdDate"));
  const [statusImage, setStatusImage] = useState(setStatusImg(status || "offline"));
  const [activity, setActivity] = useState<ActivityType | null>(
    params.get("activityData") ? JSON.parse(decodeURIComponent(params.get("activityData")!)) : null,
  );
  const [mood, setMood] = useState<MoodType | null>(
    params.get("moodData") ? JSON.parse(decodeURIComponent(params.get("moodData")!)) : null,
  );

  const id = params.get("id");
  const discordLabel = params.get("discordLabel") === "true";
  const displayUsername = params.get("displayUsername") === "true";

  const [backgroundColor, setBackgroundColor] = useState(
    params.get("bg") ? `#${params.get("bg")}` : params.get("accentColor") ? `#${params.get("accentColor")}` : "#2b2d31",
  );

  const [backgroundGradient, setBackgroundGradient] = useState("");
  const [textColor, setTextColor] = useState("");

  const updateStatusArgs = {
    id,
    params,
    displayUsername,
    setUsername: undefined, // setUsername is not needed in SmallCard
    setDisplayName,
    setAvatar,
    setStatus,
    setAvatarDecoration,
    setPrimaryGuild,
    setStatusImage,
    setCreatedDate,
    // setBackgroundColor,
    setBannerImage: undefined, // setBannerImage is not needed in SmallCard
    setAccentColor: setBackgroundColor, // setAccentColor = setBackgroundColor in SmallCard
    setActivity,
    setMood,
  };

  useEffect(() => {
    textColorFn(params, backgroundColor, setTextColor, setBackgroundGradient);
  }, [backgroundColor]);

  useEffect(() => {
    if (params.get("displayName")) return; // request from back-end
    updateStatus(updateStatusArgs);
    textColorFn(params, backgroundColor, setTextColor, setBackgroundGradient);
  }, []);

  useEffect(() => {
    if (window.__PLAYWRIGHT_SERVER__) return;

    const intervalID = setInterval(() => {
      updateStatus(updateStatusArgs);
    }, 15000);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(intervalID);
  }, []);

  const titleSize = setSmallCardTitleSize(displayName || "");

  const ratio = window.innerWidth / 1350;

  // expose to playwright
  useEffect(() => {
    window.refreshDiscordStatus = () => {
      return updateStatus(updateStatusArgs);
    };

    return () => {
      delete window.refreshDiscordStatus;
    };
  }, []);

  return (
    <a href={`https://discord.com/users/${id}`} target="_blank" rel="noreferrer">
      <Helmet>
        <title>{`${id} - Small - Discord Status as Image`}</title>
      </Helmet>
      <Box
        style={{
          background: backgroundGradient || backgroundColor,
          transform: `${ratio < 1 ? `scale(${ratio})` : ""}`,
        }}
        className={innerClasses.smallCard}
      >
        <DiscordAvatar avatar={avatar} avatarDecoration={avatarDecoration} statusImage={statusImage} />
        <Box style={{ transform: "translateX(60px)" }}>
          <Flex mih={130} direction="column" justify="center">
            <Group gap="xl">
              <Title
                mt="auto"
                fw={600}
                size={titleSize}
                c={status !== "offline" || (status === "offline" && textColor === "white") ? textColor : "#5d5f6b"}
                ff="gg sans"
                lh={1.1}
              >
                {displayName}
              </Title>
              {primaryGuild && (
                <Box
                  style={{
                    transform: "scale(1.8)",
                    transformOrigin: "left center",
                    marginTop: 15,
                  }}
                >
                  <ServerTag textColor={textColor} primaryGuild={primaryGuild} />
                </Box>
              )}
            </Group>
          </Flex>
          {createdDate && !(activity || mood) && (
            <Box mt="lg" display="flex" style={{ alignItems: "center" }}>
              <Image
                alt="discord-logo"
                src="/images/discord.svg"
                className={innerClasses.discordLogo}
                style={{
                  filter:
                    textColor === "white"
                      ? "invert(1)"
                      : status !== "offline"
                        ? "brightness(0) saturate(100%) invert(7%) sepia(6%) saturate(1299%) hue-rotate(177deg) brightness(96%) contrast(85%)"
                        : "brightness(0) saturate(100%) invert(34%) sepia(6%) saturate(770%) hue-rotate(194deg) brightness(102%) contrast(87%)",
                }}
              />
              <Title
                size={40}
                c={status !== "offline" || (status === "offline" && textColor === "white") ? textColor : "#5d5f6b"}
                fw={400}
                ff="gg sans"
              >
                {formatDate(createdDate)}
              </Title>
            </Box>
          )}
          {(activity || mood) && (
            <Box mt="lg" display="flex" style={{ alignItems: "center" }} h={60} maw={720}>
              {mood && (
                <Text
                  ff="gg sans"
                  fz={45}
                  c={status !== "offline" || (status === "offline" && textColor === "white") ? textColor : "#5d5f6b"}
                  lineClamp={1}
                >
                  {mood.emoji && mood.emoji.id && (
                    <span
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    >
                      <Image
                        src={getEmojiURLfromCDN(mood.emoji)}
                        alt={mood.emoji.name}
                        style={{ width: 58, height: 58 }}
                        mr="lg"
                      />
                    </span>
                  )}
                  {mood.emoji && !mood.emoji.id && (
                    <Twemoji
                      options={{ className: innerClasses.twemoji }}
                      style={{
                        width: "max-content",
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    >
                      <span style={{ fontSize: 45 }}>{mood.emoji.name}</span>
                    </Twemoji>
                  )}
                  {mood.state === "Custom Status" ? "" : mood.state}
                </Text>
              )}
              {activity && (mood?.state === "Custom Status" || !mood) && (
                <Title
                  lineClamp={1}
                  size={45}
                  c={status !== "offline" || (status === "offline" && textColor === "white") ? textColor : "#5d5f6b"}
                  fw={400}
                  ff="gg sans"
                >
                  {
                    {
                      listening: "Listening to ",
                      watching: "Watching ",
                      playing: "Playing ",
                      streaming: "Streaming ",
                      competing: "Competing in ",
                    }[activity.type]
                  }
                  <span style={{ fontWeight: 600 }}>
                    {
                      {
                        listening: activity.platform ? activity.artists.join(", ") : activity.state,
                        watching: activity.name,
                        playing: activity.name,
                        streaming: activity.details,
                        competing: activity.name,
                      }[activity.type]
                    }
                  </span>
                </Title>
              )}
              {activity && (
                <Image
                  alt="detail-icon"
                  src="/images/detail-icon.svg"
                  className={innerClasses.detailIcon}
                  style={{
                    filter:
                      textColor === "white"
                        ? "invert(1)"
                        : status !== "offline"
                          ? "brightness(0) saturate(100%) invert(7%) sepia(6%) saturate(1299%) hue-rotate(177deg) brightness(96%) contrast(85%)"
                          : "brightness(0) saturate(100%) invert(34%) sepia(6%) saturate(770%) hue-rotate(194deg) brightness(102%) contrast(87%)",
                  }}
                />
              )}
            </Box>
          )}
        </Box>
        {discordLabel && (
          <Image
            alt="discord-logo"
            src="/images/discord-label.svg"
            className={innerClasses.discordLabel}
            // style={{
            //   transform: `translate(603.3px, ${createdDate || activity || mood ? "30px" : "70px"})`,
            // }}
          />
        )}
      </Box>
    </a>
  );
};

export default SmallCard;
