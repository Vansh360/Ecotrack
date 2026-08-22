import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { ActivityProvider } from "./context/ActivityContext";
import { GoalProvider } from "./context/GoalContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter basename="/Ecotrack">
      <ActivityProvider>
        <GoalProvider>
          <App />
        </GoalProvider>
      </ActivityProvider>
    </BrowserRouter>
  </React.StrictMode>
);