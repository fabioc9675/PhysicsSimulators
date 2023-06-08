import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

import ReactGA from "react-ga";

// styles
import "../styles/SimFrame.css";

// local imports
import Editor from "./Editor";
// import Reader from "./Reader";
import Info from "./Info";

function SimFrame(props) {
  let history = useHistory();
  // definition of language Used in simulator
  const { url, doc, act, paneTitle, author, email } = props;

  // use of remote libraries for graphics
  const logo = "resources/logos/UdeA.png";
  const urlGraphLib =
    "https://raw.githubusercontent.com/jagracar/grafica.js/master/releases/grafica.min.js";

  const [p5, setP5] = useState("");
  const [galib, setGalib] = useState("");

  // variable to have srcDoc component for iFrame
  const [srcDoc, setSrcDoc] = useState("");

  // function to feed the script page
  useEffect(() => {
    // loading some data
    // console.log("Loading...");
    fetch(url)
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        // console.log(data);
        setP5(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    fetch(urlGraphLib)
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        // console.log(data);
        setGalib(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // sending information to Google Analytics
    // ReactGA.initialize("UA-208799821-1");
    // to report page view
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [url]);

  // function to execute change in component
  useEffect(() => {
    // console.log("Changing...");
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <!DOCTYPE html>
        <html lang="">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>p5.js example</title>
          <style>
            body {
              padding: 0;
              margin: 0;
              overflow: auto;
            }
            canvas {
              display: block;
            }
          </style>         
          <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.dom.min.js"></script>
          <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js"></script> -->
          <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.5.0/math.js"></script>
          <link rel="stylesheet" type="text/css" href="style.css">
          <!-- <script src="https://raw.githubusercontent.com/jagracar/grafica.js/master/releases/grafica.min.js"></script> -->
          <script>${galib}</script>
          <script>${p5}</script>
        </head>
          <body>
          
          </body>
        </html>
      `);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [galib, p5]);

  function backOnClick() {
    // come back to the main view
    history.push("/main");
  }

  return (
    <>
      <div className="pane">
        <div className="pane pane-title">
          <div style={{ paddingTop: "0.2rem" }} onClick={backOnClick}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </div>
          <div>{paneTitle}</div>
          <img src={logo} alt="" height="80%" />
        </div>
        <div className="pane-top">
          <div className="pane-top top-left-pane">
            <Editor
              language="javascript"
              displayName="Editor de código"
              value={p5}
              onChange={setP5}
            />
          </div>
          <div className="pane-top top-right-pane">
            <iframe
              srcDoc={srcDoc}
              title="Simulation"
              sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-downloads"
              frameBorder="0"
              width="100%"
              height="100%"
            />
          </div>
        </div>
        <div className="pane-bottom">
          {/* <div className="pane-bottom bottom-left-pane">
            <Reader
              displayName="Fundamentación teórica"
              title="Theory"
              source={doc}
            />
          </div>
          <div className="pane-bottom bottom-right-pane">
            <Reader
              displayName="Actividad de laboratorio"
              title="laboratory"
              source={act}
            />
          </div>*/}
          <div className="pane-bottom author-info">
            <div className="link-pane">
              <a
                href={doc}
                without
                rel="noopener noreferrer"
                target="_blank"
                style={{
                  textDecoration: "none",
                }}
              >
                <button className="link-pane link-button">Ver teoría</button>
              </a>
            </div>
            <div className="link-pane">
              <a
                href={act}
                without
                rel="noopener noreferrer"
                target="_blank"
                style={{
                  textDecoration: "none",
                }}
              >
                <button className="link-pane link-button">Ver actividad</button>
              </a>
            </div>
            <Info
              aut_1={author[0]}
              em_1={email[0]}
              aut_2={author[1]}
              em_2={email[1]}
              aut_3={author[2]}
              em_3={email[2]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SimFrame;
