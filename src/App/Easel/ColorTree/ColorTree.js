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
  useEffect(() => {
    const snapBtn = document.querySelector("#snapToCol > button");
    const snapToCol = function (e) {
      console.log("snap");
    };
    snapBtn.addEventListener("click", snapToCol);
    return () => {
      snapBtn.removeEventListener("click", snapToCol);
    };
  }, []);
  return (
    <div id="tree">
      <div id="snapToCol">
        <button>.</button>
      </div>
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
  );
}
