export function hexToRgb(hex : string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

export function blendColors(colorA: string, colorB: string) {
    const colorAMatch = colorA.match(/\w\w/g);
    const colorBMatch = colorB.match(/\w\w/g);
    if (!colorAMatch || !colorBMatch) return;
    const [rA, gA, bA] = colorAMatch.map((c) => parseInt(c, 16));
    const [rB, gB, bB] = colorBMatch.map((c) => parseInt(c, 16));
    const r = Math.round(rA + (rB - rA) * 0.5).toString(16).padStart(2, '0');
    const g = Math.round(gA + (gB - gA) * 0.5).toString(16).padStart(2, '0');
    const b = Math.round(bA + (bB - bA) * 0.5).toString(16).padStart(2, '0');
    return '#' + r + g + b;
}
