import React, { useState, useEffect } from "react";

function ImageDisplay({ imageUrlBase, updateInterval }) {
  const [imageUrl, setImageUrl] = useState(
    `${imageUrlBase}?${new Date().getTime()}`
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageUrl(`${imageUrlBase}?${new Date().getTime()}`);
    }, updateInterval);
    console.log("imageURL:", imageUrlBase);
    return () => clearInterval(intervalId);
  }, [imageUrlBase, updateInterval]);

  return <img src={imageUrl} alt="Mini Map" style={{ maxWidth: "100%" }} />;
}

export default ImageDisplay;

// Usage example:
<ImageDisplay imageUrlBase="/api/latest_image" updateInterval={10000} />;
