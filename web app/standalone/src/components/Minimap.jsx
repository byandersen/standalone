import React, { useState, useEffect } from "react";

function ImageDisplay({
  imageUrlBase,
  updateInterval,
  showAutofocusMenu,
  showGalleryMenu,
}) {
  const [imageUrl, setImageUrl] = useState(
    `${imageUrlBase}?${new Date().getTime()}`
  );

  useEffect(() => {
    if (!showAutofocusMenu && !showGalleryMenu) {
      const intervalId = setInterval(() => {
        setImageUrl(`${imageUrlBase}?${new Date().getTime()}`);
      }, updateInterval);
      console.log("minimap active:", imageUrlBase);

      return () => clearInterval(intervalId);
    } else {
      console.log("minimap deactivated");
    }
  }, [imageUrlBase, updateInterval, showAutofocusMenu, showGalleryMenu]); //useEffect runs again when value has been changed

  return (
    <img
      src={imageUrl}
      alt="Mini Map"
      style={{
        maxWidth: "100%",
        display: showAutofocusMenu || showGalleryMenu ? "none" : "block", //only shows minimap if menus aren't open
      }}
    />
  );
}

export default ImageDisplay;
