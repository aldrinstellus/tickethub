import * as React from "react";
import * as ReactDOM from "react-dom/client";
// import "./index.css"; // Temporarily disabled
import App from "./App.tsx";

console.log("=== MAIN.TSX EXECUTING ===");
console.log("React:", React);
console.log("ReactDOM:", ReactDOM);

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (rootElement) {
  console.log("Creating React root...");
  const root = ReactDOM.createRoot(rootElement);
  console.log("Rendering app...");
  root.render(<App />);
  console.log("=== RENDER COMPLETE ===");
} else {
  console.error("ROOT ELEMENT NOT FOUND!");
}
