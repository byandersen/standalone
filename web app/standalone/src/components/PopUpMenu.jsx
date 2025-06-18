/* This component creates the buttoms for the PopUp-Menu and sets their visibility to 
"true" when pressing Button A.*/ 

function PopUpMenu({ showButtons }) {
  return (
    <>
      {showButtons && (
        <div className="popup-menu">
          <p>Menu</p>
          <button className="settings-btn">Settings</button>
          <button className="images-btn">Images</button>
          <button className="focus-btn">Focus</button>
          <button className="other-btn">Button</button>
        </div>
      )}
    </>
  );
}

export default PopUpMenu;
