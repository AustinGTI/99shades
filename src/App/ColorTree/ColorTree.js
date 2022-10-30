import React, { useEffect, useState } from "react";
import "./ColorTree.scss";
import cols from "../../Data/Colors/tempColsv2.json";
import ColorBranch from "./ColorBranch";
import useAppContext, { getPaneColor } from "../../AuxFunctions/useAppContext";

function createColorTree(query = null) {
  const tree = {};
  let regex = /\w+/;
  if (query !== null) {
    regex = RegExp(query, "i");
  }
  for (let col of cols) {
    let { classification, title } = col;
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

export default function ColorTree() {
  let [tree, setTree] = useState(createColorTree());
  const [gt, st, pane] = useAppContext();
  const paneColor = getPaneColor(pane);
  useEffect(() => {
    const snapBtn = document.querySelector("#treeCtrl > button.snapToActive");
    const openBtn = document.querySelector("#treeCtrl > button.openAll");
    const closeBtn = document.querySelector("#treeCtrl > button.closeAll");
    const searchBtn = document.querySelector("#treeCtrl > button.searchBtn");

    const searchInput = document.querySelector("#treeCtrl > input.search");
    const treeElem = document.querySelector("#tree");

    const paneCls = paneColor.cls;

    function goToCol() {
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
    }
    const snapToCol = function (e) {
      setTree(createColorTree());

      setTimeout(goToCol, 100);
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

    const search = function (e) {
      if (e.which !== 13 && e.type === "keyup") {
        return;
      }
      let searchQuery = searchInput.value;
      if (searchQuery) {
        setTree(createColorTree(searchQuery));
      } else {
        setTree(createColorTree());
      }
      setTimeout(openAll, 100);
    };

    snapBtn.addEventListener("click", snapToCol);
    openBtn.addEventListener("click", openAll);
    closeBtn.addEventListener("click", closeAll);

    searchBtn.addEventListener("click", search);
    searchInput.addEventListener("keyup", search);

    return () => {
      snapBtn.removeEventListener("click", snapToCol);
      openBtn.removeEventListener("click", openAll);
      closeBtn.removeEventListener("click", closeAll);

      searchBtn.removeEventListener("click", search);
      searchInput.removeEventListener("keyup", search);
    };
  }, [paneColor]);
  return (
    <>
      <div id="treeCtrl">
        <button className="snapToActive">.</button>
        <button className="openAll">+</button>
        <button className="closeAll">,</button>
        <input
          type="text"
          className="search"
          placeholder="Write a color any color"
        ></input>
        <button className="searchBtn">?</button>
      </div>
      <div id="tree">
        {Object.keys(tree).length ? (
          Object.keys(tree).map((v, vi) => (
            <ColorBranch
              key={vi}
              branch={tree[v]}
              branchName={v + "s"}
              parentInfo={{}}
              rootName={""}
            />
          ))
        ) : (
          <div>Oops!</div>
        )}
      </div>
    </>
  );
}
