import React, { useEffect } from "react";
import ColorDetails from "./ColorDetails";
import "./ColorPane.scss";
import useAppContext, {
  getPaneColor,
} from "../../../AuxFunctions/useAppContext";

export default function ColorPane({ pane, isActive }) {
  const setter = useAppContext()[1];
  useEffect(() => {
    const parentPane = document.querySelector(`.colorBox.pid${pane.paneId}`);

    //pane positions

    /*let deleteBtn = parentPane.querySelector(".deleteBtn");
    let undoBtn = parentPane.querySelector(".undoBtn");
    let redoBtn = parentPane.querySelector(".redoBtn");
    let moveBtn = parentPane.querySelector(".moveBtn");*/

    //is the pane being dragged
    let isDragging = false;

    //wrapped setter function


    /*
    const undoPaneColor = (e) => {
      setter({ command: "undoPaneColor", id: pane.paneId });
    };
    const redoPaneColor = (e) => {
      setter({ command: "redoPaneColor", id: pane.paneId });
    };

    //drag and drop the pane
    const dragPane = (e) => {
      isDragging = true;
      parentPane.style.userSelect = "none";

      e.currentTarget.style.backgroundColor = "black";
    };
    const dropPane = (e) => {
      if (isDragging) {
        //get pane positions
        const allPanes = document.querySelectorAll(".colorBox");

        let panePositions = Array.from(allPanes)
          .filter((v) => v !== parentPane)
          .map(
            (v) =>
              v.getBoundingClientRect().x + v.getBoundingClientRect().width / 2
          );

        //make sure the panes are sorted least to most
        if (panePositions !== panePositions.sort((a, b) => a - b)) {
          throw Error("this should not be happening");
        }
        //change pane position
        let nPanePosition = e.pageX;
        panePositions.push(nPanePosition);
        panePositions.sort((a, b) => a - b);
        let nPaneIndex = panePositions.findIndex((v) => v === nPanePosition);

        parentPane.style.userSelect = "text";
        moveBtn.style.backgroundColor = "white";
        isDragging = false;
        setter({
          command: "movePane",
          nposition: nPaneIndex,
          id: pane.paneId,
        });
      }
    };*/

    //set pane to active
    const paneToActive = (e) => {
      if (e.target.classList.contains("btn")) {
        return;
      }
      setter({ command: "activatePane", id: pane.paneId });
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
    <div
      className={`colorBox pid${pane.paneId}`}
      style={{
        backgroundColor: getPaneColor(pane).hex,
      }}
    >
      <ColorDetails pane={pane} isActive={isActive} />
    </div>
  );
}
