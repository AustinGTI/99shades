import React, {useEffect} from "react";
import ColorDetails from "./ColorDetails";
import "./ColorPane.scss";
import useAppContext from "../../../AuxFunctions/useAppContext";
import {hexToRGB} from "../../../AuxFunctions/formatColor";
import {motion} from "framer-motion";

export default function ColorPane({pane, isRight, isLeft, isActive}) {
    const setter = useAppContext()[1];
    useEffect(() => {
        const parentPane = document.querySelector(`.colorBox.pid${pane.paneId}`);


        //set pane to active
        const paneToActive = (e) => {
            if (e.target.classList.contains("btn")) {
                return;
            }
            //calculate the background color
            setter({command: "activatePane", id: pane.paneId});
        };

        //adding event listeners
        /*deleteBtn.addEventListener("click", deletePane);
        undoBtn.addEventListener("click", undoPaneColor);
        redoBtn.addEventListener("click", redoPaneColor);

        moveBtn.addEventListener("mousedown", dragPane);
        window.addEventListener("mouseup", dropPane);*/

        parentPane.addEventListener("click", paneToActive);

        return () => {
            //removing event listeners
            /*deleteBtn.removeEventListener("click", deletePane);
            undoBtn.removeEventListener("click", undoPaneColor);
            redoBtn.removeEventListener("click", redoPaneColor);

            moveBtn.removeEventListener("mousedown", dragPane);
            window.removeEventListener("mouseup", dropPane);*/

            parentPane.removeEventListener("click", paneToActive);
        };
    }, [pane]);
    return (
        <motion.div
            className={`colorBox pid${pane.paneId} ${isLeft ? "left" : ""} ${isRight ? "right" : ""} ${isActive ? "active" : ""}`}
            initial={{width: '10px'}}
            animate={{width: '250px'}}
            // exit={{width: '0px'}}
            style={{
                backgroundColor: pane.getPaneColor().hex,
            }}
        >
            <ColorDetails pane={pane} isActive={isActive}/>
        </motion.div>
    );
}
