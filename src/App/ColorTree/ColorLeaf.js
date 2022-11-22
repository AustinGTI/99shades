import React, {useEffect, useRef} from "react";
import "./ColorLeaf.scss";
import useAppContext from "../../AuxFunctions/useAppContext";
import {buildNewColorFloat} from "../../AuxFunctions/formatColor";
import {getContrastColor} from "../../AuxFunctions/filterColor";
import {AnimatePresence, motion} from "framer-motion";

export default function ColorLeaf(params) {
    const {title, hex, index, total} = params;
    const leaf = useRef(null);
    const [_, setter, pane] = useAppContext();
    const paneColor = pane.getPaneColor();
    const leafAnimDuration = 0.5 / total;
    useEffect(() => {
        const txtColor = getContrastColor("hex", hex, 40);
        const changeColor = (e) => {
            // console.log(hex);
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
    }, [title, leaf]);
    return (
        <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: 'fit-content', opacity: 1}}
            exit={{
                height: 0, margin: 0, opacity: 0,
                transition: {
                    height: {
                        delay: (total - index) * leafAnimDuration + 0.1,
                        duration: leafAnimDuration
                    },
                    opacity: {
                        delay: (total - index) * leafAnimDuration,
                        duration: leafAnimDuration
                    },
                    margin: {
                        delay: (total - index) * leafAnimDuration + 0.1,
                        duration: leafAnimDuration
                    }
                }
            }}
            transition={{
                height: {
                    delay: index * leafAnimDuration,
                    duration: leafAnimDuration
                },
                opacity: {
                    delay: index * leafAnimDuration + 0.1,
                    duration: leafAnimDuration
                }
            }}
            className={`leaf ${title.toLowerCase().replaceAll(" ", "_")} ${
                paneColor.col == title ? "active" : ""
            }`}
            // style={{ backgroundColor: hex, color: txtColor }}
            ref={leaf}
        >

            <p>{title}</p>
        </motion.div>
    );
}
