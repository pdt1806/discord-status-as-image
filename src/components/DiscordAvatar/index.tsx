import { Box, Image } from "@mantine/core";
import classes from "../style/profile.module.css";

const DiscordAvatar = ({
  avatar,
  statusImage,
  avatarDecoration,
}: {
  avatar: string | null | undefined;
  statusImage: string | null | undefined;
  avatarDecoration: string | null | undefined;
}) => {
  return (
    <Box
      style={{
        position: "relative",
        width: "fit-content",
        height: "fit-content",
      }}
    >
      <Box>
        <Image
          alt="Avatar"
          src={avatar}
          className={classes.avatar}
          id="avatar"
        />
        {avatarDecoration && (
          <Image
            src={avatarDecoration}
            alt="Avatar decoration"
            className={classes.avatarDecoration}
            style={{
              transform: "scale(1.17)",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            id="avatar-decoration"
          />
        )}
      </Box>
      <Image
        src={statusImage}
        className={classes.statusImage}
        style={{
          position: "absolute",
          top: 273,
          left: 0,
        }}
        w={70}
        h={70}
      />
    </Box>
  );
};

export default DiscordAvatar;
