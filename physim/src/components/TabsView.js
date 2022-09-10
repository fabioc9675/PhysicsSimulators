import React from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";

// Styles
import "react-tabs/style/react-tabs.css";
import "../styles/TabsView.css";

// import data of simulators
import SimMechanics from "../simulations/sim.mechanics";
import SimElectro from "../simulations/sim.electro";
import SimWaves from "../simulations/sim.waves";
import SimTermo from "../simulations/sim.termo";
import SimModern from "../simulations/sim.modern";
import SimExamples from "../simulations/sim.examples";

export default function TabsView() {
  return (
    <div className="TabFrame">
      <Tabs className="tab-content">
        <TabList className="tablist-content">
          <Tab className="tablabel-content">Mecánica</Tab>
          <Tab className="tablabel-content">Electromagnetismo</Tab>
          <Tab className="tablabel-content">Ondas</Tab>
          <Tab className="tablabel-content">Termodinámica</Tab>
          <Tab className="tablabel-content">Moderna</Tab>
          <Tab className="tablabel-content">Ejemplos</Tab>
        </TabList>

        <TabPanel
          style={{ width: "80vw", height: "100%", transition: "all 0.4s" }}
        >
          <SimMechanics />
        </TabPanel>
        <TabPanel
          style={{ width: "80vw", height: "100%", transition: "all 0.4s" }}
        >
          <SimElectro />
        </TabPanel>
        <TabPanel
          style={{ width: "80vw", height: "100%", transition: "all 0.4s" }}
        >
          <SimWaves />
        </TabPanel>
        <TabPanel
          style={{ width: "80vw", height: "100%", transition: "all 0.4s" }}
        >
          <SimTermo />
        </TabPanel>
        <TabPanel
          style={{ width: "80vw", height: "100%", transition: "all 0.4s" }}
        >
          <SimModern />
        </TabPanel>
        <TabPanel
          style={{ width: "80vw", height: "100%", transition: "all 0.4s" }}
        >
          <SimExamples />
        </TabPanel>
      </Tabs>
    </div>
  );
}
