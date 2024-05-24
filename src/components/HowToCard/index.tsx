import { Card, Group, Image, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const HowToCard = ({
  image,
  main,
  description = '',
}: {
  image: string;
  main: string;
  description?: string;
}) => {
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      maw={450}
      h={isMobile ? 'auto' : 400}
      bg="#1a1a1a"
      c="white"
    >
      <Card.Section>
        <Image
          h={isMobile ? 'auto' : 280}
          src={image}
          alt="Norway"
          style={{ aspectRatio: '450/280' }}
        />
      </Card.Section>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{main}</Text>
      </Group>
      <Text size="sm" c="dimmed" mb="xs">
        {description}
      </Text>
    </Card>
  );
};

export default HowToCard;
