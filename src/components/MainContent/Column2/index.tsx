import { limitTextarea } from "@/utils/tools"
import {
  Box,
  Button,
  Checkbox,
  ColorPicker,
  FileInput,
  Group,
  HoverCard,
  NativeSelect,
  NumberInput,
  Radio,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { generatingCards } from "./utils"

const MainContentColumn2 = ({
  form,
  customBannerMode,
  bannerFile,
  bannerPBID,
  setUserID,
  colorMode,
  setBannerFile,
  bannerMode,
  externalImageURL,
  setSmallTail,
  setLargeTail,
  setSmallCardLink,
  setLargeCardLink,
  wantLargeCard,
  setColorMode,
  setWantLargeCard,
  setCustomBannerMode,
  setBannerMode,
  bannerModeList,
  setExternalImageURL,
  setBannerPBID,
  smallCardLink,
}: {
  form: any
  customBannerMode: string
  bannerFile: File | null
  bannerPBID: string
  setUserID: (id: string) => void
  colorMode: string
  setBannerFile: (file: File | null) => void
  bannerMode: string
  externalImageURL: string
  setSmallTail: (tail: string) => void
  setLargeTail: (tail: string) => void
  setSmallCardLink: (link: string) => void
  setLargeCardLink: (link: string) => void
  wantLargeCard: boolean
  setColorMode: (mode: string) => void
  setWantLargeCard: (want: boolean) => void
  setCustomBannerMode: (mode: string) => void
  setBannerMode: (mode: string) => void
  bannerModeList: string[]
  setExternalImageURL: (url: string) => void
  setBannerPBID: (pbid: string) => void
  smallCardLink: string
}) => {
  function formatAndUpdateHex({ value, propertyName }: { value: string; propertyName: string }) {
    if (/^([A-Fa-f0-9]{1,6})?$/.test(value) && !form.values[propertyName])
      value = `#${value.toUpperCase()}`
    if (/^#([A-Fa-f0-9]{1,6})?$/.test(value) || value === "") {
      form.setValues({
        ...form.values,
        [propertyName]: value.toUpperCase(),
      })
    }
  }

  return (
    <Table.Td h="100%" display={"flex"} style={{ alignItems: "start", flexDirection: "column" }}>
      <Box
        component="form"
        onSubmit={form.onSubmit(async () => {
          try {
            await generatingCards(
              form,
              customBannerMode,
              bannerFile,
              bannerPBID,
              setUserID,
              colorMode,
              setSmallTail,
              setLargeTail,
              setSmallCardLink,
              setLargeCardLink,
              wantLargeCard,
              bannerMode,
              externalImageURL,
              setBannerFile
            )
          } catch (err) {
            notifications.show({
              title: "Error!",
              message: (err as Error).message,
              color: "red",
              icon: null,
              autoClose: 3000,
            })
          }
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
        <Checkbox
          label="Show Discord label"
          mt="md"
          {...form.getInputProps("discordLabel")}
          onChange={(e) => {
            form.setValues({
              ...form.values,
              discordLabel: e.currentTarget.checked,
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
                  onChange={(e) =>
                    formatAndUpdateHex({
                      value: e.currentTarget.value,
                      propertyName: "backgroundSingle",
                    })
                  }
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
                    onChange={(e) =>
                      formatAndUpdateHex({
                        value: e.currentTarget.value,
                        propertyName: "backgroundGradient1",
                      })
                    }
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
                    onChange={(e) =>
                      formatAndUpdateHex({
                        value: e.currentTarget.value,
                        propertyName: "backgroundGradient2",
                      })
                    }
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
              placeholder={`Write something about yourself.\nMax characters per line: 53`}
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
                      formatAndUpdateHex({
                        value: e.currentTarget.value,
                        propertyName: "bannerColor",
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
}

export default MainContentColumn2
