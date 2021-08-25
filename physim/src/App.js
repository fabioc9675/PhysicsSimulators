import React from "react";
import SimFrame from "./components/SimFrame";
import MainView from "./components/MainView";

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
            path="/simul_01"
            component={() => (
              <SimFrame
                paneTitle={"Gravitación universal"}
                url={
                  "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/main/SolarSystem/sketch.js"
                }
                doc={
                  "https://docs.google.com/gview?url=https://github.com/fabioc9675/PhysicsSimulators/raw/main/SolarSystem/Theory.pdf&embedded=true"
                }
                act={
                  "https://docs.google.com/gview?url=https://github.com/fabioc9675/PhysicsSimulators/raw/main/SolarSystem/Activity.pdf&embedded=true"
                }
                author={["Fabian Castaño", "Jaime Osorio", "Jhon Jaramillo"]}
                email={[
                  "email_01@email.com",
                  "email_02@email.com",
                  "email_03@email.com",
                ]}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path="/simul_02"
            component={() => (
              <SimFrame
                paneTitle={"Colisión de partículas"}
                url={
                  "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/main/ParticleCollision/sketch.js"
                }
                doc={
                  "https://docs.google.com/gview?url=https://github.com/fabioc9675/PhysicsSimulators/raw/main/SolarSystem/Theory.pdf&embedded=true"
                }
                act={
                  "https://docs.google.com/gview?url=https://github.com/fabioc9675/PhysicsSimulators/raw/main/SolarSystem/Activity.pdf&embedded=true"
                }
                author={["Jaime Osorio", "Fabian Castaño", "Jhon Jaramillo"]}
                email={[
                  "email_02@email.com",
                  "email_01@email.com",
                  "email_03@email.com",
                ]}
              />
            )}
          />
          <Route
            forceRefresh={true}
            exact
            path="/simul_03"
            component={() => (
              <SimFrame
                paneTitle={"Figuras de lissajous"}
                url={
                  "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/main/Controls/sketch.js"
                }
                doc={
                  "https://docs.google.com/gview?url=https://github.com/fabioc9675/PhysicsSimulators/raw/main/SolarSystem/Theory.pdf&embedded=true"
                }
                act={
                  "https://docs.google.com/gview?url=https://github.com/fabioc9675/PhysicsSimulators/raw/main/SolarSystem/Activity.pdf&embedded=true"
                }
                author={["Jhon Jaramillo", "Jaime Osorio", "Fabian Castaño"]}
                email={[
                  "email_03@email.com",
                  "email_01@email.com",
                  "email_02@email.com",
                ]}
              />
            )}
          />
        </Switch>
      </Router>
    </div>
  );
}
