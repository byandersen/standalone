import React, { useEffect, useState } from "react";

/**this component loads images from the openflexure gallery and creates a map
 * which dynamically loads all available images. To access the gallery, users
 * have to press the button "A" (change this later).
 */

function ImageGallery({ showGallery, images, setImages, currentIndex }) {
  /* showGallery: gallery only gets shown if btn is triggered
images: list of all img of the server
setImages: sets list of img
currentIndex: index of currently shown img*/

  useEffect(() => {
    fetch("http://10.0.1.10:5000/api/v2/captures")
      .then((res) => res.json())
      .then((data) => {
        console.log("image-data:", data);
        setImages(data); /*fetched img data gets saved into setImages*/
      })
      .catch((err) => {
        console.error("error when trying to load an image:", err);
      });
  }, [setImages]);

  const currentImage = images[currentIndex]; /**fetches img based on current index */

  return (
    <div className="gallery-map">
      {showGallery && currentImage && (
        <div className="container-gallery">
          <div className="gallery-image">
            <img
              src={`http://10.0.1.10:5000/api/v2/captures/${currentImage.id}/download/${currentImage.filename}?thumbnail=true`}
              alt={currentImage.filename}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
