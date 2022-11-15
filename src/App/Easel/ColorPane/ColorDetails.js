import React, {useEffect, useRef} from "react";
import "./ColorDetails.scss";
import useAppContext from "../../../AuxFunctions/useAppContext";
import formatColor from "../../../AuxFunctions/formatColor";
import {ReactComponent as UndoBtn} from "../../../Data/Icons/Buttons/undoBtn.svg";
import {ReactComponent as RedoBtn} from "../../../Data/Icons/Buttons/redoBtn.svg";
import {ReactComponent as DeleteBtn} from "../../../Data/Icons/Buttons/deleteBtn.svg";
import {ReactComponent as MoveBtn} from "../../../Data/Icons/Buttons/moveBtn.svg";
import {motion} from "framer-motion";
import {getContrastColor} from "../../../AuxFunctions/filterColor";

function cleanFormats(format, value) {
    if (["rgb", "hsv", "hsl", "cmyk"].includes(format)) {
        return `${format}(${value.join(",")})`;
    }
    return value;
}


function ColorDetail({format, value}) {
    const doNotLabel = ["col", "cls"];
    return (
        <div className={"colorDetailBox"}>
            {(!doNotLabel.includes(format)) ? <div className={"detailFormatBox"}>{format}</div> : <></>}
            <div className={"detailValueBox"}>{(Array.isArray(value)) ? value.join(',') : value}</div>
        </div>
    )
}

export default function ColorDetails({pane, isActive}) {
    let formats = pane.getPaneColor();
    let detailVisible = useAppContext()[0].colorDetailVisible;
    let formatKeys = Object.keys(formats).filter((v) => v !== "cls");
    let emphasis = isActive ? 40 : 20;
    let fontColor = getContrastColor("hsl", formats.hsl, emphasis);
    let hoverColor = getContrastColor("hsl", formats.hsl, 50);
    // formats.hsl[2] > 50
    //   ? [
    //       formats.hsl[0],
    //       formats.hsl[1].toString() + "%",
    //       (formats.hsl[2] - emphasis).toString() + "%",
    //     ]
    //   : [
    //       formats.hsl[0],
    //       formats.hsl[1].toString() + "%",
    //       (formats.hsl[2] + emphasis).toString() + "%",
    //     ];
    const colDetailsBox = useRef(null);
    useEffect(() => {
        const appBox = document.querySelector(".appBg > .appBox");

        if (isActive) {
            appBox.style.setProperty("--primary-active-color", formats.hex);
            appBox.style.setProperty("--secondary-active-color", fontColor);
        }

        colDetailsBox.current.parentElement.style.setProperty(
            "--primary-color",
            formats.hex
        );
        colDetailsBox.current.parentElement.style.setProperty(
            "--secondary-color",
            fontColor
        );
        colDetailsBox.current.parentElement.style.setProperty(
            "--alternate-color",
            fontColor
        );
    }, [isActive, formats, colDetailsBox]);

    return (
        <>
            {/*<motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}*/}
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                        className={`colorDetailsBox ${detailVisible ? "visible" : "hidden"}`} ref={colDetailsBox}>
                {/*<div className="btn panelBtn moveBtn">
          <MoveBtn />
        </div>*/}
                {formatKeys.map((v, vi) => (
                    // <div className="format" key={vi}>
                    //   <span>{cleanFormats(v, formats[v])}</span>
                    // </div>
                    <ColorDetail key={vi} value={formats[v]} format={v}/>
                ))}

            </motion.div>
        </>
    );
}
