import React, { useState } from "react";

// local imports
import Editor from "./Editor";

function SimFrame() {
  // definition of language Used in simulator
  const [p5, setP5] = useState('')


  return (
  <>
    <div className= "pane top-left-pane">
      <Editor
        language = 'javascript'
        displayName = "Editor de código"
        value = {p5}
        onChange = {setP5} 
      />
    </div>
  </>
  )
}

export default SimFrame;
