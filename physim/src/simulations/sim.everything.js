import React from "react";

// import data of simulators
import dataSim from "../data/data.json";

import SimDescriptor from "../components/SimDescriptor";

// Styles
import "../styles/TabsView.css";

export default function SimEverything() {
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
                buttonLabel="Simulacion IG"
                pathUrl={dataSim.simIdGa.path}
                imgDir={dataSim.simIdGa.icon}
                title={dataSim.simIdGa.title}
                abstract={dataSim.simIdGa.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion LV"
                pathUrl={dataSim.simLoVo.path}
                imgDir={dataSim.simLoVo.icon}
                title={dataSim.simLoVo.title}
                abstract={dataSim.simLoVo.abst}
              />
            </div>
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
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion MA"
                pathUrl={dataSim.simMeAx.path}
                imgDir={dataSim.simMeAx.icon}
                title={dataSim.simMeAx.title}
                abstract={dataSim.simMeAx.abst}
              />
            </div>
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
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion BD"
                pathUrl={dataSim.simBoDr.path}
                imgDir={dataSim.simBoDr.icon}
                title={dataSim.simBoDr.title}
                abstract={dataSim.simBoDr.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion DO_20231"
                pathUrl={dataSim.simDoOs20231.path}
                imgDir={dataSim.simDoOs20231.icon}
                title={dataSim.simDoOs20231.title}
                abstract={dataSim.simDoOs20231.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion FM_20231"
                pathUrl={dataSim.simFlMo20231.path}
                imgDir={dataSim.simFlMo20231.icon}
                title={dataSim.simFlMo20231.title}
                abstract={dataSim.simFlMo20231.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion PL_20231"
                pathUrl={dataSim.simPaLa20231.path}
                imgDir={dataSim.simPaLa20231.icon}
                title={dataSim.simPaLa20231.title}
                abstract={dataSim.simPaLa20231.abst}
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
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion BB"
                pathUrl={dataSim.simBlBo.path}
                imgDir={dataSim.simBlBo.icon}
                title={dataSim.simBlBo.title}
                abstract={dataSim.simBlBo.abst}
              />
            </div>
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
                buttonLabel="Simulacion RP_20231"
                pathUrl={dataSim.simRiPe20231.path}
                imgDir={dataSim.simRiPe20231.icon}
                title={dataSim.simRiPe20231.title}
                abstract={dataSim.simRiPe20231.abst}
              />
            </div>
            <div className="SimButton">
              <SimDescriptor
                buttonLabel="Simulacion HA_20231"
                pathUrl={dataSim.simHyAt20231.path}
                imgDir={dataSim.simHyAt20231.icon}
                title={dataSim.simHyAt20231.title}
                abstract={dataSim.simHyAt20231.abst}
              />
            </div>

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
