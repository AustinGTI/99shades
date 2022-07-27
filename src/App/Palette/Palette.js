import React, { useEffect, useReducer } from "react";
import useAppContext from "../../AuxFunctions/useAppContext";
import ColorPane from "./ColorPane/ColorPane";

import "./Palette.scss";

export default function Palette() {
  const [appData, setAppData] = useAppContext();

  useEffect(() => {
    const addLeftBtn = document.querySelector(".addLeftBtn");
    const addRightBtn = document.querySelector(".addRightBtn");

    //add Pane function
    const addPaneLeft = () => {
      console.log("add left");
      setAppData({ command: "addPane", direction: 0 });
    };
    const addPaneRight = () => {
      setAppData({ command: "addPane", direction: 1 });
    };

    //adding event listeners
    addLeftBtn.addEventListener("click", addPaneLeft);
    addRightBtn.addEventListener("click", addPaneRight);

    return () => {
      addLeftBtn.removeEventListener("click", addPaneLeft);
      addRightBtn.removeEventListener("click", addPaneRight);
    };
  }, []);
  return (
    <div className="paletteBox">
      <div className="addRightBtn addBtn btn"></div>
      <div className="addLeftBtn addBtn btn"></div>
      <div className="downloadBtn btn"></div>
      {appData.colorPanes
        .sort((a, b) => a.panePosition - b.panePosition)
        .map((v, vi) => (
          <ColorPane
            key={vi}
            pane={v}
            isActive={appData.activePaneIdx === v.paneId}
          />
        ))}
    </div>
  );
}
