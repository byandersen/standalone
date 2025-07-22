/**
 * This component loads the gallery data for each shown image.
 * @param {boolean} showGalleryMenu - Wether the gallery menu in the sidebar is visible
 * @param {Object} currentImage - Data of the currently shown image
 * @return {JSX.Element} - Renders Gallery Data
 */

function GalleryMenu({ showGalleryMenu, currentImage }) {
  if (!showGalleryMenu || !currentImage)
    //Nothing renders if the button is either not pressed or if there's no image to show
    return null;

  return (
    <div className="gallery-menu">
      <h1>Image Data</h1>
      <div className="gallery-data">
        <p>
          <strong>Filename: </strong> {currentImage.time}
        </p>
        <p>
          <strong>ID: </strong> {currentImage.id}
        </p>
      </div>
    </div>
  );
}

export default GalleryMenu;
