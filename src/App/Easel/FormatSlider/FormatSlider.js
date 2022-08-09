import React, { useEffect } from "react";
import {
  hexToCMYK,
  hexToHSL,
  hexToHSV,
  hexToRGB,
} from "../../../AuxFunctions/formatColor";
import useAppContext, {
  getPaneColor,
} from "../../../AuxFunctions/useAppContext";
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
  const { format, idx, col, setter, mySlide, mySlider } = data;
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
    const [l, r] = [bounds.left, bounds.right];

    if (
      l <= e.clientX &&
      e.clientX <= r - mySlider.getBoundingClientRect().width
    ) {
      mySlider.style.left = `${parseInt(e.clientX - l)}px`;
      //calculating the new color
      col[idx] = parseInt(
        ((e.clientX - l) /
          (mySlide.getBoundingClientRect().width -
            mySlider.getBoundingClientRect().width)) *
          range
      );

      setter({
        command: "changePaneColor",
        color: FORMATS[format][2](col, true),
      });
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

function Slider({ format, col, idx, setter }) {
  const label = FORMATS[format][0][idx];
  const key = label.toLowerCase().split("/")[0];

  useEffect(() => {
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

    const [pick, drag, drop] = sliderFuncs({
      format,
      idx,
      col,
      setter,
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
        <div className="slider"></div>
      </div>
    </div>
  );
}

export default function FormatSlider({ idx, format }) {
  const [_, setter, pane] = useAppContext();
  const paneColor = getPaneColor(pane);

  return (
    <div className={`formatBox${idx === 2 ? " colorListBox" : ""}`}>
      {idx !== 2 ? (
        FORMATS[format][0].map((v, vi) => (
          <Slider
            format={format}
            col={FORMATS[format][2](paneColor)}
            key={vi}
            idx={vi}
            setter={setter}
          />
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
}
