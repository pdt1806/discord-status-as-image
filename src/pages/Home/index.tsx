import FAQCard from "@/components/FAQCard"
import HowToCard from "@/components/HowToCard"
import MainContent from "@/components/MainContent"
import { UserCardImage } from "@/components/UserCard"
import { Box, Center, Divider, Flex, Group, Image, SimpleGrid, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useEffect } from "react"

const Home = () => {
  useEffect(() => {
    if (window.location.pathname !== "/") window.location.pathname = "/"
  }, [])

  const isMobile = useMediaQuery("(max-width: 1080px)")

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
        <Image
          src="/images/showcase/disi-showcase-1.png"
          w={isMobile ? "90%" : "80%"}
          h="auto"
          mt="xl"
          mb="md"
          radius="md"
        />
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
        <Title ta="center" mb="lg">
          Discord Status as Image
        </Title>
        <Text ta="center" mb="xl">
          Turn your Discord status into a simple, eye-catching image for easy sharing and display.
          With your username and just a few clicks, setting things up is quick and easy!
        </Text>
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
        <Flex direction="column" align="center" justify="center" mb="xl">
          <Title mb="xl" order={2}>
            How to get one?
          </Title>
          <Group mt="md" justify="center" gap={30}>
            <HowToCard
              image="images/showcase/disi-showcase-3.png"
              main="1. Join the Discord Server to have your live status captured"
              description=""
            />
            <HowToCard
              image="images/showcase/disi-showcase-4.png"
              main="2. Fill out the form"
              description="At least the username is required to get your live status."
            />
            <HowToCard
              image="images/showcase/disi-showcase-5.png"
              main="3. Click the 'Generate' button and you are all set!"
              description=""
            />
          </Group>
        </Flex>
        <Flex direction="column" align="center" justify="center" mb="xl">
          <Title mb="xl" order={2}>
            FAQs
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="xl" verticalSpacing="xl">
            <FAQCard
              question="Is the status always accurate?"
              answer="The provided status image is not guaranteed to be accurate. That being said, we implement non-caching logic to fetch the status every time the image is loaded."
            />
            <FAQCard
              question="Why is the gradient background angle not applicable to large cards?"
              answer="Gradient background angle is not applicable to large cards in order to match the design on Discord."
            />
            <FAQCard
              question="What are the recommended specifications for a banner image to achieve the best results?"
              answer="To achieve the best results, it is recommended to use a banner image with an aspect ratio of 2.69:1 and position the main content in the center. Currently, the uploaded image cannot be cropped."
            />
            <FAQCard
              question="How to set a border radius and colored border for the image?"
              answer="The image does not come with a border radius and colored border; you can add them when embedding the image into websites."
            />
          </SimpleGrid>
        </Flex>
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
            mb="xl"
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
