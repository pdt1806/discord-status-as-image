/* eslint-disable react/no-unescaped-entities */
import { Anchor, Box, Button, Center, Container, Text, Title } from "@mantine/core";
import { Helmet } from "react-helmet-async";
import classes from "./index.module.css";

export function Error500() {
  return (
    <div className={classes.root}>
      <Helmet>
        <link rel="icon" type="image/png" href="/images/disi-logo-circle.png" />
        <title>500 Internal Server Error - Discord Status as Image</title>
      </Helmet>
      <Container>
        <Box>
          <div className={classes.label}>500</div>
          <Title className={classes.title}>Something is not right...</Title>
          <Text size="lg" ta="center" className={classes.description}>
            The server is currently down, please try again later. <br />
            Don't worry, we may have been notified of this issue and will work to resolve it as soon as possible.
          </Text>
          <Text size="lg" ta="center" className={classes.description}>
            Check the status on{" "}
            <Anchor
              href="https://uptime.bennynguyen.dev/status/discord-status-as-image"
              target="_blank"
              rel="noreferrer"
            >
              our status monitoring page.
            </Anchor>{" "}
          </Text>
          <Center>
            <Button variant="outline" size="md" onClick={() => window.location.reload()}>
              Refresh the page
            </Button>
          </Center>
        </Box>

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
