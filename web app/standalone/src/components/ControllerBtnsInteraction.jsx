import React, { useEffect, useRef } from "react";
import ControllerBtns from "./ControllerBtns";
/* This component sets the attributes for each individual button.*/

/* Buttons neubelegen, wenn z.B. smartAutofocus gewählt wurde. Auf Hauptbuttons alle Funktionen 
setzen, Menü rausnehmen*/

function ControllerBtnsInteraction({
  setShowMenu,
  setShowGallery,
  setShowGalleryMenu,
  setShowAutofocusMenu,
}) {
  const lastButtonPressedRef = useRef(null);
  useEffect(() => {
    const serverAddress = `ws://10.0.1.10:6789`;
    let websocket = null;

    const handleButtonDown = (a) => {
      console.log("Button: ", a.button);
      if (lastButtonPressedRef.current === a.button) return; //checks current value, if 1 it does nothing and prevents repeating process
      lastButtonPressedRef.current = a.button; //Marks this button as currently "pressed" to block re-processing until released

      if (a.button === 1) {
        /**Capture */
        const buttonA = document.getElementById("button-a");
        if (buttonA) {
          buttonA.setAttribute("fill", "white");
          buttonA.setAttribute("fill-opacity", "1");
          buttonA.setAttribute("filter", "url(#dropshadowbtns)");
        }
        /*pressing button A calls the capture method of openflexure and takes a picture*/
        fetch("http://10.0.1.10:5000/api/v2/actions/camera/capture/", {
          method: "POST",
        })
          .then((res) => res.json())
          .then((data) => console.log("image successfully captured", data))
          .catch((err) => console.error("error", err));
        setShowGallery(false);
        setShowGalleryMenu(false);
        setShowAutofocusMenu(false);
        setTimeout(() => {
          handleButtonUp(a);
          lastButtonPressedRef.current = null;
        }, 100); //Simulates button release after 100ms and allows button to be processed again
      } else if (a.button === 2) {
        /**Autofocusmenu & 3 modes */
        const buttonB = document.getElementById("button-b");
        if (buttonB) {
          buttonB.setAttribute("fill", "white");
          buttonB.setAttribute("fill-opacity", "1");
          buttonB.setAttribute("filter", "url(#dropshadowbtns)");
        }
        setShowAutofocusMenu((prev) => !prev);
        setShowGallery(false);
        setShowGalleryMenu(false);
        setTimeout(() => {
          handleButtonUp(a);
          lastButtonPressedRef.current = null;
        }, 100);
      } else if (a.button === 3) {
        const buttonC = document.getElementById("button-c");
        if (buttonC) {
          /**FocusStack */
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
        setShowGallery(false);
        setShowGalleryMenu(false);
        setShowAutofocusMenu(false);
        setTimeout(() => {
          handleButtonUp(a);
          lastButtonPressedRef.current = null;
        }, 100);
      } else if (a.button === 4) {
        /**Galerie */
        const buttonD = document.getElementById("button-d");
        if (buttonD) {
          buttonD.setAttribute("fill", "white");
          buttonD.setAttribute("fill-opacity", "1");
          buttonD.setAttribute("filter", "url(#dropshadowbtns)");
        }
        setShowAutofocusMenu(false);
        setShowGallery((prev) => !prev); /*sets gallery visible/closes it*/
        setShowGalleryMenu(
          (prev) => !prev
        ); /*sets gallery data visible/closes it*/
        setTimeout(() => {
          handleButtonUp(a);
          lastButtonPressedRef.current = null;
        }, 100);
      }
    };

    const handleButtonUp = (a) => {
      /*param a: key input
            set btn attributes when button is released (white, reduced opacity, remove dropshadow)*/
      if (a.button === 1) {
        const buttonA = document.getElementById("button-a");
        if (buttonA) {
          buttonA.setAttribute("fill", "white");
          buttonA.setAttribute("fill-opacity", "0.6");
          buttonA.removeAttribute("filter");
        }
      } else if (a.button === 2) {
        const buttonB = document.getElementById("button-b");
        if (buttonB) {
          buttonB.setAttribute("fill", "white");
          buttonB.setAttribute("fill-opacity", "0.6");
          buttonB.removeAttribute("filter");
        }
      } else if (a.button === 3) {
        const buttonC = document.getElementById("button-c");
        if (buttonC) {
          buttonC.setAttribute("fill", "white");
          buttonC.setAttribute("fill-opacity", "0.6");
          buttonC.removeAttribute("filter");
        }
      } else if (a.button === 4) {
        const buttonD = document.getElementById("button-d");
        if (buttonD) {
          buttonD.setAttribute("fill", "white");
          buttonD.setAttribute("fill-opacity", "0.6");
          buttonD.removeAttribute("filter");
        }
      }
    };

    const connectWebsocket = () => {
      console.log("Attempting to connect to WebSocket server...");
      websocket = new WebSocket(serverAddress);

      websocket.onopen = (event) => console.log("Connection established.");
      websocket.onmessage = (event) => {
        console.log("Message from server: ", event.data);
        const data = JSON.parse(event.data);
        if (data.button) {
          handleButtonDown(data);
          setTimeout(() => handleButtonUp(data), 100);
        }
      };

      websocket.onerror = (error) =>
        console.error(`WebSocket Error: ${error.message}`);
      websocket.onclose = (event) => {
        console.error("Connection died. Reconnecting in 5 seconds...");
        setTimeout(connectWebsocket, 5000);
      };
    };

    connectWebsocket();

    return () => websocket && websocket.close();
  }, [setShowGallery, setShowGalleryMenu, setShowMenu]);

  return <ControllerBtns />;
}

export default ControllerBtnsInteraction;
