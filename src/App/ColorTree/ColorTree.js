import React, {useEffect, useReducer, useState} from "react";
import "./ColorTree.scss";
import cols from "../../Data/Colors/tempColsv2.json";
import ColorBranch from "./ColorBranch";
import useAppContext from "../../AuxFunctions/useAppContext";
import {ReactComponent as SnapToBtn} from "../../Data/Icons/Buttons/snapBtn.svg";
import {ReactComponent as CollapseBtn} from "../../Data/Icons/Buttons/collapseBtn.svg";
import {ReactComponent as SearchBtn} from "../../Data/Icons/Buttons/searchBtn.svg";
import {CustomTooltip} from "../../AuxFunctions/CustomTooltip";
import {ReactComponent as CancelSearchBtn} from "../../Data/Icons/Buttons/cancelSearchBtn.svg";

function goToCol(treeElem, pane) {
    const paneColor = pane.getPaneColor();
    const paneCls = paneColor.cls;
    const leaf = treeElem.querySelector(`.${paneCls.join(".")}`);
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
        const [snapBtn, collapseBtn, inputBox, searchBtn] = document.querySelectorAll("#colorTreeCtrl > div");
        const searchInput = inputBox.querySelector("input");
        const cancelSearchBtn = inputBox.querySelector("div.cancelSearchBtnBox");
        const treeElem = document.querySelector("#tree");


        const goToColHandler = function (e) {
            setTree(createColorTree());
            closeAll();
            setTimeout(() => {
                setBranchState([true, pane.getPaneColor().cls])
                setTimeout(goToCol, 500, treeElem, pane);
            }, 500)
        };

        const openAll = function (e) {
            setBranchState([true])
        };

        const closeAll = function (e) {
            setBranchState([false]);
        };

        const cancelSearch = function (e) {
            closeAll();
            setTree(createColorTree());
            searchInput.value = "";
        }

        const searchHandler = (e) => {
            if ((e.which !== 13 && e.type === "keyup")) {
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
        collapseBtn.addEventListener("click", closeAll);

        searchBtn.addEventListener("click", searchHandler);
        searchInput.addEventListener("keyup", searchHandler);
        cancelSearchBtn.addEventListener("click", cancelSearch);

        return () => {
            snapBtn.removeEventListener("click", goToColHandler);
            collapseBtn.removeEventListener("click", closeAll);

            searchBtn.removeEventListener("click", searchHandler);
            searchInput.removeEventListener("keyup", searchHandler);
            cancelSearchBtn.removeEventListener("click", cancelSearch);
        };
    }, [pane]);
    return (
        <>
            <div id="colorTreeCtrl">
                <CustomTooltip title={"Go To Active Color"} placement={"top"}>
                    <div className="snapBtnBox ctrlBtn"><SnapToBtn/></div>
                </CustomTooltip>
                <CustomTooltip title={"Collapse Colors"} placement={"top"}>
                    <div className="collapseBtnBox ctrlBtn"><CollapseBtn/></div>
                </CustomTooltip>
                <div className="inputBox"><input
                    type="text"
                    className="search "
                    placeholder="Write a color..."
                >
                </input>
                    <div className="cancelSearchBtnBox">
                        <CancelSearchBtn/>
                    </div>
                </div>
                <CustomTooltip title={"Search For Color"} placement={"top"}>
                    <div className="searchBtnBox ctrlBtn"><SearchBtn/></div>
                </CustomTooltip>
            </div>

            <div id="tree">
                {Object.keys(tree).length ? (
                    Object.keys(tree).map((v, vi) => (
                        <ColorBranch
                            index={vi}
                            total={Object.keys(tree).length}
                            key={vi}
                            branch={tree[v]}
                            branchName={v + "s"}
                            rootName={""}
                            treeState={branchState}
                        />
                    ))
                ) : (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: '5vh 15%',
                            width: '70%',
                            flexDirection: 'column',
                            alignItems: 'center'

                        }}>
                        <span>There is no such color at the moment.</span>
                        <span style={{paddingTop: '2vh'}}>Please try another.</span>
                    </div>
                )}
            </div>
        </>
    );
}
