import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { ActivityProvider } from "./context/ActivityContext";
import { GoalProvider } from "./context/GoalContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter basename="/Ecotrack">
      <AuthProvider>
        <ActivityProvider>
          <GoalProvider>
            <App />
          </GoalProvider>
        </ActivityProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);