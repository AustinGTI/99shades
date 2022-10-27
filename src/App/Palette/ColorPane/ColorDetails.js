import React, { useEffect, useRef } from "react";
import "./ColorDetails.scss";
import useAppContext, {
  getPaneColor,
} from "../../../AuxFunctions/useAppContext";
import formatColor from "../../../AuxFunctions/formatColor";
import { ReactComponent as UndoBtn } from "../../../Data/Icons/Buttons/undoBtn.svg";
import { ReactComponent as RedoBtn } from "../../../Data/Icons/Buttons/redoBtn.svg";
import { ReactComponent as DeleteBtn } from "../../../Data/Icons/Buttons/deleteBtn.svg";
import { ReactComponent as MoveBtn } from "../../../Data/Icons/Buttons/moveBtn.svg";

function cleanFormats(format, value) {
  if (["rgb", "hsv", "hsl", "cmyk"].includes(format)) {
    return `${format}(${value.join(",")})`;
  }
  return value;
}

export default function ColorDetails({ pane, isActive }) {
  let formats = getPaneColor(pane);
  let formatKeys = Object.keys(formats).filter((v) => v !== "cls");
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
  const colDetailsBox = useRef(null);
  useEffect(() => {
    colDetailsBox.current.parentElement.style.setProperty(
      "--primary-color",
      formats.hex
    );
    colDetailsBox.current.parentElement.style.setProperty(
      "--secondary-color",
      `hsl(${fontColor.join(",")})`
    );
  }, [isActive, formats]);

  return (
    <>
      <div className={`bracer left ${isActive ? "active" : ""}`}>
        {/* to be replaced with svgs when working on animations */}
        <div className="indicator"></div>
      </div>
      <div className="colorDetailsBox" ref={colDetailsBox}>
        <div className="btn panelBtn moveBtn">
          <MoveBtn />
        </div>
        {formatKeys.map((v, vi) => (
          <div className="format" key={vi}>
            <span>{cleanFormats(v, formats[v])}</span>
          </div>
        ))}
        <div className="keyBtnBox">
          <div className="btn keyBtn undoBtn">
            <UndoBtn />
          </div>
          <div className="btn keyBtn deleteBtn">
            <DeleteBtn />
          </div>
          <div className="btn keyBtn redoBtn">
            <RedoBtn />
          </div>
        </div>
      </div>
      <div className={`bracer right ${isActive ? "active" : ""}`}>
        <div className="indicator"></div>
      </div>
    </>
  );
}
