import React from "react";

export default function Info(props) {
  // authors information
  const { aut_1, aut_2, aut_3, em_1, em_2, em_3 } = props;

  return (
    <div
      style={{
        padding: "2.0rem",
        color: "white",
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        Instituto de Física
      </div>
      <div></div>
      <div>
        <div
          style={{
            paddingTop: "1rem",
            fontSize: "1.3rem",
          }}
        >
          Autor= {aut_1}
        </div>
        <div>{em_1}</div>
      </div>
      <div>
        <div
          style={{
            paddingTop: "1rem",
            fontSize: "1.3rem",
          }}
        >
          Autor= {aut_2}
        </div>
        <div>{em_2}</div>
      </div>
      <div>
        <div
          style={{
            paddingTop: "1rem",
            fontSize: "1.3rem",
          }}
        >
          Autor= {aut_3}
        </div>
        <div>{em_3}</div>
      </div>
      <div
        style={{
          paddingTop: "3rem",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        Universidad de Antioquia
      </div>
    </div>
  );
}
