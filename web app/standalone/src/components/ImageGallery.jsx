import React, { useEffect } from "react";
import { API_IP } from '../config';

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
    fetch(`http://${API_IP}:5000/api/v2/captures`)
      .then((res) => res.json())
      .then((data) => {
        const sortedImages = data.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        ); // shows newest images first
        setImages(sortedImages);
      })
      .catch((err) => {
        console.error("error when trying to load an image:", err);
      });
  }, [setImages]);

  const currentImage =
    images[currentIndex]; /**fetches img based on current index */

  return (
    <div className="gallery-map">
      {showGallery && currentImage && (
        <div className="container-gallery">
          <div className="gallery-image">
            <img
              src={`http://${API_IP}:5000/api/v2/captures/${currentImage.id}/download/${currentImage.filename}`}
              alt={currentImage.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
