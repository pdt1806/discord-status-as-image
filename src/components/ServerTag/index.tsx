import { Badge, Image, Title } from "@mantine/core";
import { PrimaryGuildType } from "../../utils/types";

const ServerTag = ({
  textColor,
  primaryGuild,
}: {
  textColor: string;
  primaryGuild: PrimaryGuildType;
}) => (
  <Badge
    color="rgba(255, 255, 255, 0.2)"
    size="xl"
    radius="md"
    px="sm"
    styles={{
      label: {
        textTransform: "none",
      },
    }}
    leftSection={<Image src={primaryGuild.badge} width={20} height={20} />}
  >
    <Title fw={600} size={25} ff="gg sans" c={textColor}>
      {primaryGuild.tag}
    </Title>
  </Badge>
);

export default ServerTag;
