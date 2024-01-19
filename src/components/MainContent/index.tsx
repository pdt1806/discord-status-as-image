import { disiAPI, refinerAPI, testing } from "@/env/env"
import { getBannerImage } from "@/pocketbase_client"
import { isMobile } from "@/utils/browser"
import { fileToBase64, limitTextarea } from "@/utils/tools"
import {
  Box,
  Button,
  Checkbox,
  ColorPicker,
  FileInput,
  Group,
  HoverCard,
  Image,
  Mark,
  NativeSelect,
  NumberInput,
  Radio,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const MainContent = () => {
  const [smallCardLink, setSmallCardLink] = useState("")
  const [largeCardLink, setLargeCardLink] = useState("")
  const [smallTail, setSmallTail] = useState("")
  const [largeTail, setLargeTail] = useState("")
  const [userID, setUserID] = useState("")
  const [wantLargeCard, setWantLargeCard] = useState(false)
  const [bannerMode, setBannerMode] = useState("Custom Color")
  const [customBannerMode, setCustomBannerMode] = useState("")
  const [externalImageURL, setExternalImageURL] = useState("")
  const [bannerPBID, setBannerPBID] = useState("")
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const form = useForm({
    initialValues: {
      username: null as String | null,
      colorMode: "Single",
      backgroundSingle: "",
      backgroundGradient1: "",
      backgroundGradient2: "",
      backgroundGradientAngle: 0,
      created: false,
      aboutMe: "",
      mood: "",
      bannerColor: "",
      pronouns: "",
    },
  })

  const bannerModeList = [
    "Custom Color",
    "Custom Image Banner",
    "Discord Accent Color",
    "Discord Image Banner (Nitro User Only)",
  ]

  useEffect(() => {
    bannerMode === "Custom Image Banner" && setCustomBannerMode("upload")
    bannerMode !== "Custom Image Banner" && setCustomBannerMode("")
  }, [bannerMode])

  const [colorMode, setColorMode] = useState("Single")

  function copiedNotification() {
    notifications.show({
      title: "Copied!",
      message: "Copied to clipboard",
      color: "teal",
      icon: null,
      autoClose: 2000,
    })
  }

  const column1 = (
    <Table.Td h="100%">
      <Box h="100%" display="flex" mt="xl">
        <iframe
          src="https://discord.com/widget?id=1174576233581912074&theme=dark"
          style={{
            width: "90%",
            height: "90%",
            border: "none",
            minHeight: "300px",
            maxHeight: "500px",
          }}
        />
      </Box>
    </Table.Td>
  )

  const column2 = (
    <Table.Td h="100%" display={"flex"} style={{ alignItems: "start", flexDirection: "column" }}>
      <Box
        component="form"
        onSubmit={form.onSubmit(async () => {
          if (customBannerMode === "upload" && !bannerFile) {
            notifications.show({
              title: "Error!",
              message: "Please upload an image",
              color: "red",
              icon: null,
              autoClose: 3000,
            })
            return
          }
          if (customBannerMode === "pbid" && !(await getBannerImage(bannerPBID, true))) {
            notifications.show({
              title: "Error!",
              message: "Invalid image ID",
              color: "red",
              icon: null,
              autoClose: 3000,
            })
            return
          }
          fetch(
            `${testing ? refinerAPI["dev"] : refinerAPI["prod"]}/username/${form.values.username}`
          ).then(async (res) => {
            if (res.status === 404) {
              notifications.show({
                title: "Error!",
                message: "User not found",
                color: "red",
                icon: null,
                autoClose: 3000,
              })
              return
            }
            const data = await res.json()
            setUserID(data.id)
            let newTail =
              colorMode == "Gradient"
                ? `&bg1=${form.values.backgroundGradient1.replace(
                    "#",
                    ""
                  )}&bg2=${form.values.backgroundGradient2.replace("#", "")}`
                : form.values.backgroundSingle
                  ? `&bg=${form.values.backgroundSingle.replace("#", "")}`
                  : ""
            if (form.values.created) newTail += "&created=true"
            let newBannerID = ""
            if (bannerFile && customBannerMode === "upload") {
              const body = {
                image: await fileToBase64(bannerFile),
              }
              const response = await fetch(
                `${testing ? disiAPI["dev"] : disiAPI["prod"]}/uploadbanner`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(body),
                }
              )
              if (response.status !== 200) {
                notifications.show({
                  title: "Error!",
                  message: "Something went wrong",
                  color: "red",
                  icon: null,
                  autoClose: 3000,
                })
                return
              }
              const json = await response.json()
              newBannerID = json.id
              setBannerFile(null)
            }
            const smallTail =
              newTail +
              (colorMode == "Gradient" ? `&angle=${form.values.backgroundGradientAngle}` : "")
            const largeTail =
              newTail +
              (form.values.aboutMe ? `&aboutMe=${encodeURIComponent(form.values.aboutMe)}` : "") +
              (form.values.mood ? `&mood=${form.values.mood}` : "") +
              (form.values.pronouns
                ? `&pronouns=${encodeURIComponent(form.values.pronouns)}`
                : "") +
              (bannerMode === "Custom Color" && form.values.bannerColor
                ? `&bannerColor=${form.values.bannerColor.replace("#", "")}`
                : "") +
              (bannerMode === "Discord Accent Color" ? `&wantAccentColor=true` : "") +
              (bannerMode === "Discord Image Banner (Nitro User Only)"
                ? `&wantBannerImage=true`
                : "") +
              (customBannerMode === "upload" ? `&bannerID=${newBannerID}` : "") +
              (customBannerMode === "pbid" ? `&bannerID=${bannerPBID}` : "") +
              (customBannerMode === "exturl" ? `&bannerImage=${externalImageURL}` : "")
            setSmallTail(smallTail)
            setLargeTail(largeTail)
            setSmallCardLink(
              `${testing ? disiAPI["dev"] : disiAPI["prod"]}/smallcard/${data.id}?${smallTail}`
            )
            wantLargeCard &&
              setLargeCardLink(
                `${testing ? disiAPI["dev"] : disiAPI["prod"]}/largecard/${data.id}?${largeTail}`
              )
          })
        })}
        w="90%"
      >
        <TextInput
          {...form.getInputProps("username")}
          required
          id="disi-username"
          label="Username"
          minLength={2}
          maxLength={32}
          placeholder="Enter your username"
          onChange={(e) => {
            form.setValues({
              ...form.values,
              username: e.currentTarget.value,
            })
          }}
        />
        <Checkbox
          label="Show account created date"
          mt="md"
          {...form.getInputProps("created")}
          onChange={(e) => {
            form.setValues({
              ...form.values,
              created: e.currentTarget.checked,
            })
          }}
        />
        <Box mt="xl">
          <Title order={4}>Background color</Title>
          <NativeSelect
            {...form.getInputProps("colorMode")}
            label="Color mode"
            data={["Single", "Gradient"]}
            onChange={(e) => {
              setColorMode(e.currentTarget.value)
              form.setValues({
                ...form.values,
                backgroundGradient1: "",
                backgroundGradient2: "",
                backgroundGradientAngle: 0,
                backgroundSingle: "",
              })
              form.setFieldValue("colorMode", e.currentTarget.value)
            }}
          />
          {colorMode === "Single" ? (
            <HoverCard shadow="md" openDelay={250}>
              <HoverCard.Target>
                <TextInput
                  placeholder="#2B2D31"
                  description="Leave blank for default Discord color"
                  label="Color"
                  {...form.getInputProps("backgroundSingle")}
                  maxLength={7}
                  minLength={7}
                  onChange={(e) => {
                    if (
                      /^([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) &&
                      !form.values.backgroundSingle
                    )
                      e.currentTarget.value = `#${e.currentTarget.value.toUpperCase()}`
                    if (
                      /^#([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) ||
                      e.currentTarget.value === ""
                    ) {
                      const finalValue = e.currentTarget.value.toUpperCase()
                      form.setValues({
                        ...form.values,
                        backgroundSingle: finalValue,
                      })
                    }
                  }}
                />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <ColorPicker
                  value={form.values.backgroundSingle}
                  onChange={(e) => {
                    form.setValues({
                      ...form.values,
                      backgroundSingle: e.toUpperCase(),
                    })
                  }}
                />
              </HoverCard.Dropdown>
            </HoverCard>
          ) : (
            <Box display={"flex"} style={{ justifyContent: "space-between" }} w="100%">
              <HoverCard shadow="md" openDelay={250}>
                <HoverCard.Target>
                  <TextInput
                    placeholder="#1E1E1E"
                    label="Gradient 1"
                    {...form.getInputProps("backgroundGradient1")}
                    maxLength={7}
                    minLength={7}
                    required
                    onChange={(e) => {
                      if (
                        /^([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) &&
                        !form.values.backgroundGradient1
                      )
                        e.currentTarget.value = `#${e.currentTarget.value.toUpperCase()}`
                      if (
                        /^#([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) ||
                        e.currentTarget.value === ""
                      ) {
                        const finalValue = e.currentTarget.value.toUpperCase()
                        form.setValues({
                          ...form.values,
                          backgroundGradient1: finalValue,
                        })
                      }
                    }}
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <ColorPicker
                    value={form.values.backgroundGradient1}
                    onChange={(e) => {
                      form.setValues({
                        ...form.values,
                        backgroundGradient1: e.toUpperCase(),
                      })
                    }}
                  />
                </HoverCard.Dropdown>
              </HoverCard>
              <HoverCard shadow="md" openDelay={250}>
                <HoverCard.Target>
                  <TextInput
                    placeholder="#FFFFFF"
                    pl={10}
                    pr={10}
                    label="Gradient 2"
                    {...form.getInputProps("backgroundGradient2")}
                    maxLength={7}
                    minLength={7}
                    required
                    onChange={(e) => {
                      if (
                        /^([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) &&
                        !form.values.backgroundGradient2
                      )
                        e.currentTarget.value = `#${e.currentTarget.value.toUpperCase()}`
                      if (
                        /^#([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) ||
                        e.currentTarget.value === ""
                      )
                        form.setValues({
                          ...form.values,
                          backgroundGradient2: e.currentTarget.value.toUpperCase(),
                        })
                    }}
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <ColorPicker
                    value={form.values.backgroundGradient2}
                    onChange={(e) => {
                      form.setValues({
                        ...form.values,
                        backgroundGradient2: e.toUpperCase(),
                      })
                    }}
                  />
                </HoverCard.Dropdown>
              </HoverCard>
              <NumberInput
                placeholder="0"
                label="Angle"
                {...form.getInputProps("backgroundGradientAngle")}
                allowDecimal={false}
                clampBehavior="strict"
                max={360}
                min={0}
                required
                onChange={(e) => {
                  form.setValues({
                    ...form.values,
                    backgroundGradientAngle: e as number,
                  })
                }}
              />
            </Box>
          )}
        </Box>
        <Checkbox
          label="Get a large card"
          mt="lg"
          onChange={(e) => {
            const checked = e.currentTarget.checked
            setWantLargeCard(checked)
            if (!checked) {
              setCustomBannerMode("")
              setBannerMode("Custom Color")
            }
          }}
        />
        {wantLargeCard && (
          <Box mt="xl">
            <Title order={4}>Details</Title>
            <TextInput
              {...form.getInputProps("pronouns")}
              label="Pronouns"
              placeholder="Enter your pronouns"
              onChange={(e) => {
                form.setValues({
                  ...form.values,
                  pronouns: e.currentTarget.value.trim().length != 0 ? e.currentTarget.value : "",
                })
              }}
            />
            <Textarea
              label="About me"
              minRows={5}
              maxRows={5}
              autosize
              {...form.getInputProps("aboutMe")}
              placeholder="Write something about yourself. Max characters per line: 53"
              onChange={(e) => {
                form.setValues({
                  ...form.values,
                  aboutMe:
                    e.currentTarget.value.trim().length != 0
                      ? limitTextarea(e.currentTarget.value)
                      : "",
                })
              }}
            />
            <NativeSelect
              label="Banner Mode"
              data={bannerModeList}
              onChange={(e) => {
                setBannerMode(e.currentTarget.value)
                form.setFieldValue("bannerColor", "")
                setBannerFile(null)
              }}
            />
            {bannerMode === "Custom Color" && (
              <HoverCard shadow="md" openDelay={250}>
                <HoverCard.Target>
                  <TextInput
                    placeholder="#212121"
                    label="Banner color"
                    description="Leave blank for dark grey color"
                    {...form.getInputProps("bannerColor")}
                    maxLength={7}
                    minLength={7}
                    onChange={(e) => {
                      if (
                        /^([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) &&
                        !form.values.bannerColor
                      )
                        e.currentTarget.value = `#${e.currentTarget.value.toUpperCase()}`
                      if (
                        /^#([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) ||
                        e.currentTarget.value === ""
                      )
                        form.setValues({
                          ...form.values,
                          bannerColor: e.currentTarget.value.toUpperCase(),
                        })
                    }}
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <ColorPicker
                    value={form.values.bannerColor}
                    onChange={(e) => {
                      form.setValues({
                        ...form.values,
                        bannerColor: e.toUpperCase(),
                      })
                    }}
                  />
                </HoverCard.Dropdown>
              </HoverCard>
            )}
            {bannerMode === "Custom Image Banner" && (
              <>
                <Box>
                  <Radio.Group
                    name="customImageBannerOptions"
                    onChange={(e) => {
                      setCustomBannerMode(e)
                      setExternalImageURL("")
                      setBannerPBID("")
                      setBannerFile(null)
                    }}
                    value={customBannerMode}
                    label="Options"
                    description="Choose how you want to set your banner image."
                    withAsterisk
                  >
                    <Group mt="xs">
                      <Radio value="upload" label="Upload new image" />
                      <Radio value="pbid" label="Use uploaded image" />
                      <Radio value="exturl" label="External image URL" />
                    </Group>
                  </Radio.Group>
                </Box>
                {customBannerMode === "upload" && (
                  <FileInput
                    required
                    value={bannerFile}
                    accept="image/png,image/vnd.mozilla.apng,image/jpeg,image/gif,image/webp,image/avif"
                    label="Upload image"
                    description="Only accept image files."
                    // @ts-ignore
                    placeholder="Click to upload image"
                    w="max-content"
                    maw="280px"
                    onChange={(e) => {
                      if (e) setBannerFile(e)
                    }}
                  />
                )}
                {customBannerMode === "pbid" && (
                  <TextInput
                    w="max-content"
                    required
                    maxLength={15}
                    minLength={15}
                    placeholder="1kdufzpk70fors1"
                    value={bannerPBID}
                    onChange={(e) => {
                      const value = e.currentTarget.value.trim()
                      if (/^[a-z0-9]+$/.test(value) || value === "") {
                        setBannerPBID(value)
                      }
                    }}
                    label="Image ID"
                    description="ID of the image stored on the database"
                  />
                )}
                {customBannerMode === "exturl" && (
                  <TextInput
                    required
                    placeholder="https://example.com/image.png"
                    value={externalImageURL}
                    onChange={(e) => {
                      setExternalImageURL(e.currentTarget.value.trim())
                    }}
                    label="Image URL"
                    description="Make sure it is a valid one."
                  />
                )}
              </>
            )}
            {bannerMode === "Discord Accent Color" && (
              <Text mt="md" style={{ fontSize: "15px" }}>
                This is the color that Discord uses for the accent color (banner color) of your
                profile. If it is not available, you will get a dark grey banner instead.
              </Text>
            )}
            {bannerMode === "Discord Image Banner (Nitro User Only)" && (
              <Text mt="md" style={{ fontSize: "15px" }}>
                This feature is only available for Nitro users. If you are not a Nitro user, you
                will get a solid color banner instead (accent color or dark grey).
              </Text>
            )}
          </Box>
        )}
        <Button type="submit" mt="xl" mr="md">
          Generate
        </Button>
        {smallCardLink !== "" && (
          <Button
            onClick={() => {
              setSmallCardLink("")
              setLargeCardLink("")
              setSmallTail("")
              setLargeTail("")
            }}
            mt="xl"
            color="orange"
          >
            Clear result
          </Button>
        )}
      </Box>
    </Table.Td>
  )

  const column3 = (
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

  const pcTable = (
    <Table w="95%" h="90%" style={{ fontSize: "30px" }}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="33%">Step 1 - Join the Discord Server</Table.Th>
          <Table.Th w="33%">Step 2 - Enter your username</Table.Th>
          <Table.Th w="33%">Step 3 - Enjoy!</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          {column1}
          {column2}
          {column3}
        </Table.Tr>
      </Table.Tbody>
    </Table>
  )

  const mobileTable = (
    <Table w="95%" h="90%" style={{ fontSize: "30px" }}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="100%">Step 1 - Join the Discord Server</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>{column1}</Table.Tr>
      </Table.Tbody>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="100%">Step 2 - Enter your username</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>{column2}</Table.Tr>
      </Table.Tbody>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="100%">Step 3 - Enjoy!</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>{column3}</Table.Tr>
      </Table.Tbody>
    </Table>
  )

  return isMobile ? mobileTable : pcTable
}

export default MainContent
