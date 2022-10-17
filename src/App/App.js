import React, { useEffect, useReducer } from "react";
import "./App.scss";
import Palette from "./Palette/Palette";
import cols from "../Data/Colors/tempCols.json";
import HexTuner from "./Easel/Hex/HexTuner";
import Easel from "./Easel/Easel";
import { buildNewColor } from "../AuxFunctions/formatColor";

class ColorPane {
  constructor(id, position) {
    this.paneId = id; //the id that will identify a color pane
    this.colorStack = [
      buildNewColor(
        "hex",
        cols[Math.floor(Math.random() * cols.length)].hexcode
      ),
    ]; //this will refer to the history of the colors that have been set on this pane
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
    case "deletePane":
      if (colordata.colorPanes.length === 1) {
        console.log("cannot delete the only pane");
        break;
      }
      let drpPane = getPane(colordata.colorPanes, options.id);
      colordata.colorPanes.forEach((v) => {
        if (v.panePosition > drpPane.panePosition) {
          v.panePosition -= 1;
        }
      });
      if (drpPane.paneId === colordata.activePaneIdx) {
        console.log("resetting stuff vals");

        let newActive = colordata.colorPanes.find(
          (v) =>
            v.panePosition === drpPane.panePosition &&
            v.paneId !== drpPane.paneId
        );
        if (!newActive) {
          newActive = colordata.colorPanes.find(
            (v) =>
              v.panePosition === drpPane.panePosition - 1 &&
              v.paneId !== drpPane.paneId
          );
        }

        colordata.activePaneIdx = newActive.paneId;
        console.log(
          colordata.colorPanes.find(
            (v) =>
              v.panePosition === drpPane.panePosition &&
              v.paneId !== drpPane.paneId
          )
        );
      }

      let dropIdx = colordata.colorPanes.reduce(
        (t, v, vi) => (v.paneId === drpPane.paneId ? vi : t),
        undefined
      );
      colordata.colorPanes.splice(dropIdx, 1);
      console.log(colordata.activePaneIdx);
      break;

    //undo the pane color
    case "undoPaneColor":
      let undoPane = getPane(colordata.colorPanes, options.id);
      if (undoPane.colorStack.length <= undoPane.colorStackPointer + 1) {
        console.log("cannot undo further back");
        break;
      }
      undoPane.colorStackPointer++;
      break;

    //redo the pane color
    case "redoPaneColor":
      let redoPane = getPane(colordata.colorPanes, options.id);
      if (redoPane.colorStackPointer === 0) {
        console.log("cannot redo, nothing ahead");
        break;
      }
      if (redoPane.colorStackPointer < 0) {
        throw Error("This should not be happening.. Fix it");
      }
      redoPane.colorStackPointer--;
      break;

    //when changing the color of the pane, requires the new color
    case "changePaneColor":
      let { color } = options;

      if (activePane.colorInFlux) {
        activePane.colorStack[activePane.colorStack.length - 1] = { ...color };
        clearTimeout(activePane.fluxTimeoutId);
      } else {
        if (activePane.colorStackPointer !== 0) {
          activePane.colorStack = activePane.colorStack.slice(
            0,
            activePane.colorStack.length - activePane.colorStackPointer
          );
          activePane.colorStackPointer = 0;
        }

        activePane.colorInFlux = true;
        activePane.colorStack.push({ ...color });
        console.log(activePane.colorStack.length);
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
    case "movePane":
      let { nposition } = options;
      let mvPane = getPane(colordata.colorPanes, options.id);
      let currPosition = mvPane.panePosition;

      if (nposition === currPosition) {
        break;
      }

      if (nposition > currPosition) {
        for (let p = currPosition + 1; p <= nposition; p++) {
          colordata.colorPanes.find((v) => v.panePosition === p).panePosition--;
        }
      } else if (nposition < currPosition) {
        for (let p = nposition; p < currPosition; p++) {
          colordata.colorPanes.find((v) => v.panePosition === p).panePosition++;
        }
      }
      mvPane.panePosition = nposition;
      // colordata.activePaneIdx = mvPane.paneid;
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
            <Easel />
          </div>
        </AppContext.Provider>
      </div>
    </React.StrictMode>
  );
}

export default App;
