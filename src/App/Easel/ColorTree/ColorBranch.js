import React, { useEffect, useState } from "react";
import "./ColorBranch.scss";

import ColorLeaf from "./ColorLeaf";

export default function ColorBranch(params) {
  const { branch, branchName, depth } = params;
  const [inBloom, setBloom] = useState(false);

  useEffect(() => {}, []);

  return (
    <div className="branchContainer" style={{ marginLeft: `${depth * 10}px` }}>
      <div className="branchRoot">
        <p>{branchName}</p>
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
              />
            ))
          : branch.map(({ title, hexcode }, vi) => (
              <ColorLeaf key={vi} title={title} hex={hexcode} />
            ))}
      </div>
    </div>
  );
}
