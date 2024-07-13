import React from "react";
import ReactDOM from "react-dom/client";
import NFCWriter from "./components/NFCWriter";
import ErrorBoundary from "./components/ErrorBoundary";
import "bootstrap/dist/css/bootstrap.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <NFCWriter />
    </ErrorBoundary>
  </React.StrictMode>
);
