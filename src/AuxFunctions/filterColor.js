import { FUNCTIONS } from "./formatColor";

export function getContrastColor(format, col, contrast) {
  //convert the color to hsl and drop the hsl value
  if (Array.isArray(col)) {
    col = [...col];
  }
  if (format !== "hsl") {
    if (format !== "hex") {
      col = FUNCTIONS[format](col, true);
    }
    col = FUNCTIONS["hsl"](col);
  }
  col[2] = col[2] + contrast * (col[2] >= 50 ? -1 : 1);
  return FUNCTIONS["hsl"](col, true);
}
