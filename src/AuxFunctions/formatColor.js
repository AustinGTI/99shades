//converts hex codes to the rgb color format
export function hexToRGB(hex) {
  let rgb = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)];
  return rgb.map((v) => parseInt(v, 16));
}

//converts hex codes to the cmyk color format
export function hexToCMYK(hex) {
  let rgb = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)];
  let [r, g, b] = rgb.map((v) => parseInt(v, 16) / 255);

  let kinv = Math.max([r, g, b]);
  let c = 1 - r / kinv;
  let m = 1 - g / kinv;
  let y = 1 - b / kinv;
  let k = 1 - kinv;

  return [c, m, y, k].map((v) => parseInt(v * 100));
}

//converts hex codes to the hsl color format
export function hexToHSL(hex) {
  let rgb = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)];
  let [r, g, b] = rgb.map((v) => parseInt(v, 16) / 255);

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;
  // Calculate hue
  // No difference
  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;
  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}

//converting hex codes to the hsv/hsb color format
export function hexToHSV(hex) {
  let rgb = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)];
  let [r, g, b] = rgb.map((v) => parseInt(v, 16) / 255);

  let min = Math.min(r, g, b);
  let max = Math.max(r, g, b);
  let delta = max - min;

  let h, s;
  if (delta == 0) {
    h = 0;
    s = 0;
  } else {
    x = delta / max;

    let [dr, dg, db] = [r, g, b].map(
      (v) => ((max - v) / 6 + delta / 2) / delta
    );

    if (r === max) h = db - dg;
    else if (g === max) h = 1 / 3 + dr - db;
    else if (b === max) h = 2 / 3 + dg - dr;

    if (h < 0) h += 1;
    if (h > 1) h -= 1;
  }
  return [parseInt(h * 360), parseInt(s * 100), parseInt(max * 100)];
}
