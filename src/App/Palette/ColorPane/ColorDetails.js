import React, { useEffect } from "react";
import "./ColorDetails.scss";
import useAppContext, {
  getPaneColor,
} from "../../../AuxFunctions/useAppContext";
import formatColor from "../../../AuxFunctions/formatColor";

function cleanFormats(format, value) {
  if (["rgb", "hsv", "hsl", "cmyk"].includes(format)) {
    return `${format}(${value.join(",")})`;
  }
  return value;
}

export default function ColorDetails({ pane, isActive }) {
  let formats = formatColor(getPaneColor(pane));
  let formatKeys = Object.keys(formats);
  let emphasis = isActive ? 40 : 20;
  let fontColor =
    formats.hsl[2] > 50
      ? [
          formats.hsl[0],
          formats.hsl[1].toString() + "%",
          (formats.hsl[2] - emphasis).toString() + "%",
        ]
      : [
          formats.hsl[0],
          formats.hsl[1].toString() + "%",
          (formats.hsl[2] + emphasis).toString() + "%",
        ];

  return (
    <div
      className="colorDetailsBox"
      style={{ color: `hsl(${fontColor.join(",")})` }}
    >
      <div className="btn panelBtn moveBtn"></div>
      {formatKeys.map((v, vi) => (
        <div className="format" key={vi}>
          <span>{cleanFormats(v, formats[v])}</span>
        </div>
      ))}
      <div className="keyBtnBox">
        <div className="btn keyBtn undoBtn">U</div>
        <div className="btn keyBtn deleteBtn">D</div>
        <div className="btn keyBtn redoBtn">R</div>
      </div>
    </div>
  );
}
