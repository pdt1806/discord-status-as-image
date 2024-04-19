import { Avatar, Button, Card, Group, Text } from '@mantine/core';
import { IconBrandGithubFilled, IconCoffee, IconHeart, IconWorld } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import classes from './index.module.css';

interface UserData {
  followers: number;
  following: number;
  public_repos: number;
  bio: string;
}

const buttons = [
  {
    icon: IconBrandGithubFilled,
    text: 'GitHub',
    link: 'https://github.com/pdt1806',
    bg: 'black',
    c: 'white',
  },
  {
    icon: IconWorld,
    text: 'My Website',
    link: 'https://bennynguyen.dev',
    bg: 'blue',
    c: 'white',
  },
  {
    icon: IconCoffee,
    text: 'Buy me a coffee!',
    link: 'https://www.buymeacoffee.com/pdteggman',
    bg: '#fbe13b',
    c: 'black',
  },
  {
    icon: IconHeart,
    text: 'Sponsor me!',
    link: 'https://github.com/sponsors/pdt1806',
    bg: 'pink',
    c: 'white',
  },
];

export default function UserCard() {
  const [info, setInfo] = useState<UserData | null>(null);
  const [items, setItems] = useState<Array<JSX.Element>>([]);

  useEffect(() => {
    fetch('https://api.github.com/users/pdt1806')
      .then((response) => response.json())
      .then((data) => setInfo(data));
  }, []);

  useEffect(() => {
    if (!info) return;
    setItems([
      <div key={info.followers}>
        <Text ta="center" fz="lg" fw={500}>
          {info.followers}
        </Text>
        <Text ta="center" fz="sm" c="dimmed" lh={1}>
          Followers
        </Text>
      </div>,
      <div key={info.following}>
        <Text ta="center" fz="lg" fw={500}>
          {info.following}
        </Text>
        <Text ta="center" fz="sm" c="dimmed" lh={1}>
          Following
        </Text>
      </div>,
      <div key={info.public_repos}>
        <Text ta="center" fz="lg" fw={500}>
          {info.public_repos}
        </Text>
        <Text ta="center" fz="sm" c="dimmed" lh={1}>
          Public Repos
        </Text>
      </div>,
    ]);
  }, [info]);

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
      <Card.Section className={classes.cardSection} />
      <Avatar
        src="https://avatars.githubusercontent.com/u/78996937"
        size={120}
        className={classes.avatar}
      />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        pdt1806
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
        {info?.bio || 'Software Developer'}
      </Text>
      <Group mt="md" mb="md" justify="center" gap={30}>
        {items}
      </Group>
      {buttons.map((button) => (
        <Button
          key={button.text}
          fullWidth
          bg={button.bg}
          c={button.c}
          radius="md"
          mt="md"
          size="md"
          variant="default"
          onClick={() => {
            window.location.href = button.link;
          }}
        >
          <Group>
            <button.icon size={20} />
            <Text fw={600}>{button.text}</Text>
          </Group>
        </Button>
      ))}
    </Card>
  );
}
