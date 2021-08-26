import React from "react";
import "../styles/Reader.css";

export default function Reader(props) {
  // definition of properties for Reader component
  const { displayName, title, source } = props;

  return (
    <div className="reader-container">
      <div className="reader-title">{displayName}</div>
      <iframe
        title={title}
        src={source}
        width="100%"
        height="100%"
        frameBorder="0"
      />
    </div>
  );
}
