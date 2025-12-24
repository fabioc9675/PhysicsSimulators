/* ***********************************************************
 * ***** SITEMA LIGADO DE RESORTES SOBRE CIRCUNFERENCIA ******
 * ***********************************************************
 * * Autores: Sebastian Carrillo Mejía                       *
 * *          Andrés Felipe Riaño Quintanilla                *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3 2025-1                    *
 * ***********************************************************/

// ******************************************
// CONFIGURACIÓN GLOBAL
// ******************************************

let angulos = [];
let numSprings = 3;
let r = 1;
let m = 1;
let k_hooke = 1;
let state = { x: 0.8, y: 0.5, vx: 0, vy: 0 };
let isRunning = true;

// Visuales
let trail = [];
let maxTrail = 100;
let historyX = [];
let historyY = [];
let maxGraphPoints = 400;
let scaleFactor = 160;

// Elementos de Interfaz (DOM)
let inpN, inpAngles, inpK, inpM;
let inpX0, inpY0;
let btnGen, btnReset, btnPause, btnTrail;

let isTrailPersistent = false;

// COLORES CONFIGURADOS
const COLOR_PRINCIPAL = "#069a7e"; // Color udea
const COLOR_PAUSA = "#f9a12c"; // Color udea

// ******************************************
// SETUP
// ******************************************
function setup() {
  createCanvas(1200, 600);

  // --- CREACIÓN DE CONTROLES (Columna Izquierda) ---
  let xAlign = 20;
  let wInput = 60;

  // 1. Input Resortes (Aleatorio)
  inpN = createInput("3", "number");
  inpN.position(xAlign, 60);
  inpN.size(wInput);

  // 2. Input Ángulos manuales
  inpAngles = createInput("");
  inpAngles.position(xAlign, 100);
  inpAngles.size(200, 20);
  inpAngles.attribute("placeholder", "Ej: 0, 90, 180, 270");

  // 3. Constantes K y M
  inpK = createInput("1.0", "number");
  inpK.position(xAlign, 160);
  inpK.size(wInput);
  inpK.attribute("step", "0.1");

  inpM = createInput("1.0", "number");
  inpM.position(xAlign, 230);
  inpM.size(wInput);
  inpM.attribute("step", "0.1");

  // 4. POSICIÓN INICIAL
  // Movemos las cajas un poco a la derecha para poner la etiqueta "x:" antes
  inpX0 = createInput("0.8", "number");
  inpX0.position(45, 320); // x=45 deja espacio para la etiqueta "x:"
  inpX0.size(50);
  inpX0.attribute("step", "0.1");

  inpY0 = createInput("0.5", "number");
  inpY0.position(145, 320); // x=145 deja espacio para la etiqueta "y:"
  inpY0.size(50);
  inpY0.attribute("step", "0.1");

  // --- BOTONES ---

  // Botón Generar
  btnGen = createButton("Generar Distribución");
  btnGen.position(xAlign, 370);
  btnGen.size(200, 30);
  estilarBoton(btnGen, COLOR_PRINCIPAL);
  btnGen.mousePressed(generarSistema);

  // Botón Reiniciar
  btnReset = createButton("Reiniciar Movimiento");
  btnReset.position(xAlign, 410);
  btnReset.size(200, 30);
  estilarBoton(btnReset, COLOR_PRINCIPAL);
  btnReset.mousePressed(resetMovimiento);

  // Botón Pausar
  btnPause = createButton("Pausar Simulación");
  btnPause.position(xAlign, 450);
  btnPause.size(200, 30);
  estilarBoton(btnPause, COLOR_PRINCIPAL);
  btnPause.mousePressed(togglePause);

  // Botón Trayectoria
  btnTrail = createButton("Mantener Trayectoria: Desactivado");
  btnTrail.position(xAlign, 490);
  btnTrail.size(200, 50); // Alto extra para padding
  estilarBoton(btnTrail, COLOR_PRINCIPAL);
  btnTrail.mousePressed(toggleTrail);

  // Inicializar sistema
  generarSistema();
  textFont("Arial");
}

// Función auxiliar para estilos
function estilarBoton(btn, colorHex) {
  btn.style("background-color", colorHex);
  btn.style("color", "white");
  btn.style("border", "none");
  btn.style("border-radius", "4px");
  btn.style("cursor", "pointer");
  btn.style("font-size", "12px");
}

// ******************************************
// DRAW
// ******************************************
function draw() {
  background(255);

  // 1. PANEL LATERAL
  fill(240);
  noStroke();
  rect(0, 0, 250, height);

  // 2. LEER PARAMETROS
  let valK = parseFloat(inpK.value());
  let valM = parseFloat(inpM.value());
  if (!isNaN(valK)) k_hooke = valK;
  if (!isNaN(valM)) m = valM;

  // 3. ETIQUETAS GUI
  drawGuiLabels();

  // 4. FISICA
  if (isRunning) {
    let dt = 0.05;
    rk4Step(dt);

    if (frameCount % 2 === 0) {
      historyX.push(state.x);
      historyY.push(state.y);
      if (historyX.length > maxGraphPoints) {
        historyX.shift();
        historyY.shift();
      }
    }
  } else {
    // Texto PAUSADO
    fill(200, 0, 0);
    noStroke();
    textAlign(RIGHT);
    textStyle(BOLD);
    text("PAUSADO", width - 20, 20);
  }

  // 5. DIBUJAR
  push();
  translate(550, 300);
  drawSimulation();
  pop();

  drawGraphs();
}

// ******************************************
// FUNCIONES DE CONTROL
// ******************************************

function togglePause() {
  isRunning = !isRunning;
  if (isRunning) {
    btnPause.html("Pausar Simulación");
    btnPause.style("background-color", COLOR_PRINCIPAL);
  } else {
    btnPause.html("Reanudar Simulación");
    btnPause.style("background-color", COLOR_PAUSA);
  }
}

function toggleTrail() {
  isTrailPersistent = !isTrailPersistent;
  if (isTrailPersistent) {
    btnTrail.html("Mantener Trayectoria: Activado");
    btnTrail.style("background-color", COLOR_PRINCIPAL);
  } else {
    btnTrail.html("Mantener Trayectoria: Desactivado");
    btnTrail.style("background-color", COLOR_PRINCIPAL);
    while (trail.length > maxTrail) {
      trail.shift();
    }
  }
}

function generarSistema() {
  angulos = [];
  let textoAngulos = inpAngles.value();

  // Prioridad: Input de texto manual
  if (textoAngulos.trim().length > 0) {
    let partes = textoAngulos.split(",");
    for (let p of partes) {
      let valorGrados = parseFloat(p);
      if (!isNaN(valorGrados)) {
        let radianes = valorGrados * (Math.PI / 180);
        angulos.push(radianes);
      }
    }
    numSprings = angulos.length;
    inpN.value(numSprings);
  } else {
    // Si no hay texto manual, usamos aleatorio
    let valN = parseInt(inpN.value());
    if (!isNaN(valN) && valN > 0) numSprings = valN;

    for (let i = 0; i < numSprings; i++) {
      angulos.push(Math.random() * 2 * Math.PI);
    }
  }

  resetMovimiento();
}

function resetMovimiento() {
  let valX = parseFloat(inpX0.value());
  let valY = parseFloat(inpY0.value());
  let startX = isNaN(valX) ? 0.8 : valX;
  let startY = isNaN(valY) ? 0.5 : valY;

  state = { x: startX, y: startY, vx: 0, vy: 0 };

  trail = [];
  historyX = [];
  historyY = [];

  isRunning = true;
  btnPause.html("Pausar Simulación");
  btnPause.style("background-color", COLOR_PRINCIPAL);
}

// ******************************************
// ETIQUETAS GUI
// ******************************************
function drawGuiLabels() {
  fill(50);
  noStroke();
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT);
  text("CONFIGURACIÓN", 20, 30);
  textStyle(NORMAL);
  textSize(12);

  text("Número de Resortes (n)", 20, 55);
  text("Ángulos Manuales (grados)", 20, 95);
  text("Constante Elástica (k)", 20, 155);
  text("Masa (m)", 20, 225);

  text("Condiciones Iniciales", 20, 300);

  // Etiquetas explicitas para X e Y alineadas con las cajas
  text("x:", 25, 335);
  text("y:", 125, 335);
}

// ******************************************
// DIBUJO SIMULACION
// ******************************************
function drawSimulation() {
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  textStyle(BOLD);
  text("Oscilador No Lineal", 0, -230);

  noFill();
  stroke(31, 119, 180);
  strokeWeight(4);
  circle(0, 0, r * 2 * scaleFactor);

  let mx = state.x * scaleFactor;
  let my = -state.y * scaleFactor;

  stroke(80);
  strokeWeight(2);
  for (let theta of angulos) {
    let ax = r * Math.cos(theta) * scaleFactor;
    let ay = -r * Math.sin(theta) * scaleFactor;
    drawZigZagSpring(mx, my, ax, ay, 12, 10);
  }

  noFill();
  stroke(131, 41, 187, 100);
  strokeWeight(2);
  beginShape();
  for (let p of trail) vertex(p.x, p.y);
  endShape();

  if (isRunning) {
    trail.push({ x: mx, y: my });
    if (!isTrailPersistent && trail.length > maxTrail) trail.shift();
  }

  fill(255, 0, 0);
  noStroke();
  circle(mx, my, 18);
}

// ******************************************
// GRAFICAS
// ******************************************
function drawGraphs() {
  let xPos = 850;
  let w = 320;
  let h = 180;
  drawSingleGraph(historyX, "Posición X vs t", xPos, 50, w, h);
  drawSingleGraph(historyY, "Posición Y vs t", xPos, 320, w, h);
}

function drawSingleGraph(data, title, x, y, w, h) {
  push();
  translate(x, y);
  stroke(200);
  noFill();
  fill(255);
  rect(0, 0, w, h);

  noStroke();
  fill(0);
  textAlign(CENTER);
  textStyle(NORMAL);
  text(title, w / 2, -8);

  stroke(220);
  line(0, h / 2, w, h / 2);

  stroke(14, 192, 193);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < data.length; i++) {
    let px = map(i, 0, maxGraphPoints, 0, w);
    let py = map(data[i], 1.5, -1.5, 0, h);
    vertex(px, py);
  }
  endShape();
  pop();
}

function drawZigZagSpring(x1, y1, x2, y2, nodes, width) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let len = Math.sqrt(dx * dx + dy * dy);
  let angle = Math.atan2(dy, dx);

  push();
  translate(x1, y1);
  rotate(angle);
  noFill();
  beginShape();
  vertex(0, 0);

  for (let i = 1; i <= nodes; i++) {
    let xx = (len / nodes) * i;
    let yy = i % 2 === 0 ? -width : width;
    if (i === nodes) yy = 0;

    let prevX = (len / nodes) * (i - 1);
    vertex(prevX + (xx - prevX) / 2, yy);
    vertex(xx, 0);
  }
  endShape();
  pop();
}

// ******************************************
// FISICA RK4
// ******************************************
function getDerivatives(s) {
  let x = s.x;
  let y = s.y;
  let n = angulos.length;

  let sumCos = 0;
  let sumSin = 0;
  let sumComplexX = 0;
  let sumComplexY = 0;

  for (let theta of angulos) {
    sumCos += Math.cos(theta);
    sumSin += Math.sin(theta);
    let denom = Math.sqrt(
      r * r +
        x * x +
        y * y -
        2 * r * (x * Math.cos(theta) + y * Math.sin(theta))
    );
    if (denom < 0.0001) denom = 0.0001;
    sumComplexX += (x - r * Math.cos(theta)) / denom;
    sumComplexY += (y - r * Math.sin(theta)) / denom;
  }

  let ax =
    (-k_hooke * n * x) / m +
    (k_hooke * r * sumCos) / m +
    ((k_hooke * r) / m) * sumComplexX;
  let ay =
    (-k_hooke * n * y) / m +
    (k_hooke * r * sumSin) / m +
    ((k_hooke * r) / m) * sumComplexY;
  return { dx: s.vx, dy: s.vy, dvx: ax, dvy: ay };
}

function rk4Step(dt) {
  let s = state;
  let k1 = getDerivatives(s);

  let s2 = {
    x: s.x + k1.dx * dt * 0.5,
    y: s.y + k1.dy * dt * 0.5,
    vx: s.vx + k1.dvx * dt * 0.5,
    vy: s.vy + k1.dvy * dt * 0.5,
  };
  let k2 = getDerivatives(s2);

  let s3 = {
    x: s.x + k2.dx * dt * 0.5,
    y: s.y + k2.dy * dt * 0.5,
    vx: s.vx + k2.dvx * dt * 0.5,
    vy: s.vy + k2.dvy * dt * 0.5,
  };
  let k3 = getDerivatives(s3);

  let s4 = {
    x: s.x + k3.dx * dt,
    y: s.y + k3.dy * dt,
    vx: s.vx + k3.dvx * dt,
    vy: s.vy + k3.dvy * dt,
  };
  let k4 = getDerivatives(s4);

  state.x += ((k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx) * dt) / 6;
  state.y += ((k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy) * dt) / 6;
  state.vx += ((k1.dvx + 2 * k2.dvx + 2 * k3.dvx + k4.dvx) * dt) / 6;
  state.vy += ((k1.dvy + 2 * k2.dvy + 2 * k3.dvy + k4.dvy) * dt) / 6;
}
