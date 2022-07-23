import React from "react";
import useAppContext from "../../AuxFunctions/useAppContext";

export default function Palette() {
  console.log("this is ", useAppContext().activeColor);
  return (
    <div className="paletteBox">
      <div className="addRightBtn addBtn btn"></div>
      <div className="addLeftBtn addBtn btn"></div>
      <div className="downloadBtn btn"></div>
      {Array.from(Array(3).keys()).map((v, vi) => (
        <div key={vi} className="colorBox">
          <div className="colorDetailsBox"></div>
        </div>
      ))}
    </div>
  );
}
