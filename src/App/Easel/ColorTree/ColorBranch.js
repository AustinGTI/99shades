import React, { useEffect, useRef, useState } from "react";
import "./ColorBranch.scss";

import ColorLeaf from "./ColorLeaf";

export default function ColorBranch(params) {
  const { branch, branchName, depth, rootName } = params;
  const branchContainer = useRef(null);
  let branchClasses = `${branchName} ${rootName}`;
  branchClasses = branchClasses.slice(0, branchClasses.length - 2);

  useEffect(() => {
    const branchLeaves =
      branchContainer.current.querySelector("div.branchLeaves");
    const dropDownBtn = branchContainer.current.querySelector(
      "div.branchRoot > button.dropdown"
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

  return (
    <div
      className={`branchContainer ${branchClasses}`}
      ref={branchContainer}
      style={{ marginLeft: `${depth * 10}px` }}
    >
      <div className="branchRoot">
        <p>
          {branchName} {rootName}
        </p>
        <button className="dropdown">&gt;</button>
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
