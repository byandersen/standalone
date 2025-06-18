import DropshadowBtns from "./DropshadowBtns";

/*This component creates the SVG for the Buttons-Controller. The SVGs have been creating
using an online Tool from the Website: https://editsvgcode.com/. Each Button is given an unique
ID, which is later used to fetch the buttons to set their attributes when pressed.*/

function ControllerBtns() {
  return (
    <div className="interactive-buttons">
      <svg
        width="72"
        height="68"
        viewBox="0 0 72 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <DropshadowBtns />
        <circle
          id="button-a" //id for eventlistener in ControllerBtnsInteraction component
          cx="36"
          cy="10"
          r="10"
          fill="white"
          fillOpacity="0.6"
        />
        <circle
          id="button-b"
          cx="62"
          cy="34"
          r="10"
          fill="white"
          fillOpacity="0.6"
        />
        <circle
          id="button-c"
          cx="36"
          cy="58"
          r="10"
          fill="white"
          fillOpacity="0.6"
        />
        <circle
          id="button-d"
          cx="10"
          cy="34"
          r="10"
          fill="white"
          fillOpacity="0.6"
        />
      </svg>
    </div>
  );
}

export default ControllerBtns;
