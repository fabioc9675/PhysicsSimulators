import React from "react";
import SimFrame from "./components/SimFrame";
import MainView from "./components/MainView";

// import data of simulators
import dataSim from "../src/data/data.json";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

export default function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Redirect exact from="/" to="/main" />
          <Route exact path="/main" component={MainView} />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simEnTr.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simEnTr.title}
                url={dataSim.simEnTr.url}
                doc={dataSim.simEnTr.doc}
                act={dataSim.simEnTr.act}
                author={dataSim.simEnTr.author}
                email={dataSim.simEnTr.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simIdGa.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simIdGa.title}
                url={dataSim.simIdGa.url}
                doc={dataSim.simIdGa.doc}
                act={dataSim.simIdGa.act}
                author={dataSim.simIdGa.author}
                email={dataSim.simIdGa.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simLoVo.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simLoVo.title}
                url={dataSim.simLoVo.url}
                doc={dataSim.simLoVo.doc}
                act={dataSim.simLoVo.act}
                author={dataSim.simLoVo.author}
                email={dataSim.simLoVo.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simSiPe.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simSiPe.title}
                url={dataSim.simSiPe.url}
                doc={dataSim.simSiPe.doc}
                act={dataSim.simSiPe.act}
                author={dataSim.simSiPe.author}
                email={dataSim.simSiPe.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simEnCo.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simEnCo.title}
                url={dataSim.simEnCo.url}
                doc={dataSim.simEnCo.doc}
                act={dataSim.simEnCo.act}
                author={dataSim.simEnCo.author}
                email={dataSim.simEnCo.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simCoOs.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simCoOs.title}
                url={dataSim.simCoOs.url}
                doc={dataSim.simCoOs.doc}
                act={dataSim.simCoOs.act}
                author={dataSim.simCoOs.author}
                email={dataSim.simCoOs.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simSuRe.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simSuRe.title}
                url={dataSim.simSuRe.url}
                doc={dataSim.simSuRe.doc}
                act={dataSim.simSuRe.act}
                author={dataSim.simSuRe.author}
                email={dataSim.simSuRe.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simBlBo.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simBlBo.title}
                url={dataSim.simBlBo.url}
                doc={dataSim.simBlBo.doc}
                act={dataSim.simBlBo.act}
                author={dataSim.simBlBo.author}
                email={dataSim.simBlBo.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simDaOs.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simDaOs.title}
                url={dataSim.simDaOs.url}
                doc={dataSim.simDaOs.doc}
                act={dataSim.simDaOs.act}
                author={dataSim.simDaOs.author}
                email={dataSim.simDaOs.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simDoPe.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simDoPe.title}
                url={dataSim.simDoPe.url}
                doc={dataSim.simDoPe.doc}
                act={dataSim.simDoPe.act}
                author={dataSim.simDoPe.author}
                email={dataSim.simDoPe.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simMeAx.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simMeAx.title}
                url={dataSim.simMeAx.url}
                doc={dataSim.simMeAx.doc}
                act={dataSim.simMeAx.act}
                author={dataSim.simMeAx.author}
                email={dataSim.simMeAx.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simMaSp.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simMaSp.title}
                url={dataSim.simMaSp.url}
                doc={dataSim.simMaSp.doc}
                act={dataSim.simMaSp.act}
                author={dataSim.simMaSp.author}
                email={dataSim.simMaSp.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simIsMo.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simIsMo.title}
                url={dataSim.simIsMo.url}
                doc={dataSim.simIsMo.doc}
                act={dataSim.simIsMo.act}
                author={dataSim.simIsMo.author}
                email={dataSim.simIsMo.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simFiCh.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simFiCh.title}
                url={dataSim.simFiCh.url}
                doc={dataSim.simFiCh.doc}
                act={dataSim.simFiCh.act}
                author={dataSim.simFiCh.author}
                email={dataSim.simFiCh.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simBoDr.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simBoDr.title}
                url={dataSim.simBoDr.url}
                doc={dataSim.simBoDr.doc}
                act={dataSim.simBoDr.act}
                author={dataSim.simBoDr.author}
                email={dataSim.simBoDr.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simDoOs20231.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simDoOs20231.title}
                url={dataSim.simDoOs20231.url}
                doc={dataSim.simDoOs20231.doc}
                act={dataSim.simDoOs20231.act}
                author={dataSim.simDoOs20231.author}
                email={dataSim.simDoOs20231.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simFlMo20231.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simFlMo20231.title}
                url={dataSim.simFlMo20231.url}
                doc={dataSim.simFlMo20231.doc}
                act={dataSim.simFlMo20231.act}
                author={dataSim.simFlMo20231.author}
                email={dataSim.simFlMo20231.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simPaLa20231.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simPaLa20231.title}
                url={dataSim.simPaLa20231.url}
                doc={dataSim.simPaLa20231.doc}
                act={dataSim.simPaLa20231.act}
                author={dataSim.simPaLa20231.author}
                email={dataSim.simPaLa20231.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simRiPe20231.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simRiPe20231.title}
                url={dataSim.simRiPe20231.url}
                doc={dataSim.simRiPe20231.doc}
                act={dataSim.simRiPe20231.act}
                author={dataSim.simRiPe20231.author}
                email={dataSim.simRiPe20231.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simIsMa20231.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simIsMa20231.title}
                url={dataSim.simIsMa20231.url}
                doc={dataSim.simIsMa20231.doc}
                act={dataSim.simIsMa20231.act}
                author={dataSim.simIsMa20231.author}
                email={dataSim.simIsMa20231.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.simHyAt20231.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.simHyAt20231.title}
                url={dataSim.simHyAt20231.url}
                doc={dataSim.simHyAt20231.doc}
                act={dataSim.simHyAt20231.act}
                author={dataSim.simHyAt20231.author}
                email={dataSim.simHyAt20231.email}
              />
            )}
          />

          <Route
            forceRefresh={true}
            exact
            path={dataSim.sim01.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.sim01.title}
                url={dataSim.sim01.url}
                doc={dataSim.sim01.doc}
                act={dataSim.sim01.act}
                author={dataSim.sim01.author}
                email={dataSim.sim01.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.sim02.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.sim02.title}
                url={dataSim.sim02.url}
                doc={dataSim.sim02.doc}
                act={dataSim.sim02.act}
                author={dataSim.sim02.author}
                email={dataSim.sim02.email}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path={dataSim.sim03.path}
            component={() => (
              <SimFrame
                paneTitle={dataSim.sim03.title}
                url={dataSim.sim03.url}
                doc={dataSim.sim03.doc}
                act={dataSim.sim03.act}
                author={dataSim.sim03.author}
                email={dataSim.sim03.email}
              />
            )}
          />
        </Switch>
      </Router>
    </div>
  );
}
