import * as React from "react";
import * as ReactDOM from "react-dom/client";
// import "./index.css"; // Temporarily disabled
import App from "./App.tsx";

console.log("=== MAIN.TSX EXECUTING ===");

// Test immediate DOM manipulation
const rootElement = document.getElementById("root");
console.log("Root element found:", !!rootElement);

if (rootElement) {
  // First test: Direct HTML insertion
  rootElement.innerHTML = '<div style="background:blue;color:white;padding:20px;font-size:24px;">DIRECT DOM TEST - BLUE</div>';

  setTimeout(() => {
    console.log("Now testing React rendering...");

    // Then test React
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
    console.log("=== REACT RENDER COMPLETE ===");
  }, 1000);
} else {
  console.error("ROOT ELEMENT NOT FOUND!");
  document.body.innerHTML = '<div style="background:red;color:white;padding:20px;">ROOT NOT FOUND ERROR</div>';
}
