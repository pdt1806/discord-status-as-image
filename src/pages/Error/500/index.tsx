import { Badge, Box, Button, Center, Container, Divider, Flex, Text, Title } from "@mantine/core"
import classes from "./index.module.css"

export function Error500({ proceedToDemo }: { proceedToDemo: () => void }) {
  return (
    <div className={classes.root}>
      <Container>
        <Box>
          <div className={classes.label}>500</div>
          <Title className={classes.title}>Something bad just happened...</Title>
          <Text size="lg" ta="center" className={classes.description}>
            Our servers are currently down, please try again later. <br />
            Don't worry, our team is already working on it.
          </Text>
          <Center>
            <Button variant="outline" size="md" onClick={() => window.location.reload()}>
              Refresh the page
            </Button>
          </Center>
        </Box>
        <Divider my="xl" />
        <Badge color="orange" variant="light" size="lg">
          Effective March 20, 2024
        </Badge>
        <Title order={3} mb="lg" mt="lg">
          Server Maintenance Notice
        </Title>
        <Text>
          The server may experience temporary downtime due to the relocation of the website creator,
          Benny Nguyen. We're working hard to minimize any disruption and will restore service
          promptly. Thank you for your understanding.
        </Text>
        <Title order={5} mt="xl">
          Click the button below if you still want to proceed to the app (the images will not work!)
        </Title>
        <Button
          variant="outline"
          color="green"
          mt="lg"
          onClick={() => {
            proceedToDemo()
            window.scrollTo(0, 0)
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
            style={{ marginTop: "var(--mantine-spacing-md)" }}
          >
            <img width="450px" height="150px" src="images/demo/small-card.png"></img>
          </a>
          <a
            href="https://discord.com/users/458550515614351360"
            target="_blank"
            style={{ marginTop: "var(--mantine-spacing-md)" }}
          >
            <img width="450px" height="627.32px" src="images/demo/large-card.png"></img>
          </a>
        </Flex>
      </Container>
    </div>
  )
}
