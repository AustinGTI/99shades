import React from "react";
import "./FormatSlider.scss";

export default function FormatSlider({ idx, format }) {
  return <div className={`formatBox${idx === 2 ? " colorListBox" : ""}`}></div>;
}
