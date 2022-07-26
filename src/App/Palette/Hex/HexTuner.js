import React, {useEffect, useRef, useState} from "react";
import {buildNewColorFloat} from "../../../AuxFunctions/formatColor";
import useAppContext from "../../../AuxFunctions/useAppContext";
import "./HexTuner.scss";

//all the buttons
import {
    ReactComponent as AddBtn
} from "../../../Data/Icons/Buttons/addBtn.svg";
import {
    ReactComponent as DupLeftBtn
} from "../../../Data/Icons/Buttons/duplicateLeftBtn.svg";
import {
    ReactComponent as DupRightBtn
} from "../../../Data/Icons/Buttons/duplicateRightBtn.svg";
import {
    ReactComponent as UndoBtn
} from "../../../Data/Icons/Buttons/undoBtn.svg";
import {
    ReactComponent as RedoBtn
} from "../../../Data/Icons/Buttons/redoBtn.svg";
import {CustomTooltip} from "../../../AuxFunctions/CustomTooltip";


export default function HexTuner() {
    const [getter, setter, pane] = useAppContext();
    const ctrlBox = useRef(null);
    const paneColor = pane.getPaneColor();

    const [color, setColor] = useState(paneColor.hex);

    //change colorvalue
    function certifyColorChange(e) {
        const inputVal = e.target.value;
        if (inputVal.length === 0) {
            console.log("You cannot delete any more characters");
            return;
        }

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
            setter({
                command: "changePaneColor",
                color: buildNewColorFloat("hex", col, paneColor),
            });
        };

        inputBox.addEventListener("keyup", changeColor);
        inputBox.addEventListener("focusout", changeColor);

        return () => {
            inputBox.removeEventListener("keyup", changeColor);
            inputBox.removeEventListener("focusout", changeColor);

        };
    }, [paneColor.hex]);


    useEffect(() => {
        const [dupLeftBtn, addLeftBtn, undoBtn] = ctrlBox.current.querySelectorAll(".leftBtns > div");
        const [dupRightBtn, addRightBtn, redoBtn] = ctrlBox.current.querySelectorAll(".rightBtns > div");

        //add Pane function
        const addPaneLeft = () => {
            console.log("add left");
            setter({command: "addPane", direction: 0});
        };
        const addPaneRight = () => {
            setter({command: "addPane", direction: 1});
        };
        const undoPaneColor = (e) => {
            setter({command: "undoPaneColor", id: pane.paneId});
        };
        const redoPaneColor = (e) => {
            setter({command: "redoPaneColor", id: pane.paneId});
        };

        const duplicatePaneLeft = (e) => {
            setter({command: "addPane", direction: 0, duplicate: true});
        }

        const duplicatePaneRight = (e) => {
            setter({command: "addPane", direction: 1, duplicate: true});
        }


        //adding event listeners
        addLeftBtn.addEventListener("click", addPaneLeft);
        addRightBtn.addEventListener("click", addPaneRight);
        dupLeftBtn.addEventListener("click", duplicatePaneLeft);
        dupRightBtn.addEventListener("click", duplicatePaneRight);
        undoBtn.addEventListener("click", undoPaneColor);
        redoBtn.addEventListener("click", redoPaneColor);

        return () => {
            addLeftBtn.removeEventListener("click", addPaneLeft);
            addRightBtn.removeEventListener("click", addPaneRight);
            dupLeftBtn.removeEventListener("click", duplicatePaneLeft);
            dupRightBtn.removeEventListener("click", duplicatePaneRight);
            undoBtn.removeEventListener("click", undoPaneColor);
            redoBtn.removeEventListener("click", redoPaneColor);
        };
    }, [getter]);
    return (
        <div className={"ctrlBox"} ref={ctrlBox}>
            <div className={"leftBtns"}>
                <CustomTooltip title={"Duplicate to the Left"} placement={"bottom"}>
                    <div id={"dupBtn"}><DupLeftBtn/></div>
                </CustomTooltip>
                <CustomTooltip title={"Add to the Left"}>
                    <div id={"addBtn"}><AddBtn/></div>
                </CustomTooltip>
                <CustomTooltip title={"Undo"}>
                    <div id={"undoBtn"}><UndoBtn/></div>
                </CustomTooltip>
            </div>
            <div className="hexBox">
                <input type={"text"} value={color} onChange={certifyColorChange}></input>
            </div>
            <div className={"rightBtns"}>
                <CustomTooltip title={"Duplicate to the Right"}>
                    <div id={"dupBtn"}>
                        <DupRightBtn/>
                    </div>
                </CustomTooltip>
                <CustomTooltip title={"Add to the Right"}>
                    <div id={"addBtn"}><AddBtn/></div>
                </CustomTooltip>
                <CustomTooltip title={"Redo"}>
                    <div id={"redoBtn"}><RedoBtn/></div>
                </CustomTooltip>
            </div>
        </div>
    );
}
