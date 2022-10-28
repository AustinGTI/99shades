import React, { useEffect, useRef } from "react";
import "./ColorLeaf.scss";
import useAppContext, {
  getPaneColor,
} from "../../../AuxFunctions/useAppContext";
import { buildNewColor } from "../../../AuxFunctions/formatColor";
import { getContrastColor } from "../../../AuxFunctions/filterColor";

export default function ColorLeaf(params) {
  const { title, hex } = params;
  const leaf = useRef(null);
  const [_, setter, pane] = useAppContext();
  const paneColor = getPaneColor(pane);
  useEffect(() => {
    const changeColor = (e) => {
      console.log(hex);
      setter({
        command: "changePaneColor",
        color: buildNewColor("hex", hex, paneColor),
      });
    };
    leaf.current.addEventListener("click", changeColor);
    return () => {
      leaf.current.removeEventListener("click", changeColor);
    };
  }, [paneColor]);
  return (
    <div
      className={`leaf ${title.toLowerCase().replaceAll(" ", "_")} ${
        paneColor.col == title ? "active" : ""
      }`}
      style={{ backgroundColor: hex, color: getContrastColor("hex", hex, 40) }}
      ref={leaf}
    >
      <div className="tag"></div>
      <p>{title}</p>
    </div>
  );
}
