/* eslint-disable @typescript-eslint/no-require-imports */
// Test WebSocket Server for Temperature Vitals
// Run with: node temperature-ws-server.js

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

console.log(
  "Temperature WebSocket Server running on ws://localhost:8080/temperature"
);

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Simulate sensor data after 2 seconds
  setTimeout(() => {
    const temperatureData = {
      temperature: (36 + Math.random() * 2).toFixed(1), // Random temp between 36-38°C
      unit: "C",
      timestamp: new Date().toISOString(),
    };

    console.log("Sending temperature data:", temperatureData);
    ws.send(JSON.stringify(temperatureData));
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
