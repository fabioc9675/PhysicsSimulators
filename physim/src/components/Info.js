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
        <div style={{ width: "5vw" }}></div>
        <div>
          <div
            style={{
              paddingTop: "2rem",
              fontSize: "1.3rem",
            }}
          >
            Autor: {aut_1}
          </div>
          <div style={{ paddingLeft: "2rem", paddingRight: "2rem" }}>
            {em_1}
          </div>
        </div>
        <div style={{ width: "12vw" }}>
          <div
            style={{
              paddingTop: "2rem",
              fontSize: "1.3rem",
            }}
          >
            Autor: {aut_2}
          </div>
          <div style={{ paddingLeft: "2rem", paddingRight: "2rem" }}>
            {em_2}
          </div>
        </div>
        <div style={{ width: "12vw" }}>
          <div
            style={{
              paddingTop: "2rem",
              fontSize: "1.3rem",
            }}
          >
            Autor: {aut_3}
          </div>
          <div style={{ paddingLeft: "2rem", paddingRight: "2rem" }}>
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
            paddingLeft: "2rem",
          }}
        >
          Instituto de Física
        </div>
        <div
          style={{
            paddingLeft: "2rem",
            paddingTop: "1rem",
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
