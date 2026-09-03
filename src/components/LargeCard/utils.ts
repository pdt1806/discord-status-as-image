import { blendColors, hexToRgb } from "../../utils/tools";

const getRgbString = (hexColor: string) => {
  const rgb = hexToRgb(hexColor);
  return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "";
};

export function isDark(color: { r: number; g: number; b: number }) {
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

export function adjustHexColor(hex: string, amount: number) {
  hex = hex.replace(/^#/, "");

  const num = parseInt(hex, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  const newColor = (r << 16) + (g << 8) + b;
  return `#${newColor.toString(16).padStart(6, "0")}`;
}
