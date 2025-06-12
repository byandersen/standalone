import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const handleKeyDown = (a) => {
      if (a.key === "a") {
        const buttonA = document.getElementById("button-a");
        if (buttonA) {
          buttonA.setAttribute("fill", "white");
          buttonA.setAttribute("fill-opacity", "1");
        }
        setShowButtons(true);
      }
    };

    const handleKeyUp = (a) => {
      if (a.key === "a") {
        const buttonA = document.getElementById("button-a");
        if (buttonA) {
          buttonA.setAttribute("fill", "white");
          buttonA.setAttribute("fill-opacity", "0.6");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="body">
      <div className="container">
        <div className="microscope-view">
          <img src={"http://10.0.1.10:5000/api/v2/streams/mjpeg"} alt=""></img>
          <div className="container-controller">
            <div className="buttons">
              <div className="interactive-buttons">
                <svg
                  width="72"
                  height="68"
                  viewBox="0 0 72 68"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    id="button-a" //id to prep for eventlistener
                    cx="36"
                    cy="10"
                    r="10"
                    fill="white"
                    fillOpacity="0.6"
                  />
                  <circle
                    id="button-b"
                    cx="36"
                    cy="58"
                    r="10"
                    fill="white"
                    fillOpacity="0.6"
                  />
                  <circle
                    id="button-c"
                    cx="62"
                    cy="34"
                    r="10"
                    fill="white"
                    fillOpacity="0.6"
                  />
                  <circle
                    id="button-d"
                    cx="10"
                    cy="34"
                    r="10"
                    fill="white"
                    fillOpacity="0.6"
                  />
                </svg>
              </div>
            </div>
            <div className="joystick">
              <div className="interactive-joystick">
                <svg
                  width="83"
                  height="66"
                  viewBox="0 0 83 66"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg" //svg code from website
                >
                  <path
                    d="M82.7488 23.7527C82.7488 32.0777 64.4174 38.8265 41.8044 38.8265C19.1915 38.8265 0.860107 32.0777 0.860107 23.7527C0.860107 15.4277 19.1915 0 41.8044 0C64.4174 0 82.7488 15.4277 82.7488 23.7527Z"
                    fill="white"
                    fillOpacity="0.6"
                  />
                  <ellipse
                    cx="41.4516"
                    cy="48.0037"
                    rx="18.0014"
                    ry="5.6475"
                    fill="white"
                    fillOpacity="0.6"
                  />
                  <rect
                    x="34.7454"
                    y="31.7671"
                    width="14.1187"
                    height="13.4128"
                    fill="white"
                    fillOpacity="0.6"
                  />
                  <rect
                    x="12.1553"
                    y="48.0037"
                    width="58.5928"
                    height="17.6484"
                    rx="5"
                    fill="white"
                    fillOpacity="0.6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <p>STANDALONE</p>
          {showButtons && (
            <div className="popup-menu">
              <button className="settings-btn">Settings</button>
              <button className="images-btn">Images</button>
              <button className="focus-btn">Focus</button>
              <button className="other-btn">Button</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;
