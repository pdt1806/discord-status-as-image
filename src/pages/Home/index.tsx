import HowToCard from "@/components/HowToCard"
import MainContent from "@/components/MainContent"
import { UserCardImage } from "@/components/UserCard"
import {
  Accordion,
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Overlay,
  Text,
  Title,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import classes from "./index.module.css"

const Home = () => {
  useEffect(() => {
    if (window.location.pathname !== "/") window.location.pathname = "/"
  }, [])

  const isMobile = useMediaQuery("(max-width: 1080px)")

  const faqs = [
    {
      value: "accuracy",
      question: "Is the status always accurate?",
      answer:
        "The provided status image is not guaranteed to be accurate. That being said, we implement no-caching logic to fetch the status every time the image is loaded.",
    },
    {
      value: "gradient",
      question: "Why is the gradient background angle not applicable to large cards?",
      answer:
        "Gradient background angle is not applicable to large cards in order to match the design on Discord.",
    },
    {
      value: "ratio",
      question:
        "What are the recommended specifications for a banner image to achieve the best results?",
      answer:
        "To achieve the best results, it is recommended to use a banner image with an aspect ratio of 2.69:1 and position the main content in the center. Currently, the uploaded image cannot be cropped.",
    },
    {
      value: "radius",
      question: "How to set a border radius and colored border for the image?",
      answer:
        "The image does not come with a border radius and colored border; you can add them when embedding the image into websites.",
    },
  ]

  return (
    <>
      <Box
        h="min-content"
        p="xl"
        mt={isMobile ? "0" : "xl"}
        mb={isMobile ? "0" : "md"}
        ml="auto"
        mr="auto"
        w={isMobile ? "100%" : "85%"}
        style={{
          backgroundColor: !isMobile ? "#121212" : "transparent",
          borderRadius: !isMobile ? "15px" : "0",
          color: "white",
        }}
      >
        <Center w="100%" h="100%">
          <MainContent />
        </Center>
      </Box>
      <Center>
        <Text ta="center" m="md">
          <strong>Discord Status as Image</strong> is not affiliated with Discord.
        </Text>
      </Center>
      <Divider w="90%" ml="auto" mr="auto" mb="sm" mt="xl" />
      <Center>
        <Box style={{ position: "relative" }} w={isMobile ? "90%" : "80%"} mih={500}>
          <Overlay h="auto" mt="xl" mb="md" radius="md" p="lg">
            <Flex align="center" direction="column" justify="center" h="100%">
              <Image
                src="/images/disi-logo.png"
                alt="Discord Status as Image"
                h={150}
                w={150}
                style={{ borderRadius: "15%" }}
                mb="md"
              />
              <Title mb="lg" ta="center">
                Discord Status as Image
              </Title>
              <Text mb="xl" ta="center">
                Turn your Discord status into a simple, eye-catching image for easy sharing and
                display. With your username and just a few clicks, setting things up is quick and
                easy!
              </Text>
            </Flex>
          </Overlay>
          <Image
            src="/images/showcase/disi-showcase-1.png"
            mih={500}
            h="auto"
            mt="xl"
            mb="md"
            radius="md"
          />
        </Box>
      </Center>
      <Box
        w="80%"
        display="flex"
        style={{ flexDirection: "column" }}
        ml="auto"
        mr="auto"
        mt="xl"
        mb="xl"
      >
        <Flex align="center" mb="xl" direction={isMobile ? "column" : "row"}>
          <Box w={isMobile ? "100%" : "45%"}>
            <Title mt="xl" mb="md" order={2}>
              Why should you get a DISI card?
            </Title>
            <Text>
              You can easily embed the image into your website or markdown file, and your Discord
              status will be shown and updated automatically for people who are not yet your
              friends. Moreover, they can click on the image and send you a friend request.
            </Text>
          </Box>
          <Image
            src="/images/showcase/disi-showcase-2.png"
            w={isMobile ? "100%" : "50%"}
            maw={isMobile ? "600px" : "none"}
            h="auto"
            mt="xl"
            mb="xl"
            radius="md"
            ml="auto"
            mr={isMobile ? "auto" : "0"}
          />
        </Flex>
        <Flex direction="column" align="center" justify="center" mb="xl" id="how-to">
          <Title mb="xl" order={2} ta="center">
            How to get a DISI card?
          </Title>
          <Group mt="md" justify="center" gap={30}>
            <HowToCard
              image="images/showcase/disi-showcase-3.png"
              main="1. Join the Discord Server to have your live status captured"
            />
            <HowToCard
              image="images/showcase/disi-showcase-4.png"
              main="2. Fill out the form"
              description="At least the username is required to get your live status."
            />
            <HowToCard
              image="images/showcase/disi-showcase-5.png"
              main="3. Click the 'Generate' button and you are all set!"
              description="The cards can be embedded in various formats, such as .png, .svg, Markdown, or HTML."
            />
          </Group>
        </Flex>
        <div className={classes.wrapper}>
          <Container size="lg">
            <Grid id="faq-grid" gutter={50}>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Image src={"images/faq.svg"} alt="Frequently Asked Questions" />
                <Text size="sm" c="dimmed" ta="center" mt="xl">
                  <Link
                    to="https://www.freepik.com/free-vector/faqs-concept-illustration_12781054.htm#fromView=search&page=1&position=4&uuid=d1a11e29-d943-4a51-922c-0acd0f3725e7"
                    target="_blank"
                    style={{ color: "white" }}
                  >
                    Image by storyset
                  </Link>{" "}
                  on Freepik
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Title order={2} ta={isMobile ? "center" : "left"} mb="xl">
                  Frequently Asked Questions
                </Title>
                <Accordion chevronPosition="right" variant="separated">
                  {faqs.map((faq) => (
                    <Accordion.Item className={classes.item} value={faq.value} key={faq.value}>
                      <Accordion.Control>{faq.question}</Accordion.Control>
                      <Accordion.Panel>{faq.answer}</Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Grid.Col>
            </Grid>
          </Container>
        </div>
        <Flex align="center" direction={isMobile ? "column" : "row"}>
          <Box w={isMobile ? "100%" : "45%"}>
            <Title mt="xl" mb="md" order={2}>
              Love My Work?
            </Title>
            <Text>
              If you enjoy my work, check out my other stuff on GitHub or visit my Portfolio
              website. You can support me by "buying me a coffee" or sponsoring me on GitHub. Your
              support means a lot!
            </Text>
          </Box>
          <Box
            w={isMobile ? "100%" : "50%"}
            h="auto"
            mt="xl"
            ml="auto"
            mr={isMobile ? "auto" : "0"}
          >
            <UserCardImage />
          </Box>
        </Flex>
      </Box>
    </>
  )
}

export default Home
