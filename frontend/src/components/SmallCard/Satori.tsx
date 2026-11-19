import type {
  ActivityType,
  MoodType,
  PrimaryGuildType,
} from "../../utils/types";

type SatoriSmallCardProps = {
  displayName: string | null;
  avatar: string | null;
  avatarDecoration: string | null;
  status: string | null;
  createdDate: string | null;
  activity: ActivityType | null;
  mood: MoodType | null;
  primaryGuild: PrimaryGuildType | null;
  background: string;
  textColor: string;
  assetBaseUrl: string;
  discordLabel?: boolean;
  emojiImageUrl?: string;
};

export const SMALL_CARD_SATORI_WIDTH = 1350;
export const SMALL_CARD_SATORI_HEIGHT = 450;

const getTitleSize = (displayName: string | null) => {
  const length = displayName?.length ?? 0;

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
  const month = Number(date.slice(0, 2));
  const monthName = months[month - 1];

  return monthName
    ? `${monthName} ${date.slice(3, 5)}, ${date.slice(6, 10)}`
    : date;
};

const getActivityText = (activity: ActivityType) => {
  switch (activity.type) {
    case "listening":
      return {
        prefix: "Listening to ",
        detail: activity.platform ? activity.artists.join(", ") : activity.state,
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

const SatoriSmallCard = ({
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
  assetBaseUrl,
  discordLabel = false,
  emojiImageUrl,
}: SatoriSmallCardProps) => {
  const assetUrl = (path: string) =>
    new URL(path, assetBaseUrl).toString();
  const mutedTextColor =
    status === "offline" && textColor !== "white" ? "#5d5f6b" : textColor;
  const activityText = activity ? getActivityText(activity) : null;
  const showActivity =
    activityText && (mood?.state === "Custom Status" || !mood);
  const customEmojiUrl =
    mood?.emoji.id && mood.emoji.id > 0
      ? `https://cdn.discordapp.com/emojis/${mood.emoji.id}.png`
      : emojiImageUrl;
  const titleSize = getTitleSize(displayName);

  return (
    <div
      style={{
        width: SMALL_CARD_SATORI_WIDTH,
        height: SMALL_CARD_SATORI_HEIGHT,
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: "30px 30px 30px 70px",
        boxSizing: "border-box",
        overflow: "hidden",
        background,
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
        {avatar && (
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
        )}
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
          src={assetUrl(`/images/icons/${status || "offline"}.svg`)}
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
              fontSize: titleSize,
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
              src={assetUrl("/images/discord.svg")}
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
                {mood.emoji.name && (
                  customEmojiUrl ? (
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
                  )
                )}
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
                src={assetUrl("/images/detail-icon.svg")}
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
          src={assetUrl("/images/discord-label.svg")}
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

export default SatoriSmallCard;
