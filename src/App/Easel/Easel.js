import React, {useEffect, useReducer, useRef} from "react";
import useAppContext, {getPaneColor} from "../../AuxFunctions/useAppContext";
import ColorPane from "./ColorPane/ColorPane";

import { ReactComponent as DownloadBtn } from "../../Data/Icons/Buttons/downloadBtn.svg";
import {ReactComponent as DeleteBtn} from "../../Data/Icons/Buttons/deleteBtn.svg";
import {ReactComponent as HideBtn} from "../../Data/Icons/Buttons/hideBtn.svg";
import {ReactComponent as ShowBtn} from "../../Data/Icons/Buttons/showBtn.svg";
import { ReactComponent as Logo } from "../../Data/Icons/Logos/logoV2.svg";

import "./Easel.scss";
import {hexToRGB} from "../../AuxFunctions/formatColor";

export default function Palette() {
  const [appData,setter,pane] = useAppContext();
  const easelBtnBox = useRef(null);
  const logoBox = useRef(null);

  useEffect(()=>{
      const deletePane = (e) => {
          setter({ command: "deletePane", id: pane.paneId });
      };
      const hideUnhidePane = (e) => {
          setter({command:"toggleVisible",id: pane.paneId});
      }
      const [hideBtn,deleteBtn,downloadBtn] = easelBtnBox.current.querySelectorAll("div.btn");
      deleteBtn.addEventListener("click",deletePane);
      hideBtn.addEventListener("click",hideUnhidePane);
      return ()=>{
          deleteBtn.removeEventListener("click",deletePane);
          hideBtn.removeEventListener("click",hideUnhidePane);
      }
      //pane deletion
  })

    useEffect(()=>{
        //dynamic logo
        const logoCircles = Array.from(logoBox.current.querySelectorAll("svg circle")).sort((a,b)=>b.r.baseVal.value-a.r.baseVal.value);
        logoCircles.forEach((v,vi)=>{
            if (appData.colorPanes.length > vi){
                v.style.fill=getPaneColor(appData.colorPanes[vi]).hex;
            }
            else{
                v.style.fill="transparent";
            }
        })
        let activeColor = getPaneColor(appData.colorPanes.find((v)=>v.paneId === appData.activePaneIdx));
        let nBgColor = activeColor.rgb.map(v=>parseInt(255*9/10 + v/10));
        let nBgColorHex=hexToRGB(nBgColor,true);
        document.documentElement.style.setProperty('--main-bg-color',nBgColorHex);

    },[appData]);
  /*useEffect(() => {
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
  }, [appData, setAppData]);*/
  return (
    <div className="easelBox">
      <div className="logoBox" ref={logoBox}>
        <Logo />

      </div>
        <div className={"easelBtnBox"} ref={easelBtnBox}>
           <div className={"hideBtn btn"}>
               <HideBtn/>
           </div>
            <div className={"deleteBtn btn"}>
                <DeleteBtn/>
            </div>
            <div className="downloadBtn btn">
                <DownloadBtn />
            </div>

        </div>

      {/*<div className="addRightBtn addBtn btn">
        <AddBtn />
      </div>
      <div className="addLeftBtn addBtn btn">
        <AddBtn />
      </div>*/}



      {appData.colorPanes
        .sort((a, b) => a.panePosition - b.panePosition)
        .map((v, vi) => (
          <ColorPane
            key={vi}
            pane={v}
            isLeft = {vi == 0}
            isRight = {vi == appData.colorPanes.length-1}
            isActive={appData.activePaneIdx === v.paneId}
          />
        ))}
    </div>
  );
}
