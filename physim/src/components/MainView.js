import React, { useEffect } from "react";
import "../styles/MainView.css";

import ReactGA from "react-ga";

// import data of simulators
import dataSim from "../data/data.json";

// local imports
import SimDescriptor from "./SimDescriptor";
import MainInfo from "./MainInfo";
import DesignInfo from "./DesignInfo";

export default function MainView() {
  const logo = "resources/logos/UdeA.png";

  useEffect(() => {
    ReactGA.initialize("UA-208799821-1");
    // to report page view
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

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
        <div className="MainFrame-pane pane-right">
          <div className="MainFrame-pane pane-right-content">
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
          <div className="Content">
            <DesignInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
