import React from "react";

export default function Info(props) {
  // authors information
  const { aut_1, aut_2, aut_3, em_1, em_2, em_3 } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "1.5rem",
        color: "white",
        fontFamily: "serif",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: "16vw" }}>
          <div
            style={{
              paddingTop: "1rem",
              fontSize: "1.3rem",
            }}
          >
            Autor: {aut_1}
          </div>
          <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
            {em_1}
          </div>
        </div>
        <div style={{ width: "16vw" }}>
          <div
            style={{
              paddingTop: "1rem",
              fontSize: "1.3rem",
            }}
          >
            Autor: {aut_2}
          </div>
          <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
            {em_2}
          </div>
        </div>
        <div style={{ width: "16vw" }}>
          <div
            style={{
              paddingTop: "1rem",
              fontSize: "1.3rem",
            }}
          >
            Autor: {aut_3}
          </div>
          <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
            {em_3}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            paddingLeft: "1rem",
          }}
        >
          Instituto de Física
        </div>
        <div
          style={{
            paddingLeft: "1rem",
            paddingTop: "0.5rem",
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          Universidad de Antioquia
        </div>
      </div>
    </div>
  );
}
