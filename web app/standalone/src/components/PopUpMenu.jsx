/* This component creates the buttoms for the PopUp-Menu and sets their visibility to 
"true" when pressing Button A.*/

function PopUpMenu({ showMenu }) {
  return (
    <>
      {showMenu && (
        <div className="popup-menu">
          <h1>Menu</h1>
          <button className="settings-btn">Settings</button>
          <button className="gallery-btn" >Gallery</button>
          <button className="focus-btn">Focus</button>
          <button className="other-btn">Button</button>
        </div>
      )}
    </>
  );
}

export default PopUpMenu;
