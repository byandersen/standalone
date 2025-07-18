import React, { useEffect, useState } from "react";

/**this component loads images from the openflexure gallery and creates a map
 * which dynamically loads all available images. To access the gallery, users
 * have to press the button "A" (change this later).
 */

function GalleryMenu({
  setShowMenu,
  showGalleryMenu,
  setShowGalleryMenu,
  currentImage,
  currentIndex,
  setCurrentIndex,
  imagesLength,
}) {
  /**showGalleryMenu: is the component visible? true/false
  currentImage: contains data of currently shown image of the list 
  currentIndex: index of the currently shown image from the image list
  setCurrentIndex: changes index (for next/prev)
  imagesLength: total number of images (for disabling next btn later on) */

  if (!showGalleryMenu || !currentImage)
    return null; /*nothing renders if the button is either not pressed or if there's no img to show*/

  const handlePrev = () => {
    /*goes 1 img back but only if it's not the beginning of the list*/
    if (currentIndex > 0) {
      /*checks if current index is greater than 0*/
      setCurrentIndex(
        currentIndex - 1
      ); /**if yes -> current index gets reduced by 1 */
    }
  };

  const handleNext = () => {
    /*goes 1 img forth but only if it's not the end of the list*/
    if (currentIndex < imagesLength - 1) {
      /*checks if current index is at the end of the list. substracts -1 bc imagesLength is a js Array and currentIndex is not*/
      setCurrentIndex(currentIndex + 1); /*if ok -> current index moves one up*/
    }
  };

  return (
    <div className="gallery-menu">
      <h1>Image Data</h1>
      <div className="gallery-data">
        <p>Filename: {currentImage.filename}</p>
        <p>Time: {currentImage.time}</p>
        <p>ID: {currentImage.id}</p>

        {/*   <div className="download-image-btn">
          <a
            href={`http://10.0.1.10:5000/api/v2/captures/${currentImage.id}/download/${currentImage.filename}`}
            download
          >
            Download
          </a>
        </div>

        <div className="delete-image-btn">
          <a
            href={`http://10.0.1.10:5000/api/v2/captures/${currentImage.id}`}
          >
            Delete
          </a>
        </div>*/}
      </div>

      <div className="gallery-menu-btn">
        <button
          className="last-img-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0} /*disables btn if index = 0*/
        >
          Prev
        </button>
        <button
          className="next-img-btn"
          onClick={handleNext}
          disabled={currentIndex === imagesLength - 1} /*disables btn if last img is shown*/
        >
          Next
        </button>
      </div>
       <button
            onClick={() => {
              setShowGalleryMenu(false);
              setShowMenu(true);
            }}
          >
            back
          </button>
    </div>
  );
}

export default GalleryMenu;
