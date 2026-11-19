import { readFile } from "node:fs/promises";
import satori from "satori";

type ActivityType = {
  type: string;
  name?: string;
  platform?: string;
  artists?: string[];
  state?: string;
  details?: string;
};

type MoodType = {
  state: string;
  emoji: { id: number; name: string };
};

type PrimaryGuildType = { badge: string; tag: string };

type SmallCardSvgProps = {
  displayName: string;
  avatar: string;
  avatarDecoration: string | null;
  status: string;
  createdDate: string | null;
  activity: ActivityType | null;
  mood: MoodType | null;
  primaryGuild: PrimaryGuildType | null;
  background: string;
  textColor: string;
  discordLabel: boolean;
  emojiImageUrl?: string;
};

type CardAssets = {
  discord: string;
  detail: string;
  label: string;
  status: Record<string, string>;
};

export type SmallCardUser = {
  username: string;
  display_name: string;
  avatar: string;
  avatar_decoration: string | null;
  status: string;
  created_at: string;
  accent_color: string | null;
  activity: ActivityType | null;
  mood: MoodType | null;
  primary_guild: PrimaryGuildType | null;
};

export const SMALL_CARD_SVG_WIDTH = 1350;
export const SMALL_CARD_SVG_HEIGHT = 450;

const fontRegular = readFile(
  new URL(
    "../../node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff",
    import.meta.url,
  ),
);
const fontSemibold = readFile(
  new URL(
    "../../node_modules/@fontsource/roboto/files/roboto-latin-600-normal.woff",
    import.meta.url,
  ),
);
const cardAssets = Promise.all([
  readFile(new URL("../../assets/images/discord.svg", import.meta.url), "utf8"),
  readFile(
    new URL("../../assets/images/detail-icon.svg", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../../assets/images/discord-label.svg", import.meta.url),
    "utf8",
  ),
  Promise.all(
    ["online", "offline", "idle", "dnd"].map(async (status) => [
      status,
      await readFile(
        new URL(`../../assets/images/icons/${status}.svg`, import.meta.url),
        "utf8",
      ),
    ]),
  ),
]).then(([discord, detail, label, statuses]) => {
  const toDataUri = (svg: string) =>
    `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return {
    discord: toDataUri(discord),
    detail: toDataUri(detail),
    label: toDataUri(label),
    status: Object.fromEntries(
      statuses.map(([status, svg]) => [status, toDataUri(svg)]),
    ) as Record<string, string>,
  };
});

const tintSvgDataUri = (dataUri: string, from: string, to: string) => {
  const svg = Buffer.from(
    dataUri.slice("data:image/svg+xml;base64,".length),
    "base64",
  )
    .toString("utf8")
    .replaceAll(from, to);

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

const getTitleSize = (displayName: string) => {
  const length = displayName.length;

  if (!length || length > 25) return 45;
  if (length > 20) return 50;
  if (length > 15) return 60;
  if (length > 10) return 80;
  return 85;
};

const formatCreatedDate = (date: string) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = months[Number(date.slice(0, 2)) - 1];

  return monthName
    ? `${monthName} ${date.slice(3, 5)}, ${date.slice(6, 10)}`
    : date;
};

const getActivityText = (activity: ActivityType) => {
  switch (activity.type) {
    case "listening":
      return {
        prefix: "Listening to ",
        detail:
          activity.platform && activity.artists
            ? activity.artists.join(", ")
            : activity.state,
      };
    case "watching":
      return { prefix: "Watching ", detail: activity.name };
    case "playing":
      return { prefix: "Playing ", detail: activity.name };
    case "streaming":
      return { prefix: "Streaming ", detail: activity.details };
    case "competing":
      return { prefix: "Competing in ", detail: activity.name };
    default:
      return null;
  }
};

const SmallCardSvg = ({
  displayName,
  avatar,
  avatarDecoration,
  status,
  createdDate,
  activity,
  mood,
  primaryGuild,
  background,
  textColor,
  discordLabel,
  emojiImageUrl,
  assets,
}: SmallCardSvgProps & { assets: CardAssets }) => {
  const mutedTextColor =
    status === "offline" && textColor !== "white" ? "#5d5f6b" : textColor;
  const activityText = activity ? getActivityText(activity) : null;
  const showActivity =
    activityText && (mood?.state === "Custom Status" || !mood);
  const customEmojiUrl =
    mood?.emoji.id && mood.emoji.id > 0
      ? `https://cdn.discordapp.com/emojis/${mood.emoji.id}.png`
      : emojiImageUrl;

  return (
    <div
      style={{
        width: SMALL_CARD_SVG_WIDTH,
        height: SMALL_CARD_SVG_HEIGHT,
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: "30px 30px 30px 70px",
        boxSizing: "border-box",
        overflow: "hidden",
        background,
        fontFamily: "Roboto",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexShrink: 0,
          width: 273,
          height: 273,
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: "#202225",
        }}
      >
        <img
          src={avatar}
          alt=""
          width={273}
          height={273}
          style={{
            width: 273,
            height: 273,
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
        {avatarDecoration && (
          <img
            src={avatarDecoration}
            alt=""
            width={273}
            height={273}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 273,
              height: 273,
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        )}
        <img
          src={assets.status[status] ?? assets.status.offline}
          alt=""
          width={70}
          height={70}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 70,
            height: 70,
            borderRadius: "50%",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          minWidth: 0,
          height: "100%",
          marginLeft: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            minHeight: 130,
            gap: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              minWidth: 0,
              color: mutedTextColor,
              fontSize: getTitleSize(displayName),
              fontWeight: 600,
              lineHeight: 1.1,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </div>
          {primaryGuild && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                gap: 8,
                maxWidth: 250,
                padding: "8px 12px",
                borderRadius: 10,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: textColor,
                fontSize: 24,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              <img
                src={primaryGuild.badge}
                alt=""
                width={20}
                height={20}
                style={{ width: 20, height: 20, objectFit: "contain" }}
              />
              {primaryGuild.tag}
            </div>
          )}
        </div>

        {createdDate && !(activity || mood) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 24,
              color: mutedTextColor,
              fontSize: 40,
              fontWeight: 400,
            }}
          >
            <img
              src={assets.discord}
              alt=""
              width={60}
              height={60}
              style={{
                width: 60,
                height: 60,
                marginRight: 24,
                objectFit: "contain",
              }}
            />
            {formatCreatedDate(createdDate)}
          </div>
        )}

        {(activity || mood) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: 60,
              marginTop: 24,
              overflow: "hidden",
              color: mutedTextColor,
              fontSize: 40,
              whiteSpace: "nowrap",
            }}
          >
            {mood && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  marginRight: showActivity ? 16 : 0,
                }}
              >
                {mood.emoji.name &&
                  (customEmojiUrl ? (
                    <img
                      src={customEmojiUrl}
                      alt=""
                      width={58}
                      height={58}
                      style={{
                        width: 58,
                        height: 58,
                        marginRight: 16,
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 45, marginRight: 16 }}>
                      {mood.emoji.name}
                    </span>
                  ))}
                {mood.state !== "Custom Status" && mood.state}
              </div>
            )}
            {showActivity && (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                {activityText.prefix}
                <span style={{ fontWeight: 600 }}>{activityText.detail}</span>
              </div>
            )}
            {activity && (
              <img
                src={assets.detail}
                alt=""
                width={40}
                height={40}
                style={{
                  width: 40,
                  height: 40,
                  marginLeft: 24,
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        )}
      </div>

      {discordLabel && (
        <img
          src={assets.label}
          alt=""
          width={339}
          height={90}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 339,
            height: 90,
            objectFit: "contain",
          }}
        />
      )}
    </div>
  );
};

export const renderSmallCardSvg = async (
  props: SmallCardSvgProps,
) => {
  const [regularFont, semiboldFont, images] = await Promise.all([
    fontRegular,
    fontSemibold,
    cardAssets,
  ]);
  const mutedTextColor =
    props.status === "offline" && props.textColor !== "white"
      ? "#5d5f6b"
      : props.textColor;
  const tintedImages = {
    ...images,
    discord: tintSvgDataUri(images.discord, "#000000", mutedTextColor),
    detail: tintSvgDataUri(
      images.detail,
      "oklab(0 -0.004 -0.015)",
      mutedTextColor,
    ),
  };
  const emoji = props.mood?.emoji.name;
  const unicodeEmoji = emoji && !props.mood?.emoji.id ? emoji : undefined;
  const twemojiUrl = unicodeEmoji
    ? `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${Array.from(
        unicodeEmoji.replace(/\uFE0F/g, ""),
      )
        .map((character) => character.codePointAt(0)?.toString(16) ?? "")
        .join("-")}.svg`
    : undefined;

  return satori(
    <SmallCardSvg
      {...props}
      emojiImageUrl={props.emojiImageUrl ?? twemojiUrl}
      assets={tintedImages}
    />,
    {
      width: SMALL_CARD_SVG_WIDTH,
      height: SMALL_CARD_SVG_HEIGHT,
      fonts: [
        { name: "Roboto", data: regularFont, weight: 400, style: "normal" },
        { name: "Roboto", data: semiboldFont, weight: 600, style: "normal" },
      ],
    },
  );
};
