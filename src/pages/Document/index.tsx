import { getDocument } from '@/pocketbase_client';
import { monthsKey } from '@/utils/tools';
import { Box, Container, Loader, Paper, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

export type DocumentProps = {
  id: string;
  title: string;
  content: string;
  created: string;
  updated: string;
};

const Document = ({ id }: { id: string }) => {
  const [document, setDocument] = useState<DocumentProps | null>(null);
  const [loadedDocuments, setLoadedDocuments] = useState<DocumentProps[]>([]);

  useEffect(() => {
    setDocument(null);
    async function document() {
      const doc = loadedDocuments.find((doc) => doc.id === id);
      if (doc) {
        setDocument(doc);
        return;
      }

      const document = await getDocument(id);
      if (!document) return;

      setLoadedDocuments([...loadedDocuments, document]);
      setDocument(document);
    }
    document();
    window.scrollTo(0, 0);
  }, [window.location.pathname]);

  if (!document) return <Loader color="white" type="bars" ml="auto" mr="auto" />;

  return (
    <Container mt="xl" mb="xl">
      <Helmet>
        <title>{document.title} - Discord Status as Image</title>
        <link
          rel="canonical"
          href={`https://disi.bennynguyen.dev/${document.title.toLowerCase().replaceAll(' ', '-')}`}
        />
      </Helmet>
      <Paper shadow="xl" p="xl" bg="#1a1a1a">
        <Box m="lg">
          <Title mb="md">{document.title}</Title>
          <Text mb="sm">
            Effective Date: {document.created.slice(8, 10)}{' '}
            {monthsKey[document.created.slice(5, 7) as keyof typeof monthsKey]},{' '}
            {document.created.slice(0, 4)}
          </Text>
          <Text mb="xl">
            Last Updated: {document.updated.slice(8, 10)}{' '}
            {monthsKey[document.updated.slice(5, 7) as keyof typeof monthsKey]},{' '}
            {document.updated.slice(0, 4)}
          </Text>
          <Box
            dangerouslySetInnerHTML={{
              __html: document.content.replace(/<a\b([^>]+)>/g, "<a style='color: white;' $1>"),
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Document;
