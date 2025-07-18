import React, { useEffect, useState } from "react";
import "./App.css";
import "./Gallery.css";
import "./MainMenu.css";
import "./AutofocusMenu.css";
import ControllerBtnsInteraction from "./components/ControllerBtnsInteraction";
import MainMenu from "./components/MainMenu";
import AutofocusMenu from "./components/AutofocusMenu";
import ControllerJoystick from "./components/ControllerJoystick";
import ImageGallery from "./components/ImageGallery";
import Minimap from "./components/Minimap";
import GalleryMenu from "./components/GalleryMenu";
import ImageDisplay from "./components/Minimap";

function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [showAutofocusMenu, setShowAutofocusMenu] = useState(false);
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
                setShowAutofocusMenu={setShowAutofocusMenu}
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
           {/* <MainMenu
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              setShowGallery={setShowGallery}
              setShowGalleryMenu={setShowGalleryMenu}
              showAutofocusMenu={showAutofocusMenu}
              setShowAutofocusMenu={setShowAutofocusMenu}
            />*/}
            <AutofocusMenu
              showAutofocusMenu={showAutofocusMenu}
            />
          </div>
          <GalleryMenu
            setShowMenu={setShowMenu}
            setShowGalleryMenu={setShowGalleryMenu}
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
              showGalleryMenu={showGalleryMenu}
              showAutofocusMenu={showAutofocusMenu}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
