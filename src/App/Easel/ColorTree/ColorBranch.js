import React, { useEffect, useRef, useState } from "react";
import "./ColorBranch.scss";

import ColorLeaf from "./ColorLeaf";

export default function ColorBranch(params) {
  const { branch, branchName, depth, rootName } = params;
  const [inBloom, setBloom] = useState(false);
  const branchContainer = useRef(null);

  useEffect(() => {
    const branchLeaves =
      branchContainer.current.querySelector("div.branchLeaves");
    const dropDownBtn = branchContainer.current.querySelector(
      "div.branchRoot > button.dropdown"
    );

    dropDownBtn.addEventListener("click", (e) => setBloom(!inBloom));
    branchLeaves.classList.remove(inBloom ? "invisible" : "visible");
    branchLeaves.classList.add(inBloom ? "visible" : "invisible");
  }, [inBloom]);

  return (
    <div
      className={`branchContainer ${branchName} ${rootName}`}
      ref={branchContainer}
      style={{ marginLeft: `${depth * 10}px` }}
    >
      <div className="branchRoot">
        <p>
          {branchName} {rootName}
        </p>
        <button className="dropdown">&gt;</button>
      </div>
      <div className="branchLeaves">
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
