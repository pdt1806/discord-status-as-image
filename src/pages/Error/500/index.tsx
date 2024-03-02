import { Button, Container, Group, Text, Title } from "@mantine/core"
import classes from "./index.module.css"

export function Error500() {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>500</div>
        <Title className={classes.title}>Something bad just happened...</Title>
        <Text size="lg" ta="center" className={classes.description}>
          Our servers are currently down, please try again later. <br />
          Don't worry, our team is already working on it.
        </Text>
        <Group justify="center">
          <Button variant="outline" size="md" onClick={() => window.location.reload()}>
            Refresh the page
          </Button>
        </Group>
      </Container>
    </div>
  )
}
