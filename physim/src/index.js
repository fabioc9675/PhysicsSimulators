import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import SimFrame from "./components/SimFrame";

ReactDOM.render(
  <React.StrictMode>
    <SimFrame
      url={
        "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/main/SolarSystem/sketch.js"
      }
    />
  </React.StrictMode>,
  document.getElementById("root")
);
