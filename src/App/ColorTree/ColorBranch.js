import React, { useEffect, useRef, useState } from "react";
import { FUNCTIONS } from "../../AuxFunctions/formatColor";
import "./ColorBranch.scss";

import ColorLeaf from "./ColorLeaf";

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
  const { branch, branchName, parentInfo, rootName } = params;
  const branchContainer = useRef(null);
  let branchClasses = `${branchName} ${rootName}`;
  const avgCol = `rgb(${calcBranchAverage(branch).join(",")})`;
  parentInfo[avgCol] = branchContainer;
  branchClasses = branchClasses.slice(0, branchClasses.length - 2);

  useEffect(() => {
    const branchLeaves =
      branchContainer.current.querySelector("div.branchLeaves");
    const branchRoot = branchContainer.current.querySelector(
      "div.branchRoot"
    );
    const clickBloom = (e) => {
      if (branchLeaves.classList.contains("visible")) {
        //set every child to invisible
        branchLeaves.querySelectorAll(".visible").forEach((v) => {
          showHideElem(v, false);
        });
        showHideElem(branchLeaves, false);
      } else {
        showHideElem(branchLeaves, true);
      }
    };

    branchRoot.addEventListener("click", clickBloom);
    return () => {
      branchRoot.removeEventListener("click", clickBloom);
    };
  }, []);

  return (
    <div
      className={`branchContainer ${branchClasses}`}
      ref={branchContainer}
      style={{
        filter: `drop-shadow(0 -${4 - Object.keys(parentInfo).length}px ${
          7 - Object.keys(parentInfo).length * 2
        }px #ccc)`,
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
        <div className="colTag" style={{ backgroundColor: avgCol }}></div>

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
      <div className="branchLeaves invisible">
        {!Array.isArray(branch)
          ? Object.keys(branch).map((v, vi) => (
              <ColorBranch
                key={vi}
                branch={branch[v]}
                branchName={v}
                parentInfo={{ ...parentInfo }}
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
