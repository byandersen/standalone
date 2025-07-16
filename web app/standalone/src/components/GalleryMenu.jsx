import React, { useEffect, useState } from "react";

/**this component loads images from the openflexure gallery and creates a map
 * which dynamically loads all available images. To access the gallery, users
 * have to press the button "A" (change this later).
 */

function GalleryMenu({ showGalleryMenu }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("http://10.0.1.10:5000/api/v2/captures")
      .then((res) => res.json())
      .then((data) => {
        console.log("Bilder-Daten:", data);
        setImages(data);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Bilder-Daten:", err);
      });
  }, []);

  return (
    <>
      {showGalleryMenu && (
        <div className="gallery-menu">
          <h1>Image Data</h1>
          {images.map((img, id) => (
            <div key={id} className="gallery-data">
              <p>Filename: {img.filename}</p>
              <p>Time: {img.time}</p>
              <p>ID: {img.id}</p>
              <div className="download-image-btn">
                {img.filename}
                <a
                  href={`http://10.0.1.10:5000/api/v2/captures/${img.id}/download/${img.filename}`}
                  download
                >
                  download
                </a>
              </div>
              <div className="delete-image-btn">
                {img.filename}
                <a
                  href={`http://10.0.1.10:5000/api/v2/captures/${img.id}`}
                  delete
                >
                  delete
                </a>
              </div>
            </div>
          ))}
          <div className="gallery-menu-btn">
            <button className="last-img-btn">prev</button>
            <button className="next-img-btn">next</button>
          </div>
        </div>
      )}
    </>
  );
}

export default GalleryMenu;
