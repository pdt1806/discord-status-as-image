import { bgIsLight, blendColors, hexToRgb } from "../../utils/tools";

export function textColorFn(
  params: URLSearchParams,
  backgroundColor: string,
  setTextColor: (color: string) => void,
  setBackgroundGradient: (color: string) => void,
) {
  if (!params.get("bg1")) {
    const textColorRaw = hexToRgb(backgroundColor || "");
    setTextColor(bgIsLight(textColorRaw!) ? "#202225" : "white");
  } else {
    const gradient1Raw = hexToRgb(params.get("bg1") || "");
    const gradient2Raw = hexToRgb(params.get("bg2") || "");
    const gradient1 = gradient1Raw
      ? `${gradient1Raw.r}, ${gradient1Raw.g}, ${gradient1Raw.b}`
      : "";
    const gradient2 = gradient2Raw
      ? `${gradient2Raw.r}, ${gradient2Raw.g}, ${gradient2Raw.b}`
      : "";
    setBackgroundGradient(
      gradient1 && gradient2 && params.get("angle")
        ? `linear-gradient(${params.get("angle")}deg, rgb(${gradient1}) 0%, rgb(${gradient2}) 100%)`
        : "",
    );
    const textColorRaw = hexToRgb(
      blendColors(params.get("bg1") || "", params.get("bg2") || "") || "",
    );
    setTextColor(bgIsLight(textColorRaw!) ? "#202225" : "white");
  }
}
