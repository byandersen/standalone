/* This component creates the buttoms for the PopUp-Menu and sets their visibility to 
"true" when pressing Button A.*/

function MainMenu({
  showMenu,
  setShowMenu,
  setShowAutofocusMenu,
  setShowGallery,
  setShowGalleryMenu,
}) {
  const handleOpenGallery = () => {
    setShowGallery(true);
    setShowGalleryMenu(true);
    setShowMenu(false);
  };

  const handleOpenAutofocusMenu = () => {
    setShowAutofocusMenu(true);
    setShowMenu(false)
  }

  return (
    <>
      {showMenu && (
        <div className="main-menu">
          <h1>Menu</h1>
          <button className="settings-btn">Settings</button>
          <button className="gallery-btn" onClick={handleOpenGallery}>
            Gallery
          </button>
          <button className="focus-btn" onClick={handleOpenAutofocusMenu} >Autofocus</button>
        </div>
      )}
    </>
  );
}

export default MainMenu;
