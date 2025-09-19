import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

console.log("Main.tsx loading...");

const rootElement = document.getElementById("root");

if (rootElement) {
  console.log("Creating React root and rendering App...");
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("App rendered successfully");
} else {
  console.error("ROOT ELEMENT NOT FOUND!");
}
