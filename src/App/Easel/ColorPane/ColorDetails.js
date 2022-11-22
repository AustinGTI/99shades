import React, {useEffect, useRef, useState} from "react";
import "./ColorDetails.scss";
import useAppContext from "../../../AuxFunctions/useAppContext";
import {ReactComponent as CopyValueBtn} from "../../../Data/Icons/Buttons/copyValueBtn.svg";
import {ReactComponent as ConfirmCopyBtn} from "../../../Data/Icons/Buttons/confirmCopyBtn.svg";
import {motion} from "framer-motion";
import {getContrastColor} from "../../../AuxFunctions/filterColor";
import {CustomTooltip} from "../../../AuxFunctions/CustomTooltip";


function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text);
}

function ColorDetail({format, value}) {
    const doNotLabel = ["col", "cls"];
    const copyValueBtn = useRef(null);
    const [hasCopied, setCopied] = useState(false);
    useEffect(() => {
        const copyBtn = copyValueBtn.current;
        const copyFunc = (e) => {
            copyTextToClipboard(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 5000);
        }
        if (copyBtn) {
            copyBtn.addEventListener("click", copyFunc);
            return () => {
                copyBtn.removeEventListener("click", copyFunc);
            }
        }
    }, [])
    return (
        <div className={"colorDetailBox"}>
            {(!doNotLabel.includes(format)) ? <div className={"detailFormatBox"}>{format}</div> : <></>}
            <div className={"detailValueBox"}><span>{(Array.isArray(value)) ? value.join(',') : value}</span>
                {(doNotLabel.includes(format)) ||
                    <div ref={copyValueBtn} className={"copyValueBox"}>
                        <CustomTooltip
                            title={hasCopied ? `${format.toUpperCase()} Value Copied` : `Copy ${format.toUpperCase()} Value`}
                            placement="right">
                            <CopyValueBtn/>
                        </CustomTooltip>
                        {hasCopied ? <ConfirmCopyBtn/> : <></>}
                    </div>}
            </div>
        </div>
    )
}

export default function ColorDetails({pane, isActive}) {
    let formats = pane.getPaneColor();
    let detailVisible = useAppContext()[0].colorDetailVisible;
    let formatKeys = Object.keys(formats).filter((v) => v !== "cls");
    let emphasis = isActive ? 40 : 20;
    let fontColor = getContrastColor("hsl", formats.hsl, emphasis);
    const colDetailsBox = useRef(null);
    useEffect(() => {
        const appBox = document.querySelector(".appBg > .appBox");

        if (isActive) {
            appBox.style.setProperty("--primary-active-color", formats.hex);
            appBox.style.setProperty("--secondary-active-color", fontColor);
        }

        colDetailsBox.current.parentElement.parentElement.style.setProperty(
            "--primary-color",
            formats.hex
        );
        colDetailsBox.current.parentElement.parentElement.style.setProperty(
            "--secondary-color",
            fontColor
        );
        colDetailsBox.current.parentElement.parentElement.style.setProperty(
            "--alternate-color",
            fontColor
        );
    }, [isActive, formats, colDetailsBox]);

    return (
        <>
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {delay: 0}}}
                        transition={{delay: 0.3}} style={{width: '100%'}}>
                <div className={`colorDetailsBox ${detailVisible ? "visible" : "hidden"}`} ref={colDetailsBox}>
                    {formatKeys.map((v, vi) => (
                        <ColorDetail key={vi} value={formats[v]} format={v}/>
                    ))}
                </div>
            </motion.div>
        </>
    );
}
