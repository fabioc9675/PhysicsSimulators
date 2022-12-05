import React from "react";

// import data of simulators
import dataSim from "../data/data.json";

import SimDescriptor from "../components/SimDescriptor";

// Styles
import "../styles/TabsView.css";

export default function SimMechanics() {
  return (
    <div className="TabFrame-pane tab-pane-right">
      <div className="TabFrame-pane tab-pane-right-content">
        <div className="SimFrame">
          <div className="Simulators-pane">
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion ET"
                pathUrl={dataSim.simEnTr.path}
                imgDir={dataSim.simEnTr.icon}
                title={dataSim.simEnTr.title}
                abstract={dataSim.simEnTr.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion MA"
                pathUrl={dataSim.simMeAx.path}
                imgDir={dataSim.simMeAx.icon}
                title={dataSim.simMeAx.title}
                abstract={dataSim.simMeAx.abst}
              />
            </div>
          </div>
        </div>

        <div className="SimFrame">
          <div className="Simulators-pane">
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion EC"
                pathUrl={dataSim.simEnCo.path}
                imgDir={dataSim.simEnCo.icon}
                title={dataSim.simEnCo.title}
                abstract={dataSim.simEnCo.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion BD"
                pathUrl={dataSim.simBoDr.path}
                imgDir={dataSim.simBoDr.icon}
                title={dataSim.simBoDr.title}
                abstract={dataSim.simBoDr.abst}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
