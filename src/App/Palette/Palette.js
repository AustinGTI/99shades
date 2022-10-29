import React, { useEffect, useReducer } from "react";
import useAppContext from "../../AuxFunctions/useAppContext";
import ColorPane from "./ColorPane/ColorPane";

import { ReactComponent as AddBtn } from "../../Data/Icons/Buttons/addBtn.svg";
import { ReactComponent as DownloadBtn } from "../../Data/Icons/Buttons/downloadBtn.svg";
import { ReactComponent as Logo } from "../../Data/Icons/Logos/logoV1.svg";

import "./Palette.scss";

export default function Palette() {
  const [appData, setAppData] = useAppContext();

  useEffect(() => {
    const addLeftBtn = document.querySelector(".addLeftBtn");
    const addRightBtn = document.querySelector(".addRightBtn");
    const panes = document.querySelectorAll("div.colorBox");

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
  }, [appData, setAppData]);
  return (
    <div className="paletteBox">
      <div className="logoBox">
        <Logo />
      </div>
      <div className="addRightBtn addBtn btn">
        <AddBtn />
      </div>
      <div className="addLeftBtn addBtn btn">
        <AddBtn />
      </div>
      <div className="downloadBtn btn">
        <DownloadBtn />
      </div>
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
