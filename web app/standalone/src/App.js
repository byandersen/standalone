import React, { useState } from "react";
import "./App.css";
import "./Gallery.css";
import "./AutofocusMenu.css";
import ControllerJoystick from "./components/ControllerJoystick";
import BtnsSidebarMap from "./components/BtnsSidebarMap";
import ControllerBtnsInteraction from "./components/ControllerBtnsInteraction";
import AutofocusMenu from "./components/AutofocusMenu";
import ImageGallery from "./components/ImageGallery";
import GalleryMenu from "./components/GalleryMenu";
import ImageDisplay from "./components/Minimap";
import {useEffect} from "react";
import { API_IP } from "./config";

/**
 * Main application component for the webapp
 *
 * It renders the live microscope image, controller components, the gallery, a minimap and a map for the current buttons functionality.
 * Besides that, it also manages multiple states, such as autofocus menu visibility, gallery visibility and setting images.
 
 * - showAutofocusMenu: Controls wether the autofocus menu is displayed
 * - showGallery: Controls whether the image gallery is displayed
 * - showGalleryMenu: Controls whether the gallery menu sidebar is displayed
 * - images: Stores the list of fetched images from the server
 * - currentIndex: Index of the currently selected image in the images array
 * - imageUrl: URL for refreshing the live microscope stream
 *
 * Components rendered:
 * - ImageGallery: Shows one captured image if gallery is active
 * - Live microscope image stream
 * - ControllerBtnsInteraction: Handles button interactions
 * - ControllerJoystick: Joystick UI
 * - AutofocusMenu: Autofocus configuration UI
 * - GalleryMenu: Navigation for captured images
 * - ImageDisplay: Minimap display
 * - BtnsSidebarMap: Sidebar with button labels
 *
 * @returns {JSX.Element} The complete webapp interface with all subcomponents.
 */


function App() {
  const [showAutofocusMenu, setShowAutofocusMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showGalleryMenu, setShowGalleryMenu] = useState(false);
  const [images, setImages] = useState([]); // Alle Bilder
  const [currentIndex, setCurrentIndex] = useState(0); // Aktueller Index
  const currentImage = images[currentIndex] || null;
  const imageUrlBase = `http://${API_IP}:5000/api/v2/streams/mjpeg`;
  const updateInterval = 10000;
  const [imageUrl, setImageUrl] = useState(
     `${imageUrlBase}?${new Date().getTime()}`
  );

  useEffect(() => {
      const intervalId = setInterval(() => {
        setImageUrl(`${imageUrlBase}?${new Date().getTime()}`);
      }, updateInterval);

      return () => clearInterval(intervalId);
  }, [imageUrlBase, updateInterval]);

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
            src={imageUrl}
            alt="Live-Capture of a sample"
          />
          <div className="container-controller">
            <div className="buttons">
              <ControllerBtnsInteraction
                setShowGallery={setShowGallery}
                setShowGalleryMenu={setShowGalleryMenu}
                setShowAutofocusMenu={setShowAutofocusMenu}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                imagesLength={images.length}
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
          </div>
          <AutofocusMenu showAutofocusMenu={showAutofocusMenu} />
          <GalleryMenu
            setShowGalleryMenu={setShowGalleryMenu}
            showGalleryMenu={showGalleryMenu}
            currentImage={currentImage}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            imagesLength={images.length}
          />
          <div className="minimap">
            <ImageDisplay
              imageUrlBase={`http://${API_IP}:5000/api/v2/extensions/de.hs-flensburg.mini-map/map`}
              updateInterval={10000}
              showGalleryMenu={showGalleryMenu}
              showAutofocusMenu={showAutofocusMenu}
            />
          </div>
          <div className="btns-sidebar-map">
            <BtnsSidebarMap
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
