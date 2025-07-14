import React, { useEffect, useState } from "react";
import "./App.css";
import ControllerBtnsInteraction from "./components/ControllerBtnsInteraction";
import PopUpMenu from "./components/PopUpMenu";
import ControllerJoystick from "./components/ControllerJoystick";
import ImageGallery from "./components/ImageGallery";
import Minimap from "./components/Minimap";

function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  return (
    <div className="body">
      <div className="container">
        <div className="microscope-view">
          <ImageGallery showGallery={showGallery} />
          <img src={"http://10.0.1.10:5000/api/v2/streams/mjpeg"} alt=""></img>
          <div className="container-controller">
            <div className="buttons">
              <ControllerBtnsInteraction
                setShowMenu={setShowMenu}
                setShowGallery={setShowGallery}
              />
            </div>
            <div className="joystick">
              {" "}
              <ControllerJoystick />
            </div>
          </div>
        </div>
        <div className="sidebar">
          <p>STANDALONE</p>
          <PopUpMenu showMenu={showMenu} />
          <div className="minimap">
            <Minimap />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
