import { refinerAPI, testing } from "@/env/env"
import { getBannerImage } from "@/pocketbase_client"
import { blendColors, formatDate, hexToRgb, setLargeCardTitleSize } from "@/utils/tools"
import { Avatar, Box, Divider, Image, Text, Title } from "@mantine/core"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import classes from "../style/profile.module.css"

const LargeCard = () => {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const [username, setUsername] = useState(params.get("username"))
  const [displayName, setDisplayName] = useState(params.get("displayName"))
  const [avatar, setAvatar] = useState(params.get("avatar"))
  const [status, setStatus] = useState(params.get("status"))
  const [createdDate, setCreatedDate] = useState(params.get("createdDate"))
  const [bannerImage, setBannerImage] = useState(params.get("bannerImage"))
  const [accentColor, setAccentColor] = useState(
    params.get("accentColor") && `#${params.get("accentColor")}`
  )
  const id = params.get("id")
  const backgroundColor = params.get("bg") ? `#${params.get("bg")}` : "#2b2d31"
  let backgroundGradient
  let textColor
  let textColorRaw
  if (!params.get("bg1")) {
    const textColorRaw = hexToRgb(backgroundColor || "")
    textColor =
      textColorRaw!.r * 0.299 + textColorRaw!.g * 0.587 + textColorRaw!.b * 0.114 > 186
        ? "#202225"
        : "white"
  } else {
    const gradient1Raw = hexToRgb(params.get("bg1") || "")
    const gradient2Raw = hexToRgb(params.get("bg2") || "")
    const gradient1 = gradient1Raw ? `${gradient1Raw.r}, ${gradient1Raw.g}, ${gradient1Raw.b}` : ""
    const gradient2 = gradient2Raw ? `${gradient2Raw.r}, ${gradient2Raw.g}, ${gradient2Raw.b}` : ""
    backgroundGradient =
      gradient1 && gradient2
        ? `linear-gradient(180deg, rgb(${gradient1}) 0%, rgb(${gradient2}) 100%)`
        : ""
    textColorRaw = hexToRgb(blendColors(params.get("bg1") || "", params.get("bg2") || "") || "")
    textColor =
      textColorRaw!.r * 0.299 + textColorRaw!.g * 0.587 + textColorRaw!.b * 0.114 > 186
        ? "#202225"
        : "white"
  }
  const bannerColor = params.get("bannerColor") ? `#${params.get("bannerColor")}` : "#212121"
  const mood = params.get("mood")
  const aboutMe = decodeURIComponent(params.get("aboutMe") || "")
  const pronouns = decodeURIComponent(params.get("pronouns") || "")
  const bannerID = params.get("bannerID")

  function updateStatus() {
    fetch(`${testing ? refinerAPI["dev"] : refinerAPI["prod"]}/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        setUsername(data.username)
        setDisplayName(data.display_name)
        setAvatar(data.avatar)
        setStatus(data.status)
        setStatusImage(setStatusImg(data.status))
        if (params.get("created") == "true") setCreatedDate(data.created_at)
        if (params.get("wantBannerImage") == "true") {
          setBannerImage(data.banner)
          setAccentColor(data.accent_color)
        }
        if (params.get("wantAccentColor")) setAccentColor(data.accent_color)
      })
  }

  useEffect(() => {
    async function getBanner() {
      if (!bannerID) return
      const banner: string = ((await getBannerImage(bannerID, false)) as string) || ""
      if (!banner) return
      setBannerImage(banner)
    }

    updateStatus()
    getBanner()
  }, [])

  setTimeout(() => {
    try {
      updateStatus()
    } catch {}
  }, 15000)

  function setStatusImg(status?: string) {
    switch (status) {
      case "online":
        return "/images/icons/online.svg"
      case "idle":
        return "/images/icons/idle.svg"
      case "dnd":
        return "/images/icons/dnd.svg"
      case "offline":
        return "/images/icons/offline.svg"
      default:
        return "/images/icons/offline.svg"
    }
  }

  let titleSize = setLargeCardTitleSize(displayName || "")

  const [statusImage, setStatusImage] = useState(setStatusImg(status || "offline"))

  const ratio = window.innerWidth / 807

  return (
    <a href={`https://discord.com/users/${id}`} target="_blank">
      <Box
        w={807}
        h="min-content"
        id="disi-large-card"
        style={{
          background: backgroundGradient ? backgroundGradient : backgroundColor,
          position: "absolute",
          alignItems: "center",
          transform: `${ratio < 1 ? `scale(${ratio})` : ""}`,
          transformOrigin: "top left",
        }}
      >
        {bannerImage ? (
          <Image src={bannerImage} className={classes.banner} id="banner" />
        ) : (
          <Box
            id="banner"
            style={{
              backgroundColor: accentColor ?? bannerColor,
            }}
            className={classes.colorBanner}
          />
        )}
        <Box style={{ transform: "scale(0.8) translate(20px, -180px)", position: "absolute" }}>
          <Image alt="Avatar" src={avatar} className={classes.avatar} />
          <Avatar
            w={75}
            h={75}
            src={statusImage}
            style={{
              transform: `translate(202px, -72px) `,
              background: "transparent",
            }}
          />
        </Box>
        <Box
          style={{
            position: "absolute",
            backgroundColor: "#28944c",
            padding: "8px 18px 8px 18px",
            color: "white",
            fontSize: "20px",
            fontWeight: "400",
            borderRadius: "5px",
            boxShadow: "0 0 10px 0px #00000050",
            transform: "translate(548px, 30px)",
          }}
        >
          Send Friend Request
        </Box>
        <Box
          style={{
            backgroundColor: textColor == "white" ? "#111111" : "#ffffff",
            transform: "translateX(30px)",
            borderRadius: "15px",
            zIndex: 0,
          }}
          w={747}
          p={30}
          mt={150}
          mb={30}
          h="max-content"
        >
          <Box mb={15}>
            <Title fw={600} size={titleSize} c={textColor}>
              {displayName}
            </Title>
            <Title fw={500} mt={10} size={titleSize - 15} c={textColor}>
              {username}
            </Title>
            {pronouns ? (
              <Title fw={400} mt={10} size={25} c={textColor}>
                {pronouns}
              </Title>
            ) : null}
            {mood ? (
              <Title fw={400} mt={35} size={25} c={textColor}>
                {mood}
              </Title>
            ) : null}
          </Box>
          {aboutMe || createdDate ? <Divider w={687} mb={30} mt={30} /> : null}
          {aboutMe ? (
            <Box>
              <Title size={20} c={textColor}>
                ABOUT ME
              </Title>
              <Text
                c={textColor}
                mt="sm"
                lineClamp={5}
                style={{
                  fontSize: "22px",
                  maxWidth: "700px",
                  wordWrap: "break-word",
                  whiteSpace: "pre-line",
                }}
              >
                {aboutMe}
              </Text>
            </Box>
          ) : null}
          {createdDate ? (
            <Box>
              <Title mt={30} size={20} c={textColor}>
                DISCORD MEMBER SINCE
              </Title>
              <Text c={textColor} lineClamp={4} mt="sm" style={{ fontSize: "22px" }}>
                {formatDate(createdDate)}
              </Text>
            </Box>
          ) : null}
        </Box>
      </Box>
    </a>
  )
}

export default LargeCard
