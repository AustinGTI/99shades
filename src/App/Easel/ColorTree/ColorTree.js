import React from "react";
import "./ColorTree.scss";
import cols from "../../../Data/Colors/tempColsv2.json";
import ColorBranch from "./ColorBranch";

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
  return (
    <div id="tree">
      {Object.keys(tree).map((v, vi) => (
        <ColorBranch key={vi} branch={tree[v]} branchName={v} depth={0} />
      ))}
    </div>
  );
}
