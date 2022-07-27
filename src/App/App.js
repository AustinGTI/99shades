import React, { useEffect, useReducer } from "react";
import "./App.scss";
import Palette from "./Palette/Palette";
import cols from "../Data/Colors/tempCols.json";

class ColorPane {
  constructor(id, position) {
    this.paneId = id; //the id that will identify a color pane
    this.colorStack = [cols[Math.floor(Math.random() * cols.length)].hexcode]; //this will refer to the history of the colors that have been set on this pane
    this.colorStackPointer = 0; //this will refer to the current color on the pane by pointing to an index on the colorstack array [-1,-2]
    this.paneLocked = false; //this will indicate if the color is uneditable or not
    this.colorDetailVisible = true; //this will indicate if the color details can be seen (may not be necessary)
    this.panePosition = position; // this will indicate the position of the color relative to the others on the carousel
    this.colorInFlux = false; // indicates if the user is currently editing the pane color

    //settings that define how long it takes with no activity for a color to be set in the stack
    this.fluxTimeoutId = undefined;
    this.fluxTimeoutDuration = 500;
  }
}

const appColorData = {
  activePaneIdx: 0, //this will refer to the active color in the app which the user is interacting with
  colorPanes: [
    //this is a list of all the panes on the carousel and their attributes
    new ColorPane(0, 0),
  ],
};

function getPane(panes, id) {
  return panes.find((v) => v.paneId === id);
}

function setAppColorData(data, options) {
  const colordata = Object.assign({}, data);
  const activePane = getPane(colordata.colorPanes, colordata.activePaneIdx);
  switch (options.command) {
    //when a pane is set to active, requires (paneId)
    case "activatePane":
      let { id } = options;
      colordata.activePaneIdx = id;
      break;

    //when adding a pane, requires direction(the direction in which the pane has been added)
    case "addPane":
      let { direction } = options; // a direction of true is to the right, false is to the left
      if (colordata.colorPanes.length === 5) {
        console.log("You cannot add more than 5 colors");
        break;
      }

      colordata.colorPanes.forEach((v) =>
        v.panePosition > activePane.panePosition ? v.panePosition++ : null
      );
      if (!direction) {
        activePane.panePosition++;
      }
      let newPaneId =
        Math.max(...colordata.colorPanes.map((v) => v.paneId)) + 1;
      let newPanePosition = activePane.panePosition + (direction ? 1 : -1);
      colordata.colorPanes.push(new ColorPane(newPaneId, newPanePosition));
      break;

    //when removing a pane, requires nothing
    case "dropPane":
      if (colordata.colorPanes.length() === 1) {
        break;
      }
      let isLast = true;
      colordata.colorPanes.forEach((v) => {
        if (v.panePosition > activePane.panePosition) {
          v.panePosition -= 1;
          isLast = false;
        }
      });
      if (!isLast) {
        colordata.colorPanes.forEach((v) =>
          v.panePosition === activePane.panePosition
            ? (colordata.activePaneIdx = v.paneId)
            : null
        );
      } else {
        colordata.colorPanes.activePaneIdx--;
      }
      let activeIdx = colordata.colorPanes.reduce(
        (t, v, vi) => (v.paneId === activePane.paneId ? vi : t),
        undefined
      );
      colordata.colorPanes.splice(activeIdx, 1);
      break;

    //when changing the color of the pane, requires the new color
    case "changePaneColor":
      let { color } = options;

      if (activePane.colorInFlux) {
        activePane.colorStack[0] = color;
        clearTimeout(activePane.fluxTimeoutId);
      } else {
        if (activePane.colorStackPointer !== 0) {
          activePane.colorStack.slice(
            0,
            activePane.colorStack.length - activePane.colorStackPointer
          );
          activePane.colorStackPointer = 0;
          activePane.colorInFlux = true;
        }
        activePane.colorStack.push(color);
      }
      activePane.fluxTimeoutId = setTimeout(
        (pane) => {
          pane.colorInFlux = false;
        },
        activePane.fluxTimeoutDuration,
        activePane
      );
      break;

    //change the position of the active pane.. requires the new position
    case "changePanePosition":
      let { nposition } = options;
      let currPosition = activePane.panePosition;

      if (nposition === currPosition) {
        break;
      }

      if (nposition > currPosition) {
        for (let p = currPosition + 1; p <= nposition; p++) {
          colordata.colorStack.find((v) => v.panePosition === p).panePosition--;
        }
      } else if (nposition < currPosition) {
        for (let p = nposition; p < currPosition; p++) {
          colordata.colorStack.find((v) => v.panePosition === p).panePosition++;
        }
      }
      activePane.panePosition = nposition;
      break;

    //lock/unlock active colorpane
    case "toggleLocked":
      activePane.paneLocked = !activePane.paneLocked;
      break;

    //show/hide color details
    case "toggleVisible":
      activePane.colorDetailVisible = !activePane.colorDetailVisible;
      break;

    default:
      console.log("that is not a valid command");
      break;
  }
  return colordata;
}

export const AppContext = React.createContext(undefined);

function App() {
  const [appState, setAppState] = useReducer(setAppColorData, appColorData);

  return (
    <React.StrictMode>
      <div className="appBg">
        <div className="logoBox"></div>
        <AppContext.Provider
          value={{
            getter: appState,
            setter: setAppState,
          }}
        >
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
    </React.StrictMode>
  );
}

export default App;
