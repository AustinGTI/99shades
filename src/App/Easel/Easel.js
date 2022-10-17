import React, { useEffect } from "react";
import { buildNewColor } from "../../AuxFunctions/formatColor";
import useAppContext, { getPaneColor } from "../../AuxFunctions/useAppContext";
import "./Easel.scss";
import FormatSlider from "./FormatSlider/FormatSlider";
import HexTuner from "./Hex/HexTuner";

const FORMATS = ["hsv", "rgb", "NULL", "cmyk", "hsl"];
const CURR_COLOR_VALUE = {
  precolor: { col: undefined, format: undefined },
  color: { col: undefined, format: undefined },
};
const refreshColVal = function (setter, currCols) {
  if (
    CURR_COLOR_VALUE.precolor.col === CURR_COLOR_VALUE.color.col &&
    CURR_COLOR_VALUE.precolor.format === CURR_COLOR_VALUE.color.format
  ) {
    return;
  }
  CURR_COLOR_VALUE.precolor = { ...CURR_COLOR_VALUE.color };
  setter({
    command: "changePaneColor",
    // color: CURR_COLOR_VALUE.func(CURR_COLOR_VALUE.color, true),
    color: buildNewColor(
      CURR_COLOR_VALUE.color.format,
      CURR_COLOR_VALUE.color.col,
      currCols
    ),
  });
};

export default function () {
  const [_, setter, pane] = useAppContext();
  useEffect(() => {
    let colRefresh = undefined;
    colRefresh = setInterval(refreshColVal, 100, setter, getPaneColor(pane));
    return () => {
      clearInterval(colRefresh);
    };
  });
  return (
    <div className="tunersBox">
      <HexTuner />
      <div className="slidersBox">
        {Array.from(Array(5).keys()).map((v, vi) => (
          <FormatSlider
            key={vi}
            idx={vi}
            format={FORMATS[vi]}
            colVal={CURR_COLOR_VALUE}
          />
        ))}
      </div>
    </div>
  );
}
