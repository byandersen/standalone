/**this component loads images from the openflexure gallery and creates a map
 * which dynamically loads all available images. To access the gallery, users
 * have to press the button "A" (change this later).
 */

function GalleryMenu({
  showGalleryMenu,
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
        <p><strong>Filename: </strong> {currentImage.time}</p> 
        <p><strong>ID: </strong> {currentImage.id}</p>
      </div>
    </div>
  );
}

export default GalleryMenu;
