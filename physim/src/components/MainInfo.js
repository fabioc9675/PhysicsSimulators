import React from "react";
import "../styles/MainInfo.css";

import description from "../logos/lorem.json";
import logo from "../logos/UdeA.png";

export default function MainInfo() {
  console.log(description.text);
  return (
    <div className="MainInfo-pane">
      <div className="MainInfo-Title">Descripción</div>
      <div className="MainInfo-Body">{description.text}</div>
      <img className="MainInfo-Logo" src={logo} alt="" height="5%" />
    </div>
  );
}
