import React, {useEffect, useRef} from "react";
import "./ColorLeaf.scss";
import useAppContext from "../../AuxFunctions/useAppContext";
import {buildNewColorFloat} from "../../AuxFunctions/formatColor";
import {getContrastColor} from "../../AuxFunctions/filterColor";

export default function ColorLeaf(params) {
    const {title, hex, parentVisible} = params;
    const leaf = useRef(null);
    const [_, setter, pane] = useAppContext();
    const paneColor = pane.getPaneColor();
    useEffect(() => {
        const txtColor = getContrastColor("hex", hex, 40);
        const changeColor = (e) => {
            console.log(hex);
            setter({
                command: "changePaneColor",
                color: buildNewColorFloat("hex", hex, paneColor),
            });
        };
        leaf.current.addEventListener("click", changeColor);
        leaf.current.style.setProperty('--leaf-primary-color', hex);
        leaf.current.style.setProperty('--leaf-secondary-color', txtColor);
        return () => {
            if (leaf.current !== null) {
                leaf.current.removeEventListener("click", changeColor);
            }
        };
    }, [paneColor, leaf]);
    return (
        <div
            className={`leaf ${title.toLowerCase().replaceAll(" ", "_")} ${
                paneColor.col == title ? "active" : ""
            }`}
            // style={{ backgroundColor: hex, color: txtColor }}
            ref={leaf}
        >
            <div className="tag"></div>
            <p>{title}</p>
        </div>
    );
}
