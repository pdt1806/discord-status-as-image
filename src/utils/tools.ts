export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function blendColors(colorA: string, colorB: string) {
  const colorAMatch = colorA.match(/\w\w/g);
  const colorBMatch = colorB.match(/\w\w/g);
  if (!colorAMatch || !colorBMatch) return;
  const [rA, gA, bA] = colorAMatch.map((c) => parseInt(c, 16));
  const [rB, gB, bB] = colorBMatch.map((c) => parseInt(c, 16));
  const r = Math.round(rA + (rB - rA) * 0.5)
    .toString(16)
    .padStart(2, '0');
  const g = Math.round(gA + (gB - gA) * 0.5)
    .toString(16)
    .padStart(2, '0');
  const b = Math.round(bA + (bB - bA) * 0.5)
    .toString(16)
    .padStart(2, '0');
  return '#' + r + g + b;
}

export const isMobile = window.innerWidth < 1080;
export const smallestHeader = window.innerWidth < 530;

const monthNames = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
} as const;

export function formatDate(date: string) {
  return `${monthNames[date.slice(0, 2) as keyof typeof monthNames]}${' '}
  ${date.slice(3, 5)}, ${date.slice(6, 10)}`;
}

export function limitTextarea(value: string) {
  var lines = value.split('\n');
  lines = lines.map(function(line) {
    return line.slice(0, 70);
  });
  var newText = lines.slice(0, 5).join('\n');
  return newText;
}