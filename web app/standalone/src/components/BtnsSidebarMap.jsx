function BtnsSidebarMap({ showGalleryMenu, showAutofocusMenu }) {
  
    const handleMainLabelMap = () => {
    if (!showGalleryMenu && !showAutofocusMenu) {
      return (
        <>
          <div>
            <strong>A</strong> – Capture
          </div>
          <div>
            <strong>B</strong> – Autofokus
          </div>
          <div>
            <strong>C</strong> – Focus Stack
          </div>
          <div>
            <strong>D</strong> – Galerie
          </div>
        </>
      );
    }
  };

  const handleGalleryLabelMap = () => {
    if (showGalleryMenu) {
      return (
        <>
          <div>
            <strong>A</strong> – 
          </div>
          <div>
            <strong>B</strong> – prev
          </div>
          <div>
            <strong>C</strong> – next
          </div>
          <div>
            <strong>D</strong> – Close menu
          </div>
        </>
      );
    }
  };

  const handleFocusStackLabelMap = () => {
    if (showAutofocusMenu) {
         return (
        <>
          <div>
            <strong>A</strong> – Mode 1
          </div>
          <div>
            <strong>B</strong> – Mode 2
          </div>
          <div>
            <strong>C</strong> – Mode 3
          </div>
          <div>
            <strong>D</strong> – Close menu
          </div>
        </>
      );
    }
  }
  return (
    <div className="btns-sidebar-map-wrapper">
      <div className="btns-map-list">
        {handleMainLabelMap()}
        {handleGalleryLabelMap()}
        {handleFocusStackLabelMap()}
      </div>
    </div>
  );
}

export default BtnsSidebarMap;
