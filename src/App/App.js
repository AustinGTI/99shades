import React, { useEffect } from "react";
import "./App.scss";
import Palette from "./Palette/Palette";

const appColorData = {
  activeColor: 0, //this will refer to the active color in the app which the user is interacting with
  colorPanes: [
    //this is a list of all the panes on the carousel and their attributes
    {
      colorStack: [], //this will refer to the history of the colors that have been set on this pane
      colorState: undefined, //this will refer to the current color on the pane by pointing to an index on the colorstack array [-1,-2]
      colorLocked: false, //this will indicate if the color is uneditable or not
      colorDetailVisible: true, //this will indicate if the color details can be seen (may not be necessary)
      colorPosition: undefined, // this will indicate the position of the color relative to the others on the carousel
    },
  ],
};

export const AppContext = React.createContext(undefined);

function App() {
  useEffect(() => {
    let fBox = document.querySelector("div.formatBox");
    let fSize = fBox.getBoundingClientRect();
    console.log(fSize.width, fSize.height);
  }, []);

  return (
    <div className="appBg">
      <div className="logoBox"></div>
      <AppContext.Provider value={appColorData}>
        <div className="appBox">
          <Palette />
          <div className="tunersBox">
            <div className="hexBox"></div>
            <div className="slidersBox">
              {Array.from(Array(5).keys()).map((v, vi) => (
                <div
                  key={vi}
                  className={`formatBox${vi === 2 ? " colorListBox" : ""}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
