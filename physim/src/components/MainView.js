import React from "react";
import "../styles/MainView.css";
import { useHistory } from "react-router";

export default function MainView() {
  let history = useHistory();
  return (
    <div className="MainFrame">
      <div className="SimButton">
        <button
          onClick={() => {
            history.push("/simul_01");
          }}
        >
          Simulation 1
        </button>
      </div>
      <div className="SimButton">
        <button
          onClick={() => {
            history.push("/simul_02");
          }}
        >
          Simulation 2
        </button>
      </div>
      <div className="SimButton">
        <button
          onClick={() => {
            history.push("/simul_03");
          }}
        >
          Simulation 3
        </button>
      </div>
    </div>
  );
}
