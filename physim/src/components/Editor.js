import React from "react";
import "../styles/Editor.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";

import { Controlled as ControlledEditor } from "react-codemirror2";

export default function Editor(props) {
  // definition of properties for Editor component
  const { language, displayName, value, onChange } = props;

  function handleChange(editor, data, value) {
    onChange(value);
  }

  // View structure
  return (
    <div className="editor-container">
      <div className="editor-title">{displayName}</div>
      <ControlledEditor
        className="code-mirror-wrapper"
        value={value}
        onBeforeChange={handleChange}
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          theme: "material",
          lineNumbers: true,
        }}
      />
    </div>
  );
}
