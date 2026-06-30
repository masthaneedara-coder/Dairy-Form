import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { NotificationProvider } from "./context/NotificationContext";
import { NotificationPreferenceProvider } from "./context/NotificationPreferenceContext";
import { ToastProvider } from "./context/ToastContext";

// import ToastContainer from "./components/ToastContainer";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>

      <NotificationPreferenceProvider>

        <ToastProvider>

          <NotificationProvider>

            <App />

            {/* <ToastContainer /> */}

          </NotificationProvider>

        </ToastProvider>

      </NotificationPreferenceProvider>

    </BrowserRouter>
  </React.StrictMode>
);