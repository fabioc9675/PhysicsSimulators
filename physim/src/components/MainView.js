import React, { useEffect } from "react";
import "../styles/MainView.css";

import ReactGA from "react-ga";

// local imports
import MainInfo from "./MainInfo";
import DesignInfo from "./DesignInfo";
import TabsView from "./TabsView";

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
            <TabsView></TabsView>
          </div>
          <div className="Content">
            <DesignInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
