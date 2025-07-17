import React, { useEffect, useRef } from 'react';

/**
 * A React component to manage a WebSocket connection for joystick and button inputs.
 * @param {object} props - The component props.
 * @param {string} props.mode - The connection mode. The WebSocket is only initialized if this is 'websocket'.
 */
const WebSocketController = ({ mode }) => {
  // useRef is used to hold the WebSocket instance across re-renders without causing them.
  const websocket = useRef(null);

  // Handles incoming data from the WebSocket.
  const handleInput = (data) => {
    if (data.joystick) {
      console.log('joystick position changed', data.joystick);
    }
    if (data.button) {
      // data.button has the number of the button
      console.log('button pressed', data.button);
    }
  };

  // useEffect handles side effects like subscriptions, timers, and connections.
  useEffect(() => {
    // Only initialize the WebSocket if the mode is correct.
    if (mode === 'websocket') {
      // Initialize the WebSocket connection.
      websocket.current = new WebSocket('ws://localhost:8080');

      // Set up the message listener.
      websocket.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleInput(data);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      websocket.current.onopen = () => console.log('WebSocket connection established.');
      websocket.current.onerror = (error) => console.error('WebSocket error:', error);
    }

    return () => {
      if (websocket.current) {
        websocket.current.close();
        console.log('WebSocket connection closed.');
      }
    };
  }, [mode]); // The effect depends on the 'mode' prop.

  // This component does not render any UI, it only manages the WebSocket logic.
  return null;
};

export default WebSocketController;