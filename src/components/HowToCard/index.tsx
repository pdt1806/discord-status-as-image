import { Card, Group, Image, Text } from "@mantine/core"

const HowToCard = ({
  image,
  main,
  description = "",
}: {
  image: string
  main: string
  description?: string
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" w={450} h={400} bg="dark" c="white">
      <Card.Section>
        <Image h={280} src={image} alt="Norway" />
      </Card.Section>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{main}</Text>
      </Group>
      <Text size="sm" c="dimmed" mb="xs">
        {description}
      </Text>
    </Card>
  )
}

export default HowToCard
