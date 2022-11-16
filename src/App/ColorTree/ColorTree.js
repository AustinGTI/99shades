import React, {useEffect, useReducer, useState} from "react";
import "./ColorTree.scss";
import cols from "../../Data/Colors/tempColsv2.json";
import ColorBranch from "./ColorBranch";
import useAppContext from "../../AuxFunctions/useAppContext";
import {ReactComponent as SnapToBtn} from "../../Data/Icons/Buttons/snapBtn.svg";
// import {ReactComponent as ExpandBtn} from "../../Data/Icons/Buttons/expandBtn.svg";
import {ReactComponent as CollapseBtn} from "../../Data/Icons/Buttons/collapseBtn.svg";
import {ReactComponent as SearchBtn} from "../../Data/Icons/Buttons/searchBtn.svg";
import {AnimatePresence, motion} from "framer-motion";

function goToCol(treeElem, pane) {
    const paneColor = pane.getPaneColor();
    const paneCls = paneColor.cls;
    const leaf = treeElem.querySelector(`.${paneCls.join(".")}`);
    // const visElems = [leaf.parentElement];
    // while (visElems[visElems.length - 1].parentElement.id !== "tree") {
    //     visElems.push(visElems[visElems.length - 1].parentElement);
    // }
    // [leaf.querySelector(".branchLeaves"), ...visElems].forEach((v) => {
    //     if (v.classList.contains("invisible")) {
    //         v.classList.remove("invisible");
    //         v.classList.add("visible");
    //     }
    // });
    leaf
        .querySelector(
            `.leaf.${paneColor.col.toLowerCase().replaceAll(" ", "_")}`
        )
        .scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
        });
}


function createColorTree(query = null) {
    const tree = {};
    let regex = /\w+/;
    if (query !== null) {
        regex = RegExp(query, "i");
    }
    for (let col of cols) {
        let {classification, title} = col;
        if (!regex.test(title)) {
            continue;
        }
        let finBranch = tree;

        for (let [bidx, branch] of classification.entries()) {
            if (Object.keys(finBranch).indexOf(branch) === -1) {
                finBranch[branch] = bidx === classification.length - 1 ? [] : {};
            }
            finBranch = finBranch[branch];
        }

        finBranch.push(col);
    }
    return tree;
}

function setTreeState(state, action) {
    let open = action[0];
    let payload = (action.length > 1) ? action[1] : [];
    const newState = {open, payload};
    return newState;
}

export default function ColorTree() {
    let [tree, setTree] = useState(createColorTree());
    const [branchState, setBranchState] = useReducer(setTreeState, {open: false, payload: []});
    const [gt, st, pane] = useAppContext();
    useEffect(() => {
        const [snapBtn, collapseBtn, searchBtn] = document.querySelectorAll("#colorTreeCtrl > div");
        // const [snapBtn, expandBtn, collapseBtn, searchBtn] = document.querySelectorAll("#colorTreeCtrl > div");
        const searchInput = document.querySelector("#colorTreeCtrl > input");
        const treeElem = document.querySelector("#tree");


        const goToColHandler = function (e) {
            setTree(createColorTree());
            setBranchState([true, pane.getPaneColor().cls])
            setTimeout(goToCol, 100, treeElem, pane);
        };

        const openAll = function (e) {
            setBranchState([true])
        };

        const closeAll = function (e) {
            setBranchState([false]);
        };

        const searchHandler = (e) => {
            if (e.which !== 13 && e.type === "keyup") {
                return;
            }
            let searchQuery = searchInput.value;
            if (searchQuery) {
                setTree(createColorTree(searchQuery));
            } else {
                setTree(createColorTree());
            }
            setTimeout(openAll, 100, treeElem);
        }

        snapBtn.addEventListener("click", goToColHandler);
        // expandBtn.addEventListener("click", openAll);
        collapseBtn.addEventListener("click", closeAll);

        searchBtn.addEventListener("click", searchHandler);
        searchInput.addEventListener("keyup", searchHandler);

        return () => {
            snapBtn.removeEventListener("click", goToColHandler);
            // expandBtn.removeEventListener("click", openAll);
            collapseBtn.removeEventListener("click", closeAll);

            searchBtn.removeEventListener("click", searchHandler);
            searchInput.removeEventListener("keyup", searchHandler);
        };
    }, [pane]);
    return (
        <>
            <div id="colorTreeCtrl">
                {/*
        <button className="snapToActive">.</button>
        <button className="openAll">+</button>
        <button className="closeAll">,</button>
*/}
                <div className="snapBtnBox"><SnapToBtn/></div>
                {/*<div className="expandBtnBox"><ExpandBtn/></div>*/}
                <div className="collapseBtnBox"><CollapseBtn/></div>
                <input
                    type="text"
                    className="search"
                    placeholder="Write a color..."
                ></input>
                <div className="searchBtnBox"><SearchBtn/></div>
                {/*<button className="searchBtn">?</button>*/}
            </div>

            <div id="tree">
                {Object.keys(tree).length ? (
                    Object.keys(tree).map((v, vi) => (
                        <ColorBranch
                            key={vi}
                            branch={tree[v]}
                            branchName={v + "s"}
                            rootName={""}
                            treeState={branchState}
                        />
                    ))
                ) : (
                    <div>Oops!</div>
                )}
            </div>
        </>
    );
}
