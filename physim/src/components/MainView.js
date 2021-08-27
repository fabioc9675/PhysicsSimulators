import React from "react";
import "../styles/MainView.css";
import SimDescriptor from "./SimDescriptor";

// local imports
import logo from "../logos/UdeA.png";
import MainInfo from "./MainInfo";

export default function MainView() {
  return (
    <div className="MainFrame">
      <div className="MainFrame pane-title">
        <div></div>
        <div>Proyecto simuladores</div>
        <img src={logo} alt="" height="80%" />
      </div>
      <div className="MainFrame-pane">
        <div className="MainFrame-pane pane-left">
          <MainInfo />
        </div>

        <div>
          <div className="SimButton">
            <SimDescriptor buttonLabel="Simulacion 1" pathUrl="/simul_01" />
          </div>
          <div className="SimButton">
            <SimDescriptor buttonLabel="Simulacion 2" pathUrl="/simul_02" />
          </div>
          <div className="SimButton">
            <SimDescriptor buttonLabel="Simulacion 3" pathUrl="/simul_03" />
          </div>
        </div>
      </div>
    </div>
  );
}
