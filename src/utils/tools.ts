export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function blendColors(colorA: string, colorB: string) {
  const colorAMatch = colorA.match(/\w\w/g)
  const colorBMatch = colorB.match(/\w\w/g)
  if (!colorAMatch || !colorBMatch) return
  const [rA, gA, bA] = colorAMatch.map((c) => parseInt(c, 16))
  const [rB, gB, bB] = colorBMatch.map((c) => parseInt(c, 16))
  const r = Math.round(rA + (rB - rA) * 0.5)
    .toString(16)
    .padStart(2, "0")
  const g = Math.round(gA + (gB - gA) * 0.5)
    .toString(16)
    .padStart(2, "0")
  const b = Math.round(bA + (bB - bA) * 0.5)
    .toString(16)
    .padStart(2, "0")
  return "#" + r + g + b
}

export function bgIsLight(color: { r: number; g: number; b: number }) {
  const { r, g, b } = color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 186
}

export const monthsKey = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
} as const

export function formatDate(date: string) {
  return `${monthsKey[date.slice(0, 2) as keyof typeof monthsKey].slice(0, 3)}${" "}
  ${date.slice(3, 5)}, ${date.slice(6, 10)}`
}

export function limitTextarea(value: string) {
  var lines = value.split("\n")
  lines = lines.map(function (line) {
    return line.slice(0, 57)
  })
  var newText = lines.slice(0, 5).join("\n")
  return newText
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener("load", (event) => {
      if (event.target && event.target.result) {
        const dataUrl = event.target.result.toString()
        const mimeType = dataUrl.split(";")[0].split(":")[1]
        return resolve(dataUrl)
      }
      reject(new Error("Failed to read the file."))
    })

    reader.addEventListener("error", reject)

    reader.readAsDataURL(file)
  })
}

export function setSmallCardTitleSize(displayName: string | undefined) {
  if (displayName?.length! > 30) {
    return 45
  } else if (displayName?.length! > 25) {
    return 50
  } else if (displayName?.length! > 20) {
    return 60
  } else if (displayName?.length! > 15) {
    return 80
  }
  return 100
}

export function setLargeCardTitleSize(displayName: string | undefined) {
  if (displayName?.length! > 30) {
    return 25
  } else if (displayName?.length! > 25) {
    return 30
  } else if (displayName?.length! > 20) {
    return 35
  } else if (displayName?.length! > 15) {
    return 40
  }
  return 45
}
