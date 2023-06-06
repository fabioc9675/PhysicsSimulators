import React from "react";
import { useHistory } from "react-router";
import "../styles/SimDescriptor.css";

import ReactGA from "react-ga";

export default function SimDescriptor(props) {
  // component props
  const { buttonLabel, pathUrl, imgDir, title, abstract } = props;

  // URL history
  let history = useHistory();

  // function to handle click
  function HandleClick() {
    // sending information to Google Analytics
    ReactGA.event({
      category: "Button",
      action: "Accessed to " + pathUrl,
    });
    // alert("Se envio informacion a Google Analytics");

    history.push(pathUrl);
  }

  return (
    <div className="desc-pane card-highlight" onClick={HandleClick}>
      <div className="des-pane des-content">
        <div className="des-pane des-title">{title}</div>
        <hr className="desc-line" />
        <div className="des-pane des-abstract">{abstract}</div>
      </div>
      <button className="desc-pane desc-button">
        <img className="des-pane desc-icon" src={imgDir} alt={buttonLabel} />
      </button>
    </div>
  );
}
