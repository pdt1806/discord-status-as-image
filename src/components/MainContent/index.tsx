import { isMobile } from "@/utils/browser"
import { Table } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { useEffect, useState } from "react"
import MainContentColumn1 from "./Column1"
import MainContentColumn2 from "./Column2"
import MainContentColumn3 from "./Column3"

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
          <MainContentColumn1 />
          <MainContentColumn2
            form={form}
            customBannerMode={customBannerMode}
            bannerFile={bannerFile}
            bannerPBID={bannerPBID}
            setUserID={setUserID}
            colorMode={colorMode}
            setBannerFile={setBannerFile}
            bannerMode={bannerMode}
            externalImageURL={externalImageURL}
            setSmallTail={setSmallTail}
            setLargeTail={setLargeTail}
            setSmallCardLink={setSmallCardLink}
            setLargeCardLink={setLargeCardLink}
            setColorMode={setColorMode}
            setBannerMode={setBannerMode}
            setExternalImageURL={setExternalImageURL}
            setBannerPBID={setBannerPBID}
            setWantLargeCard={setWantLargeCard}
            setCustomBannerMode={setCustomBannerMode}
            bannerModeList={bannerModeList}
            smallCardLink={smallCardLink}
            wantLargeCard={wantLargeCard}
          />
          <MainContentColumn3
            smallCardLink={smallCardLink}
            largeCardLink={largeCardLink}
            smallTail={smallTail}
            largeTail={largeTail}
            userID={userID}
            wantLargeCard={wantLargeCard}
            customBannerMode={customBannerMode}
            copiedNotification={copiedNotification}
          />
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
        <Table.Tr>
          <MainContentColumn1 />
        </Table.Tr>
      </Table.Tbody>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="100%">Step 2 - Enter your username</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <MainContentColumn2
            form={form}
            customBannerMode={customBannerMode}
            bannerFile={bannerFile}
            bannerPBID={bannerPBID}
            setUserID={setUserID}
            colorMode={colorMode}
            setBannerFile={setBannerFile}
            bannerMode={bannerMode}
            externalImageURL={externalImageURL}
            setSmallTail={setSmallTail}
            setLargeTail={setLargeTail}
            setSmallCardLink={setSmallCardLink}
            setLargeCardLink={setLargeCardLink}
            setColorMode={setColorMode}
            setBannerMode={setBannerMode}
            setExternalImageURL={setExternalImageURL}
            setBannerPBID={setBannerPBID}
            setWantLargeCard={setWantLargeCard}
            setCustomBannerMode={setCustomBannerMode}
            bannerModeList={bannerModeList}
            smallCardLink={smallCardLink}
            wantLargeCard={wantLargeCard}
          />
        </Table.Tr>
      </Table.Tbody>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="100%">Step 3 - Enjoy!</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <MainContentColumn3
            smallCardLink={smallCardLink}
            largeCardLink={largeCardLink}
            smallTail={smallTail}
            largeTail={largeTail}
            userID={userID}
            wantLargeCard={wantLargeCard}
            customBannerMode={customBannerMode}
            copiedNotification={copiedNotification}
          />
        </Table.Tr>
      </Table.Tbody>
    </Table>
  )

  return isMobile ? mobileTable : pcTable
}

export default MainContent
