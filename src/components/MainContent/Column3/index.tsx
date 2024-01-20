import { Box, Image, Mark, Table, Text, Title, Tooltip, UnstyledButton } from "@mantine/core"
import { Link } from "react-router-dom"

const MainContentColumn3 = ({
  smallCardLink,
  largeCardLink,
  smallTail,
  largeTail,
  userID,
  wantLargeCard,
  customBannerMode,
  copiedNotification,
}: {
  smallCardLink: string
  largeCardLink: string
  smallTail: string
  largeTail: string
  userID: string
  wantLargeCard: boolean
  customBannerMode: string
  copiedNotification: () => void
}) => {
  return (
    <Table.Td>
      {smallCardLink !== "" ? (
        <Box
          display={"flex"}
          style={{ flexDirection: "column", alignItems: "start" }}
          h="100%"
          mt="xl"
        >
          <Box display={"flex"} style={{ flexDirection: "column" }} mb="lg">
            <Title order={4} mb="md">
              Small card
            </Title>
            <a href={`https://discord.com/users/${userID}`} target="_blank">
              <Image src={smallCardLink} mb="md" />
            </a>
            <UnstyledButton
              w="fit-content"
              mb="md"
              onClick={async () => {
                await navigator.clipboard.writeText(smallCardLink)
                copiedNotification()
              }}
            >
              🔗 Copy Image URL (.png)
            </UnstyledButton>
            <UnstyledButton
              w="fit-content"
              mb="md"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `<a href="https://discord.com/users/${userID}" target="_blank"><img width="300px" height="100px" src="${smallCardLink}"></img></a>`
                )
                copiedNotification()
              }}
            >
              🔗 Copy Anchor (image/png)
            </UnstyledButton>
            <UnstyledButton
              w="fit-content"
              mb="md"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `https://disi-api.bennynguyen.dev/smallcard_svg/${userID}?${smallTail}`
                )
                copiedNotification()
              }}
            >
              🔗 Copy Image URL (.svg)
            </UnstyledButton>
            <UnstyledButton
              w="fit-content"
              mb="md"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `[![My Discord](https://disi-api.bennynguyen.dev/smallcard_svg/${userID}?${smallTail})](https://discord.com/users/${userID})`
                )
                copiedNotification()
              }}
            >
              🔗 Copy Markdown (image/svg)
            </UnstyledButton>
            <Tooltip label="Reload every 30 seconds" position="right">
              <UnstyledButton mb="md" w="fit-content">
                <Link
                  to={`/smallcard?id=${userID}${smallTail}`}
                  target="_blank"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <UnstyledButton>🌐 View live card</UnstyledButton>
                </Link>
              </UnstyledButton>
            </Tooltip>
            <UnstyledButton
              w="fit-content"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `<iframe src="https://disi.bennynguyen.dev/smallcard?id=${userID}${smallTail}" name="disi-small-card" height="100px" width="300px"></iframe>`
                )
                copiedNotification()
              }}
            >
              🔗 Copy iframe (live card)
            </UnstyledButton>
          </Box>
          {wantLargeCard && largeCardLink && (
            <Box display={"flex"} style={{ flexDirection: "column" }}>
              <Title order={4} mb="md">
                Large card
              </Title>
              {customBannerMode === "upload" && largeCardLink.includes("bannerID=") && (
                <>
                  <Text>
                    Banner ID ={" "}
                    <Mark color="blue">
                      {largeCardLink.substring(
                        largeCardLink.indexOf("bannerID=") + 9,
                        largeCardLink.indexOf("bannerID=") + 24
                      )}
                    </Mark>
                  </Text>
                  <Text mb="md" style={{ fontSize: "15px" }}>
                    Save this ID somewhere for later use.
                  </Text>
                </>
              )}
              <a href={`https://discord.com/users/${userID}`} target="_blank">
                <Image src={largeCardLink} mb="md" />
              </a>
              <UnstyledButton
                w="fit-content"
                mb="md"
                onClick={async () => {
                  await navigator.clipboard.writeText(largeCardLink)
                  copiedNotification()
                }}
              >
                🔗 Copy Image URL
              </UnstyledButton>
              <UnstyledButton
                w="fit-content"
                mb="md"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `<a href="https://discord.com/users/${userID}" target="_blank"><img width="300px" height="auto" src="${largeCardLink}"></img></a>`
                  )
                  copiedNotification()
                }}
              >
                🔗 Copy Anchor (image)
              </UnstyledButton>
              <Tooltip label="Reload every 30 seconds" position="right">
                <UnstyledButton mb="md" w="fit-content">
                  <Link
                    to={`/largecard?id=${userID}${largeTail}`}
                    target="_blank"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <UnstyledButton>🌐 View live card</UnstyledButton>
                  </Link>
                </UnstyledButton>
              </Tooltip>
              <UnstyledButton
                w="fit-content"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `<iframe src="https://disi.bennynguyen.dev/largecard?id=${userID}${largeTail}" name="disi-large-card" height="256.5px" width="300px"></iframe>`
                  )
                  copiedNotification()
                }}
              >
                🔗 Copy iframe (live card)
              </UnstyledButton>
              <Text mt="sm" style={{ fontSize: "15px" }}>
                The size of the iframe is pre-determined to be 300.0 x 256.5 (px). You probably will
                need to change it to fit your needs.
              </Text>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Text>Complete the previous steps correctly and your card(s) will show here!</Text>
          <Text>It may take a while for the image(s) to be loaded.</Text>
        </Box>
      )}
    </Table.Td>
  )
}

export default MainContentColumn3
