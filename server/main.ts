import express, { Request, Response } from "express"
import puppeteer from "puppeteer-core"
import { testing } from "../src/env/env"
import { getBannerImage } from "../src/pocketbase_client/index"
import {
  bgIsLight,
  blendColors,
  formatDate,
  hexToRgb,
  setSmallCardTitleSize,
} from "../src/utils/tools"
import { iconsListSmall } from "./icons"
import { uploadBannerImage } from "./pocketbase_server"
import { base64toBlob, fetchData, urlToBase64 } from "./utils"

const root = testing ? "http://localhost:5173" : "http://localhost:2011"

const origin = testing ? "*" : "https://disi.bennynguyen.dev"

const minimal_args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
  "--headless",
]

const app = express()

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin)
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
  res.header("Access-Control-Allow-Headers", "Content-Type")
  next()
})

app.use(express.json({ limit: "16mb" }))

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "API of Discord Status as Image" })
})

app.get("/smallcard/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { bg, bg1, bg2, angle, created } = req.query
    let link = bg1
      ? `${root}/smallcard?bg=${bg}&bg1=${bg1}&bg2=${bg2}&angle=${angle}&`
      : bg
        ? `${root}/smallcard?bg=${bg}&`
        : `${root}/smallcard?`
    try {
      const data = await fetchData(id)
      if (data === null) {
        res.status(404).send("User not found")
        return null
      }
      created && (link += `createdDate=${data["created_at"]}&`)
      const browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
        userDataDir: "./loaded",
        args: minimal_args,
      })
      const page = await browser.newPage()
      await page.setViewport({ width: 1350, height: 450 })
      await page.goto(
        `${link}displayName=${data["display_name"]}&avatar=${data["avatar"]}&status=${data["status"]}&id=${id}`,
        { waitUntil: ["networkidle0"] }
      )
      const screenshotBuffer = await page.screenshot({
        clip: { x: 0, y: 0, width: 1350, height: 450 },
      })
      res.set("Content-Type", "image/png")
      res.send(screenshotBuffer)
      await browser.close()
    } catch (error) {
      res.status(500).send("Internal Server Error")
    }
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
})

function monoBackgroundTextColor(bg: string) {
  const color = hexToRgb(bg)
  return bgIsLight(color!) ? "#202225" : "white"
}

app.get("/smallcard_svg/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { bg, bg1, bg2, angle, created } = req.query
    try {
      const data = await fetchData(id)
      if (data === null) {
        res.status(404).send("User not found")
        return null
      }
      const avatar = await urlToBase64(data["avatar"])
      const background = bg ? `#${bg}` : null
      let textColor
      if (bg1) {
        const blendColor = blendColors(`#${bg1}`, `#${bg2}`)
        textColor = monoBackgroundTextColor(blendColor!)
      }
      if (bg) textColor = monoBackgroundTextColor(`#${bg}`)
      if (data["status"] == "offline" && textColor === "#202225") textColor = "#5d5f6b"
      const statusImage = iconsListSmall[data["status"]]
      const displayName = data["display_name"]
      const titleSize = setSmallCardTitleSize(data["display_name"])
      const createdDate = created ? data["created_at"] : null
      const svgContent = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 300 100"
        width="360px"
        height="120px"
      >
        <defs>
        ${
          bg1 &&
          `<linearGradient id="bgGradient" x1="0%" y1="100%" x2="0%" y2="0%" gradientTransform="rotate(${angle} .5 .5)">
              <stop offset="0%" style="stop-color:#${bg1};stop-opacity:1" />
              <stop offset="80%" style="stop-color:#${bg2};stop-opacity:1" />
            </linearGradient>`
        }
          <style type="text/css">@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700');.cls-1{fill:none;}.cls-2{fill:${background ?? "url(#bgGradient)"};}.cls-30{fill:#24934f;fill-rule:evenodd;}.cls-31{fill:#5d5f6b;fill-rule:evenodd;}.cls-32{fill:#f0b232;fill-rule:evenodd;}.cls-33{fill:#ec3e4a;fill-rule:evenodd;}.cls-4{clip-path:url(#clip-path);}.cls-10,.cls-5,.cls-6{isolation:isolate;}.cls-6{font-size:${22 * (titleSize / 100)}px;font-family:Noto Sans TC, system-ui;font-weight:500;}.cls-10,.cls-6,.cls-9{fill:${textColor};}.cls-7{letter-spacing:-0.021em;}.cls-8{letter-spacing:-0.01501em;}.cls-10{font-size:8.85069px;font-family:Noto Sans TC, system-ui; font-weight:400;}}</style>
          <clipPath id="clip-path">
            <path
              class="cls-1"
              d="M45.8312,19.77937a30.30156,30.30156,0,0,1,27.90485,42.073l-.26383.54773-.74423-.404a11.00057,11.00057,0,0,0-14.41,14.41l.52766.972-1.22624.59108A30.28826,30.28826,0,1,1,45.8312,19.77937Z"
            />
          </clipPath>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <rect class="cls-2" width="360" height="120" />
            ${statusImage}
            <g class="cls-4">
              <image
                id="img0"
                class="cls-5"
                width="1440"
                height="1440"
                transform="translate(15.54643 19.77937) scale(0.04206)"
                xlink:href="${avatar}"
              />
            </g>
            <text
              class="cls-6"
              transform="translate(90.67773 ${createdDate ? "50.64147" : "59.5"})"
            >
              ${displayName}
            </text>
            ${
              createdDate &&
              `
                <path
                  class="cls-9"
                  d="M99.34572,68.42014a1.19712,1.19712,0,0,1-1.11652-1.19705c0-.02122.00042-.04244.00166-.06366v.00291c-.00124-.02-.00207-.04327-.00207-.067a1.19019,1.19019,0,0,1,1.11362-1.19082h.00331a1.1838,1.1838,0,0,1,1.11734,1.18457c0,.0258-.00085.05118-.00246.07656v-.00333c.00123.02081.002.04535.002.0699a1.18658,1.18658,0,0,1-1.114,1.18751h-.00331Zm-4.12268,0a1.19712,1.19712,0,0,1-1.1165-1.19705c0-.02122.00041-.04244.00165-.06366v.00291c-.00124-.02-.00207-.04327-.00207-.067a1.19017,1.19017,0,0,1,1.11361-1.19082H95.223a1.18379,1.18379,0,0,1,1.11733,1.18457c0,.0258-.00083.05118-.00248.07656v-.00333c.00124.02.00207.04327.00207.067a1.19013,1.19013,0,0,1-1.11361,1.19081Zm6.3569-5.69942a9.86118,9.86118,0,0,0-2.46342-.77848l-.06165-.00915-.007-.00084a.03836.03836,0,0,0-.03348.01957h0a6.54608,6.54608,0,0,0-.29661.6033L98.7,62.60131a9.10148,9.10148,0,0,0-1.4181-.10777,9.479,9.479,0,0,0-1.47144.11442l.05336-.00707a6.35774,6.35774,0,0,0-.33632-.68153l.017.032a.03939.03939,0,0,0-.03434-.01956l-.00662.00041h.00041a10.13173,10.13173,0,0,0-2.58793.81427l.06246-.02663a.03461.03461,0,0,0-.01655.01414h0a10.4873,10.4873,0,0,0-1.88718,6.03143,10.70729,10.70729,0,0,0,.05833,1.11679l-.00372-.04575a.04326.04326,0,0,0,.01613.02911h0a10.16591,10.16591,0,0,0,3.02519,1.55532l.07281.02.01158.00162a.03944.03944,0,0,0,.03186-.01579h0a7.26961,7.26961,0,0,0,.61431-.99526l.01944-.04164a.04072.04072,0,0,0,.00413-.01788.03976.03976,0,0,0-.02564-.037h-.00042a6.71266,6.71266,0,0,1-.99985-.48141l.03185.0175a.04012.04012,0,0,1-.01985-.03453.03947.03947,0,0,1,.01572-.03166h0c.06494-.04907.13031-.09986.19235-.15141a.03885.03885,0,0,1,.02442-.00875l.01571.00333h-.00041a7.19424,7.19424,0,0,0,3.11744.6994,7.272,7.272,0,0,0,3.16171-.7186l-.04425.0192a.03508.03508,0,0,1,.01655-.00379.03881.03881,0,0,1,.02439.00875h0c.062.05163.127.10318.1928.15187a.04106.04106,0,0,1,.0157.032.04057.04057,0,0,1-.019.03414h0a6.09572,6.09572,0,0,1-.92455.44851l-.04349.01494a.04038.04038,0,0,0-.02563.03708.03828.03828,0,0,0,.00454.01827v-.00039a8.28548,8.28548,0,0,0,.64988,1.06013l-.01655-.02369a.03952.03952,0,0,0,.03186.01664l.012-.00162h-.00039a10.24383,10.24383,0,0,0,3.12984-1.59441l-.02694.01951a.04036.04036,0,0,0,.01616-.02872h0a10.15969,10.15969,0,0,0,.05626-1.088,10.45789,10.45789,0,0,0-1.91244-6.04728l.02155.03245a.03234.03234,0,0,0-.0157-.015h0Z"
                />
                <text class="cls-10" transform="translate(108.38086 70.42077)">
                  ${formatDate(createdDate)}
                </text>
              `
            }
          </g>
        </g>
      </svg>
            `
      res.set("Content-Type", "image/svg+xml")
      res.send(svgContent)
    } catch (error) {
      res.status(500).send("Internal Server Error")
    }
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
})

app.get("/largecard/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const {
      bg,
      bg1,
      bg2,
      created,
      aboutMe,
      pronouns,
      wantBannerImage,
      wantAccentColor,
      bannerColor,
      bannerID,
      bannerImage,
    } = req.query as { [key: string]: string }
    let link = bg1
      ? `${root}/largecard?bg=${bg}&bg1=${bg1}&bg2=${bg2}&`
      : bg
        ? `${root}/largecard?bg=${bg}&`
        : `${root}/largecard?`
    link += aboutMe ? `aboutMe=${encodeURIComponent(aboutMe)}&` : ""
    link += pronouns ? `pronouns=${pronouns}&` : ""
    try {
      const data = await fetchData(id)
      if (data === null) {
        res.status(404).send("User not found")
        return null
      }
      created && (link += `createdDate=${data["created_at"]}&`)
      if (bannerID) {
        const banner = await getBannerImage(bannerID, false)
        banner && (link += `bannerImage=${banner}&`)
      }
      if (wantBannerImage) {
        data["banner"] && (link += `bannerImage=${data["banner"]}&`)
        data["accent_color"] && (link += `accentColor=${data["accent_color"].replace("#", "")}&`)
      }
      bannerImage && (link += `bannerImage=${bannerImage}&`)
      wantAccentColor &&
        data["accent_color"] &&
        (link += `accentColor=${data["accent_color"].replace("#", "")}&`)
      bannerColor && (link += `bannerColor=${bannerColor}&`)
      const browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
        userDataDir: "./loaded",
        args: minimal_args,
      })
      const page = await browser.newPage()
      await page.setViewport({ width: 807, height: 1200 })
      await page.goto(
        `${link}username=${data["username"]}&displayName=${data["display_name"]}&avatar=${data["avatar"]}&status=${data["status"]}&id=${id}`,
        { waitUntil: ["networkidle0"] }
      )
      await page.waitForSelector("#banner")
      const maxHeight = await page.evaluate(() => {
        const elements = document.querySelectorAll("#disi-large-card")
        let maxElementHeight = 0

        elements.forEach((element) => {
          const { height } = element.getBoundingClientRect()
          maxElementHeight = Math.max(maxElementHeight, height)
        })
        return maxElementHeight
      })
      const screenshotBuffer = await page.screenshot({
        clip: { x: 0, y: 0, width: 807, height: maxHeight },
      })
      res.set("Content-Type", "image/png")
      res.send(screenshotBuffer)
      await browser.close()
    } catch (error) {
      res.status(500).send("Internal Server Error")
    }
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
})

app.post("/uploadbanner", async (req, res) => {
  try {
    const { image } = req.body as { image: string }
    if (!image) {
      res.status(400).send("Bad Request")
      return null
    }
    const blob = base64toBlob(image)
    if (!blob) {
      res.status(400).send("Bad Request")
      return null
    }
    const id = await uploadBannerImage(blob)
    res.status(200).json({ id })
  } catch (error) {
    res.status(500).send(error.message)
  }
})

app.listen(1911, () => console.log("Server is running on http://localhost:1911"))
