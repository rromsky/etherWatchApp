import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter, Route, Routes } from "react-router-dom";
// import Web3Load from "./Components/web3/web3account";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter basename="/">
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
