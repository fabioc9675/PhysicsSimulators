/************************************************************
 * ******* SIMULACION DE TERREMOTOS EN EDIFICIOS ************
 * **********************************************************
 * Proyecto: Visualización de la respuesta estructural de   *
 * diferentes tipos de edificios ante ondas sísmicas        *
 * mediante simulación gráfica en p5.js.                    *
 *                                                          *
 * Librerías necesarias:                                    * 
 *   - p5.js (https://p5js.org/)                            *
 *                                                          *
 * Autores:                                                 *
 *   José Luis Torres López                                 *
 *   Julián Francisco Pinchao                               *
 *   Juan Esteban Berrío Salazar                            *
 *                                                          *
 * Institución: Universidad de Antioquia                    *
 * Curso: Laboratorio avanzado 3 - 2025-1                   *
 ***********************************************************/

let periodSlider, amplitudeSlider;
let resetButton, waveTypeSelector;
let period, amplitude;
let baseY;
let damageLevel = [];
let collapseTime = []; // 🚨 Nuevo: tiempos de colapso
let isQuakeActive = false;
let waveType = "sin";
let buildingSpecs;
let scrollX = 0;
let clouds = [];

function setup() {
  createCanvas(1000, 550);
  baseY = height * 0.7; // Bajamos un poco la base para las montañas

  // Crear nubes
  for (let i = 0; i < 8; i++) {
    clouds.push({
      x: random(width),
      y: random(100, 200),
      speed: random(0.2, 0.5),
      size: random(50, 120),
    });
  }

  buildingSpecs = [
    {
      w: 50,
      h: 50,
      label: "Cabaña",
      color: color(180, 120, 80),
      windows: { cols: 3, rows: 2 },
      freq: 4.0,
      resistance: 0.8,
    },
    {
      w: 60,
      h: 60,
      label: "Casa (1 piso)",
      color: color(200, 150, 100),
      windows: { cols: 2, rows: 1 },
      freq: 3.0,
      resistance: 0.7,
    },
    {
      w: 70,
      h: 140,
      label: "Edificio (5 pisos)",
      color: color(180, 180, 220),
      windows: { cols: 3, rows: 3 },
      freq: 1.5,
      resistance: 0.6,
    },
    {
      w: 80,
      h: 240,
      label: "Edificio (10 pisos)",
      color: color(150, 150, 200),
      windows: { cols: 3, rows: 6 },
      freq: 1.0,
      resistance: 0.5,
    },
    {
      w: 90,
      h: 270,
      label: "Torre Oficinas",
      color: color(170, 170, 190),
      windows: { cols: 4, rows: 8 },
      freq: 0.75,
      resistance: 0.4,
    },
    {
      w: 100,
      h: 300,
      label: "Rascacielos",
      color: color(100, 100, 150),
      windows: { cols: 4, rows: 10 },
      freq: 0.35,
      resistance: 0.3,
    },
    {
      w: 120,
      h: 180,
      label: "Edificio Ancho",
      color: color(160, 200, 180),
      windows: { cols: 5, rows: 4 },
      freq: 0.5,
      resistance: 0.9,
    },
  ];

  damageLevel = new Array(buildingSpecs.length).fill(0);
  collapseTime = new Array(buildingSpecs.length).fill(null);

  // Controles con estilo
  let controls =
    select("#controls") || createDiv().id("controls").position(20, 20);

  createP("Periodo sísmico (s):")
    .parent(controls)
    .style("color", "#333")
    .style("margin", "20px 0");
  periodSlider = createSlider(0.01, 2.5, 0.5, 0.01).parent(controls);
  periodSlider.position(20, 40);
  periodSlider.input(() => (isQuakeActive = false));
  valueDisplay2 = createSpan(periodSlider.value())
    .parent(controls)
    .style("display", "inline-block")
    .style("margin-left", "20px")
    .style("font-weight", "bold")
    .style("color", "#333");

  createP("Intensidad:")
    .parent(controls)
    .style("color", "#333")
    .style("margin", "12px 0 5px 0");
  amplitudeSlider = createSlider(0.1, 10, 3, 0.1).parent(controls);
  amplitudeSlider.position(20, 100);
  valueDisplay = createSpan(amplitudeSlider.value())
    .parent(controls)
    .style("display", "inline-block")
    .style("margin-left", "20px")
    .style("font-weight", "bold")
    .style("color", "#333");

  createP("Tipo de onda:")
    .parent(controls)
    .style("color", "#333")
    .style("margin", "10px 0");
  waveTypeSelector = createSelect().parent(controls);
  waveTypeSelector.position(20, 170);
  waveTypeSelector.option("Sinusoidal", "sin");
  waveTypeSelector.option("Coseno", "cos");
  waveTypeSelector.option("Aleatoria", "random");
  waveTypeSelector.changed(() => (waveType = waveTypeSelector.value()));

  resetButton = createButton("Iniciar Terremoto").parent(controls);
  resetButton.position(20, 200);
  resetButton.mousePressed(startEarthquake);
  resetButton
    .style("background", "#ff6b6b")
    .style("color", "white")
    .style("border", "none")
    .style("padding", "8px 15px");

  rectMode(CENTER);
  noStroke();
  textSize(12);
}

function startEarthquake() {
  isQuakeActive = true;
  damageLevel = new Array(buildingSpecs.length).fill(0);
  collapseTime = new Array(buildingSpecs.length).fill(null); // 🚨 Reinicio tiempos
}

function draw() {
  // Cielo con degradado
  drawSky();

  // Sol
  drawSun();

  // Montañas
  drawMountains();

  // Nubes
  drawClouds();

  // Resto del dibujo con desplazamiento horizontal
  push();
  translate(-scrollX, 0);

  period = periodSlider.value();
  valueDisplay2.html(periodSlider.value().toFixed(2));

  amplitude = amplitudeSlider.value();
  valueDisplay.html(amplitudeSlider.value().toFixed(1));

  // Suelo con hierba
  drawGround();

  // Onda sísmica
  let wave = 0;
  if (isQuakeActive) {
    let t = millis() / 1000;
    wave = generateSeismicWave(t);
  }

  // Edificios
  drawBuildings(wave);

  // Panel de info
  pop();
}

function drawSky() {
  for (let y = 0; y < height * 0.6; y++) {
    let inter = map(y, 0, height * 0.6, 0, 1);
    let c = lerpColor(color(135, 206, 235), color(25, 25, 112), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawSun() {
  fill(255, 204, 0);
  noStroke();
  ellipse(width - 100, 100, 80, 80);

  for (let i = 0; i < 12; i++) {
    let angle = (TWO_PI * i) / 12;
    let x1 = width - 100 + cos(angle) * 45;
    let y1 = 100 + sin(angle) * 45;
    let x2 = width - 100 + cos(angle) * 60;
    let y2 = 100 + sin(angle) * 60;
    stroke(255, 204, 0, 150);
    strokeWeight(3);
    line(x1, y1, x2, y2);
  }
  noStroke();
}

function drawMountains() {
  fill(70, 70, 80);
  beginShape();
  vertex(0, baseY);
  for (let x = 0; x < width; x += 50) {
    let y = baseY - 150 + noise(x * 0.01) * 100;
    vertex(x, y);
  }
  vertex(width, baseY);
  endShape(CLOSE);

  fill(90, 90, 100);
  beginShape();
  vertex(0, baseY);
  for (let x = 0; x < width; x += 30) {
    let y = baseY - 100 + noise(x * 0.02, 10) * 120;
    vertex(x, y);
  }
  vertex(width, baseY);
  endShape(CLOSE);
}

function drawClouds() {
  for (let cloud of clouds) {
    cloud.x += cloud.speed;
    if (cloud.x > width + cloud.size) cloud.x = -cloud.size;

    fill(255, 255, 255, 200);
    noStroke();
    ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6);
    ellipse(
      cloud.x + cloud.size * 0.3,
      cloud.y - cloud.size * 0.1,
      cloud.size * 0.8,
      cloud.size * 0.5
    );
    ellipse(
      cloud.x - cloud.size * 0.3,
      cloud.y,
      cloud.size * 0.7,
      cloud.size * 0.5
    );
  }
}

function drawGround() {
  fill(34, 139, 34);
  rect(width / 2, baseY + (height - baseY) / 2, width, height - baseY);

  stroke(0, 100, 0);
  strokeWeight(2);
  line(0, baseY, width, baseY);
  noStroke();
}

function drawBuildings(wave) {
  let spacing = 130;

  for (let i = 0; i < buildingSpecs.length; i++) {
    let building = buildingSpecs[i];
    let cx = spacing * (i + 0.5);

    let f = 1.0 / period;
    let A0 = map(amplitude, 0, 10, 5, 100);
    let denom = abs(1 - sq(f / building.freq));
    let amplitudeFactor = denom < 0.1 ? A0 / 0.1 : A0 / denom;
    amplitudeFactor = constrain(amplitudeFactor, 0, 200) * building.resistance;

    if (isQuakeActive) {
      damageLevel[i] = min(100, damageLevel[i] + amplitudeFactor * 0.03);
    }

    // 🚨 Guardar tiempo de colapso
    if (damageLevel[i] > 90 && collapseTime[i] === null) {
      collapseTime[i] = millis() / 1000; // segundos
    }

    push();
    translate(cx, baseY);

    if (damageLevel[i] > 90) {
      drawCollapsedBuilding(building, i);
    } else if (damageLevel[i] > 0) {
      drawDamagedBuilding(building, i, amplitudeFactor * wave);
    } else {
      drawIntactBuilding(building, i, amplitudeFactor * wave);
    }
    pop();

    drawDamageBar(cx - 50, baseY + 30, 100, damageLevel[i]);

    fill(0);
    textAlign(CENTER);
    let info = `${building.label}\nFrec: ${building.freq} Hz`;

    if (collapseTime[i] !== null) {
      info += `\nColapsó en: ${collapseTime[i].toFixed(2)} s`;
    }

    text(info, cx, baseY + 80);
  }
}

function generateSeismicWave(t) {
  switch (waveType) {
    case "sin":
      return sin((TWO_PI * t) / period);
    case "cos":
      return cos((TWO_PI * t) / period);
    case "random":
      return random(-1, 1);
    default:
      return 0;
  }
}

function drawIntactBuilding(building, idx, displacement) {
  push();
  translate(displacement, 0);

  fill(building.color);
  rect(0, -building.h / 2, building.w, building.h);

  drawWindows(building);

  fill(80);
  rect(0, -building.h, building.w * 1.1, 10);
  pop();
}

function drawDamagedBuilding(building, idx, displacement) {
  push();
  translate(displacement, 0);

  fill(red(building.color), green(building.color), blue(building.color), 200);
  rect(0, -building.h / 2, building.w, building.h);

  drawBrokenWindows(building, idx);
  drawCracks(building, damageLevel[idx]);

  pop();
}

function drawCollapsedBuilding(building, idx) {
  fill(
    red(building.color) * 0.7,
    green(building.color) * 0.7,
    blue(building.color) * 0.7
  );
  rect(0, -20, building.w * 0.8, 40);
}

function drawWindows(building) {
  let padX = building.w * 0.1,
    padY = building.h * 0.1;
  let wx =
    (building.w - padX * (building.windows.cols + 1)) / building.windows.cols;
  let hy =
    (building.h - padY * (building.windows.rows + 1)) / building.windows.rows;

  fill(255, 255, 200);
  stroke(100);
  strokeWeight(1);

  for (let r = 0; r < building.windows.rows; r++) {
    for (let c = 0; c < building.windows.cols; c++) {
      let x = -building.w / 2 + padX * (c + 1) + wx * c + wx / 2;
      let y = -building.h + padY * (r + 1) + hy * r + hy / 2;
      rect(x, y, wx, hy);
    }
  }
  noStroke();
}

function drawBrokenWindows(building, idx) {
  let padX = building.w * 0.1,
    padY = building.h * 0.1;
  let wx =
    (building.w - padX * (building.windows.cols + 1)) / building.windows.cols;
  let hy =
    (building.h - padY * (building.windows.rows + 1)) / building.windows.rows;

  for (let r = 0; r < building.windows.rows; r++) {
    for (let c = 0; c < building.windows.cols; c++) {
      let x = -building.w / 2 + padX * (c + 1) + wx * c + wx / 2;
      let y = -building.h + padY * (r + 1) + hy * r + hy / 2;

      if (random(100) < damageLevel[idx]) {
        fill(150, 150, 150);
        rect(x, y, wx, hy);

        stroke(80);
        line(x - wx / 2, y - hy / 2, x + wx / 2, y + hy / 2);
        line(x + wx / 2, y - hy / 2, x - wx / 2, y + hy / 2);
        noStroke();
      } else {
        fill(255, 255, 200);
        rect(x, y, wx, hy);
      }
    }
  }
}

function drawCracks(building, damage) {
  if (damage > 30) {
    let crackCount = floor(map(damage, 30, 90, 1, 5));
    for (let i = 0; i < crackCount; i++) {
      let xPos = random(-building.w / 2, building.w / 2);
      stroke(50, 50, 50, 150);
      strokeWeight(map(damage, 30, 90, 1, 3));
      line(xPos, -building.h, xPos, 0);
      noStroke();
    }
  }
}

function drawDamageBar(x, y, w, damage) {
  noStroke();
  fill(220);
  rect(x + w / 2, y + 10, w, 20);

  let damageWidth = map(damage, 0, 100, 0, w);
  if (damage < 30) {
    fill(100, 200, 100);
  } else if (damage < 70) {
    fill(255, 200, 100);
  } else {
    fill(200, 50, 50);
  }
  rect(x + damageWidth / 2, y + 10, damageWidth, 20);

  stroke(100);
  noFill();
  rect(x + w / 2, y + 10, w, 20);
  noStroke();
}
