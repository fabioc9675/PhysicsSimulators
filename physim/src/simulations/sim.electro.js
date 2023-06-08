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
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion FC"
                pathUrl={dataSim.simFiCh.path}
                imgDir={dataSim.simFiCh.icon}
                title={dataSim.simFiCh.title}
                abstract={dataSim.simFiCh.abst}
              />
            </div>
          </div>
        </div>

        <div className="SimFrame">
          <div className="Simulators-pane">
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion IM"
                pathUrl={dataSim.simIsMo.path}
                imgDir={dataSim.simIsMo.icon}
                title={dataSim.simIsMo.title}
                abstract={dataSim.simIsMo.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion IM_20231"
                pathUrl={dataSim.simIsMa20231.path}
                imgDir={dataSim.simIsMa20231.icon}
                title={dataSim.simIsMa20231.title}
                abstract={dataSim.simIsMa20231.abst}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
