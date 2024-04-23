import {
  Anchor,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Image,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import classes from './index.module.css';

export function Error500({ proceedToDemo }: { proceedToDemo: () => void }) {
  const [maintenanceMessage, setMaintenanceMessage] = useState<string[]>();

  useEffect(() => {
    const fetchMaintenanceMessage = async () => {
      try {
        const response = await fetch(
          `https://api.allorigins.win/raw?url=https://pastebin.com/raw/xPgJnKkA`,
          { cache: 'no-store' }
        );
        if (response.ok) {
          const text = await response.text();
          text.length > 0 && setMaintenanceMessage(text.split('\n'));
        }
      } catch (e) {
        // pass
      }
    };

    fetchMaintenanceMessage();
  }, []);

  return (
    <div className={classes.root}>
      <Helmet>
        <title>500 Internal Server Error - Discord Status as Image</title>
      </Helmet>
      <Container>
        <Box>
          <div className={classes.label}>500</div>
          <Title className={classes.title}>Something bad just happened...</Title>
          <Text size="lg" ta="center" className={classes.description}>
            The server is currently down, please try again later. <br />
            Don't worry, I may have been notified of this issue and will work to resolve it as soon
            as possible.
          </Text>
          <Center>
            <Button variant="outline" size="md" onClick={() => window.location.reload()}>
              Refresh the page
            </Button>
          </Center>
        </Box>
        <Divider my="xl" />
        {!!maintenanceMessage ? (
          maintenanceMessage[4].includes('500') ? (
            <>
              <Badge color="orange" variant="light" size="lg">
                {maintenanceMessage[0]}
              </Badge>
              <Title order={3} mb="lg" mt="lg">
                {maintenanceMessage[1]}
              </Title>
              <Text>{maintenanceMessage[2]}</Text>
              <Divider my="xl" />
            </>
          ) : (
            <>
              <Badge color="orange" variant="light" size="lg">
                NEW ISSUE
              </Badge>
              <Title order={3} mb="lg" mt="lg">
                This issue has not been known yet
              </Title>
              <Text>
                Please send a message to{' '}
                <span>
                  <Anchor c="orange" href="mailto:disi@bennynguyen.dev">
                    disi@bennynguyen.dev
                  </Anchor>
                </span>{' '}
                to notify me of this issue and I will work on it ASAP. Thank you in advance.
              </Text>
              <Divider my="xl" />
            </>
          )
        ) : null}
        <Title order={5}>
          Click the button below if you still want to proceed to the app (the images will not work!)
        </Title>
        <Button
          variant="outline"
          color="green"
          mt="lg"
          onClick={() => {
            proceedToDemo();
            window.scrollTo(0, 0);
          }}
        >
          Proceed to the app
        </Button>
        <Title order={5} mt="xl">
          Demo Discord Status as Image cards:
        </Title>
        <Flex direction="column">
          <a
            href="https://discord.com/users/458550515614351360"
            target="_blank"
            style={{ marginTop: 'var(--mantine-spacing-md)' }}
          >
            <Image maw="450px" mah="150px" src="images/demo/small-card.png"></Image>
          </a>
          <a
            href="https://discord.com/users/458550515614351360"
            target="_blank"
            style={{ marginTop: 'var(--mantine-spacing-md)' }}
          >
            <Image
              maw="450px"
              mah="627.32px"
              src="images/demo/large-card.png"
              style={{ aspectRatio: '450/627.32' }}
            ></Image>
          </a>
        </Flex>
      </Container>
    </div>
  );
}
