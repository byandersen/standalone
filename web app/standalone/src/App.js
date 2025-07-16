import React, { useEffect, useState } from "react";
import "./App.css";
import ControllerBtnsInteraction from "./components/ControllerBtnsInteraction";
import PopUpMenu from "./components/PopUpMenu";
import ControllerJoystick from "./components/ControllerJoystick";
import ImageGallery from "./components/ImageGallery";
import Minimap from "./components/Minimap";
import GalleryMenu from "./components/GalleryMenu";

function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showGalleryMenu, setShowGalleryMenu] = useState(false);
  return (
    <div className="body">
      <div className="container">
        <div className="microscope-view">
          <ImageGallery showGallery={showGallery} />
          <img
            src={"http://10.0.1.10:5000/api/v2/streams/mjpeg"}
            alt="Live-Capture of a sample"
          ></img>
          <div className="container-controller">
            <div className="buttons">
              <ControllerBtnsInteraction
                setShowMenu={setShowMenu}
                setShowGallery={setShowGallery}
                setShowGalleryMenu={setShowGalleryMenu}
              />
            </div>
            <div className="joystick">
              <ControllerJoystick />
            </div>
          </div>
        </div>
        <div className="sidebar">
          <div className="microscope-name"><p>STANDALONE</p></div>
          {/*<PopUpMenu showMenu={showMenu} />*/}
          <GalleryMenu showGalleryMenu={showGalleryMenu} />
          <div className="minimap">{/*<Minimap />*/}</div>
        </div>
      </div>
    </div>
  );
}
export default App;
