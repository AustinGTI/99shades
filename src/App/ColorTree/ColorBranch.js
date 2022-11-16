import React, {useEffect, useRef, useState} from "react";
import {FUNCTIONS} from "../../AuxFunctions/formatColor";
import "./ColorBranch.scss";

import ColorLeaf from "./ColorLeaf";
import {getLighterColor, getUsableColor} from "../../AuxFunctions/filterColor";
import {AnimatePresence, motion} from "framer-motion";

function flattenBranch(branch) {
    if (Array.isArray(branch)) {
        return branch;
    }
    let leaves = [];
    for (let key in branch) {
        let nLeaves = flattenBranch(branch[key]);
        leaves = leaves.concat(nLeaves);
    }
    return leaves;
}

function calcBranchAverage(branch) {
    const flatBranch = flattenBranch(branch);
    const colSum = flatBranch.reduce(
        (t, v) => {
            let rgb = FUNCTIONS["rgb"](v.hexcode);
            return t.map((va, vai) => va + rgb[vai]);
        },
        [0, 0, 0]
    );
    return colSum.map((v) => parseInt(v / flatBranch.length));
}

function showHideElem(elem, showhide = null) {
    if (showhide == null || showhide) {
        if (elem.classList.contains("invisible")) {
            elem.classList.remove("invisible");
            elem.classList.add("visible");
        }
    }
    if (showhide == null || !showhide) {
        if (elem.classList.contains("visible")) {
            elem.classList.remove("visible");
            elem.classList.add("invisible");
        }
    }
}

export default function ColorBranch(params) {
    const {branch, branchName, rootName, treeState} = params;
    const branchContainer = useRef(null);
    const [iamVisible, setVisible] = useState(false);
    const [leavesVisible, setLeavesVisible] = useState(false);
    const [inFocus, setInFocus] = useState(false);
    let branchClasses = `${branchName} ${rootName}`;
    const avgCol = calcBranchAverage(branch);
    const avgColRGB = `rgb(${avgCol.join(',')})`;
    const avgColBg = getLighterColor('rgb', avgCol, 95);
    // console.log(avgColBg);
    branchClasses = branchClasses.slice(0, branchClasses.length - 2);

    useEffect(() => {
        const branchRoot = branchContainer.current.querySelector(
            "div.branchRoot"
        );


        const observeCallback = function (entries, observer) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.log(branchClasses, " Houston we have intersection");
                    setLeavesVisible(true);
                } else {
                    setLeavesVisible(false);
                }
            })
        }
        let observer = new IntersectionObserver(observeCallback, {
            threshold: 0,
            root: document.querySelector(".treeBox")
        });
        observer.observe(branchContainer.current.querySelector("div.branchLeaves"));


        const clickBloom = (e) => {
            // if (branchLeaves.classList.contains("visible")) {
            //     //set every child to invisible
            //     branchLeaves.querySelectorAll(".visible").forEach((v) => {
            //         showHideElem(v, false);
            //     });
            //     showHideElem(branchLeaves, false);
            //     setVisible(false);
            // } else {
            //     showHideElem(branchLeaves, true);
            //     setVisible(true);
            // }
            setVisible(!iamVisible);
        };

        branchRoot.addEventListener("click", clickBloom);
        return () => {
            branchRoot.removeEventListener("click", clickBloom);
        };
    }, [iamVisible]);
    useEffect(() => {
        branchContainer.current.style.setProperty('--avg-branch-color', avgColBg);
    });
    useEffect(() => {
        if (treeState.open) {
            if ((treeState.payload.length === 0)) {
                setVisible(true);
                setInFocus(false)
            } else if (!treeState.payload.includes(branchClasses.split(" ")[0])) {

                setInFocus(false)
            } else if (treeState.payload.includes(branchClasses.split(" ")[0])) {
                setVisible(true);
                setInFocus(true);
            }
        } else {
            setVisible(false);
            setInFocus(false)
        }
    }, [treeState])

    return (
        <motion.div
            // initial={{height: 0, opacity: 0}}
            // animate={{height: 'fit-content', opacity: 1}}
            // exit={{height: 0, opacity: 0}}
            className={`branchContainer ${branchClasses}`}
            ref={branchContainer}
            style={{
                //       boxShadow: `${4 - Object.keys(parentInfo).length}px ${4 - Object.keys(parentInfo).length}px
                // ${7 - Object.keys(parentInfo).length * 2}px
                //  var(--dark-bg-color), -${4 - Object.keys(parentInfo).length}px
                //    -${4 - Object.keys(parentInfo).length}px
                //      ${7 - Object.keys(parentInfo).length * 2}px var(--light-bg-color)`,
            }}
        >
            <div className="branchRoot">
                <div className="btnDiv climbDiv">
                    {/* {Object.keys(parentInfo)
            .filter((v) => v != avgCol)
            .map((v, vi) => (
              <div
                className="btn climbBtn"
                style={{ backgroundColor: v }}
                key={vi}
                onClick={(e) =>
                  showHideElem(
                    parentInfo[v].current.querySelector(".branchLeaves"),
                    false
                  )
                }
                //onClick={(e) => console.log(parentInfo[v].current)}
              ></div>
            ))} */}
                </div>
                <div className="colTag" style={{backgroundColor: avgColRGB}}></div>

                <p>
                    {branchName} {rootName}
                </p>
                {/*
        <div className="btnDiv dropDiv">
          {Array(3)
            .fill(true)
            .map((v, vi) => (
              <div key={vi} className="btn dropBtn"></div>
            ))}
        </div>
*/}
            </div>
            {/*    <div className="branchLeaves">*/}
            {/*        {(iamVisible) ? (!Array.isArray(branch)*/}
            {/*            ? Object.keys(branch).map((v, vi) => (*/}
            {/*                <ColorBranch*/}
            {/*                    key={vi}*/}
            {/*                    branch={branch[v]}*/}
            {/*                    branchName={v}*/}
            {/*                    rootName={branchName + " " + rootName}*/}
            {/*                    treeState={treeState}*/}
            {/*                />*/}
            {/*            ))*/}
            {/*            : branch.map(({title, hexcode}, vi) => (*/}
            {/*                <ColorLeaf key={vi} title={title} hex={hexcode}/>*/}
            {/*            ))) : <></>}*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="branchLeaves">
                <AnimatePresence initial={false}>
                    {(iamVisible) ? (!Array.isArray(branch)
                        ? Object.keys(branch).map((v, vi) => (
                            <ColorBranch
                                key={vi}
                                branch={branch[v]}
                                branchName={v}
                                rootName={branchName + " " + rootName}
                                treeState={treeState}
                            />
                        ))
                        : branch.map(({title, hexcode}, vi) => (
                            (leavesVisible || inFocus) ? <ColorLeaf key={vi} title={title} hex={hexcode}/> :
                                <div key={vi} style={{height: "50px", width: "100%", margin: "3px 0"}}></div>
                        ))) : <></>}</AnimatePresence>
            </div>
        </motion.div>
    );
}
