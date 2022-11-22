import React, {useEffect} from "react";
import ColorDetails from "./ColorDetails";
import "./ColorPane.scss";
import useAppContext from "../../../AuxFunctions/useAppContext";
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

        parentPane.addEventListener("click", paneToActive);

        return () => {
            parentPane.removeEventListener("click", paneToActive);
        };
    }, [pane]);
    return (
        <Reorder.Item value={pane} as={"li"}
                      className={`colorBox pid${pane.paneId} ${isActive ? "active" : ""}`}
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
