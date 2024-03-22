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

export function UserCardImage() {
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
      <Card.Section
        h={220}
        style={{
          backgroundImage: 'url(/images/showcase/disi-showcase-6.jpg)',
          backgroundSize: 'cover',
        }}
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/78996937"
        size={120}
        mx="auto"
        mt={-50}
        className={classes.avatar}
      />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        pdt1806
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
        {info?.bio || 'Software Developer'}
      </Text>
      <Group mt="md" justify="center" gap={30}>
        {items}
      </Group>
      <Button
        fullWidth
        bg="black"
        c="white"
        radius="md"
        mt="xl"
        size="md"
        variant="default"
        onClick={() => {
          window.open('https://github.com/pdt1806');
        }}
      >
        <Group>
          <IconBrandGithubFilled size={20} />
          <Text fw={600}>GitHub</Text>
        </Group>
      </Button>
      <Button
        fullWidth
        bg="blue"
        c="white"
        radius="md"
        mt="md"
        size="md"
        variant="default"
        onClick={() => {
          window.open('https://bennynguyen.dev');
        }}
      >
        <Group>
          <IconWorld size={20} />
          <Text fw={600}>My Website</Text>
        </Group>
      </Button>
      <Button
        fullWidth
        bg="#fbe13b"
        c="black"
        radius="md"
        mt="md"
        size="md"
        variant="default"
        onClick={() => {
          window.open('https://www.buymeacoffee.com/pdteggman');
        }}
      >
        <Group>
          <IconCoffee size={20} />
          <Text fw={600}>Buy me a coffee!</Text>
        </Group>
      </Button>
      <Button
        fullWidth
        bg="pink"
        c="white"
        radius="md"
        mt="md"
        size="md"
        variant="default"
        onClick={() => {
          window.open('https://github.com/sponsors/pdt1806');
        }}
      >
        <Group>
          <IconHeart size={20} />
          <Text fw={600}>Sponsor me!</Text>
        </Group>
      </Button>
    </Card>
  );
}
