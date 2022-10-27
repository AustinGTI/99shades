import React, { useEffect } from "react";
import {
  buildNewColor,
  FUNCTIONS,
  hexToCMYK,
  hexToHSL,
  hexToHSV,
  hexToRGB,
} from "../../../AuxFunctions/formatColor";
import useAppContext, {
  getPaneColor,
} from "../../../AuxFunctions/useAppContext";
import { ReactComponent as SlideBtn } from "../../../Data/Icons/Buttons/slideBtn.svg";
import "./FormatSlider.scss";

const FORMATS = {
  cmyk: [
    ["Cyan", "Magenta", "Yellow", "Black"],
    [100, 100, 100, 100],
    hexToCMYK,
    Array(4).fill(false),
  ],
  rgb: [
    ["Red", "Green", "Blue"],
    [255, 255, 255],
    hexToRGB,
    Array(3).fill(false),
  ],
  hsl: [
    ["Hue", "Saturation", "Lightness"],
    [360, 100, 100],
    hexToHSL,
    Array(3).fill(false),
  ],
  hsv: [
    ["Hue", "Saturation", "Value/Brightness"],
    [360, 100, 100],
    hexToHSV,
    Array(3).fill(false),
  ],
};

let dragTimeout = undefined;
let canDrag = true;

function sliderFuncs(data) {
  const { format, idx, col: currCol, colVal, mySlide, mySlider } = data;
  const range = FORMATS[format][1][idx];

  //function to change color value
  //drag and drop the slider
  const pickSlider = (e) => {
    FORMATS[format][3][idx] = true;
    document.querySelector("body").style.userSelect = "none";

    e.currentTarget.style.backgroundColor = "black";
  };
  const dragSlider = (e) => {
    if (!FORMATS[format][3][idx]) {
      return;
    }
    // if (!canDrag) {
    //   return;
    // }

    const bounds = mySlide.getBoundingClientRect();
    const slideWidth = mySlide.getBoundingClientRect().width;
    const sliderWidth = mySlider.getBoundingClientRect().width;
    const [l, r] = [bounds.left, bounds.right];

    const [lp, rp] = [
      Math.floor(bounds.left + sliderWidth / 2),
      Math.floor(bounds.right - sliderWidth / 2),
    ];

    if (lp <= e.clientX && e.clientX <= rp) {
      mySlider.style.left = `${parseInt(e.clientX - lp)}px`;
      //calculating the new color
      currCol[idx] = Math.round(
        ((e.clientX - lp) / (slideWidth - sliderWidth)) * range
      );

      colVal.color.col = [...currCol];
      colVal.color.format = format;
      //debugger;
      // setter({
      //   command: "changePaneColor",
      //   color: FORMATS[format][2](col, true),
      // });
    }

    // canDrag = false;
    // setTimeout(() => {
    //   canDrag = true;
    // }, 1000 / 1000);
    return;
  };
  const dropSlider = (e) => {
    if (FORMATS[format][3][idx]) {
      mySlider.style.backgroundColor = "red";
      FORMATS[format][3][idx] = false;
    }
  };
  return [pickSlider, dragSlider, dropSlider];
}

function Slider({ format, col, idx, colVal }) {
  const label = FORMATS[format][0][idx];
  const key = label.toLowerCase().split("/")[0];

  useEffect(() => {
    //set slider position
    const slide = document.querySelector(
      `.slide.${format.toLowerCase()}.${key}`
    );
    const mySlider = slide.querySelector(".slider");
    const value = col[idx];
    const range = FORMATS[format][1][idx];

    mySlider.style.left = `${Math.max(
      0,
      parseInt(
        (value / range) *
          (slide.getBoundingClientRect().width -
            mySlider.getBoundingClientRect().width)
      )
    )}px`;
    //create the background gradient
    const detail = 10;
    const gradients = Array.from(Array(detail + 1).keys()).map((v) => {
      let nVal = (v / detail) * range;
      let nCol = [...col];
      nCol[idx] = nVal;
      return FUNCTIONS[format](nCol, true);
    });
    //console.log(gradients);
    const slideGradient = `linear-gradient(to right,${gradients.join(",")})`;
    slide.style.backgroundImage = slideGradient;

    const [pick, drag, drop] = sliderFuncs({
      format,
      idx,
      col,
      colVal,
      mySlide: slide,
      mySlider,
    });

    mySlider.addEventListener("mousedown", pick);
    window.addEventListener("mouseup", drop);
    window.addEventListener("mousemove", drag);

    return () => {
      mySlider.removeEventListener("mousedown", pick);
      window.removeEventListener("mouseup", drop);
      window.removeEventListener("mousemove", drag);
    };
  });

  return (
    <div className="sliderBox">
      <p>{label}</p>
      <div className={`slide ${format.toLowerCase()} ${key}`}>
        <div className="slider">
          <SlideBtn />
        </div>
      </div>
    </div>
  );
}

export default function FormatSlider({ idx, format, colVal }) {
  const [_, st, pane] = useAppContext();
  const paneColor = getPaneColor(pane);
  //${idx === 2 ? " colorListBox" : ""}
  return (
    <div className={`formatBox`}>
      {FORMATS[format][0].map((v, vi) => (
        <Slider
          format={format}
          col={paneColor[format]}
          key={vi}
          idx={vi}
          //setter={setter}
          colVal={colVal}
        />
      ))}
    </div>
  );
}
