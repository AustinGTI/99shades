import cols from "../Data/Colors/tempColsv2.json";

//helper functions
function colorVec(hexA, hexB) {
  let rgbB = hexToRGB(hexB);
  let diff = hexToRGB(hexA).map((v, vi) => Math.abs(v - rgbB[vi]));
  return diff.reduce((t, v) => t + v, 0) / 3;
}

function hueToRGB(v1, v2, h) {
  if (h < 0) h++;
  else if (h > 1) h--;

  if (6 * h < 1) return v1 + (v2 - v1) * 6 * h;
  if (2 * h < 1) return v2;
  if (3 * h < 2) return v1 + (v2 - v1) * (2 / 3 - h) * 6;
  return v1;
}
//...............

//converts hex codes to the rgb color format
export function hexToRGB(val, reverse = false) {
  if (reverse) {
    return `#${val
      .reduce(
        (t, v) =>
          t + Math.min(255, Math.round(v)).toString(16).padStart(2, "0"),
        ""
      )
      .toUpperCase()}`;
  }
  let rgb = [val.slice(1, 3), val.slice(3, 5), val.slice(5, 7)];
  return rgb.map((v) => parseInt(v, 16));
}

//converts hex codes to the cmyk color format
export function hexToCMYK(val, reverse = false) {
  if (reverse) {
    let [c, m, y, k] = val.map((v) => v / 100);
    let kinv = 1 - k;
    let rgb = [c, m, y].map((v) => kinv * (1 - v) * 255);
    return hexToRGB(rgb, true);
  }
  let rgb = [val.slice(1, 3), val.slice(3, 5), val.slice(5, 7)];
  let [r, g, b] = rgb.map((v) => parseInt(v, 16) / 255);

  let kinv = Math.max(r, g, b);
  let c = 1 - (kinv === 0 ? 1 : r / kinv);
  let m = 1 - (kinv === 0 ? 1 : g / kinv);
  let y = 1 - (kinv === 0 ? 1 : b / kinv);
  let k = 1 - kinv;
  if (c === NaN) {
    debugger;
  }
  return [c, m, y, k].map((v) => Math.round(v * 100));
}

//converts hex codes to the hsl color format
export function hexToHSL(val, reverse = false) {
  if (reverse) {
    let [h, s, l] = val.map((v, vi) => (vi === 0 ? v / 360 : v / 100));
    let r, g, b, v1, v2;
    if (s === 0) {
      r = l * 255;
      g = l * 255;
      b = l * 255;
    } else {
      if (l < 0.5) {
        v2 = l * (1 + s);
      } else {
        v2 = l + s - s * l;
      }
      v1 = 2 * l - v2;
      r = 255 * hueToRGB(v1, v2, h + 1 / 3);
      g = 255 * hueToRGB(v1, v2, h);
      b = 255 * hueToRGB(v1, v2, h - 1 / 3);
    }
    return hexToRGB([r, g, b], true);
  }
  let rgb = [val.slice(1, 3), val.slice(3, 5), val.slice(5, 7)];
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
  if (delta === 0) h = 0;
  // Red is max
  else if (cmax === r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax === g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;
  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(0);
  l = +(l * 100).toFixed(0);

  return [h, s, l];
}

//converting hex codes to the hsv/hsb color format
export function hexToHSV(val, reverse = false) {
  if (reverse) {
    let [h, s, v] = val.map((v, vi) => (vi === 0 ? v / 360 : v / 100));
    let r, g, b;
    if (s === 0) {
      r = v * 255;
      g = v * 255;
      b = v * 255;
    } else {
      let var_h, var_i, var_1, var_2, var_3, var_r, var_g, var_b;
      var_h = h * 6;
      if (var_h === 6) var_h = 0;
      var_i = Math.floor(var_h); //Or ... var_i = floor( var_h )
      var_1 = v * (1 - s);
      var_2 = v * (1 - s * (var_h - var_i));
      var_3 = v * (1 - s * (1 - (var_h - var_i)));

      if (var_i == 0) {
        var_r = v;
        var_g = var_3;
        var_b = var_1;
      } else if (var_i == 1) {
        var_r = var_2;
        var_g = v;
        var_b = var_1;
      } else if (var_i == 2) {
        var_r = var_1;
        var_g = v;
        var_b = var_3;
      } else if (var_i == 3) {
        var_r = var_1;
        var_g = var_2;
        var_b = v;
      } else if (var_i == 4) {
        var_r = var_3;
        var_g = var_1;
        var_b = v;
      } else {
        var_r = v;
        var_g = var_1;
        var_b = var_2;
      }
      [r, g, b] = [var_r, var_g, var_b].map((v) => v * 255);
    }
    return hexToRGB([r, g, b], true);
  }
  let rgb = [val.slice(1, 3), val.slice(3, 5), val.slice(5, 7)];
  let [r, g, b] = rgb.map((v) => parseInt(v, 16) / 255);

  let min = Math.min(r, g, b);
  let max = Math.max(r, g, b);
  let delta = max - min;

  let h, s;
  if (delta === 0) {
    h = 0;
    s = 0;
  } else {
    s = delta / max;

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

//converting a random hexcode to a color name
export function hexToName(hex) {
  let closestCol = [...cols].sort(
    (a, b) => colorVec(a.hexcode, hex) - colorVec(b.hexcode, hex)
  )[0];
  return closestCol.title;
}

export function hexToClassification(hex) {
  let closestCol = [...cols].sort(
    (a, b) => colorVec(a.hexcode, hex) - colorVec(b.hexcode, hex)
  )[0];
  return closestCol.classification;
}

export default function formatColor(hex) {
  let ret = {
    hex,
    rgb: hexToRGB(hex),
    hsl: hexToHSL(hex),
    hsv: hexToHSV(hex),
    cmyk: hexToCMYK(hex),
    colName: hexToName(hex),
  };
  return ret;
}

//.. Calculate color transform
const FORMATS = ["hex", "hsv", "rgb", "cmyk", "hsl", "col", "cls"];
const FUNCTIONS = {
  rgb: hexToRGB,
  cmyk: hexToCMYK,
  hsl: hexToHSL,
  hsv: hexToHSV,
  col: hexToName,
  cls: hexToClassification,
};

export function buildNewColor(cformat, value, currCols = undefined) {
  currCols =
    currCols ||
    FORMATS.reduce((t, v) => {
      t[v] = undefined;
      return t;
    }, {});
  let tempCols = { ...currCols };
  const hexVal = cformat === "hex" ? value : FUNCTIONS[cformat](value, true);
  for (let [key, val] of Object.entries(tempCols)) {
    if (val && (key === "hex" ? val : FUNCTIONS[key](val, true)) === hexVal) {
      continue;
    }
    if (key === "hex") {
      tempCols[key] = hexVal;
      continue;
    }
    tempCols[key] = key === cformat ? value : FUNCTIONS[key](hexVal);
  }
  return tempCols;
}
