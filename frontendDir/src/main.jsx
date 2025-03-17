import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TripProvider } from "./pages/main/utils/TripContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <TripProvider>
    <App />
  </TripProvider>
);
