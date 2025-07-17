import React, { useEffect } from "react";
import ControllerBtns from "./ControllerBtns";
/* This component sets the attributes for each individual button.*/

/* Buttons neubelegen, wenn z.B. smartAutofocus gewählt wurde. Auf Hauptbuttons alle Funktionen 
setzen, Menü rausnehmen*/

function ControllerBtnsInteraction({ setShowMenu, setShowGallery, setShowGalleryMenu }) {

  useEffect(() => {
    const handleKeyDown = (a) => {
      if (a.key === "a") {
        /*param a: key input
      set btn attributes when button is pressed (white, full opacity, add dropshadow)*/
        const buttonA = document.getElementById("button-a");
        if (buttonA) {
          buttonA.setAttribute("fill", "white");
          buttonA.setAttribute("fill-opacity", "1");
          buttonA.setAttribute("filter", "url(#dropshadowbtns)");
        }
        setShowGallery((prev) => !prev); /*sets gallery visible/closes it*/
        setShowGalleryMenu((prev) => !prev); /*sets gallery data visible/closes it*/
        setShowMenu((prev) => !prev); /*sets sidebar menu visible/closes it*/
      } else if (a.key === "b") {
        const buttonB = document.getElementById("button-b");
        if (buttonB) {
          buttonB.setAttribute("fill", "white");
          buttonB.setAttribute("fill-opacity", "1");
          buttonB.setAttribute("filter", "url(#dropshadowbtns)");
        }
        /*pressing button B calls the capture method of openflexure and takes a picture*/
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
        /*pressing button C calls and runs the focus-stack extension*/
        fetch(
          "http://10.0.1.10:5000/api/v2/extensions/org.openflexure.focus-stack/acquire_and_fuse_stack",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            /*setting parameters which the extension expects*/
            body: JSON.stringify({
              settle: 0.6,
              start_offset: -300,
              step_size: 40,
              blur: 21,
              output_name: "fused.jpg",
              weights_alpha: 25,
              levels: 10,
              end_offset: 300,
            }),
          }
        );
      } else if (a.key === "d") {
        const buttonD = document.getElementById("button-d");
        if (buttonD) {
          buttonD.setAttribute("fill", "white");
          buttonD.setAttribute("fill-opacity", "1");
          buttonD.setAttribute("filter", "url(#dropshadowbtns)");
        }
        /*pressing button D calls and runs the smart-autofocus extension*/
        //3 Modi, einmal 400 mit 5 steps, 800 mit 10 steps, 1200 mit 15 steps
        fetch(
          "http://10.0.1.10:5000/api/v2/extensions/org.openflexure.smart-autofocus/smart_autofocus",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            /*setting parameters which the extension expects*/
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
      }
    };

    const handleKeyUp = (a) => {
      /*param a: key input
      set btn attributes when button is released (white, reduced opacity, remove dropshadow)*/
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
