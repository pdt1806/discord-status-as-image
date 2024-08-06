import { Avatar, Box, Text } from '@mantine/core';

export default function MoodBox() {
  return (
    <Box style={{ position: 'absolute', zIndex: 999, transform: 'translate(290px, -330px)' }}>
      <Avatar size="md" bg="grey">
        {' '}
      </Avatar>
      <Avatar size="lg" bg="grey" mt="xs" ml="lg">
        {' '}
      </Avatar>
      <Box
        mt={-45}
        bg="grey"
        mih={100}
        maw={400}
        style={{ borderRadius: 'var(--mantine-radius-xl)', zIndex: 999, position: 'relative' }}
      >
        <Text mt="xs" fz={22} ff="Noto Sans TC" c="white" p="lg">
          Moooooooooooooooooooood
        </Text>
      </Box>
    </Box>
  );
}
