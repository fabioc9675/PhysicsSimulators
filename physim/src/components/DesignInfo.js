import React from "react";
import { version } from "../textFiles/autobuild_version";

export default function DesignInfo(props) {
  // authors information

  return (
    <div
      style={{
        padding: "1.0rem",
        color: "white",
        fontFamily: "serif",
        overflow: "auto",
      }}
    >
      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: "bold",
        }}
      >
        Iniciativa desarrollada por:
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            width: "20%",
            paddingLeft: "0.5rem",
            paddingTop: "0.5rem",
          }}
        >
          <div style={{ fontSize: "1.2rem" }}>Fabian Castaño</div>
          <div style={{ fontSize: "1.0rem" }}>fabian.castano@udea.edu.co</div>
        </div>
        <div
          style={{
            width: "20%",
            paddingLeft: "0.5rem",
            paddingTop: "0.5rem",
          }}
        >
          <div style={{ fontSize: "1.2rem" }}>Jaime Osorio</div>
          <div style={{ fontSize: "1.0rem" }}>jaime.osorio@udea.edu.co</div>
        </div>
        <div
          style={{
            width: "20%",
            paddingLeft: "0.5rem",
            paddingTop: "0.5rem",
          }}
        >
          <div style={{ fontSize: "1.2rem" }}>Jose David Ruiz</div>
          <div style={{ fontSize: "1.0rem" }}>josed.ruiz@udea.edu.co</div>
        </div>
        <div
          style={{
            width: "20%",
            paddingLeft: "0.5rem",
            paddingTop: "0.5rem",
          }}
        >
          <div style={{ fontSize: "1.2rem" }}>Jhon Jaramillo</div>
          <div style={{ fontSize: "1.0rem" }}>jhon.jaramilloe@udea.edu.co</div>
        </div>
        <div
          style={{
            width: "20%",
            paddingLeft: "0.5rem",
            paddingTop: "0.5rem",
            justifyContent: "right",
          }}
        >
          <div style={{ fontSize: "2.0rem" }}>Instituto de Física</div>
          <div
            style={{
              paddingTop: "0.3rem",
              paddingLeft: "50%",
              fontSize: "1.0rem",
            }}
          >
            Versión: {version}
          </div>
        </div>
      </div>
    </div>
  );
}
