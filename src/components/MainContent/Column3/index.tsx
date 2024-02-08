import { disiAPI, testing, web } from "@/env/env"
import {
  Box,
  Combobox,
  Divider,
  Image,
  Input,
  InputBase,
  Mark,
  Table,
  Text,
  Title,
  useCombobox,
} from "@mantine/core"
import { useEffect, useState } from "react"

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
  const comboboxForSmallCard = useCombobox({
    onDropdownClose: () => comboboxForSmallCard.resetSelectedOption(),
  })

  const comboboxForLargeCard = useCombobox({
    onDropdownClose: () => comboboxForLargeCard.resetSelectedOption(),
  })

  const [smallCardValue, setSmallCardValue] = useState<string | null>(null)
  const [largeCardValue, setLargeCardValue] = useState<string | null>(null)

  useEffect(() => {
    setSmallCardValue(null)
    setLargeCardValue(null)
  }, [smallTail, largeTail])

  useEffect(() => {
    if (smallCardValue) {
      if (smallCardValue === "🔗 Copy Image URL (.png)") {
        navigator.clipboard.writeText(smallCardLink)
        copiedNotification()
      } else if (smallCardValue === "🔗 Copy Anchor (.png)") {
        navigator.clipboard.writeText(
          `<a href="https://discord.com/users/${userID}" target="_blank"><img width="300px" height="100px" src="${smallCardLink}"></img></a>`
        )
        copiedNotification()
      } else if (smallCardValue === "🔗 Copy Image URL (.svg)") {
        navigator.clipboard.writeText(
          `${testing ? disiAPI["dev"] : disiAPI["prod"]}/smallcard_svg/${userID}?${smallTail}`
        )
        copiedNotification()
      } else if (smallCardValue === "🔗 Copy Markdown (.svg)") {
        navigator.clipboard.writeText(
          `[![My Discord](${testing ? disiAPI["dev"] : disiAPI["prod"]}/smallcard_svg/${userID}?${smallTail})](https://discord.com/users/${userID})`
        )
        copiedNotification()
      } else if (smallCardValue === "🔗 Copy iframe (live card)") {
        navigator.clipboard.writeText(
          `<iframe src="${testing ? web["dev"] : web["prod"]}/smallcard?id=${userID}?${smallTail}" name="disi-small-card" height="100px" width="300px"></iframe>`
        )
        copiedNotification()
      } else if (smallCardValue === "🌐 View live card") {
        window.open(`/smallcard?id=${userID}?${smallTail}`, "_blank")
      }
    }
  }, [smallCardValue])

  useEffect(() => {
    if (largeCardValue) {
      if (largeCardValue === "🔗 Copy Image URL (.png)") {
        navigator.clipboard.writeText(largeCardLink)
        copiedNotification()
      } else if (largeCardValue === "🔗 Copy Anchor (.png)") {
        navigator.clipboard.writeText(
          `<a href="https://discord.com/users/${userID}" target="_blank"><img width="300px" height="100px" src="${largeCardLink}"></img></a>`
        )
        copiedNotification()
      } else if (largeCardValue === "🔗 Copy iframe (live card)") {
        navigator.clipboard.writeText(
          `<iframe src="${testing ? web["dev"] : web["prod"]}/largecard?id=${userID}?${largeTail}" name="disi-large-card" height="100px" width="300px"></iframe>`
        )
        copiedNotification()
      } else if (largeCardValue === "🌐 View live card") {
        window.open(`/largecard?id=${userID}?${largeTail}`, "_blank")
      }
    }
  }, [largeCardValue])

  const smallCardOptions = [
    "🔗 Copy Image URL (.png)",
    "🔗 Copy Anchor (.png)",
    "🔗 Copy Image URL (.svg)",
    "🔗 Copy Markdown (.svg)",
    "🔗 Copy iframe (live card)",
    "🌐 View live card",
  ]

  const smallCardComboboxOptions = smallCardOptions.map((option) => (
    <Combobox.Option value={option} key={option}>
      {option}
    </Combobox.Option>
  ))

  const largeCardOptions = [
    "🔗 Copy Image URL (.png)",
    "🔗 Copy Anchor (.png)",
    "🔗 Copy iframe (live card)",
    "🌐 View live card",
    "🔗 Copy Image URL (.svg) - Unsupported",
    "🔗 Copy Markdown (.svg) - Unsupported",
  ]

  const largeCardComboboxOptions = largeCardOptions.map((option) => (
    <Combobox.Option value={option} key={option} disabled={option.includes(".svg")}>
      {option}
    </Combobox.Option>
  ))

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
            <Combobox
              store={comboboxForSmallCard}
              onOptionSubmit={(val) => {
                setSmallCardValue(val)
                comboboxForSmallCard.closeDropdown()
              }}
            >
              <Combobox.Target>
                <InputBase
                  label="Choose what to do with the Small card"
                  component="button"
                  type="button"
                  pointer
                  rightSection={<Combobox.Chevron />}
                  rightSectionPointerEvents="none"
                  onClick={() => comboboxForSmallCard.toggleDropdown()}
                >
                  {smallCardValue || <Input.Placeholder>Select action</Input.Placeholder>}
                </InputBase>
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>{smallCardComboboxOptions}</Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
          </Box>
          {wantLargeCard && largeCardLink && (
            <Box display={"flex"} style={{ flexDirection: "column" }}>
              <Divider mb="xl" mt="lg" />
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
              <Combobox
                store={comboboxForLargeCard}
                onOptionSubmit={(val) => {
                  setLargeCardValue(val)
                  comboboxForLargeCard.closeDropdown()
                }}
              >
                <Combobox.Target>
                  <InputBase
                    label="Choose what to do with the Large card"
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => comboboxForLargeCard.toggleDropdown()}
                  >
                    {largeCardValue || <Input.Placeholder>Select action</Input.Placeholder>}
                  </InputBase>
                </Combobox.Target>
                <Combobox.Dropdown>
                  <Combobox.Options>{largeCardComboboxOptions}</Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>
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
