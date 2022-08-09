import React from "react";
import useAppContext from "../../AuxFunctions/useAppContext";
import "./Easel.scss";
import FormatSlider from "./FormatSlider/FormatSlider";
import HexTuner from "./Hex/HexTuner";

const FORMATS = ["hsv", "rgb", "NULL", "cmyk", "hsl"];

export default function () {
  const [_, setter, pane] = useAppContext();
  return (
    <div className="tunersBox">
      <HexTuner />
      <div className="slidersBox">
        {Array.from(Array(5).keys()).map((v, vi) => (
          <FormatSlider key={vi} idx={vi} format={FORMATS[vi]} />
        ))}
      </div>
    </div>
  );
}
