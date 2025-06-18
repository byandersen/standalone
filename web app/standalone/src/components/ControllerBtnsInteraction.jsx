import React, { useEffect } from "react";
import ControllerBtns from "./ControllerBtns";

/* This component sets the attributes for each individual button.*/ 

function ControllerBtnsInteraction({ setShowButtons }) {
  useEffect(() => {
    const handleKeyDown = (a) => {
      if (a.key === "a") {
        const buttonA = document.getElementById("button-a");
        if (buttonA) {
          buttonA.setAttribute("fill", "white");
          buttonA.setAttribute("fill-opacity", "1");
          buttonA.setAttribute("filter", "url(#dropshadowbtns)");
        }
        setShowButtons(true);
      } else if (a.key === "b") {
        const buttonB = document.getElementById("button-b");
        if (buttonB) {
          buttonB.setAttribute("fill", "white");
          buttonB.setAttribute("fill-opacity", "1");
          buttonB.setAttribute("filter", "url(#dropshadowbtns)");
        }
        fetch("http://10.0.1.10:5000/api/v2/actions/camera/capture/", {
          method: "POST",
        })
          .then((res) => res.json())
          .then((data) => console.log("image successfully captured", data))
          .catch((err) => console.error("error", err));
      } else if (a.key === "c") {
        const buttonC = document.getElementById("button-c");
        if (buttonC) {
          buttonC.setAttribute("fill", "white");
          buttonC.setAttribute("fill-opacity", "1");
          buttonC.setAttribute("filter", "url(#dropshadowbtns)");
        }
      } else if (a.key === "d") {
        const buttonD = document.getElementById("button-d");
        if (buttonD) {
          buttonD.setAttribute("fill", "white");
          buttonD.setAttribute("fill-opacity", "1");
          buttonD.setAttribute("filter", "url(#dropshadowbtns)");
        }
      }
    };

    const handleKeyUp = (a) => {
      if (a.key === "a") {
        const buttonA = document.getElementById("button-a");
        if (buttonA) {
          buttonA.setAttribute("fill", "white");
          buttonA.setAttribute("fill-opacity", "0.6");
          buttonA.removeAttribute("filter");
        }
      } else if (a.key === "b") {
        const buttonB = document.getElementById("button-b");
        if (buttonB) {
          buttonB.setAttribute("fill", "white");
          buttonB.setAttribute("fill-opacity", "0.6");
          buttonB.removeAttribute("filter");
        }
      } else if (a.key === "c") {
        const buttonC = document.getElementById("button-c");
        if (buttonC) {
          buttonC.setAttribute("fill", "white");
          buttonC.setAttribute("fill-opacity", "0.6");
          buttonC.removeAttribute("filter");
        }
      } else if (a.key === "d") {
        const buttonD = document.getElementById("button-d");
        if (buttonD) {
          buttonD.setAttribute("fill", "white");
          buttonD.setAttribute("fill-opacity", "0.6");
          buttonD.removeAttribute("filter");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return <ControllerBtns />;
}

export default ControllerBtnsInteraction;
