import React, {useEffect, useState, useRef} from "react";
import useAppContext from "../../AuxFunctions/useAppContext";
import ColorPane from "./ColorPane/ColorPane";

import {ReactComponent as DownloadBtn} from "../../Data/Icons/Buttons/downloadBtn.svg";
import {ReactComponent as DeleteBtn} from "../../Data/Icons/Buttons/deleteBtn.svg";
import {ReactComponent as HideBtn} from "../../Data/Icons/Buttons/hideBtn.svg";
import {ReactComponent as ShowBtn} from "../../Data/Icons/Buttons/showBtn.svg";
import {ReactComponent as Logo} from "../../Data/Icons/Logos/logoV2.svg";

import "./Easel.scss";
import {hexToHSL, hexToRGB} from "../../AuxFunctions/formatColor";
import {AnimatePresence} from "framer-motion";
import {Reorder} from "framer-motion";


function ColorPanes({appData, setter}) {
    const reorderPanes = function (newPanes) {
        setter({command: "reorderPanes", newPanes});
        console.log(newPanes.map(v => v.getPaneColor().col));
    }
    return <Reorder.Group className={"easelPaneBox"} values={appData.colorPanes} as="ul" axis={"x"}
                          onReorder={reorderPanes} onPan={(e, info) => console.log(info.offset.x)}>
        <AnimatePresence initial={false}>
            {appData.colorPanes.map((pane, pi) => {
                return <ColorPane
                    key={pane.paneId}
                    pane={pane}
                    // isLeft={pi == 0}
                    // isRight={pi == appData.colorPanes.length - 1}
                    isActive={appData.activePaneIdx === pane.paneId}
                />
            })}
        </AnimatePresence>
    </Reorder.Group>
}


export default function Palette() {
    const [appData, setter, pane] = useAppContext();


    const easelBtnBox = useRef(null);
    const logoBox = useRef(null);
    console.log("rerender");
    useEffect(() => {
        const deletePane = (e) => {
            setter({command: "deletePane", id: pane.paneId});
        };
        const hideUnhidePane = (e) => {
            setter({command: "toggleVisible", id: pane.paneId});
        };
        const [hideBtn, deleteBtn, downloadBtn] = easelBtnBox.current.querySelectorAll("div.btn");
        deleteBtn.addEventListener("click", deletePane);
        hideBtn.addEventListener("click", hideUnhidePane);
        return () => {
            deleteBtn.removeEventListener("click", deletePane);
            hideBtn.removeEventListener("click", hideUnhidePane);
        }
        //pane deletion
    });

    useEffect(() => {
        //dynamic logo
        const logoCircles = Array.from(logoBox.current.querySelectorAll("svg circle")).sort((a, b) => b.r.baseVal.value - a.r.baseVal.value);
        logoCircles.forEach((v, vi) => {
            if (appData.colorPanes.length > vi) {
                v.style.fill = appData.colorPanes[vi].getPaneColor().hex;
            } else {
                v.style.fill = "transparent";
            }
        });
        let activeColor = appData.colorPanes.find((v) => v.paneId === appData.activePaneIdx).getPaneColor();
        let nBgColor = activeColor.rgb.map(v => parseInt(255 * 9 / 10 + v / 10));
        let bgDarkHex = hexToRGB(nBgColor.map(v => parseInt(v * 0.94)), true);
        let bgLightHex = hexToRGB(nBgColor.map(v => Math.max(0, parseInt(v * 1.06))), true);
        let nBgColorHex = hexToRGB(nBgColor, true);
        let btnBgColor = `rgba(${activeColor.rgb.join(',')},0.1)`;
        let btnFillColor = hexToHSL(activeColor.hsl.map((v, vi) => (vi === 2) ? 50 : v), true);

        // console.log(nBgColor, bgDarkHex, bgLightHex, btnBgColor, btnFillColor);
        document.documentElement.style.setProperty('--main-bg-color', nBgColorHex);
        document.documentElement.style.setProperty('--dark-bg-color', bgDarkHex);
        document.documentElement.style.setProperty('--light-bg-color', bgLightHex);
        document.documentElement.style.setProperty('--btn-bg-color', btnBgColor);
        document.documentElement.style.setProperty('--btn-fill-color', btnFillColor);

    }, [appData, appData.colorPanes.length]);

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
                <Logo/>

            </div>
            <div className={"easelBtnBox"} ref={easelBtnBox}>
                <div className={"hideBtn btn"}>
                    {appData.colorDetailVisible ? <HideBtn/> : <ShowBtn/>}
                </div>
                <div className={"deleteBtn btn"}>
                    <DeleteBtn/>
                </div>
                <div className="downloadBtn btn">
                    <DownloadBtn/>
                </div>

            </div>

            {/*<div className="addRightBtn addBtn btn">
        <AddBtn />
      </div>
      <div className="addLeftBtn addBtn btn">
        <AddBtn />
      </div>*/}


            {/*{appdata.colorpanes*/}
            {/*    .sort((a, b) => a.paneposition - b.paneposition)*/}
            {/*    .map((v, vi) => (*/}
            {/*        <colorpane*/}
            {/*            key={vi}*/}
            {/*            pane={v}*/}
            {/*            isleft={vi == 0}*/}
            {/*            isright={vi == appdata.colorpanes.length - 1}*/}
            {/*            isactive={appdata.activepaneidx === v.paneid}*/}
            {/*        />*/}
            {/*    ))}*/}
            {/*{<AnimatePresence>*/}
            {/*    {Array.from(Array(5).keys()).map(*/}
            {/*        (v) => {*/}
            {/*            const pane = appData.colorPanes.find(p => p.panePosition === v);*/}
            {/*            return ((pane) && (pane.paneAlive) &&*/}
            {/*                <ColorPane*/}
            {/*                    key={v}*/}
            {/*                    pane={pane}*/}
            {/*                    isLeft={v == 0}*/}
            {/*                    isRight={v == appData.colorPanes.length - 1}*/}
            {/*                    isActive={appData.activePaneIdx === pane.paneId}*/}
            {/*                />);*/}
            {/*        }*/}
            {/*    )}</AnimatePresence>*/}
            <ColorPanes appData={appData} setter={setter}/>

        </div>
    );
}
