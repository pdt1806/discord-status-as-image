import { Box, Container, Loader, Paper } from "@mantine/core";
import { useEffect } from "react";
import Markdown from "react-markdown";

const Document = ({
  text,
  id,
  title,
}: {
  text: string;
  id: string;
  title: string;
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [window.location.pathname]);

  if (!text) return <Loader color="white" type="bars" ml="auto" mr="auto" />;

  return (
    <Container mt="xl" mb="xl">
      <title>{`${title} - Discord Status as Image`}</title>
      <link rel="icon" type="image/png" href="/images/disi-logo-circle.png" />
      <link rel="canonical" href={`https://disi.fyi/${id}`} />
      <Paper shadow="xl" p="xl" bg="#1a1a1a">
        <Box m="lg">
          <Markdown
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  style={{ color: "white", textDecoration: "underline" }}
                />
              ),
            }}
          >
            {text}
          </Markdown>
        </Box>
      </Paper>
    </Container>
  );
};

export default Document;
