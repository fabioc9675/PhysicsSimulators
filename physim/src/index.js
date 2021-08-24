import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import SimFrame from "./components/SimFrame";

ReactDOM.render(
  <React.StrictMode>
    <SimFrame
      paneTitle={"Gravitación Universal"}
      url={
        "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/main/SolarSystem/sketch.js"
      }
      doc={
        "https://docs.google.com/gview?url=https://github.com/fabioc9675/PhysicsSimulators/raw/main/SolarSystem/Theory.pdf&embedded=true"
      }
      act={
        "https://docs.google.com/gview?url=https://github.com/fabioc9675/PhysicsSimulators/raw/main/SolarSystem/Activity.pdf&embedded=true"
      }
      author={["Fabian Castaño", "Jaime Ososrio", "Jhon Jaramillo"]}
      email={["email_01@email.com", "email_02@email.com", "email_03@email.com"]}
    />
  </React.StrictMode>,
  document.getElementById("root")
);
