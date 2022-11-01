import React, { useEffect, useState } from "react";
import { buildNewColor } from "../../../AuxFunctions/formatColor";
import useAppContext, {
  getPaneColor,
} from "../../../AuxFunctions/useAppContext";
import "./HexTuner.scss";

//all the buttons
import {ReactComponent as AddBtn
} from "../../../Data/Icons/Buttons/addBtn.svg";
import {ReactComponent as MoveLeftBtn
} from "../../../Data/Icons/Buttons/moveLeftBtn.svg";
import {ReactComponent as MoveRightBtn
} from "../../../Data/Icons/Buttons/moveRightBtn.svg";
import {ReactComponent as DupLeftBtn
} from "../../../Data/Icons/Buttons/duplicateLeftBtn.svg";
import {ReactComponent as DupRightBtn
} from "../../../Data/Icons/Buttons/duplicateRightBtn.svg";
import {ReactComponent as UndoBtn
} from "../../../Data/Icons/Buttons/undoBtn.svg";
import {ReactComponent as RedoBtn
} from "../../../Data/Icons/Buttons/redoBtn.svg";


export default function HexTuner() {
  const [_, setter, pane] = useAppContext();
  const paneColor = getPaneColor(pane);

  const [color, setColor] = useState(paneColor.hex);
  // const colorPane = getter.colorPanes.find(v => v.paneId === getter.activePaneIdx);
  //change colorvalue
  function certifyColorChange(e) {
    const inputVal = e.target.value;
    if (inputVal.length === 0) {
      console.log("You cannot delete any more characters");
      return;
    }

    //const nChar = inputVal[inputVal.length - 1].toUpperCase();
    if (/[^0123456789ABCDEF]/gi.test(inputVal.slice(1))) {
      console.log("That is not a valid hex character");
      return;
    }
    if (inputVal.length >= 8) {
      console.log("Those are too many characters for a hex code..");
      return;
    }

    setColor(inputVal.toUpperCase());
  }

  useEffect(() => {
    const inputBox = document.querySelector(".hexBox > input");
    setColor(paneColor.hex);

    //function that permanently changes color
    const changeColor = (e) => {
      if (e.which !== 13 && e.type !== "focusout") {
        return;
      }
      let col = e.target.value;
      if (col.length > 7) {
        return;
      } else if (col.length < 7) {
        col += "0".repeat(7 - col.length);
      }
      //checking if value is consistent
      setter({
        command: "changePaneColor",
        color: buildNewColor("hex", col, paneColor),
      });
    };

    inputBox.addEventListener("keyup", changeColor);
    inputBox.addEventListener("focusout", changeColor);

    return () => {
      inputBox.removeEventListener("keyup", changeColor);
      inputBox.removeEventListener("focusout", changeColor);

    };
  }, [paneColor.hex]);
  return (
      <div className={"ctrlBox"}>
        <div className={"leftBtns"}>
          <div id={"dupBtn"}><DupLeftBtn/></div>
          <div id={"addBtn"}><AddBtn/></div>
          <div id={"moveBtn"}><MoveLeftBtn/></div>
          <div id={"undoBtn"}><UndoBtn/></div>
        </div>
    <div className="hexBox">
      <input type={"text"} value={color} onChange={certifyColorChange}></input>
    </div>
        <div className={"rightBtns"}>
          <div id={"redoBtn"}><RedoBtn/></div>
          <div id={"moveBtn"}><MoveRightBtn/></div>
          <div id={"addBtn"}><AddBtn/></div>
          <div id={"dupBtn"}><DupRightBtn/></div>
        </div>
      </div>
  );
}
