/* eslint-disable @typescript-eslint/no-require-imports */
// Test WebSocket Server for Temperature Vitals
// Run with: node temperature-ws-server.js

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8081 });

console.log(
  "Temperature WebSocket Server running on ws://localhost:8080/temperature"
);

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Simulate sensor data after 2 seconds
  setTimeout(() => {
    const batimento = {
      batimento: "89bpm / 89%",
    };

    console.log("Sending temperature data:", batimento);
    ws.send(JSON.stringify(batimento));
  }, 2000);

  ws.on("message", (message) => {
    console.log("Received:", message);
  });

  ws.on("close", (code, reason) => {
    console.log(`Client disconnected: ${code} - ${reason}`);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Handle server errors
wss.on("error", (error) => {
  console.error("Server error:", error);
});

console.log("WebSocket server ready to accept connections");
