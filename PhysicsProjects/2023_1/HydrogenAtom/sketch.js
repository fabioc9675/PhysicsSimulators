/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Cristian David Gutierrez                       *
 * *          Joseph Nicolay Ruiz                            *
 * *          Sergio Castrillon                              *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

//------------- Variables canvas 2 -------------

let c1_x = 0;
let c1_y = 0;
let c2_x = 500;
let c2_y = 0;
let c3_x = 660;
let c3_y = 0;
let c1_size_x = 450;
let c1_size_y = 350;
let c2_size_x = 350;
let c2_size_y = 350;
let c3_size_x = 300;
let c3_size_y = 300;

let _START = false;
let _THRESHOLD = [0.01, 0.002, 0.001, 0.001];
let _DOTNUMBER = 3000;
let _MAXRANGES = [10.0, 20.0, 30.0, 65.0];
let _MAXHEIGHT = [0.1, 0.1, 0.03, 0.05];
let _SCALES = [10.0, 20.0, 5.0, 2.0];
let _BKGCOLOR = [154, 187, 209];
let _KOLORS = [
  [255, 0, 0],
  [255, 168, 5],
  [0, 255, 0],
  [0, 0, 255],
  [128, 0, 255],
  [252, 3, 236],
  [0, 242, 255],
];

let n, l, m;
let solvedAtoms;
let orbitalCheck = [];
let orbitals = [];
let orbitalsDots = [];

//------------- Variables canvas 2 -------------

let _START2 = false;

let n2, l2;
let solvedAtoms2;
let thetaSlider; //Deslizador para ajustar theta.
let phiSlider; //Deslizador para ajustar phi.
let plotData = []; //Arreglo para los puntos de la gráfica.
let orbitalsFunctions = []; //Arreglo con las funciones de los orbitales.
let Menu; //Variable para el despliegue de la lista.

var s1 = function (sketch) {
  sketch.preload = function () {
    solvedAtoms = sketch.loadJSON(
      "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2023_1/HydrogenAtom/MixedOrbitals.json"
    );
  };

  sketch.setup = function () {
    let canvas1 = sketch.createCanvas(c1_size_x, c1_size_y, sketch.WEBGL);
    canvas1.position(c1_x, c1_y);

    // Create the fields for n, l, and m inputs
    inputN = sketch.createInput("", "number");
    inputN.class("my-input");
    inputN.position(0, c1_size_y + 2);
    inputN.size(75, 20);
    inputN.attribute("min", 1);
    inputN.attribute("max", 4);

    inputL = sketch.createInput("", "number");
    inputL.class("my-input");
    inputL.size(75, 20);
    inputL.position(0, c1_size_y + 52);
    //inputL.elt.disabled = true;

    // Create the buttons for n, l, and m inputs
    const submitN = sketch.createButton("Submit n");
    submitN.class("my-button");
    submitN.size(100, 35);
    submitN.position(100, c1_size_y);

    const submitL = sketch.createButton("Submit l");
    submitL.class("my-button");
    submitL.size(100, 35);
    submitL.position(100, c1_size_y + 50);

    // Acciones del programa al presionar los botones.
    submitN.mousePressed(() => {
      //Al presionar el botón de n se guarda su valor y se habilita el campo para l.
      const n = parseInt(inputN.value());
      inputL.attribute("min", 0);
      inputL.attribute("max", n - 1);
      inputL.value("");
      inputL.elt.disabled = false;
      submitL.elt.disabled = false;
    });

    submitL.mousePressed(() => {
      //Al presionar el botón de l se guarda su valor y se habilita el campo para n.
      n = parseInt(inputN.value());
      l = parseInt(inputL.value());

      //Controladores de la visualización.
      for (let i = -l; i <= l; i++) {
        let label;
        if (i < 0) {
          label =
            sketch.str(n) +
            sketch.str(l) +
            "(" +
            sketch.str(i) +
            " - " +
            sketch.str(-i) +
            ")";
        } else if (i === 0) {
          label = sketch.str(n) + sketch.str(l) + "(0)";
        } else {
          label =
            sketch.str(n) +
            sketch.str(l) +
            "(" +
            sketch.str(-i) +
            "+" +
            sketch.str(i) +
            ")";
        }

        let checkbox = sketch.createCheckbox(label, false);
        checkbox.changed(myCheckedEvent);
        checkbox.position(
          submitN.position().x + 150,
          submitN.position().y + 25 * (i + l)
        );

        orbitalCheck[i + l] = checkbox;
        orbitals[i + l] = false; // Set the initial state of the cone as visible
      }

      //Dibujo de los orbitales.
      for (let i = -l; i <= l; i++) {
        let f_string = solvedAtoms[n][l][i];
        let funct = new Function("r", "theta", "phi", "return " + f_string);
        let Points = Sampler(
          funct,
          _MAXRANGES[n - 1],
          _DOTNUMBER,
          _THRESHOLD[n - 1]
        );
        orbitalsDots[i + l] = Points;
      }

      _START = true;
    });
  };

  sketch.draw = function () {
    sketch.background(sketch.color(_BKGCOLOR));
    if (_START) {
      sketch.orbitControl();
      drawAxis(150);
      for (let i = -l; i <= l; i++) {
        let orbColor = _KOLORS[i + l];
        if (orbitals[i + l]) {
          //drawCone(i, 30 ,50);
          for (let j = 0; j < _DOTNUMBER; j++) {
            if (l == 0) {
              DrawDots(
                orbitalsDots[i + l][j],
                _SCALES[n - 1],
                orbColor,
                (show_half = true)
              );
            } else {
              DrawDots(orbitalsDots[i + l][j], _SCALES[n - 1], orbColor);
            }
          }
        }
      }
    }
  };

  function DrawDots(array, scalar, kolor, show_half = false) {
    let [x, y, z] = Spher2Cart(array);

    if (show_half) {
      if (x > 0) {
        sketch.push();
        sketch.translate(x * scalar, y * scalar, z * scalar);
        sketch.stroke(kolor[0], kolor[1], kolor[2]);
        sketch.point(0, 0, 0);
        sketch.pop();
      }
    } else {
      sketch.push();
      sketch.translate(x * scalar, y * scalar, z * scalar);
      sketch.stroke(kolor[0], kolor[1], kolor[2]);
      sketch.point(0, 0, 0);
      sketch.pop();
    }
  }

  function Spher2Cart(array) {
    let [r, theta, phi] = array;
    return [
      r * Math.sin(theta) * Math.cos(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(theta),
    ];
  }

  function randomSphericalDot(maxRange) {
    r = Math.random() * maxRange;
    theta = Math.random() * Math.PI;
    phi = Math.random() * 2 * Math.PI - Math.PI;

    return [r, theta, phi];
  }

  function Sampler(f, maxRange, maxNum, threshold) {
    let dots = [];
    while (dots.length < maxNum) {
      let [r, theta, phi] = randomSphericalDot(maxRange);
      if (f(r, theta, phi) >= threshold) {
        dots.push([r, theta, phi]);
      }
    }

    return dots;
  }

  function myCheckedEvent() {
    for (let i = -l; i <= l; i++) {
      orbitals[i + l] = orbitalCheck[i + l].checked(); // Update the visibility state of the cone
    }
    sketch.redraw(); // Redraw the sketch to reflect the changes
  }

  function drawAxis(length) {
    sketch.strokeWeight(2);

    // X-axis (red)
    sketch.stroke(255, 0, 0);
    sketch.line(0, 0, 0, length, 0, 0);

    // Y-axis (green)
    sketch.stroke(0, 255, 0);
    sketch.line(0, 0, 0, 0, length, 0);

    // Z-axis (blue)
    sketch.stroke(0, 0, 255);
    sketch.line(0, 0, 0, 0, 0, length);
  }
};

new p5(s1);

var s2 = function (sketch) {
  sketch.preload = function () {
    solvedAtoms2 = sketch.loadJSON(
      "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2023_1/HydrogenAtom/MixedOrbitals.json"
    );
  };

  sketch.setup = function () {
    let canvas2 = sketch.createCanvas(c2_size_x, c2_size_y);
    canvas2.position(c2_x, c2_y);

    // Create the fields for n, l inputs
    inputN2 = sketch.createInput("", "number");
    inputN2.class("my-input");
    inputN2.position(c2_x, sketch.height + 2);
    inputN2.size(75, 20);
    inputN2.attribute("min", 1);
    inputN2.attribute("max", 4);

    inputL2 = sketch.createInput("", "number");
    inputL2.class("my-input");
    inputL2.size(75, 20);
    inputL2.position(c2_x, sketch.height + 52);
    inputL2.elt.disabled = true;

    // Create the buttons for n, l, and m inputs
    const submitN2 = sketch.createButton("Submit n");
    submitN2.class("my-button");
    submitN2.size(100, 35);
    submitN2.position(c2_x + 100, sketch.height);

    const submitL2 = sketch.createButton("Submit l");
    submitL2.class("my-button");
    submitL2.size(100, 35);
    submitL2.position(c2_x + 100, sketch.height + 50);

    submitN2.mousePressed(() => {
      const n2 = parseInt(inputN2.value());
      inputL2.attribute("min", 0);
      inputL2.attribute("max", n2 - 1);
      inputL2.value("");
      inputL2.elt.disabled = false;
      submitL2.elt.disabled = false;
    });

    submitL2.mousePressed(() => {
      n2 = parseInt(inputN2.value());
      l2 = parseInt(inputL2.value());

      Menu = sketch.createSelect();
      Menu.position(submitN2.position().x + 150, submitN2.position().y + 25);
      Menu.size(80, 30);

      for (let i = -l2; i <= l2; i++) {
        let label;
        let f_string = solvedAtoms2[n2][l2][i];
        let funct = new Function("r", "theta", "phi", "return " + f_string);
        orbitalsFunctions[i + l2] = funct;
        if (i < 0) {
          label =
            sketch.str(n2) +
            sketch.str(l2) +
            "(" +
            sketch.str(i) +
            " - " +
            sketch.str(-i) +
            ")";
        } else if (i === 0) {
          label = sketch.str(n2) + sketch.str(l2) + "(0)";
        } else {
          label =
            sketch.str(n2) +
            sketch.str(l2) +
            "(" +
            sketch.str(-i) +
            "+" +
            sketch.str(i) +
            ")";
        }
        Menu.option(label, i);
      }

      // Create the sliders for theta and phi
      thetaSlider = sketch.createSlider(0, Math.PI, Math.PI / 2, Math.PI / 180);
      phiSlider = sketch.createSlider(
        -Math.PI,
        Math.PI,
        Math.PI / 2,
        (2 * Math.PI) / 180
      );
      thetaSlider.position(c2_x + 10, sketch.height - 50);
      phiSlider.position(c2_x + sketch.width - 150, sketch.height - 50);

      // Create paragraph elements to display the current values of theta and phi
      thetaValue = sketch.createP("Theta: ");
      phiValue = sketch.createP("Phi: ");
      thetaValue.position(c2_x + 35, sketch.height - 45);
      phiValue.position(c2_x + sketch.width - 120, sketch.height - 45);

      _START2 = true;
    });
  };

  sketch.draw = function () {
    sketch.background(sketch.color(_BKGCOLOR));

    if (_START2) {
      // Get the current values of theta and phi from the sliders
      let theta = (thetaSlider.value() * 180) / Math.PI;
      let phi = (phiSlider.value() * 180) / Math.PI;
      let option = sketch.int(Menu.value());

      // Update the paragraph elements with the current values
      thetaValue.html("Theta: " + theta.toFixed(2));
      phiValue.html("Phi: " + phi.toFixed(2));

      let plot = new GPlot(this);
      drawFunction(
        orbitalsFunctions[option + l2],
        theta,
        phi,
        _MAXRANGES[n2 - 1],
        _MAXHEIGHT[n2 - 1],
        sketch.width,
        sketch.height,
        plot
      );
    }
  };

  function drawFunction(
    f,
    theta,
    phi,
    rMax,
    yMax,
    sketch_width,
    sketch_height,
    plot
  ) {
    let plotData = [];

    // Generate data points for the plot
    for (let r = 0; r <= rMax; r += 0.1) {
      let y = f(r, theta, phi);
      plotData.push(new GPoint(r, y));
    }

    //let plot = new GPlot(sketch.canvas2);
    plot.setPos(0, 0); // Set the position of the plot
    plot.setOuterDim(sketch_width, sketch_height - 50); // Set the dimensions of the plot
    plot.setPoints(plotData); // Set the data points for the plot

    // Set the labels for the x-axis and y-axis
    plot.getXAxis().setAxisLabelText("r [a_0]");
    plot.getYAxis().setAxisLabelText("r^2*R(r,theta,phi)^2");

    // Set the range for the x-axis and y-axis
    plot.setXLim(0, rMax);
    plot.setYLim(0, yMax);

    // Set the number of ticks for the y-axis
    plot.getYAxis().setNTicks(5);

    plot.setGridLineWidth(1);
    plot.setGridLineColor(sketch.color(200));

    // Draw the plot
    plot.beginDraw();
    plot.drawBox();
    plot.drawXAxis();
    plot.drawYAxis();
    plot.drawGridLines(GPlot.BOTH);
    plot.drawPoints();
    plot.endDraw();
  }
};

new p5(s2);
