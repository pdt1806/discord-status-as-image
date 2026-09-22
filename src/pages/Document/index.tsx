import { Box, Container, Loader, Paper, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { getDocument } from "../../pocketbase_client";
import { monthsKey } from "../../utils/tools";
import { DocumentProps } from "../../utils/types";

const Document = ({ id }: { id: string }) => {
  const [documentData, setDocumentData] = useState<DocumentProps | null>(null);
  const [loadedDocuments, setLoadedDocuments] = useState<DocumentProps[]>([]);

  useEffect(() => {
    setDocumentData(null);
    async function documentProcedure() {
      const docID = loadedDocuments.find((doc) => doc.id === id);
      if (docID) {
        setDocumentData(docID);
        return;
      }

      const fetchedDocument = await getDocument(id);
      if (!fetchedDocument) return;

      setLoadedDocuments([...loadedDocuments, fetchedDocument]);
      setDocumentData(fetchedDocument);
    }
    documentProcedure();
    window.scrollTo(0, 0);
  }, [window.location.pathname]);

  if (!documentData)
    return <Loader color="white" type="bars" ml="auto" mr="auto" />;

  return (
    <Container mt="xl" mb="xl">
      <title>{`${documentData.title} - Discord Status as Image`}</title>
      <link rel="icon" type="image/png" href="/images/disi-logo-circle.png" />
      <link
        rel="canonical"
        href={`https://disi.fyi/${documentData.readable_id}`}
      />
      <Paper shadow="xl" p="xl" bg="#1a1a1a">
        <Box m="lg">
          <Title mb="md">{documentData.title}</Title>
          <Text mb="sm">
            Effective Date: {documentData.created.slice(8, 10)}{" "}
            {
              monthsKey[
                documentData.created.slice(5, 7) as keyof typeof monthsKey
              ]
            }
            , {documentData.created.slice(0, 4)}
          </Text>
          <Text mb="xl">
            Last Updated: {documentData.updated.slice(8, 10)}{" "}
            {
              monthsKey[
                documentData.updated.slice(5, 7) as keyof typeof monthsKey
              ]
            }
            , {documentData.updated.slice(0, 4)}
          </Text>
          <Box
            dangerouslySetInnerHTML={{
              __html: documentData.content.replace(
                /<a\b([^>]+)>/g,
                "<a style='color: white;' $1>",
              ),
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Document;
