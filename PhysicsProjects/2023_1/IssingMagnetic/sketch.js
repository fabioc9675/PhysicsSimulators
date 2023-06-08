/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: David Andrés Pedroza                           *
 * *          Sebastian Saavedra Patiño                      *
 * *          Jordan Hernandez Daza                           *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

// Define variables
let gridSize = 50;
let spinSize = 10; // 14 y sumar 100 al canvas
let temperature = 6; //funciona muy bien con temperature = 0.01
let spins = [];
let energy = 0;
//let magnetization = 0;
let iterations = 0;
let increaseTemp = false;
let maxIterations = 500000;
//se define H= -2 y se agrega a calculateenergy
let H = -25;
let J = 0;
let graphSize = 100;
let graphMargin = 10;
let graphCanvas;
let plot;

// Initializes the spin lattice
function initializeSpins() {
  for (let i = 0; i < gridSize; i++) {
    spins[i] = [];
    for (let j = 0; j < gridSize; j++) {
      spins[i][j] = -1; // Set all spins to 1
    }
  }
}

// Calculates the energy of the system
function calculateEnergy(i, j, H, s) {
  energy = 0;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let s = spins[i][j];
      let nb =
        spins[(i + 1) % gridSize][j] +
        spins[(i - 1 + gridSize) % gridSize][j] +
        spins[i][(j + 1) % gridSize] +
        spins[i][(j - 1 + gridSize) % gridSize];
      energy -= J * nb * s;

      energy -= s * H;
    }
  }
  energy /= 2;
}

// Cal88culates the magnetization of the system
function calculateMagnetization() {
  magnetization = 0;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      magnetization += spins[i][j];
      //magnetization/= gridSize**2;
    }
  }
}

// Updates the spins randomly using the Metropolis algorithm
function metropolis(H) {
  let i = floor(random() * gridSize);
  let j = floor(random() * gridSize);
  let s = spins[i][j];
  let nb =
    spins[(i + 1) % gridSize][j] +
    spins[(i - 1 + gridSize) % gridSize][j] +
    spins[i][(j + 1) % gridSize] +
    spins[i][(j - 1 + gridSize) % gridSize];
  let deltaE = 2 * (J * nb * s + H * s);
  if (deltaE <= 0) {
    s *= -1;
    spins[i][j] = s;
    energy += deltaE;
    magnetization += 2.0 * s;
  } else {
    let prob = exp(-deltaE / temperature);
    if (random() < prob) {
      s *= -1;
      spins[i][j] = s;
      energy += deltaE;
      magnetization += 2.0 * s;
    }
  }

  iterations++;
  return magnetization;
}
// function metropolis(H) {
//   let i = floor(random() * gridSize);
//   let j = floor(random() * gridSize);
//   let s = spins[i][j];
//   let nb = spins[(i + 1) % gridSize][j] + spins[(i - 1 + gridSize) % gridSize][j] + spins[i][(j + 1) % gridSize] + spins[i][(j - 1 + gridSize) % gridSize];
//   let deltaE = 2 * J * nb * s + H * s;
//   let expDeltaE = exp(-deltaE / temperature);

//   if (deltaE <= 0 || random() <= expDeltaE) {
//     s *= -1;
//     spins[i][j] = s;
//     energy += deltaE;
//     magnetization += 2 * s;
//   }

//   iterations++;
// }

// Increases the temperature of the system linearly for a fixed number of iterations
function increaseTemperature() {
  if (iterations < maxIterations) {
    temperature += 5.0 / maxIterations;
  } else {
    increaseTemp = false;
  }
}

function setup() {
  createCanvas(gridSize * spinSize * 2 + 200, gridSize * spinSize);
  /*
      graphCanvas = createGraphics(graphSize*3, graphSize*3);
      graphCanvas.background(250);
      //graphCanvas.stroke(0);
      
      graphCanvas.line(graphMargin, graphSize - graphMargin, graphSize - graphMargin, graphSize - graphMargin);
      graphCanvas.line(graphMargin, graphMargin, graphMargin, graphSize - graphMargin);
      graphCanvas.stroke(255, 0, 0);
      */
  // Crear un objeto GPlot
  plot = new GPlot(this, 650, 0, width - 700, height);
  plot.setTitleText("Magnetización vs Campo magnético");

  plot.getXAxis().setAxisLabelText("Campo magnético H");
  plot.getYAxis().setNTicks(10);
  plot.getYAxis().setAxisLabelText("Magnetizacion promedio");
  plot.setXLim(-25, 25);
  plot.setYLim(-2500, 2500);

  plot.setGridLineWidth(2);
  plot.setGridLineColor(210);

  //plot.setLineColor(120);
  //plot.setLineWidth(1);

  //setFrameRate(1);

  initializeSpins();
  calculateMagnetization();
  //calculateEnergy(i,j);

  resetSimulation();
  botonesConf();
}

function draw() {
  // Increase the external field H
  if (H <= 25) {
    H += 0.1; //0.030
  }

  // Perform Metropolis updates
  for (let i = 0; i < 1000; i++) {
    if (iterations < maxIterations) {
      metropolis(H);
    }
    if (iterations == maxIterations) {
      noLoop;
    }
  }
  translate(30, 0);
  // Update the display
  background(255);
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let x = i * spinSize;
      let y = j * spinSize;
      if (spins[i][j] === 1) {
        fill("cyan");
      } else {
        fill(255);
      }
      stroke(0);
      rect(x, y, spinSize, spinSize);
    }
  }

  // Display the system information
  textSize(16);
  fill(0);
  text("Temperature: " + temperature, 10, 20);
  text("External field H: " + H, 10, 40);
  text("Exchange integral J: " + J, 10, 60);
  text("Magnetization: " + magnetization, 10, 80);
  text("Iterations: " + iterations, 10, 100);

  plot.addPoint(H, magnetization);
  plot.addPoint(-H, -magnetization);
  plot.beginDraw();
  plot.drawBackground();
  plot.drawBox();
  plot.drawXAxis();
  plot.drawYAxis();
  plot.drawTitle();
  plot.drawGridLines(GPlot.BOTH);
  plot.drawLines();
  plot.drawPoints();
}
//Cambiar temperatura
function changeTemperature() {
  const newTemperature = Number(
    prompt("Introduce el valor de la temperatura:")
  );
  if (!isNaN(newTemperature)) {
    temperature = newTemperature;
    initializeSpins();
    calculateMagnetization();
    iterations = 0;
    resetSimulation();
  }
}

function resetSimulation() {
  //temperature = 6;

  H = -25;
  spins = [];
  initializeSpins();
  //calculateEnergy(i,j);
  calculateMagnetization();
  iterations = 0;
  //plot.clear();
}
//Cambiar J

function changeJ() {
  const newJ = Number(prompt("Introduce el valor de J:"));
  if (!isNaN(newJ)) {
    J = newJ;
    initializeSpins();
    calculateMagnetization();
    iterations = 0;
    resetSimulation();
  }
}
function botonesConf() {
  //fill(150);
  //rect(820, 500, 305, 55);
  //square(840, 500, 100);
  //fill(255);
  encender = createButton("Continuar");
  encender.position(550, 50);
  encender.mousePressed(loop);

  apagar = createButton("Pausar");
  apagar.position(550, 20);
  apagar.mousePressed(noLoop);

  reiniciar = createButton("Reiniciar");
  reiniciar.position(550, 80);
  reiniciar.mousePressed(reset);

  reiniciar = createButton("Temperatura");
  reiniciar.position(550, 110);
  reiniciar.mousePressed(changeTemperature);

  Jchange = createButton("Interacción:J");
  Jchange.position(550, 140);
  Jchange.mousePressed(changeJ);

  text("Botones de configuracion:", width, 120);

  fill(0);

  //text("Botones de configuracion:", HEIGHT + 250, 520);
}

function reset() {
  setup();
}
