import React, { useEffect, useRef, useState } from "react";
import { FUNCTIONS } from "../../../AuxFunctions/formatColor";
import "./ColorBranch.scss";

import ColorLeaf from "./ColorLeaf";

function flattenBranch(branch) {
  if (Array.isArray(branch)) {
    return branch;
  }
  let leaves = [];
  for (let key in branch) {
    console.log(key, branch);
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

export default function ColorBranch(params) {
  const { branch, branchName, depth, rootName } = params;
  const branchContainer = useRef(null);
  let branchClasses = `${branchName} ${rootName}`;
  branchClasses = branchClasses.slice(0, branchClasses.length - 2);

  useEffect(() => {
    const branchLeaves =
      branchContainer.current.querySelector("div.branchLeaves");
    const dropDownBtn = branchContainer.current.querySelector(
      "div.branchRoot  div.dropDiv"
    );
    const clickBloom = (e) => {
      if (branchLeaves.classList.contains("visible")) {
        //set every child to invisible
        branchLeaves.querySelectorAll(".visible").forEach((v) => {
          v.classList.remove("visible");
          v.classList.add("invisible");
        });
        branchLeaves.classList.remove("visible");
        branchLeaves.classList.add("invisible");
      } else {
        branchLeaves.classList.remove("invisible");
        branchLeaves.classList.add("visible");
      }
    };

    dropDownBtn.addEventListener("click", clickBloom);
    return () => {
      dropDownBtn.removeEventListener("click", clickBloom);
    };
  }, []);
  useEffect(() => {
    const avgCol = calcBranchAverage(branch);
    branchContainer.current.style.backgroundColor = `rgb(${avgCol.join(",")})`;
    console.log(avgCol);
  }, [branch]);

  return (
    <div className={`branchContainer ${branchClasses}`} ref={branchContainer}>
      <div className="branchRoot">
        <div className="btnDiv climbDiv">
          {Array.from(Array(depth).keys()).map((v, vi) => (
            <div className="btn climbBtn" key={vi}></div>
          ))}
        </div>
        <div className="colTag"></div>

        <p>
          {branchName} {rootName}
        </p>
        <div className="btnDiv dropDiv">
          {Array(3)
            .fill(true)
            .map((v, vi) => (
              <div key={vi} className="btn dropBtn"></div>
            ))}
        </div>
      </div>
      <div className="branchLeaves invisible">
        {!Array.isArray(branch)
          ? Object.keys(branch).map((v, vi) => (
              <ColorBranch
                key={vi}
                branch={branch[v]}
                branchName={v}
                depth={depth + 1}
                rootName={branchName + " " + rootName}
              />
            ))
          : branch.map(({ title, hexcode }, vi) => (
              <ColorLeaf key={vi} title={title} hex={hexcode} />
            ))}
      </div>
    </div>
  );
}
