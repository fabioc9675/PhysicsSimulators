import React from "react";
import "../styles/MainInfo.css";

import description from "../textFiles/lorem.json";

export default function MainInfo() {
  const logo = "resources/logos/UdeA.png";
  //console.log(description.text);
  return (
    <div className="MainInfo-pane">
      <div className="MainInfo-Title">Descripción</div>
      <div className="MainInfo-Body">{description.text}</div>
      <img className="MainInfo-Logo" src={logo} alt="" height="5%" />
    </div>
  );
}
