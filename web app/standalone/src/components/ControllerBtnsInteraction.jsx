import React, { useEffect, useRef, useCallback, useState } from "react";
import ControllerBtns from "./ControllerBtns";
import { API_IP } from "../config";

/**
 * This component handles the entire button interaction within the webapp. 
 * It handles each visual state and interaction when a button is either pressed or released. 
 * ####TOAST ergänzen
 * ####JOYSTICK ergänzen
 */


// ===================================================================
// Toast Component and Styles (self-contained)
// ===================================================================

const toastStyles = {
  // Base container style
  container: {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 20px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "white",
    fontSize: "16px",
    fontFamily: "sans-serif",
    zIndex: 9999,
    transition: "opacity 0.3s, top 0.3s", // Basic transition for appearance
  },
  // Style for success toasts (green)
  success: {
    backgroundColor: "#28a745",
  },
  // Style for info toasts (blue)
  info: {
    backgroundColor: "#17a2b8",
  },
  // Style for error toasts (red)
  error: {
    backgroundColor: "#dc3545",
  },
};

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// The Toast component, now defined locally
const Toast = ({ message, type }) => {
  // Merge the base style with the type-specific style (e.g., success, info)
  const combinedStyle = { ...toastStyles.container, ...toastStyles[type] };

  return (
    <div style={combinedStyle}>
      {type === "success" ? <CheckIcon /> : <InfoIcon />}
      <span>{message}</span>
    </div>
  );
};

/* A custom hook to prevent stale closures. */
const useLatest = (value) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
};

// ===================================================================
// Main component with integrated Toast logic
// ===================================================================

/**
 *
 * @param {Function} setShowGallery - sets visibility of gallery image
 * @param {Function} setShowGalleryMenu - sets visibility of gallery sidebar menu
 * @param {Function} setShowAutofocusMenu  - sets visibility of autofocusmenu
 * @param {number} currentIndex - current index of the shown image
 * @param {Function} setCurrentIndex - sets the current index
 * @param {number} imagesLength - total number of images
 * @returns
 */
function ControllerBtnsInteraction({
  setShowGallery,
  setShowGalleryMenu,
  setShowAutofocusMenu,
  currentIndex,
  setCurrentIndex,
  imagesLength,
}) {
  const websocketRef = useRef(null);
  const lastButtonPressedRef = useRef(null);
  const currentMenu = useRef("main");

  // State for the toast
  const [toastInfo, setToastInfo] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const toastTimerRef = useRef(null);

  // Helper function to show the toast
  const showToast = useCallback((message, type = "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastInfo({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToastInfo({ show: false, message: "", type: "success" });
    }, 3000); // Hide after 3 seconds
  }, []);

  // Starts autofocus with pre-defined values
  const autoFocus1 = () => {
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

  // Starts autofocus with pre-defined values
  const autoFocus2 = () => {
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

  // Starts autofocus with pre-defined values
  const autoFocus3 = () => {
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

  // Takes picture and closes other menus. This ensures that no menus overlap
  const captureImage = useCallback(() => {
    fetch(`http://${API_IP}:5000/api/v2/actions/camera/capture/`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("image successfully captured", data);
        showToast("Bild gespeichert!", "success");
      })
      .catch((err) => {
        console.error("error", err);
        showToast("Speichern fehlgeschlagen!", "error");
      });
    setShowGallery(false);
    setShowGalleryMenu(false);
    setShowAutofocusMenu(false);
  }, [
    API_IP,
    setShowAutofocusMenu,
    setShowGallery,
    setShowGalleryMenu,
    showToast,
  ]);

  // Starts Focus Stack
  const focusStack = useCallback(() => {
    showToast("Starte Focus Stacking", "success");
    fetch(
      `http://${API_IP}:5000/api/v2/extensions/org.openflexure.focus-stack/acquire_and_fuse_stack`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    ).catch((err) => {
      console.error("Focus stack error", err);
      showToast("Focus stack fehlgeschlagen.", "error");
    });
  }, [API_IP, showToast]);

  /**
   * This function links the predefined IDs used for the buttons in the ControllerBtns component (button-a, ...) and links them to numbers.
   * When one of the buttons is being released, the button will be reset to its initial visual state.
   *
   * @param {number} buttonId - ID of the released button
   */
  const handleButtonUp = (buttonId) => {
    const buttonMap = {
      1: "button-a",
      2: "button-d",
      3: "button-b",
      4: "button-c",
    };
    const elementId = buttonMap[buttonId];
    if (elementId) {
      const buttonElement = document.getElementById(elementId);
      if (buttonElement) {
        //sets main visual button state
        buttonElement.setAttribute("fill", "white");
        buttonElement.setAttribute("fill-opacity", "0.6");
        buttonElement.removeAttribute("filter");
      }
    }
  };

  /**
   * This function handles each button if one of them is being pressed. 
   * It sets visual values and handles opening/closing menus. 
   * @param {Object} a - Object that contains button information
   * @param {number} a.button - ID of the button that was pressed
   */
  const handleButtonDown = useCallback(
    (a) => {
      // Prevents handling the same button press multiple times in a row
      if (lastButtonPressedRef.current === a.button) return;
      lastButtonPressedRef.current = a.button;

      // Sets visual attributes for each button when being pressed
      const buttonMap = {
        1: "button-a",
        2: "button-d",
        3: "button-b",
        4: "button-c",
      };
      const elementId = buttonMap[a.button];
      if (elementId) {
        const buttonElement = document.getElementById(elementId);
        if (buttonElement) {
          buttonElement.setAttribute("fill", "white");
          buttonElement.setAttribute("fill-opacity", "1");
          buttonElement.setAttribute("filter", "url(#dropshadowbtns)");
        }
      }

      if (a.button === 1) {
        // Button A
        if (currentMenu.current === "main") captureImage();
        else if (currentMenu.current === "autofocus") {
          autoFocus3();
          showToast("Starte Autofocus full", "info");
        }
      } else if (a.button === 3) {
        // Button B
        if (currentMenu.current === "main") {
          setShowAutofocusMenu(true);
          currentMenu.current = "autofocus";
        } else if (currentMenu.current === "autofocus") {
          setShowAutofocusMenu(false);
          currentMenu.current = "main";
        } else if (currentMenu.current === "gallery") {
          if (currentIndex < imagesLength - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            showToast("Das ist das letzte Bild.", "info");
          }
        }
      } else if (a.button === 4) {
        // Button C
        if (currentMenu.current === "main") {
          setShowGallery(true);
          setShowGalleryMenu(true);
          currentMenu.current = "gallery";
        } else if (currentMenu.current === "gallery") {
          setShowGallery(false);
          setShowGalleryMenu(false);
          currentMenu.current = "main";
        } else if (currentMenu.current === "autofocus") {
          autoFocus1();
          showToast("Starte Autofocus fine", "info");
        }
      } else if (a.button === 2) {
        // Button D
        if (currentMenu.current === "main") {
          focusStack();
        } else if (currentMenu.current === "gallery") {
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          } else {
            showToast("Das ist das erste Bild.", "info");
          }
        } else if (currentMenu.current === "autofocus") {
          autoFocus2();
          showToast("Starte Autofocus medium", "info");
        }
      }
      /**
       * This function delays the button release, allowing the same or other buttons to be detected as newly pressed afterward.
       */
      setTimeout(() => {
        handleButtonUp(a.button);
        lastButtonPressedRef.current = null;
      }, 100);
    },
    [
      currentIndex,
      imagesLength,
      setCurrentIndex,
      setShowAutofocusMenu,
      setShowGallery,
      setShowGalleryMenu,
      showToast,
      captureImage,
      focusStack,
    ]
  );

  const latestButtonDownHandler = useLatest(handleButtonDown);

  const handleJoyStick = useCallback(
    (x, y) => {
      const joystickBase = document.getElementById("joystick-base");
      const joystickHandle = document.getElementById("joystick-handle");
      const rect = joystickBase.getBoundingClientRect();
      const radius = rect.width / 2;

      x = x * radius;
      y = y * radius;

      joystickHandle.style.left = `${x + radius}px`;
      joystickHandle.style.top = `${-y + radius}px`;
    },
    [showToast]
  );
  const latestJoyStickHandler = useLatest(handleJoyStick);

  useEffect(() => {
    const serverAddress = `ws://${API_IP}:6789`;
    let ws;

    const connectWebsocket = () => {
      console.log("Attempting to connect to WebSocket server...");
      ws = new WebSocket(serverAddress);
      websocketRef.current = ws;

      ws.onopen = () => console.log("Connection established.");

      ws.onmessage = (event) => {
        console.log("Message from server: ", event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.button) {
            latestButtonDownHandler.current(data);
          }
          if (data.joystick) {
            latestJoyStickHandler.current(data.joystick.x, data.joystick.y);
          }
        } catch (error) {
          console.error("Error parsing message data", error);
        }
      };

      ws.onerror = (error) => console.error(`WebSocket Error:`, error);

      ws.onclose = () => {
        console.error("Connection died. Reconnecting in 5 seconds...");
        setTimeout(connectWebsocket, 5000);
      };
    };

    connectWebsocket();

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      if (websocketRef.current) {
        websocketRef.current.onclose = null;
        websocketRef.current.close();
      }
    };
  }, [API_IP, latestButtonDownHandler]);

  return (
    <>
      {toastInfo.show && (
        <Toast message={toastInfo.message} type={toastInfo.type} />
      )}
      <ControllerBtns />
    </>
  );
}

export default ControllerBtnsInteraction;
