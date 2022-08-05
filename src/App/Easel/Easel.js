import React from "react";
import useAppContext from "../../AuxFunctions/useAppContext";
import "./Easel.scss";
import FormatSlider from "./FormatSlider/FormatSlider";
import HexTuner from "./Hex/HexTuner";

export default function () {
  const [getter, setter, pane] = useAppContext();
  return (
    <div className="tunersBox">
      <HexTuner pane={pane} setter={setter} />
      <div className="slidersBox">
        {Array.from(Array(5).keys()).map((v, vi) => (
          <FormatSlider key={vi} idx={vi} />
        ))}
      </div>
    </div>
  );
}
