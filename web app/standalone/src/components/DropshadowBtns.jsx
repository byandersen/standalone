/* This component is the drop-shadow filter for the ControllerBtnsInteraction and ControllerBtns component, which is
being activated by pressing a button.*/ 

function DropshadowBtns() {
  return (
    <defs>
      <filter id="dropshadowbtns" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="2"
          dy="2"
          stdDeviation="2"
          floodColor="rgba(28, 24, 39, 0.6)"
          floodOpacity="0.5"
        />
      </filter>
    </defs>
  );
}

export default DropshadowBtns;
