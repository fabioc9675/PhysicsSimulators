/*************************************************************
 ******** GENERACIÓN PROBABILISTICA DE RAYOS *****************
 *************************************************************
 ** Autor: Maria Alejandra Sanchez                          **
 **        Anna Sofia Giraldo Neira                          **
 ** Institución: Universidad de Antioquia                    **
 ** Curso: Laboratorio avanzado 3  2025-1                    **
 *************************************************************/

// Librerías necesarias: p5.js y p5.sound (incluidas en index.html mediante CDN)
// ---------- VARIABLES GLOBALES ----------
let humiditySlider, pressureSlider, tempSlider, chargeSlider;
let generateBtn;
let lightning = [];
let flash = 0;
let thunder;

let fondo, nube;
let electricFieldDisplay, conductivityDisplay, probabilityDisplay;

// ---  referencias a textos/labels para poder reposicionarlos ---
let humDiv, presDiv, tempDiv, chargeDiv, calcTitle;

// ---  layout responsivo ---
let sceneW = 400; // ancho de la zona de dibujo (izquierda)
let margin = 20; // margen entre escena y panel derecho
let panelW = 260; // ancho del panel de controles

// ---------- PRELOAD ----------
function preload() {
  fondo = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/ProbabilityRay/assets/fondo_montanas.png"
  );
  nube = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/ProbabilityRay/assets/nube.png"
  );
  soundFormats("mp3");
  thunder = loadSound(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/ProbabilityRay/assets/trueno.mp3"
  );
}

// ---------- SETUP ----------
function setup() {
  // canvas a pantalla completa
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textFont("Helvetica");
  noStroke();

  // --- CONTROLES (se crean una vez) ---
  humDiv = createDiv('Humedad: <span id="humVal">80</span> %');
  humiditySlider = createSlider(0, 100, 80, 1);
  humiditySlider.input(() => select("#humVal").html(humiditySlider.value()));

  presDiv = createDiv('Presión: <span id="presVal">1000</span> hPa');
  pressureSlider = createSlider(900, 1100, 1000, 10);
  pressureSlider.input(() => select("#presVal").html(pressureSlider.value()));

  tempDiv = createDiv('Temperatura: <span id="tempVal">283</span> K');
  tempSlider = createSlider(253, 313, 283, 1);
  tempSlider.input(() => select("#tempVal").html(tempSlider.value()));

  chargeDiv = createDiv(
    'Densidad de carga: <span id="chargeVal">5.0</span> μC/m³'
  );
  chargeSlider = createSlider(0, 10, 5, 0.1);
  chargeSlider.input(() =>
    select("#chargeVal").html(chargeSlider.value().toFixed(1))
  );

  generateBtn = createButton("⚡ Generar rayo").mousePressed(generateLightning);
  generateBtn.style("font-size", "16px; padding: 8px 12px;");

  calcTitle = createP("--- Valores Calculados ---").style(
    "font-weight",
    "bold"
  );
  electricFieldDisplay = createP("Campo Eléctrico: -");
  conductivityDisplay = createP("Conductividad: -");
  probabilityDisplay = createP("Prob. de Rayo: -");

  //  colocar UI según tamaño actual
  placeUI();
}

// ---------- COLOCAR UI (RESPONSIVO) ----------
function placeUI() {
  // calcular anchos en función de la ventana
  // escena ~57% del ancho (mantiene ~400px cuando width≈700)
  sceneW = constrain(Math.floor(width * 0.57), 300, width - 280);
  panelW = constrain(Math.floor(width - sceneW - 2 * margin), 240, 420);

  const uiX = sceneW + margin; // panel a la derecha de la escena
  let currentY = 20;

  // posicionar y definir ancho de cada elemento
  humDiv.position(uiX, currentY);
  currentY += 40;
  humiditySlider.position(uiX, currentY);
  humiditySlider.style("width", panelW + "px");

  currentY += 40;
  presDiv.position(uiX, currentY);
  currentY += 40;
  pressureSlider.position(uiX, currentY);
  pressureSlider.style("width", panelW + "px");

  currentY += 40;
  tempDiv.position(uiX, currentY);
  currentY += 40;
  tempSlider.position(uiX, currentY);
  tempSlider.style("width", panelW + "px");

  currentY += 40;
  chargeDiv.position(uiX, currentY);
  currentY += 40;
  chargeSlider.position(uiX, currentY);
  chargeSlider.style("width", panelW + "px");

  currentY += 50;
  generateBtn.position(uiX, currentY);
  generateBtn.size(panelW, 36);

  currentY += 60;
  calcTitle.position(uiX, currentY);
  currentY += 40;
  electricFieldDisplay.position(uiX, currentY);
  currentY += 30;
  conductivityDisplay.position(uiX, currentY);
  currentY += 30;
  probabilityDisplay.position(uiX, currentY);
}

// ---------- AJUSTE AL REDIMENSIONAR ----------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  placeUI();
}

// ---------- GENERAR RAYO ----------
function generateLightning() {
  lightning = [];
  flash = 200;

  if (thunder && thunder.isLoaded()) {
    if (thunder.isPlaying()) thunder.stop();
    setTimeout(() => thunder.play(), 200);
  }

  const humidity = humiditySlider.value();
  const pressure = pressureSlider.value();
  const temperature = tempSlider.value();
  const chargeDensity = chargeSlider.value();

  const baseConductivity = 1e-14;
  const baseTemperature = 273;
  const basePressure = 1000;
  const vacuumPermittivity = 8.854e-12;
  const breakdownField = 3e6;
  const cloudLength = 1000;

  const conductivity =
    baseConductivity *
    (humidity / 100) *
    (temperature / baseTemperature) *
    exp(-pressure / basePressure);
  const electricField =
    ((chargeDensity * 1e-6) / vacuumPermittivity) * cloudLength;
  const pressureFactor =
    (pressure / basePressure) *
    (1 - humidity / 100) *
    (baseTemperature / temperature);
  const lightningProbability =
    electricField / (breakdownField * pressureFactor);

  // Actualizar los textos en pantalla
  electricFieldDisplay.html(
    `Campo Eléctrico: ${electricField.toExponential(2)} V/m`
  );
  conductivityDisplay.html(
    `Conductividad: ${conductivity.toExponential(2)} S/m`
  );
  probabilityDisplay.html(`Prob. de Rayo: ${lightningProbability.toFixed(3)}`);

  if (lightningProbability > 0.5) {
    // usa sceneW en vez de 400 fijo
    const startX = random(sceneW * 0.3, sceneW * 0.7);
    const endY = height - 50;
    const maxProduct = 5e-20;
    const chargeConductivityProduct = chargeDensity * 1e-6 * conductivity;
    const strokeW = map(chargeConductivityProduct, 0, maxProduct, 1, 5, true);

    generateBranch(
      startX,
      120,
      endY,
      chargeDensity,
      conductivity,
      electricField,
      strokeW,
      0
    );
  }
}

// ---------- GENERAR RAMAS ----------
function generateBranch(
  x,
  y,
  endY,
  chargeDensity,
  conductivity,
  electricField,
  weight,
  depth
) {
  if (depth >= 10) return;
  let currentX = x,
    currentY = y;

  while (currentY < endY) {
    currentY += random(5, 18);
    let deviation = map(chargeDensity, 0, 10, 5, 20);
    currentX += random(-deviation, deviation);
    lightning.push({ x1: x, y1: y, x2: currentX, y2: currentY, w: weight });

    const energy =
      chargeDensity > 0
        ? (electricField * electricField * conductivity) /
          (chargeDensity * 1e-6)
        : 0;
    const branchProbability = constrain(map(energy, 0, 1e9, 0, 0.4), 0, 0.4);

    if (random() < branchProbability && currentY < endY - 40) {
      generateBranch(
        currentX,
        currentY,
        endY,
        chargeDensity * 0.8,
        conductivity,
        electricField * 0.8,
        weight * 0.7,
        depth + 1
      );
    }
    x = currentX;
    y = currentY;
  }
}

// ---------- DIBUJAR ESCENA ----------
function draw() {
  background(220);
  push();

  if (flash > 0) flash = max(0, flash - 20);
  fill(50 + flash, 55 + flash, 110 + flash);

  // NUEVO: escena con ancho variable sceneW
  rect(0, 0, sceneW, height);
  image(fondo, sceneW / 2, height / 2, sceneW, height);

  fill(80, 50, 20);
  rect(0, height - 50, sceneW, 50);

  tint(255, 230);
  image(nube, sceneW * 0.25, 100, 140, 70);
  image(nube, sceneW * 0.65, 85, 180, 90);
  image(nube, sceneW * 0.5, 130, 160, 80);
  noTint();

  for (let seg of lightning) {
    stroke(255, 255, 180, 120);
    strokeWeight(seg.w + 3);
    line(seg.x1, seg.y1, seg.x2, seg.y2);
    stroke(255);
    strokeWeight(seg.w);
    line(seg.x1, seg.y1, seg.x2, seg.y2);
  }

  pop();
}
