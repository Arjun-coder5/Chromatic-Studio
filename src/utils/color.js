export const isValidHex = (value) => /^#[0-9a-fA-F]{6}$/.test(value);
export function luminance(hex) {
  if (!isValidHex(hex)) return null;
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrastRatio(a, b) {
  const x = luminance(a), y = luminance(b);
  if (x === null || y === null) return null;
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function readableTextColor(bg) {
  return contrastRatio(bg, '#000000') >= contrastRatio(bg, '#FFFFFF') ? '#000000' : '#FFFFFF';
}
export function hexToRgb(hex) {
  if (!isValidHex(hex)) return [0, 0, 0];
  return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
}
export function rgbToHex(rgb) {
  return '#' + rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();
}
export function simulateColor(hex, type) {
  const rgb = hexToRgb(hex);
  const matrices = {
    normal: [[1,0,0],[0,1,0],[0,0,1]],
    protanopia: [[0.567,0.433,0],[0.558,0.442,0],[0,0.242,0.758]],
    deuteranopia: [[0.625,0.375,0],[0.7,0.3,0],[0,0.3,0.7]],
    tritanopia: [[0.95,0.05,0],[0,0.433,0.567],[0,0.475,0.525]],
    achromatopsia: [[0.299,0.587,0.114],[0.299,0.587,0.114],[0.299,0.587,0.114]]
  };
  const linear = rgb.map(v => { const n = v / 255; return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4; });
  const out = matrices[type] || matrices.normal;
  const transformed = out.map(row => row.reduce((sum, n, i) => sum + n * linear[i], 0)).map(v => { const n = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; return n * 255; });
  return rgbToHex(transformed);
}
export function makePalette() {
  const base = Math.floor(Math.random() * 360);
  const offsets = [0, 28, 155, 205, 315];
  return offsets.map((offset, i) => {
    const h = (base + offset) % 360;
    const s = [68, 74, 52, 61, 66][i];
    const l = [45, 58, 72, 36, 63][i];
    return hslToHex(h, s, l);
  });
}
export function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex([f(0) * 255, f(8) * 255, f(4) * 255]);
}
