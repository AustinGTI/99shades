import React, { useEffect } from "react";
import {
  hexToCMYK,
  hexToHSL,
  hexToHSV,
  hexToRGB,
} from "../../../AuxFunctions/formatColor";
import { getPaneColor } from "../../../AuxFunctions/useAppContext";
import "./FormatSlider.scss";

const FORMATS = {
  cmyk: [
    ["Cyan", "Magenta", "Yellow", "Black"],
    [100, 100, 100, 100],
    hexToCMYK,
  ],
  rgb: [["Red", "Green", "Blue"], [255, 255, 255], hexToRGB],
  hsl: [["Hue", "Saturation", "Lightness"], [360, 100, 100], hexToHSL],
  hsv: [["Hue", "Saturation", "Value/Brightness"], [360, 100, 100], hexToHSV],
};

function Slider({ format, label, range, value }) {
  console.log(format, label, value, range, label.split("/")[0].toLowerCase());
  useEffect(() => {
    const mySlide = document.querySelector(
      `.slide.${format.toLowerCase()}.${label.split("/")[0].toLowerCase()}`
    );
    const mySlider = mySlide.querySelector(".slider");
    let isDragging = false;

    mySlider.style.left = `${Math.max(
      0,
      parseInt(
        (value / range) * mySlide.getBoundingClientRect().width -
          mySlider.getBoundingClientRect().width
      )
    )}px`;

    //function to change color value
    //drag and drop the slider
    const dragSlider = (e) => {
      isDragging = true;
      document.querySelector("body").style.userSelect = "none";

      e.currentTarget.style.backgroundColor = "black";
    };
    const dropSlider = (e) => {
      if (isDragging) {
        mySlider.style.backgroundColor = "red";
        isDragging = false;
      }
    };
    //.............................................

    mySlider.addEventListener("mousedown", dragSlider);
    window.addEventListener("mouseup", dropSlider);

    return () => {
      mySlider.addEventListener("mousedown", dragSlider);
      window.addEventListener("mouseup", dropSlider);
    };
  });
  return (
    <div className="sliderBox">
      <p>{label}</p>
      <div
        className={`slide ${format.toLowerCase()} ${label
          .split("/")[0]
          .toLowerCase()}`}
      >
        <div className="slider"></div>
      </div>
    </div>
  );
}

export default function FormatSlider({ idx, format, pane, setter }) {
  const paneColor = getPaneColor(pane);

  return (
    <div className={`formatBox${idx === 2 ? " colorListBox" : ""}`}>
      {idx !== 2 ? (
        FORMATS[format][0].map((v, vi) => (
          <Slider
            format={format}
            label={v}
            value={FORMATS[format][2](paneColor)[vi]}
            range={FORMATS[format][1][vi]}
            key={vi}
          />
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
}
