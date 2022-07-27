import { useContext } from "react";
import { AppContext } from "../App/App.js";

export default function useAppContext() {
  let { getter, setter } = useContext(AppContext);
  return [getter, setter];
}
