function BtnsSidebarMap({ showGalleryMenu, showAutofocusMenu }) {
  
    const handleMainLabelMap = () => {
    if (!showGalleryMenu && !showAutofocusMenu) {
      return (
        <>
          <div>
            <strong>A</strong> – Capture
          </div>
          <div>
            <strong>B</strong> – Autofocus
          </div>
          <div>
            <strong>C</strong> – Focus Stack
          </div>
          <div>
            <strong>D</strong> – Gallery
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
            <strong>B</strong> – Nächstes
          </div>
          <div>
            <strong>C</strong> – Zurück
          </div>
          <div>
            <strong>D</strong> – Vorheriges
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
            <strong>A</strong> – Voll
          </div>
          <div>
            <strong>B</strong> – Zurück
          </div>
          <div>
            <strong>C</strong> – Fine
          </div>
          <div>
            <strong>D</strong> – Medium
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
