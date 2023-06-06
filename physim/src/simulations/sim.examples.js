import React from "react";

// import data of simulators
import dataSim from "../data/data.json";

import SimDescriptor from "../components/SimDescriptor";

// Styles
import "../styles/TabsView.css";

export default function SimExamples() {
  return (
    <div className="TabFrame-pane tab-pane-right">
      <div className="TabFrame-pane tab-pane-right-content">
        <div className="SimFrame">
          <div className="Simulators-pane">
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion 1"
                pathUrl={dataSim.sim01.path}
                imgDir={dataSim.sim01.icon}
                title={dataSim.sim01.title}
                abstract={dataSim.sim01.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion 2"
                pathUrl={dataSim.sim02.path}
                imgDir={dataSim.sim02.icon}
                title={dataSim.sim02.title}
                abstract={dataSim.sim02.abst}
              />
            </div>
          </div>
        </div>
        <div className="SimFrame">
          <div className="Simulators-pane">
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion 3"
                pathUrl={dataSim.sim03.path}
                imgDir={dataSim.sim03.icon}
                title={dataSim.sim03.title}
                abstract={dataSim.sim03.abst}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
