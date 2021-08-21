import React, { useState } from "react";

// local imports
import Editor from "./Editor";

function SimFrame(props) {
  // definition of language Used in simulator
  const {
    url
  } = props

  const [p5, setP5] = useState('')

  // function to feed the script page
  window.onload= function loadSketch() {
    fetch(url).then(function(response){
      return response.text();
    }).then(function(data){
      // console.log(data);
      setP5(data);
    }).catch(function(error){
      console.log(error);
    });
  }

  return (
  <>
    <div className= "pane top-pane">
      <Editor
        language = 'javascript'
        displayName = "Editor de código"
        value = {p5}
        onChange = {setP5} 
      />
      <div>Hola mundo</div>
    </div>
  </>
  
  )
}

export default SimFrame;
