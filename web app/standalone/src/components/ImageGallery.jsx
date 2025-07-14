import React, { useEffect, useState } from "react";

/**this component loads images from the openflexure gallery and creates a map 
 * which dynamically loads all available images. To access the gallery, users
 * have to press the button "A" (change this later). 
 */

function ImageGallery({ showGallery }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("http://10.0.1.10:5000/api/v2/captures")
      .then((res) => res.json())
      .then((data) => {
        console.log("Bilder-Daten:", data);
        setImages(data);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Bilder:", err);
      });
  }, []);

  // http://10.0.1.10:5000/api/v2/captures/62e89a5c-56c7-491b-bd68-47f7a0957b66/download/2025-06-20_08-02-42_0_0_-200.jpeg?thumbnail=true

  return (
    <div className="gallery-map">
      {showGallery && (
        <div className="container-gallery">
          {images.map((img, id) => (
            <div key={id} className="gallery-image">
              <img
                src={`http://10.0.1.10:5000/api/v2/captures/${img.id}/download/${img.filename}?thumbnail=true`}
                alt={img.filename}
              />
              <p>{img.time}</p>
              <p>{img.id}</p>
              <div className="download-image">
                {img.filename}
                <a
                  href={`http://10.0.1.10:5000/api/v2/captures/${img.id}/download/${img.filename}`}
                  download
                >
                  download
                </a>
              </div>
              <div className="delet-image">
                {img.filename}
                <a
                  href={`http://10.0.1.10:5000/api/v2/captures/${img.id}`}
                  download
                >
                  delete
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
