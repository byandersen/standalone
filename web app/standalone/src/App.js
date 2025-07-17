import React, { useEffect, useState } from "react";
import "./App.css";
import ControllerBtnsInteraction from "./components/ControllerBtnsInteraction";
import PopUpMenu from "./components/PopUpMenu";
import ControllerJoystick from "./components/ControllerJoystick";
import ImageGallery from "./components/ImageGallery";
import Minimap from "./components/Minimap";
import GalleryMenu from "./components/GalleryMenu";
import ImageDisplay from "./components/Minimap";

function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showGalleryMenu, setShowGalleryMenu] = useState(false);

  const [images, setImages] = useState([]); // Alle Bilder
  const [currentIndex, setCurrentIndex] = useState(0); // Aktueller Index

  const currentImage = images[currentIndex] || null;

  return (
    <div className="body">
      <div className="container">
        <div className="microscope-view">
          <ImageGallery
            showGallery={showGallery}
            images={images}
            setImages={setImages}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
          <img
            src={"http://10.0.1.10:5000/api/v2/streams/mjpeg"}
            alt="Live-Capture of a sample"
          />
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
          <div className="microscope-name">
            <p>STANDALONE</p>
            {/*<PopUpMenu showMenu={showMenu} />*/}
          </div>
          <GalleryMenu
            showGalleryMenu={showGalleryMenu}
            currentImage={currentImage}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            imagesLength={images.length}
          />
          <div className="minimap">
            <ImageDisplay
              imageUrlBase="/api/latest_image"
              updateInterval={10000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
