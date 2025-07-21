import {API_IP} from "../config";

function AutofocusMenu({
  showAutofocusMenu,
}) {
  
  const handleMode1 = () => {
    console.log("mode1 clicked");
    fetch(
      `http://${API_IP}:5000/api/v2/extensions/org.openflexure.smart-autofocus/smart_autofocus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coarse_range: 400,
          coarse_steps: 5,
          fine_range: 100,
          fine_steps: 1,
          settle: 0.6,
          metric_name: "variance",
        }),
      }
    );
  };

  const handleMode2 = () => {
    console.log("mode2 clicked");
    fetch(
      `http://${API_IP}:5000/api/v2/extensions/org.openflexure.smart-autofocus/smart_autofocus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coarse_range: 800,
          coarse_steps: 10,
          fine_range: 100,
          fine_steps: 1,
          settle: 0.6,
          metric_name: "variance",
        }),
      }
    );
  };

  const handleMode3 = () => {
    console.log("mode3 clicked");
    fetch(
      `http://${API_IP}:5000/api/v2/extensions/org.openflexure.smart-autofocus/smart_autofocus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coarse_range: 1200,
          coarse_steps: 15,
          fine_range: 100,
          fine_steps: 1,
          settle: 0.6,
          metric_name: "variance",
        }),
      }
    );
  };
  return (
    <>
      {showAutofocusMenu && (
        <div className="autofocus-menu">
          <h1>Smart-Autofocus</h1>
        </div>
      )}
    </>
  );
}

export default AutofocusMenu;
