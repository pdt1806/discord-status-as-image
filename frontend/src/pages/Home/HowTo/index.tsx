import { Flex, Group, Title } from "@mantine/core";
import HowToCard from "../../../components/HowToCard";

export default function HowTo() {
  return (
    <Flex direction="column" align="center" justify="center" mb="xl" id="how-to">
      <Title mb="xl" order={2} ta="center">
        How to get a DISI card?
      </Title>
      <Group mt="md" justify="center" gap={30}>
        <HowToCard
          image="images/showcase/disi-showcase-3.webp"
          main="1. Join the Discord Server to have your live status captured"
        />
        <HowToCard
          image="images/showcase/disi-showcase-4.webp"
          main="2. Customize your cards"
          description="At least the username is required to get your live status."
        />
        <HowToCard
          image="images/showcase/disi-showcase-5.webp"
          main="3. Click the Generate button and you are all set!"
          description="The cards can be embedded in various formats, such as .png, Markdown, or embedded HTML."
        />
      </Group>
    </Flex>
  );
}
