import React from "react";

// import data of simulators
import dataSim from "../data/data.json";

import SimDescriptor from "../components/SimDescriptor";

// Styles
import "../styles/TabsView.css";

export default function SimElectro() {
  return (
    <div className="TabFrame-pane tab-pane-right">
      <div className="TabFrame-pane tab-pane-right-content">
        <div className="SimFrame">
          <div className="Simulators-pane">
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion MS"
                pathUrl={dataSim.simMaSp.path}
                imgDir={dataSim.simMaSp.icon}
                title={dataSim.simMaSp.title}
                abstract={dataSim.simMaSp.abst}
              />
            </div>
          </div>
        </div>

        <div className="SimFrame">
          <div className="Simulators-pane"></div>
        </div>
      </div>
    </div>
  );
}
