/**
 * This component handles each individual state of the Button Labels in the sidebar.
 * The contents change depending on the currently shown menu.
 *
 * @param {boolean} showGalleryMenu - Current state of Gallery Sidebar Menu
 * @param {boolean} showAutofocusMenu - Current State of Autofocus Menu
 * @returns {JSX.Element} - Dynamically renders information for each button depending on which menu is currently active
 */

function BtnsSidebarMap({ showGalleryMenu, showAutofocusMenu }) {
  const handleMainLabelMap = () => {
    //only renders if neither are currently active
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
            <strong>D</strong> – Galerie
          </div>
        </>
      );
    }
  };

  const handleGalleryLabelMap = () => {
    //only renders if Gallery Menu is active
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
    //only renders if Autofocus Menu is active
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
  };
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
