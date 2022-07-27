import React from "react";
import "./ColorPane.scss";

export default function ColorPane({ pane, isActive }) {
  return (
    <div
      className="colorBox"
      style={{
        backgroundColor: pane.colorStack[pane.colorStackPointer],
        border: `${isActive ? "5px" : "0px"} solid black`,
      }}
    >
      <div className="colorDetailsBox"></div>
    </div>
  );
}
