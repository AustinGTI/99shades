import { useContext } from "react";
import { AppContext } from "../App/App.js";

export default function useAppContext() {
  let appdata = useContext(AppContext);
  return appdata;
}
