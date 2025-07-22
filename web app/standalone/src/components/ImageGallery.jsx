import React, { useEffect } from "react";
import { API_IP } from "../config";

/**
 * This component loads images from the openflexure gallery using the image's ID and filename and only shows one image at a time.
 * @param {boolean} showGallery - Current state of Gallery, only gets rendered if gallery is active
 * @param {Array<Object>} images - Array of image objects fetched from the OpenFlexure server
 * @param {Function} setImages - Function to update the list of images in state.
 * @param {number} currentIndex - Index of currently shown image
 * @returns {JSX.Element} - Renders the image
 */


function ImageGallery({ showGallery, images, setImages, currentIndex }) {
 
  useEffect(() => {
    //Fetches all captured images from the server
    if (!showGallery) return; // Only fetch when gallery is opened

    const fetchImages = () => {
      fetch(`http://${API_IP}:5000/api/v2/captures`)
        .then((res) => res.json())
        .then((data) => {
          const sortedImages = data.sort(
          // sorts images by date (newest first)
            (a, b) => new Date(b.time) - new Date(a.time)
          );
          setImages(sortedImages);
        })
        .catch((err) => {
          console.error("Error loading images from server:", err);
        });
    };

    fetchImages(); // Initial fetch when gallery opens
    const intervalId = setInterval(fetchImages, 10000); // Refresh every 10s while gallery is open

    return () => clearInterval(intervalId); // Cleanup interval on unmount or when gallery closes
  }, [showGallery, setImages]); //starts useEffect again when showGallery opens

  const currentImage = images[currentIndex];

  return (
    <div className="gallery-map">
      {showGallery && currentImage && (
        //Only renders if gallery is active and if an image exists
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
