import { Box, Image, Text } from "@mantine/core";
import TwemojiImport from "react-twemoji";
import { getEmojiURLfromCDN } from "../../../utils/tools";
import { MoodType } from "../../../utils/types";
import classes from "./index.module.css";

const Twemoji = (TwemojiImport as any).default || TwemojiImport;

export default function MoodBox({
  mood,
  textColor,
}: {
  mood: MoodType;
  textColor: string;
}) {
  const bg = textColor === "white" ? "#313338" : "#f8fcfc";

  // if (mood.state === 'Custom Status' && mood.emoji?.id) {
  //   return null;
  // }

  return (
    <Box
      style={{
        position: "absolute",
        zIndex: 999,
        transform: "translate(280px, -360px)",
      }}
    >
      <Box w={30} h={30} bg={bg} style={{ borderRadius: "50%" }} />
      <Box
        w={56}
        h={56}
        bg={bg}
        style={{ borderRadius: "50%" }}
        mt="xs"
        ml="lg"
      />
      <Box
        mt={-35}
        bg={bg}
        mih={50}
        maw={400}
        miw={100}
        py="sm"
        px="xl"
        style={{
          borderRadius: "var(--mantine-radius-xl)",
          zIndex: 999,
          position: "relative",
        }}
      >
        <Text ff="gg sans" fz={25} c={textColor} lineClamp={2}>
          {mood.emoji && mood.emoji.id && (
            <span style={{ display: "inline-block", verticalAlign: "middle" }}>
              <Image
                src={getEmojiURLfromCDN(mood.emoji)}
                alt={mood.emoji.name}
                style={{ width: 35, height: 35 }}
                mr="md"
              />
            </span>
          )}
          {mood.emoji && !mood.emoji.id && (
            <Twemoji
              options={{ className: classes.twemoji }}
              style={{
                width: "max-content",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              <span style={{ fontSize: 30 }}>{mood.emoji.name}</span>
            </Twemoji>
          )}
          {mood.state === "Custom Status" ? "" : mood.state}
        </Text>
      </Box>
    </Box>
  );
}
