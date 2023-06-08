import React from "react";

// import data of simulators
import dataSim from "../data/data.json";

import SimDescriptor from "../components/SimDescriptor";

// Styles
import "../styles/TabsView.css";

export default function SimModern() {
  return (
    <div className="TabFrame-pane tab-pane-right">
      <div className="TabFrame-pane tab-pane-right-content">
        <div className="SimFrame">
          <div className="Simulators-pane">
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion BB"
                pathUrl={dataSim.simBlBo.path}
                imgDir={dataSim.simBlBo.icon}
                title={dataSim.simBlBo.title}
                abstract={dataSim.simBlBo.abst}
              />
            </div>
          </div>
        </div>

        <div className="SimFrame">
          <div className="Simulators-pane">
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion HA_20231"
                pathUrl={dataSim.simHyAt20231.path}
                imgDir={dataSim.simHyAt20231.icon}
                title={dataSim.simHyAt20231.title}
                abstract={dataSim.simHyAt20231.abst}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
