/** This component creates a drop-shadow filter for the ControllerBtnsInteraction and ControllerBtns component, which gets
 *  activated when pressing a button.
 * @returns {JSX.Element} -This React Element creates a filter which is used in the "ControllerBtnsInteraction" component to set a dropshadow filter
 */

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
