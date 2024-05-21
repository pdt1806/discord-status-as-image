import { Accordion, Container, Grid, Image, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import classes from './index.module.css';

const faqs = [
  {
    value: 'accuracy',
    question: 'Is the status always accurate?',
    answer:
      'The provided status image is not guaranteed to be accurate. That being said, the service is implemented with logic that avoids caching, instead fetching the status every time the image is loaded.',
  },
  {
    value: 'gradient',
    question: 'Why is the gradient background angle not applicable to large cards?',
    answer:
      'Gradient background angle is not applicable to large cards in order to match the design on Discord.',
  },
  {
    value: 'ratio',
    question:
      'What are the recommended specifications for a banner image to achieve the best results?',
    answer:
      'To achieve the best results, it is recommended to use a banner image with an aspect ratio of 2.69:1 and position the main content in the center. Currently, the uploaded image cannot be cropped.',
  },
  {
    value: 'radius',
    question: 'How to set a border radius and colored border for the image?',
    answer:
      'The image does not come with a border radius and colored border; you can add them when embedding the image into websites.',
  },
];

export default function FAQs() {
  const isMd = useMediaQuery('(max-width: 62em)');

  return (
    <div className={classes.wrapper}>
      <Container size="xl">
        <Grid id="faq-grid" gutter={50}>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Image
              src="images/faq.svg"
              alt="Frequently Asked Questions"
              maw={450}
              ml="auto"
              mr="auto"
            />
            <Text size="sm" c="dimmed" ta="center" mt="xl">
              <Link
                to="https://www.freepik.com/free-vector/faqs-concept-illustration_12781054.htm#fromView=search&page=1&position=4&uuid=d1a11e29-d943-4a51-922c-0acd0f3725e7"
                target="_blank"
                style={{ color: 'white' }}
              >
                Image by storyset
              </Link>{' '}
              on Freepik
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Title order={2} ta={isMd ? 'center' : 'left'} mb="xl">
              Frequently Asked Questions
            </Title>
            <Accordion chevronPosition="right" variant="separated">
              {faqs.map((faq) => (
                <Accordion.Item
                  className={classes.item}
                  value={faq.value}
                  key={faq.value}
                  bg="#1a1a1a"
                  style={{ border: '1px solid #1a1a1a' }}
                >
                  <Accordion.Control c="white">{faq.question}</Accordion.Control>
                  <Accordion.Panel c="white">{faq.answer}</Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
