import React, { useEffect, useState } from "react";
import useAppContext, {
  getPaneColor,
} from "../../../AuxFunctions/useAppContext";
import "./HexTuner.scss";

const hexChars = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F".split(",");

export default function HexTuner({ pane, setter }) {
  const [color, setColor] = useState(getPaneColor(pane));
  // const colorPane = getter.colorPanes.find(v => v.paneId === getter.activePaneIdx);
  //change colorvalue
  function certifyColorChange(e) {
    const inputVal = e.target.value;
    const nChar = inputVal[inputVal.length - 1].toUpperCase();
    if (!hexChars.includes(nChar)) {
      console.log("That is not a valid hex character");
      return;
    }
    if (inputVal.length >= 8) {
      console.log("Those are too many characters for a hex code..");
      return;
    }
    console.log(nChar);
    setColor(inputVal.toUpperCase());
  }

  useEffect(() => {
    const inputBox = document.querySelector(".hexBox > input");
    setColor(getPaneColor(pane));

    //function that permanently changes color
    const changeColor = (e) => {
      if (e.which !== 13) {
        return;
      }
      let col = e.target.value;
      //checking if value is consistent
      setter({ command: "changePaneColor", color: col });
    };

    inputBox.addEventListener("keyup", changeColor);

    return () => {
      inputBox.removeEventListener("keyup", changeColor);
    };
  });
  return (
    <div className="hexBox">
      <input type={"text"} value={color} onChange={certifyColorChange}></input>
    </div>
  );
}
