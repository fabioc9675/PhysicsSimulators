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
      doc={
        "https://docs.google.com/gview?url=https://github.com/fabioc9675/PhysicsSimulators/raw/main/SolarSystem/Theory.pdf&embedded=true"
      }
      act={
        "https://docs.google.com/gview?url=https://github.com/fabioc9675/PhysicsSimulators/raw/main/SolarSystem/Activity.pdf&embedded=true"
      }
    />
  </React.StrictMode>,
  document.getElementById("root")
);
