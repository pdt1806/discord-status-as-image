import { Box, Button, Container, Image, SimpleGrid, Text, Title } from '@mantine/core';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import classes from './index.module.css';

export function Error404() {
  return (
    <Container className={classes.root}>
      <Helmet>
        <title>404 Not Found - Discord Status as Image</title>
        <link rel="canonical" href="https://disi.bennynguyen.dev/404" />
      </Helmet>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Box className={classes.mobileImage}>
          <Image src="/images/errors/404.svg" className={classes.mobileImage} />
          <Text size="sm" c="dimmed" ta="center">
            <Link
              to="https://www.freepik.com/free-vector/page-found-concept-illustration_7887410.htm#query=404%20page&position=4&from_view=keyword&track=ais&uuid=4f5238cf-1545-49fa-9cc2-c9a7012eeb9b"
              target="_blank"
              style={{ color: 'white' }}
            >
              Image by storyset
            </Link>{' '}
            on Freepik
          </Text>
        </Box>
        <Box className={classes.content}>
          <Title className={classes.title}>Something is not right...</Title>
          <Text c="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}
            component={Link}
            to="/"
          >
            Get back to home page
          </Button>
        </Box>
        <Box className={classes.desktopImage}>
          <Image src="/images/errors/404.svg" />
          <Text size="sm" c="dimmed" ta="center">
            <Link
              to="https://www.freepik.com/free-vector/page-found-concept-illustration_7887410.htm#query=404%20page&position=4&from_view=keyword&track=ais&uuid=4f5238cf-1545-49fa-9cc2-c9a7012eeb9b"
              target="_blank"
              style={{ color: 'white' }}
            >
              Image by storyset
            </Link>{' '}
            on Freepik
          </Text>
        </Box>
      </SimpleGrid>
    </Container>
  );
}
