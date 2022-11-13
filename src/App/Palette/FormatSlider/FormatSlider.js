import React, {useEffect, useRef} from "react";
import {
    buildNewColorFloat,
    FUNCTIONS,
    hexToCMYK,
    hexToHSL,
    hexToHSV,
    hexToRGB,
} from "../../../AuxFunctions/formatColor";
import useAppContext from "../../../AuxFunctions/useAppContext";
import {ReactComponent as SlideBtn} from "../../../Data/Icons/Buttons/slideBtn.svg";
import "./FormatSlider.scss";

const FORMATS = {
    cmyk: [
        ["Cyan", "Magenta", "Yellow", "Black"],
        [100, 100, 100, 100],
        hexToCMYK,
        Array(4).fill(false),
        ["#00FFFF", "#FF00FF", "#0000FF", "#000000"]
    ],
    rgb: [
        ["Red", "Green", "Blue"],
        [255, 255, 255],
        hexToRGB,
        Array(3).fill(false),
        ["#FF0000", "#00FF00", "#0000FF"]
    ],
    hsl: [
        ["Hue", "Saturation", "Lightness"],
        [360, 100, 100],
        hexToHSL,
        Array(3).fill(false),
        null
    ],
    hsv: [
        ["Hue", "Saturation", "Value/Brightness"],
        [360, 100, 100],
        hexToHSV,
        Array(3).fill(false),
        null
    ],
};

let dragTimeout = undefined;
let canDrag = true;

function sliderFuncs(data) {
    const {format, idx, col: currCol, colVal, mySlide, mySlider} = data;
    const range = FORMATS[format][1][idx];

    //function to change color value
    //drag and drop the slider
    const pickSlider = (e) => {
        FORMATS[format][3][idx] = true;
        document.querySelector("body").style.userSelect = "none";

        // e.currentTarget.style.backgroundColor = "black";
    };
    const dragSlider = (e) => {
        if (!FORMATS[format][3][idx]) {
            return;
        }
        // if (!canDrag) {
        //   return;
        // }

        const bounds = mySlide.getBoundingClientRect();
        const slideWidth = mySlide.getBoundingClientRect().width;
        const sliderWidth = mySlider.getBoundingClientRect().width;
        const [l, r] = [bounds.left, bounds.right];

        const [lp, rp] = [
            Math.floor(bounds.left + sliderWidth / 2),
            Math.floor(bounds.right - sliderWidth / 2),
        ];

        if (lp <= e.clientX && e.clientX <= rp) {
            mySlider.style.left = `${parseInt(e.clientX - lp)}px`;
            //calculating the new color
            currCol[idx] = Math.round(
                ((e.clientX - lp) / (slideWidth - sliderWidth)) * range
            );

            colVal.color.col = [...currCol];
            colVal.color.format = format;
            //debugger;
            // setter({
            //   command: "changePaneColor",
            //   color: FORMATS[format][2](col, true),
            // });
        }

        // canDrag = false;
        // setTimeout(() => {
        //   canDrag = true;
        // }, 1000 / 1000);

    };
    const dropSlider = (e) => {
        if (FORMATS[format][3][idx]) {
            FORMATS[format][3][idx] = false;
        }
    };
    return [pickSlider, dragSlider, dropSlider];
}

function setColorChannel(format, idx, colVal, currCol) {
    const range = FORMATS[format][1][idx];
    const enterHandler = function (e) {
        if (e.which !== 13 && e.type !== "focusout") {
            return;
        }
        let nVal = e.target.value;
        console.log("cjamge jamd;er");
        if (nVal == "") {
            nVal = 0;
        } else if (isNaN(nVal)) {
            nVal = currCol[idx];
        } else if (nVal < 0) {
            nVal = 0;
        } else if (nVal > range) {
            nVal = range;
        }
        currCol[idx] = nVal;
        colVal.color.col = [...currCol];
        colVal.color.format = format;

    }

    return enterHandler;

}

function Slider({format, coltag, col, idx, colVal, direction}) {
    const label = FORMATS[format][0][idx];
    const key = label.toLowerCase().split("/")[0];
    const sliderBox = useRef(null);

    useEffect(() => {
        //set slider position
        const slide = sliderBox.current.querySelector(
            ".slide"
        );
        const mySlider = slide.querySelector(".slider");
        const channelInput = sliderBox.current.querySelector("div.slideInfo input");

        const value = col[idx];
        const range = FORMATS[format][1][idx];

        mySlider.style.left = `${Math.max(
            0,
            parseInt(
                (value / range) *
                (slide.getBoundingClientRect().width -
                    mySlider.getBoundingClientRect().width)
            )
        )}px`;
        channelInput.value = value;
        //create the background gradient
        const detail = 10;
        const gradients = Array.from(Array(detail + 1).keys()).map((v) => {
            let nVal = (v / detail) * range;
            let nCol = [...col];
            nCol[idx] = nVal;
            return FUNCTIONS[format](nCol, true);
        });
        //console.log(gradients);
        const slideGradient = `linear-gradient(to right,${gradients.join(",")})`;
        slide.style.backgroundImage = slideGradient;

        const [pick, drag, drop] = sliderFuncs({
            format,
            idx,
            col,
            colVal,
            mySlide: slide,
            mySlider,
        });
        const enterHandler = setColorChannel(format, idx, colVal, col);

        mySlider.addEventListener("mousedown", pick);
        window.addEventListener("mouseup", drop);
        window.addEventListener("mousemove", drag);

        channelInput.addEventListener("keyup", enterHandler);
        channelInput.addEventListener("focusout", enterHandler);

        return () => {
            mySlider.removeEventListener("mousedown", pick);
            window.removeEventListener("mouseup", drop);
            window.removeEventListener("mousemove", drag);

            channelInput.removeEventListener("keyup", enterHandler);
            channelInput.removeEventListener("focusout", enterHandler);


        };
    });


    return (
        <div className="sliderBox" ref={sliderBox}>
            <div className="slideInfo" style={{
                float: direction,
                display: "flex",
                flexDirection: (direction == "right") ? "row-reverse" : "row"
            }}>
                <input type={"text"} style={{width: "40px"}}/>
                <p>{label}</p>
                {(coltag === null) ? <></> : <span style={{backgroundColor: coltag[idx]}}></span>}

            </div>
            <div className={`slide ${format.toLowerCase()} ${key}`}>
                <div className="slider">
                    <SlideBtn/>
                </div>
            </div>
        </div>
    );
}

export default function FormatSlider({idx, format, colVal, direction}) {
    const [_, st, pane] = useAppContext();
    const paneColor = pane.getPaneColor();
    //${idx === 2 ? " colorListBox" : ""}
    return (
        <div className={`formatBox`}>
            {FORMATS[format][0].map((v, vi) => (
                <Slider
                    format={format}
                    col={paneColor[format]}
                    key={vi}
                    idx={vi}
                    //setter={setter}
                    colVal={colVal}
                    direction={direction}
                    coltag={FORMATS[format][4]}
                />
            ))}
        </div>
    );
}
