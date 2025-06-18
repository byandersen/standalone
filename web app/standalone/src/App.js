import React, { useState } from "react";
import "./App.css";
import ControllerBtnsInteraction from "./components/ControllerBtnsInteraction";
import PopUpMenu from "./components/PopUpMenu";
import ControllerJoystick from "./components/ControllerJoystick";

function App() {
  const [showButtons, setShowButtons] = useState(false);

  return (
    <div className="body">
      <div className="container">
        <div className="microscope-view">
          <img
                src={"http://10.0.1.10:5000/api/v2/streams/mjpeg"}
                alt=""
              ></img>
          <div className="container-controller">
            <div className="buttons">
              
              <ControllerBtnsInteraction setShowButtons={setShowButtons} />
            </div>
            <div className="joystick"> <ControllerJoystick/></div>
          </div>
        </div>
        <div className="sidebar">
          <p>STANDALONE</p>
          <PopUpMenu showButtons={showButtons} />
        </div>
      </div>
    </div>
  );
}
export default App;
