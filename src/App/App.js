import { useEffect } from "react";
import "./App.scss";

function App() {
  useEffect(() => {
    let fBox = document.querySelector("div.formatBox");
    let fSize = fBox.getBoundingClientRect();
    console.log(fSize.width, fSize.height);
  }, []);

  return (
    <div className="appBg">
      <div className="logoBox"></div>
      <div className="appBox">
        <div className="paletteBox">
          <div className="addRightBtn addBtn btn"></div>
          <div className="addLeftBtn addBtn btn"></div>
          <div className="downloadBtn btn"></div>
          {Array.from(Array(3).keys()).map((v, vi) => (
            <div key={vi} className="colorBox">
              <div className="colorDetailsBox"></div>
            </div>
          ))}
        </div>
        <div className="tunersBox">
          <div className="hexBox"></div>
          <div className="slidersBox">
            {Array.from(Array(4).keys()).map((v, vi) => (
              <div key={vi} className="formatBox"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
