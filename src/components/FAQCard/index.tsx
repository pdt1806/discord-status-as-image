import { Paper, Text, Title } from "@mantine/core"

const FAQCard = ({ question, answer }: { question: string; answer: string }) => {
  return (
    <Paper shadow="md" p="xl" bg="dark">
      <Title order={4}>{question}</Title>
      <Text mt="md">{answer}</Text>
    </Paper>
  )
}

export default FAQCard
