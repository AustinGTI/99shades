import React from "react";
import "./ColorLeaf.scss";

export default function ColorLeaf(params) {
  const { title, hex } = params;
  return (
    <div className="leaf">
      <div style={{ backgroundColor: hex }}></div>
      <p>{title}</p>
    </div>
  );
}
