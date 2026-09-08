import { blendColors, hexToRgb } from "../../utils/tools";

const getRgbString = (hexColor: string) => {
  const rgb = hexToRgb(hexColor);
  return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "";
};

function isDark(color: { r: number; g: number; b: number }) {
  const { r, g, b } = color;
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}

export function notBG1TextColor(backgroundColor: string | undefined) {
  const textColorRaw = hexToRgb(backgroundColor || "");
  return isDark(textColorRaw!) ? "#202225" : "white";
}

export function BG1TextColor(params: URLSearchParams) {
  const gradient1 = getRgbString(params.get("bg1") || "");
  const gradient2 = getRgbString(params.get("bg2") || "");
  const backgroundGradient =
    `linear-gradient(180deg, rgb(${gradient1}) 0%, rgb(${gradient2}) 100%)` ||
    "";
  const textColorRaw = hexToRgb(
    blendColors(params.get("bg1") || "", params.get("bg2") || "") || "",
  );
  return [backgroundGradient, isDark(textColorRaw!) ? "#202225" : "white"];
}

