import { Box, Button, Flex, Group, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconHeart, IconX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function HeaderNoti() {
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <Flex
      bg="#5865F2"
      p="xl"
      c="white"
      justify="space-between"
      align="center"
      style={{ position: 'sticky', top: 0, zIndex: 1000 }}
      direction={isMobile ? 'column' : 'row'}
      id="header-noti"
    >
      <Group gap="xl" mr="xl">
        <IconHeart size={64} />
        <Box>
          <Title order={2}>Don’t Skip This – Make a Difference!</Title>
          <Text size="md" mt="sm">
            I’m raising funds for the <strong>Antelope High School Choir Tour 2025</strong> and
            would greatly appreciate your support! Every donation brings us closer to our goal.
            Thank you so much for your generosity!
          </Text>
        </Box>
      </Group>
      <Group gap="xl" miw={220} m="lg">
        <Button
          color="white"
          variant="light"
          size="lg"
          component={Link}
          to="https://app.schoolfundr.org/fund/antelopechoir/nmcDH"
          target="_blank"
        >
          Support us!
        </Button>
        <IconX
          size={24}
          onClick={() => {
            const headerNoti = document.getElementById('header-noti');
            if (headerNoti) {
              headerNoti.style.display = 'none';
            }
          }}
          style={{ cursor: 'pointer' }}
        />
      </Group>
    </Flex>
  );
}
