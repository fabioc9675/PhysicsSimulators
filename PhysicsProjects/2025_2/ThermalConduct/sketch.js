/*************************************************************
 ******** Simulación de transferencia de calor por conducción **********************
 *************************************************************
 ** Autor: Pablo Sanchez                                                            **
 ** David García                                                             **
 ** Victor Palacios                                                          **
 ** Institución: Universidad de Antioquia                        **
 ** Curso: Laboratorio avanzado 3  2025-1                        **
 *************************************************************/

// Configuración de colores (Tema oscuro)
const tema = {
  fondo: [17, 24, 39],
  panel: [31, 41, 55],
  texto: [255, 255, 255],
  rojo: [239, 68, 68],
  azul: [59, 130, 246],
  amarillo: [234, 179, 8],
  verde: [34, 197, 94],
  grid: [75, 85, 99]
};

// Config del mallado
const NUM_CELDAS = 10; // Divisiones por barra

// Variables globales del sistema
let temp1 = [];
let temp2 = [];
let avgTemp1 = 20;
let avgTemp2 = 20;

let mass1 = 1;
let mass2 = 1;

let reservoirTemp = 200;
let isReservoirActive = false;
let time = 0;
let historyData = [];
let heatFlow = 0;
let simulando = false;
let velocidadSimulacion = 1;
const velocidades = [1, 1.5, 2, 3];
let indiceVelocidad = 0;

// Físicas
const A = 0.01;
const d = 0.1;
const dx = 0.1 / NUM_CELDAS;
const dt = 0.05;

// Elementos del DOM (UI)
let selMat1, selMat2;
let inputC1, inputC2;
let sliderResTemp, sliderT1, sliderT2;
let sliderM1, sliderM2;
let btnReservorio, btnReset, btnStart, btnVelocidad;

const materiales = {
  "Acero":    { c: 450, k: 50 },
  "Cobre":    { c: 385, k: 400 },
  "Aluminio": { c: 900, k: 237 },
  "Laton":    { c: 380, k: 110 },
  "Titanio":  { c: 520, k: 22 },
  "Niquel":   { c: 440, k: 91 },
  "Plata":    { c: 235, k: 430 },
  "Vidrio":   { c: 800, k: 1.1 },
  "Personalizado": { c: 800, k: 100 }
};

let mat1Actual = "Cobre";
let mat2Actual = "Cobre";

function setup() {
  createCanvas(900, 650);
  textFont("Arial");

  resetTemperatures(20, 20);

  // -- Material 1 --
  selMat1 = createSelect().position(50, 280).class("mi-input");
  llenarMateriales(selMat1);
  selMat1.selected(mat1Actual);
  selMat1.changed(() => { mat1Actual = selMat1.value(); gestionarInputPersonalizado(1); });

  inputC1 = createInput('800').position(210, 280).class("mi-input-num").hide();
  inputC1.attribute('type', 'number').attribute('placeholder', 'Valor c');

  sliderT1 = createSlider(0, 300, 20).position(50, 330).class("mi-slider");
  sliderM1 = createSlider(2, 50, 5, 0.5).position(50, 380).class("mi-slider");

  // -- Material 2 --
  selMat2 = createSelect().position(350, 280).class("mi-input");
  llenarMateriales(selMat2);
  selMat2.selected(mat2Actual);
  selMat2.changed(() => { mat2Actual = selMat2.value(); gestionarInputPersonalizado(2); });

  inputC2 = createInput('800').position(510, 280).class("mi-input-num").hide();
  inputC2.attribute('type', 'number').attribute('placeholder', 'Valor c');

  sliderT2 = createSlider(0, 300, 20).position(350, 330).class("mi-slider");
  sliderM2 = createSlider(2, 50, 5, 0.5).position(350, 380).class("mi-slider");

  // -- Botones y controles --
  sliderResTemp = createSlider(0, 300, 200).position(650, 100).class("mi-slider");

  // Botones principales (Ajusté posiciones ligeramente para alinearlos)
  btnReservorio = createButton("Activar Reservorio").position(650, 150).class("mi-btn btn-verde");
  btnReservorio.mousePressed(() => isReservoirActive = !isReservoirActive);

  btnStart = createButton("▶ INICIAR").position(650, 200).class("mi-btn btn-azul");
  btnStart.mousePressed(() => simulando = !simulando);

  btnReset = createButton("↺ REINICIAR").position(650, 250).class("mi-btn btn-gris");
  btnReset.mousePressed(resetSimulation);

  // Botón de velocidad (Estilo Circular)
  btnVelocidad = createButton("1x").position(20, 15).class("mi-btn-velocidad");
  btnVelocidad.mousePressed(cambiarVelocidad);

  estilizarDOM();
}

function resetTemperatures(t1, t2) {
  temp1 = [];
  temp2 = [];
  for(let i=0; i<NUM_CELDAS; i++) temp1.push(t1);
  for(let i=0; i<NUM_CELDAS; i++) temp2.push(t2);
}

function draw() {
  background(tema.fondo);

  reservoirTemp = sliderResTemp.value();
  mass1 = sliderM1.value();
  mass2 = sliderM2.value();

  // Bloqueo de inputs
  toggleInputState(simulando);

  if (simulando) {
    calcularFisica();
    avgTemp1 = temp1.reduce((a,b)=>a+b)/NUM_CELDAS;
    avgTemp2 = temp2.reduce((a,b)=>a+b)/NUM_CELDAS;
  } else {
    if(mouseIsPressed && (mouseY > 300 && mouseY < 360)) {
       resetTemperatures(sliderT1.value(), sliderT2.value());
    }
    avgTemp1 = sliderT1.value();
    avgTemp2 = sliderT2.value();
  }

  // Render UI
  fill(tema.texto); textAlign(CENTER); textSize(24); textStyle(BOLD);
  text("Simulación de transferencia de calor por conducción", width / 2, 35);

  fill(0); stroke(tema.panel); strokeWeight(2);
  rect(30, 60, 580, 350, 10);

  // Dibujar las barras
  dibujarBarraMallada(150, 150, temp1, mass1, "Material 1", mat1Actual);
  dibujarBarraMallada(300, 150, temp2, mass2, "Material 2", mat2Actual);

  dibujarReservorio();
  dibujarFlechasFlujo();

  dibujarPanelControles(630, 60);
  dibujarGrafica(60, 480, 810, 140);

  dibujarEtiquetasSliders();

  // Actualización de texto y colores de botones dinámicos
  btnStart.html(simulando ? "⏸ PAUSAR" : "▶ INICIAR");

  // Cambiamos el color directamente en style para el estado activo/inactivo del reservorio
  btnReservorio.html(isReservoirActive ? "Apagar Reservorio" : "Activar Reservorio");
  // Nota: Usamos los códigos de color de Tailwind para consistencia
  btnReservorio.style("background-color", isReservoirActive ? "#ef4444" : "#22c55e");
  // Efecto visual cuando cambia a rojo (hover rojo oscuro)
  if(isReservoirActive) {
      btnReservorio.mouseOver(() => btnReservorio.style("background-color", "#b91c1c"));
      btnReservorio.mouseOut(() => btnReservorio.style("background-color", "#ef4444"));
  } else {
      btnReservorio.mouseOver(() => btnReservorio.style("background-color", "#16a34a"));
      btnReservorio.mouseOut(() => btnReservorio.style("background-color", "#22c55e"));
  }
}

function dibujarEtiquetasSliders() {
    noStroke(); fill(200); textSize(12); textAlign(LEFT);
    text(`Temp Inicial: ${sliderT1.value()}°C`, 50, 325);
    text(`Masa Total: ${mass1.toFixed(1)} kg`, 50, 375);
    text(`Temp Inicial: ${sliderT2.value()}°C`, 350, 325);
    text(`Masa Total: ${mass2.toFixed(1)} kg`, 350, 375);
}

function gestionarInputPersonalizado(num) {
  if (num === 1) mat1Actual === "Personalizado" ? inputC1.show() : inputC1.hide();
  else mat2Actual === "Personalizado" ? inputC2.show() : inputC2.hide();
}

function toggleInputState(isSimulating) {
  if (isSimulating) {
    sliderT1.attribute('disabled', '');
    sliderT2.attribute('disabled', '');
    sliderM1.attribute('disabled', '');
    sliderM2.attribute('disabled', '');
    selMat1.attribute('disabled', '');
    selMat2.attribute('disabled', '');
    inputC1.attribute('disabled', '');
    inputC2.attribute('disabled', '');
  } else {
    sliderT1.removeAttribute('disabled');
    sliderT2.removeAttribute('disabled');
    sliderM1.removeAttribute('disabled');
    sliderM2.removeAttribute('disabled');
    selMat1.removeAttribute('disabled');
    selMat2.removeAttribute('disabled');
    inputC1.removeAttribute('disabled');
    inputC2.removeAttribute('disabled');
  }
}

function cambiarVelocidad() {
  indiceVelocidad = (indiceVelocidad + 1) % velocidades.length;
  velocidadSimulacion = velocidades[indiceVelocidad];
  btnVelocidad.html(velocidadSimulacion + "x");
}

function calcularFisica() {
  let iteraciones = velocidadSimulacion === 1 ? 1 : velocidadSimulacion === 1.5 ? 2 : velocidadSimulacion === 2 ? 3 : 5;
  for (let i = 0; i < iteraciones; i++) calcularFisicaStep();
}

function calcularFisicaStep() {
  let c1 = mat1Actual === "Personalizado" ? (parseFloat(inputC1.value()) || 800) : materiales[mat1Actual].c;
  let c2 = mat2Actual === "Personalizado" ? (parseFloat(inputC2.value()) || 800) : materiales[mat2Actual].c;

  let k1 = materiales[mat1Actual].k;
  let k2 = materiales[mat2Actual].k;
  let k_interface = (k1 + k2) / 2;

  let m_cell1 = mass1 / NUM_CELDAS;
  let m_cell2 = mass2 / NUM_CELDAS;

  let nextTemp1 = [...temp1];
  let nextTemp2 = [...temp2];

  // --- Calculos Barra 1 ---
  for (let i = 0; i < NUM_CELDAS; i++) {
    let Q_in = 0;
    let Q_out = 0;

    if (i === 0) {
      if (isReservoirActive) {
         Q_in = k1 * A * (reservoirTemp - temp1[i]) / d;
      }
    } else {
      Q_in = k1 * A * (temp1[i-1] - temp1[i]) / dx;
    }

    if (i === NUM_CELDAS - 1) {
      Q_out = k_interface * A * (temp1[i] - temp2[0]) / d;
      heatFlow = Q_out;
    } else {
      Q_out = k1 * A * (temp1[i] - temp1[i+1]) / dx;
    }

    let dT = ((Q_in - Q_out) * dt) / (m_cell1 * c1);
    nextTemp1[i] += dT;
  }

  // --- Calculos Barra 2 ---
  for (let i = 0; i < NUM_CELDAS; i++) {
    let Q_in = 0;
    let Q_out = 0;

    if (i === 0) {
      Q_in = k_interface * A * (temp1[NUM_CELDAS-1] - temp2[i]) / d;
    } else {
      Q_in = k2 * A * (temp2[i-1] - temp2[i]) / dx;
    }

    if (i === NUM_CELDAS - 1) {
      Q_out = 0;
    } else {
      Q_out = k2 * A * (temp2[i] - temp2[i+1]) / dx;
    }

    let dT = ((Q_in - Q_out) * dt) / (m_cell2 * c2);
    nextTemp2[i] += dT;
  }

  for(let i=0; i<NUM_CELDAS; i++) temp1[i] = clamp(nextTemp1[i], 0, 500);
  for(let i=0; i<NUM_CELDAS; i++) temp2[i] = clamp(nextTemp2[i], 0, 500);

  time += dt;

  if (frameCount % 5 === 0) {
    historyData.push({ t: time, val1: avgTemp1, val2: avgTemp2 });
  }
}

function dibujarBarraMallada(xStart, y, temps, mass, nombre, matNombre) {
  let totalWidth = 150;
  let cellWidth = totalWidth / NUM_CELDAS;
  let fixedHeight = 100;

  noStroke();

  for (let i = 0; i < NUM_CELDAS; i++) {
    let t = temps[i];
    let ratio = constrain(t / 300, 0, 1);
    let gray = 200 * (1 - ratio);
    let redVal = 200 + 55 * ratio;

    fill(redVal, gray, gray);
    rect(xStart + (i * cellWidth), y, cellWidth + 1, fixedHeight);
  }

  noFill(); stroke(255); strokeWeight(2);
  rect(xStart, y, totalWidth, fixedHeight);

  let avg = temps.reduce((a,b)=>a+b)/NUM_CELDAS;

  noStroke(); fill(255); textSize(18); textStyle(BOLD); textAlign(CENTER);
  text(avg.toFixed(1) + "°C", xStart + 75, y + 55);

  textSize(14); textStyle(NORMAL); fill(200);
  text(matNombre, xStart + 75, y - 25);

  if(temps[0] !== temps[NUM_CELDAS-1]) {
      fill(tema.amarillo); textSize(10);
  }
}

function dibujarGrafica(x, y, w, h) {
  fill(tema.panel); stroke(tema.grid); strokeWeight(1);
  rect(x, y, w, h);

  let ultimoTiempo = historyData.length > 0 ? historyData[historyData.length - 1].t : 0;
  let maxTiempoEjeX = max(60, ultimoTiempo);

  noStroke(); fill(180); textSize(10); textAlign(RIGHT, CENTER);
  for (let val = 0; val <= 300; val += 50) {
    let yPos = map(val, 0, 300, y + h, y);
    text(val, x - 8, yPos);
    stroke(tema.grid); strokeWeight(0.5);
    line(x, yPos, x + w, yPos);
  }

  push(); noStroke(); fill(180);
  translate(x - 30, y + h / 2); rotate(-HALF_PI); textAlign(CENTER);
  text("Temperatura Promedio (°C)", 0, 0);
  pop();

  noStroke(); fill(180); textAlign(CENTER, TOP);
  text("0s", x, y + h + 5);
  text(maxTiempoEjeX.toFixed(0) + "s", x + w, y + h + 5);

  if (historyData.length < 2) return;

  noFill(); strokeWeight(2);
  stroke(tema.rojo); beginShape();
  for (let p of historyData) vertex(map(p.t, 0, maxTiempoEjeX, x, x + w), map(p.val1, 0, 300, y + h, y));
  endShape();

  stroke(tema.azul); beginShape();
  for (let p of historyData) vertex(map(p.t, 0, maxTiempoEjeX, x, x + w), map(p.val2, 0, 300, y + h, y));
  endShape();
}

function dibujarPanelControles(x, y) {
  fill(tema.panel); noStroke();
  // Panel de fondo para controles
  rect(x, y, 240, 350, 10);

  fill(tema.texto); textAlign(LEFT); textSize(16); textStyle(BOLD);
  text("Panel de Control", x + 20, y + 20);

  textSize(12); textStyle(NORMAL); fill(200);
  text(`Temp Reservorio: ${reservoirTemp}°C`, x + 20, y + 60);

  fill(tema.texto);
  text(`Tiempo: ${time.toFixed(1)} s`, x + 20, y + 260);
  text("Flujo Interfaz: ", x + 20, y + 280);
  fill(tema.amarillo);
  text(`${abs(heatFlow).toFixed(1)} W`, x + 110, y + 280);

  let c1 = mat1Actual === "Personalizado" ? (parseFloat(inputC1.value()) || 800) : materiales[mat1Actual].c;
  let c2 = mat2Actual === "Personalizado" ? (parseFloat(inputC2.value()) || 800) : materiales[mat2Actual].c;

  fill(tema.rojo); rect(x + 20, y + 300, 10, 10); fill(tema.texto);
  text(`Material 1 (c=${c1} J/kg·°C)`, x + 40, y + 310);
  fill(tema.azul); rect(x + 20, y + 320, 10, 10); fill(tema.texto);
  text(`Material 2 (c=${c2}J/kg·°C)`, x + 40, y + 330);
}

function dibujarReservorio() {
  if (!isReservoirActive) return;
  fill(255, 107, 0); stroke(255);
  rect(100, 170, 50, 60);
  fill(255); noStroke(); textSize(12);
  text(reservoirTemp + "°C", 115, 250);
}

function dibujarFlechasFlujo() {
  if (isReservoirActive && reservoirTemp > temp1[0]) {
    let thickness = min(abs(reservoirTemp - temp1[0]) / 50, 5) + 1;
    dibujarFlecha(130, 200, 155, 200, thickness, color(255, 255, 0));
  }

  if (abs(heatFlow) > 1) {
    let thickness = min(abs(heatFlow) / 500, 5) + 1;
    if (heatFlow > 0) dibujarFlecha(260, 200, 340, 200, thickness, color(255, 255, 0));
    else dibujarFlecha(340, 200, 260, 200, thickness, color(255, 255, 0));

    fill(tema.amarillo); noStroke(); textSize(14);
    text(abs(heatFlow).toFixed(0) + " W", 300, 130);
  }
}

function dibujarFlecha(x1, y1, x2, y2, grosor, col) {
  stroke(col); strokeWeight(grosor);
  line(x1, y1, x2, y2);
  push(); translate(x2, y2);
  rotate(atan2(y2 - y1, x2 - x1));
  fill(col); noStroke();
  triangle(0, 0, -(5+grosor), -(2.5+grosor/2), -(5+grosor), (2.5+grosor/2));
  pop();
}

function resetSimulation() {
  simulando = false;
  time = 0;
  historyData = [];
  resetTemperatures(sliderT1.value(), sliderT2.value());
  isReservoirActive = false;
  heatFlow = 0;
}

function llenarMateriales(sel) { for (let m in materiales) sel.option(m); }

function estilizarDOM() {
  // Aquí usamos CSS moderno y específico para forzar el estilo de los botones
  let css = `
    /* ESTILOS DE INPUTS */
    .mi-input {
        background: #374151; color: white; border: 1px solid #4b5563;
        padding: 6px; width: 150px; border-radius: 6px; outline: none;
    }
    .mi-input-num {
        background: #1f2937; color: #38bdf8; border: 1px solid #3b82f6;
        padding: 5px; width: 80px; border-radius: 4px; outline: none;
    }
    .mi-slider {
        width: 150px; accent-color: #3b82f6; cursor: pointer;
    }

    /* ESTILO GENERAL DE BOTONES (Redondeados y Modernos) */
    .mi-btn {
        color: white;
        border: none;
        padding: 10px 0;
        border-radius: 8px; /* Bordes redondeados */
        font-family: Arial, sans-serif;
        font-weight: bold;
        cursor: pointer;
        width: 190px;
        font-size: 14px;
        transition: transform 0.1s, box-shadow 0.2s;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        text-align: center;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }

    .mi-btn:hover {
        transform: translateY(-2px); /* Efecto de elevación al pasar el mouse */
        box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.5);
    }

    .mi-btn:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.3);
    }

    /* Colores específicos */
    .btn-azul { background-color: #2563eb; }
    .btn-azul:hover { background-color: #1d4ed8; }

    .btn-verde { background-color: #22c55e; }
    .btn-verde:hover { background-color: #16a34a; }

    .btn-gris { background-color: #4b5563; }
    .btn-gris:hover { background-color: #374151; }

    /* ESTILO BOTÓN VELOCIDAD (Circular) */
    .mi-btn-velocidad {
        background: #1f2937;
        color: white;
        border: 2px solid #374151;
        width: 45px;
        height: 45px;
        border-radius: 50%; /* Completamente redondo */
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s, border-color 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .mi-btn-velocidad:hover {
        background-color: #374151;
        border-color: #6b7280;
    }

    /* Estilos para estado disabled (Solo opacidad, sin cambiar layout) */
    .mi-slider[disabled], .mi-input[disabled], .mi-input-num[disabled] {
        opacity: 0.5; cursor: not-allowed;
    }
  `;
  createElement('style', css);
}

function clamp(val, lo, hi) { return min(max(val, lo), hi); }
