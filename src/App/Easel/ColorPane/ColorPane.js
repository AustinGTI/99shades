import React, {useEffect} from "react";
import ColorDetails from "./ColorDetails";
import "./ColorPane.scss";
import useAppContext from "../../../AuxFunctions/useAppContext";
import {hexToRGB} from "../../../AuxFunctions/formatColor";
import {Reorder} from "framer-motion";

export default function ColorPane({pane, isActive}) {
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
        <Reorder.Item value={pane} as={"li"}
                      className={`colorBox pid${pane.paneId} ${isActive ? "active" : ""}`}
            // initial={{width: '10px'}}
            // animate={{width: '250px'}}
            // exit={{width: '10px'}}
                      initial={{
                          // opacity: 0,
                          width: '0px'
                      }}
                      animate={{
                          // opacity: 1,
                          width: '250px',
                      }}
                      exit={{
                          // opacity: 0,
                          width: '0px',
                          transition: {delay: 0.2, ease: "easeInOut"}
                      }}
                      transition={{
                          duration: 0.3,
                          ease: "easeOut"
                      }}
                      style={{
                          backgroundColor: pane.getPaneColor().hex,
                          width: '250px',
                      }}
        >
            <ColorDetails pane={pane} isActive={isActive}/>
        </Reorder.Item>
    );
}
