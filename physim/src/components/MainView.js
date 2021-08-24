import React from "react";
import { useHistory } from "react-router";

export default function MainView() {
  let history = useHistory();
  return (
    <div>
      <button
        onClick={() => {
          history.push("/simul_01");
        }}
      >
        Simulation 1
      </button>
      <button
        onClick={() => {
          history.push("/simul_02");
        }}
      >
        Simulation 2
      </button>
    </div>
  );
}
