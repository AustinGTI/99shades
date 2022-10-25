import React, { useEffect } from "react";
import "./ColorTree.scss";
import cols from "../../../Data/Colors/tempColsv2.json";
import ColorBranch from "./ColorBranch";
import useAppContext, {
  getPaneColor,
} from "../../../AuxFunctions/useAppContext";

function createColorTree() {
  const tree = {};
  for (let col of cols) {
    let { classification } = col;
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

export default function ColorTree() {
  let tree = createColorTree();
  const [gt, st, pane] = useAppContext();
  const paneColor = getPaneColor(pane);
  useEffect(() => {
    const snapBtn = document.querySelector("#treeCtrl > button.snapToActive");
    const openBtn = document.querySelector("#treeCtrl > button.openAll");
    const closeBtn = document.querySelector("#treeCtrl > button.closeAll");
    const treeElem = document.querySelector("#tree");
    const paneCls = paneColor.cls;
    const snapToCol = function (e) {
      const leaf = treeElem.querySelector(`.${paneCls.join(".")}`);
      const visElems = [leaf.parentElement];
      while (visElems[visElems.length - 1].parentElement.id !== "tree") {
        visElems.push(visElems[visElems.length - 1].parentElement);
      }
      [leaf.querySelector(".branchLeaves"), ...visElems].forEach((v) => {
        if (v.classList.contains("invisible")) {
          v.classList.remove("invisible");
          v.classList.add("visible");
        }
      });
      leaf
        .querySelector(
          `.leaf.${paneColor.col.toLowerCase().replaceAll(" ", "_")}`
        )
        .scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });

      console.log("snap");
    };
    const openAll = function (e) {
      treeElem.querySelectorAll(".invisible").forEach((v) => {
        v.classList.remove("invisible");
        v.classList.add("visible");
      });
    };
    const closeAll = function (e) {
      treeElem.querySelectorAll(".visible").forEach((v) => {
        v.classList.remove("visible");
        v.classList.add("invisible");
      });
    };

    snapBtn.addEventListener("click", snapToCol);
    openBtn.addEventListener("click", openAll);
    closeBtn.addEventListener("click", closeAll);

    return () => {
      snapBtn.removeEventListener("click", snapToCol);
      openBtn.removeEventListener("click", openAll);
      closeBtn.removeEventListener("click", closeAll);
    };
  }, [paneColor]);
  return (
    <>
      <div id="treeCtrl">
        <button className="snapToActive">.</button>
        <button className="openAll">@</button>
        <button className="closeAll">,</button>
      </div>
      <div id="tree">
        {Object.keys(tree).map((v, vi) => (
          <ColorBranch
            key={vi}
            branch={tree[v]}
            branchName={v + "s"}
            depth={0}
            rootName={""}
          />
        ))}
      </div>
    </>
  );
}
