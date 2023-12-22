import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster
      toastOptions={{
        style: {
          background: "#1A2F4B",
          color: "white",
        },
      }}
    />
    <App />
  </React.StrictMode>
);
