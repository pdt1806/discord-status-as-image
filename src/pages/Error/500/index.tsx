/* eslint-disable react/no-unescaped-entities */
import { Anchor, Badge, Box, Button, Center, Container, Divider, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchMaintenanceMessage } from '../../../utils/tools';
import { MaintenanceMessageType } from '../../../utils/types';
import classes from './index.module.css';

export function Error500() {
  const [maintenanceMessage, setMaintenanceMessage] = useState<MaintenanceMessageType | null>(null);

  useEffect(() => {
    (async () => {
      const message = await fetchMaintenanceMessage();
      setMaintenanceMessage(message);
    })();
  }, []);

  return (
    <div className={classes.root}>
      <Helmet>
        <link rel="icon" type="image/png" href="/images/disi-logo-circle.png" />
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

        {maintenanceMessage ? (
          maintenanceMessage.error500.active ? (
            <>
              <Divider my="xl" />
              <Badge color="orange" variant="light" size="lg">
                {maintenanceMessage.error500.date}
              </Badge>
              <Title order={3} mb="lg" mt="lg">
                {maintenanceMessage.error500.title}
              </Title>
              <Text>{maintenanceMessage.error500.message}</Text>
            </>
          ) : (
            <>
              <Divider my="xl" />
              <Badge color="orange" variant="light" size="lg">
                NEW ISSUE
              </Badge>
              <Title order={3} mb="lg" mt="lg">
                This issue has not been known yet
              </Title>
              <Text>
                Please send a message to{' '}
                <span>
                  <Anchor c="orange" href="mailto:me@bennynguyen.dev">
                    me@bennynguyen.dev
                  </Anchor>
                </span>{' '}
                or ping{' '}
                <span>
                  <Text style={{ fontStyle: 'italic', display: 'inline' }}>@pdteggman</Text>
                </span>{' '}
                in the{' '}
                <span>
                  <Anchor c="orange" href="https://discord.com/invite/WWDkkjmD">
                    Discord server
                  </Anchor>
                </span>{' '}
                to notify me of this issue and I will work on it ASAP. Thank you in advance.
              </Text>
              {/* <Divider my="xl" /> */}
            </>
          )
        ) : null}
        {/* <Title order={5}>
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
            rel="noreferrer"
          >
            <Image maw="450px" mah="150px" src="images/demo/small-card.png"></Image>
          </a>
          <a
            href="https://discord.com/users/458550515614351360"
            target="_blank"
            style={{ marginTop: 'var(--mantine-spacing-md)' }}
            rel="noreferrer"
          >
            <Image
              maw="450px"
              src="images/demo/large-card.png"
              style={{ aspectRatio: '807/985' }}
            />
          </a>
        </Flex> */}
      </Container>
    </div>
  );
}
