import { useContext } from "react";
import { AppContext } from "../App/App.js";

export function getPaneColor(pane) {
  return pane.colorStack[pane.colorStack.length - 1 - pane.colorStackPointer];
}

export default function useAppContext() {
  let { getter, setter } = useContext(AppContext);
  const activePane = getter.colorPanes.find(
    (v) => v.paneId === getter.activePaneIdx
  );

  return [getter, setter, activePane];
}
