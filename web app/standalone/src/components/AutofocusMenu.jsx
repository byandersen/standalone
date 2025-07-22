/**
 * This component displays the Smart Autofocus menu.
 * It renders conditionally based on "showAutofocusMenu".
 * @param {boolean} showAutofocusMenu - Current state of Autofocusmenu
 * @returns {JSX.Element} - Autofocus menu component
 */

function AutofocusMenu({ showAutofocusMenu }) {
  return (
    <>
      {showAutofocusMenu && ( //only renders if button has been pressed
        <div className="autofocus-menu">
          <h1>Smart-Autofocus</h1>
        </div>
      )}
    </>
  );
}

export default AutofocusMenu;
