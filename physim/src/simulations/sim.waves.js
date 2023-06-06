import React from "react";

// import data of simulators
import dataSim from "../data/data.json";

import SimDescriptor from "../components/SimDescriptor";

// Styles
import "../styles/TabsView.css";

export default function SimWaves() {
  return (
    <div className="TabFrame-pane tab-pane-right">
      <div className="TabFrame-pane tab-pane-right-content">
        <div className="SimFrame">
          <div className="Simulators-pane">
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion SP"
                pathUrl={dataSim.simSiPe.path}
                imgDir={dataSim.simSiPe.icon}
                title={dataSim.simSiPe.title}
                abstract={dataSim.simSiPe.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion DO"
                pathUrl={dataSim.simDaOs.path}
                imgDir={dataSim.simDaOs.icon}
                title={dataSim.simDaOs.title}
                abstract={dataSim.simDaOs.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion DP"
                pathUrl={dataSim.simDoPe.path}
                imgDir={dataSim.simDoPe.icon}
                title={dataSim.simDoPe.title}
                abstract={dataSim.simDoPe.abst}
              />
            </div>
          </div>
        </div>

        <div className="SimFrame">
          <div className="Simulators-pane">
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion CO"
                pathUrl={dataSim.simCoOs.path}
                imgDir={dataSim.simCoOs.icon}
                title={dataSim.simCoOs.title}
                abstract={dataSim.simCoOs.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion SR"
                pathUrl={dataSim.simSuRe.path}
                imgDir={dataSim.simSuRe.icon}
                title={dataSim.simSuRe.title}
                abstract={dataSim.simSuRe.abst}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
