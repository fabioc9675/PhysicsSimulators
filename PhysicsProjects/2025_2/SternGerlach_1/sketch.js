/*************************************************************
 ******** EXPERIMENTOS DE STERN-GERLACH SECUENCIALES *********
 *************************************************************
 ** Autor: Santiago Julio Dávila                            **
 ** Institución: Universidad de Antioquia                   **
 ** Curso: Laboratorio avanzado 3  2025-2                   **
 *************************************************************/

let particles = [];
let mode = "continuo";

let yOffset = 50; // desplazamiento vertical para controles y horno

let toggleButton;
let fireButton;
let resetButton;
let pauseButton;
let detectorMenu, labelDetectors;
let experimentType = "sgz";
let sourceX = 20,
  sourceY = 150,
  sourceW = 100,
  sourceH = 100;
let probSlider, labelProb;
let detectorPositions = [];
let histogramCounts = [0, 0];
let finalHistogramCounts = [0, 0];
let paused = false;

let detectorY = 160,
  boxW = 80,
  boxH = 80;

let probHistoryPlus = [];
let probHistoryMinus = [];

// Variables para la pantalla y visualización
let screenX = 0;
let screenParticles = []; // Para guardar las "manchas"

function resetSimulation() {
  particles = [];
  screenParticles = [];
  histogramCounts = [0, 0];
  finalHistogramCounts = [0, 0];
  probHistoryPlus = [];
  probHistoryMinus = [];
}

function setup() {
  // Canvas amplio para que quepa todo
  createCanvas(1200, 800);

  toggleButton = createButton("Individual");
  toggleButton.position(20, 20 + yOffset);
  toggleButton.mousePressed(toggleMode);

  fireButton = createButton("•");
  fireButton.position(
    sourceX + sourceW / 2 - 10,
    sourceY + sourceH / 2 - 10 + yOffset
  );
  fireButton.style("width", "20px");
  fireButton.style("height", "20px");
  fireButton.style("border-radius", "50%");
  fireButton.style("font-size", "15px");
  fireButton.style(
    "background",
    `
      radial-gradient(circle at 30% 30%, 
        rgba(255, 255, 255, 0.8), 
        rgba(180, 0, 0, 0.85) 40%, 
        rgba(120, 0, 0, 1) 70%)
    `
  );
  fireButton.style("color", "white");
  fireButton.style("border", "none");
  fireButton.style("cursor", "pointer");
  fireButton.style("box-shadow", "0 0 6px rgba(255,0,0,0.8)");
  fireButton.mousePressed(fireParticle);
  fireButton.hide();

  resetButton = createButton("Reiniciar");
  resetButton.position(220, 20 + yOffset);
  resetButton.mousePressed(resetSimulation);
  resetButton.style("font-size", "15px");
  resetButton.style("padding", "5px 15px");
  resetButton.style("background", "#333");
  resetButton.style("color", "white");
  resetButton.style("border-radius", "8px");
  resetButton.style("border", "none");
  resetButton.style("cursor", "pointer");
  resetButton.style("box-shadow", "0 0 6px rgba(0,0,0,0.12)");

  pauseButton = createButton("Pausa");
  pauseButton.position(340, 20 + yOffset);
  pauseButton.style("font-size", "15px");
  pauseButton.style("padding", "5px 15px");
  pauseButton.style("background", "#444");
  pauseButton.style("color", "white");
  pauseButton.style("border-radius", "8px");
  pauseButton.style("border", "none");
  pauseButton.style("cursor", "pointer");
  pauseButton.style("box-shadow", "0 0 6px rgba(0,0,0,0.12)");
  pauseButton.mousePressed(() => {
    paused = !paused;
    pauseButton.html(paused ? "Continuar" : "Pausa");
  });

  labelDetectors = createP("Experimento de Stern-Gerlach");
  labelDetectors.position(20, 50 + yOffset);
  labelDetectors.style("color", "white");
  labelDetectors.style("font-family", "Arial, sans-serif");
  labelDetectors.style("font-size", "15px");
  labelDetectors.style("margin", "0");
  detectorMenu = createSelect();
  detectorMenu.position(20, 70 + yOffset);
  detectorMenu.option("SGz", "sgz");
  detectorMenu.option("SGz → SGz", "sgz-sgz");
  detectorMenu.option("SGz → SGx", "sgz-sgx");
  detectorMenu.option("SGz → SGx → SGz", "sgz-sgx-sgz");
  detectorMenu.changed(() => {
    experimentType = detectorMenu.value();
    resetSimulation();
  });

  labelProb = createP("Probabilidad de medir +z en el estado inicial");
  labelProb.position(20, 100 + yOffset);
  labelProb.style("color", "white");
  labelProb.style("font-family", "Arial, sans-serif");
  labelProb.style("font-size", "14px");
  labelProb.style("margin", "0");
  probSlider = createSlider(0, 1, 0.5, 0.01);
  probSlider.position(20, 120 + yOffset);
  probSlider.style("width", "180px");
  probSlider.input(resetSimulation);
}

function draw() {
  background(20);

  // Título y controles
  fill(255);
  textAlign(CENTER, TOP);
  textSize(32);
  text("EXPERIMENTOS DE STERN-GERLACH", width / 2, 22);

  drawSourceBox();
  fill(255);
  noStroke();
  textSize(13);
  textAlign(LEFT, BASELINE);
  text("Pr(+z) = " + nf(probSlider.value(), 1, 2), 250, 125 + yOffset);

  // --- CÁLCULO DE POSICIÓN DE PANTALLA ---
  let numBoxes =
    experimentType === "sgz"
      ? 1
      : experimentType === "sgz-sgz" || experimentType === "sgz-sgx"
      ? 2
      : 3;

  let lastBoxX = 300 + (numBoxes - 1) * 220;
  let lastBoxEnd = lastBoxX + 80;

  // La pantalla estará 130px después de que termine la última caja
  screenX = lastBoxEnd + 130;

  // Dibujar línea de pantalla
  stroke(150);
  strokeWeight(4);
  line(
    screenX,
    detectorY + yOffset - 50,
    screenX,
    detectorY + yOffset + boxH + 50
  );

  // --- DIBUJAR MANCHAS CON GLOW ---
  noStroke();
  drawingContext.shadowBlur = 15;
  drawingContext.globalCompositeOperation = "screen";

  for (let sp of screenParticles) {
    drawingContext.shadowColor = sp.c;
    let c = color(sp.c);
    c.setAlpha(200);
    fill(c);
    ellipse(sp.x, sp.y, 6, 12);
  }

  drawingContext.globalCompositeOperation = "source-over";
  drawingContext.shadowBlur = 0;

  // Simulación visual
  if (!paused) {
    if (mode === "continuo") {
      if (frameCount % 2 === 0) {
        particles.push(new Particle());
      }
    }
    for (let p of particles) {
      p.update();
      p.draw();
    }
  } else {
    for (let p of particles) {
      p.draw();
    }
  }

  // Limpieza
  particles = particles.filter(
    (p) => !p.pendingDelete || p.deleteCounter <= 15
  );

  drawDetectors();

  // --- HISTOGRAMA HORIZONTAL CON ETIQUETAS ---
  drawHorizontalHistogramAt(screenX + 20, detectorY + yOffset + 40);

  // --- GRÁFICA DE EVOLUCIÓN ---
  let graphX = 300;
  let graphY = detectorY + yOffset + 300;
  drawProbabilitiesGraphAt(graphX, graphY);
}

class Particle {
  constructor() {
    this.x = sourceX + sourceW;
    this.y = sourceY + sourceH / 2 + random(-sourceH / 20, sourceH / 20);
    this.vx = 4;
    this.size = 5;
    this.probPlusZ = probSlider.value();
    this.spins = [];
    this.nextDetector = 0;
    this.measured = false;
    this.pendingDelete = false;
    this.deleteCounter = 0;
    this.color = color(255);
    this.hasHitScreen = false;
  }

  update() {
    if (this.stuck) return;

    this.x += this.vx;

    // Detectar colisión con la pantalla
    if (this.x >= screenX) {
      this.x = screenX;
      this.hasHitScreen = true;
      this.stuck = true;

      screenParticles.push({
        x: this.x,
        y: this.y + yOffset + random(-3, 3),
        c: this.color,
      });

      this.updateStats();
      return;
    }

    // --- LÓGICA DE DETECTORES ---

    // 1. SGz (ÚNICO)
    if (
      experimentType === "sgz" &&
      !this.measured &&
      detectorPositions.length > 0 &&
      this.x >= detectorPositions[0]
    ) {
      const spin = random() < this.probPlusZ ? "+z" : "-z";
      this.spins.push(spin);
      if (spin === "+z") {
        this.y -= 25;
        this.probPlusZ = 1;
        histogramCounts[0]++;
        this.color = color(100, 180, 240); // AZUL
      } else {
        this.y += 25;
        this.probPlusZ = 0;
        histogramCounts[1]++;
        this.color = color(240, 120, 110); // ROJO
      }
      this.measured = true;
      this.nextDetector++;
    }

    // 2. SGz -> SGz
    else if (experimentType === "sgz-sgz") {
      // 1er Detector
      if (
        this.nextDetector === 0 &&
        detectorPositions.length > 0 &&
        this.x >= detectorPositions[0] + boxW / 2
      ) {
        if (!this.measured) {
          const spin = random() < this.probPlusZ ? "+z" : "-z";
          this.spins.push(spin);
          if (spin === "+z") {
            this.y -= 25;
            this.probPlusZ = 1;
          } else {
            this.y += 25;
            this.probPlusZ = 0;
            this.pendingDelete = true;
          }
          this.measured = true;
          this.nextDetector++;
        }
      }
      if (this.pendingDelete) this.deleteCounter++;

      // 2do Detector (FINAL)
      if (
        !this.pendingDelete &&
        this.nextDetector === 1 &&
        detectorPositions.length > 1 &&
        this.x >= detectorPositions[1]
      ) {
        const spin2 = random() < this.probPlusZ ? "+z" : "-z";
        this.spins.push(spin2);
        if (spin2 === "+z") {
          this.color = color(100, 180, 240);
        } else {
          this.color = color(240, 120, 110);
        }
        if (spin2 === "+z") this.y = this.y;
        else this.y += 50;
        this.nextDetector++;
      }
    }

    // 3. SGz -> SGx
    else if (experimentType === "sgz-sgx") {
      // 1er Detector
      if (
        this.nextDetector === 0 &&
        detectorPositions.length > 0 &&
        this.x >= detectorPositions[0] + boxW / 2
      ) {
        if (!this.measured) {
          const spin = random() < this.probPlusZ ? "+z" : "-z";
          this.spins.push(spin);
          if (spin === "+z") {
            this.y -= 25;
            this.probPlusZ = 0.5;
          } else {
            this.y += 25;
            this.probPlusZ = 0.5;
            this.pendingDelete = true;
          }
          this.measured = true;
          this.nextDetector++;
        }
      }
      if (this.pendingDelete) this.deleteCounter++;

      // 2do Detector (FINAL)
      if (
        !this.pendingDelete &&
        this.nextDetector === 1 &&
        detectorPositions.length > 1 &&
        this.x >= detectorPositions[1]
      ) {
        const spin2 = random() < this.probPlusZ ? "+x" : "-x";
        this.spins.push(spin2);
        if (spin2 === "+x") {
          this.color = color(100, 180, 240);
        } else {
          this.color = color(240, 120, 110);
        }
        if (spin2 === "+x") this.y = this.y;
        else this.y += 50;
        this.nextDetector++;
      }
    }

    // 4. SGz -> SGx -> SGz
    else if (experimentType === "sgz-sgx-sgz") {
      // 1er Detector
      if (
        this.nextDetector === 0 &&
        detectorPositions.length > 0 &&
        this.x >= detectorPositions[0] + boxW / 2
      ) {
        if (!this.measured) {
          const spinZ1 = random() < this.probPlusZ ? "+z" : "-z";
          this.spins.push(spinZ1);
          if (spinZ1 === "+z") {
            this.y -= 25;
            this.probPlusZ = 0.5;
          } else {
            this.y += 25;
            this.probPlusZ = 0.5;
            this.pendingDelete = true;
          }
          this.measured = true;
          this.nextDetector++;
        }
      }
      if (this.pendingDelete) this.deleteCounter++;
      // 2do Detector
      if (
        !this.pendingDelete &&
        this.nextDetector === 1 &&
        detectorPositions.length > 1 &&
        this.x >= detectorPositions[1] + boxW / 2
      ) {
        if (this.spins.length === 1) {
          const spinX = random() < this.probPlusZ ? "+x" : "-x";
          this.spins.push(spinX);
          if (spinX === "+x") {
            this.y = this.y;
            this.probPlusZ = 0.5;
          } else {
            this.y += 50;
            this.probPlusZ = 0.5;
            this.pendingDelete = true;
          }
          this.nextDetector++;
        }
      }
      if (this.pendingDelete) this.deleteCounter++;
      // 3er Detector (FINAL)
      if (
        !this.pendingDelete &&
        this.nextDetector === 2 &&
        detectorPositions.length > 2 &&
        this.x >= detectorPositions[2]
      ) {
        if (this.spins.length === 2) {
          const spinZ2 = random() < 0.5 ? "+z" : "-z";
          this.spins.push(spinZ2);
          if (spinZ2 === "+z") {
            this.color = color(100, 180, 240);
          } else {
            this.color = color(240, 120, 110);
          }
          if (spinZ2 === "+z") this.y = this.y;
          else this.y += 50;
          this.nextDetector++;
        }
      }
    }
  }

  updateStats() {
    let isUp = red(this.color) < 200;

    if (experimentType === "sgz") {
      if (isUp) histogramCounts[0]++;
      else histogramCounts[1]++;
      this.pushToHistory(histogramCounts);
    } else {
      if (isUp) finalHistogramCounts[0]++;
      else finalHistogramCounts[1]++;
      this.pushToHistory(finalHistogramCounts);
    }
  }

  pushToHistory(counts) {
    let total = counts[0] + counts[1];
    let probPlus = total > 0 ? counts[0] / total : 0;
    let probMinus = total > 0 ? counts[1] / total : 0;
    probHistoryPlus.push(probPlus);
    probHistoryMinus.push(probMinus);
  }

  draw() {
    noStroke();

    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = this.color;

    fill(this.color);

    if (!this.hasHitScreen) {
      if (this.pendingDelete) {
        let fade = map(this.deleteCounter, 0, 15, 255, 0, true);
        fill(red(this.color), green(this.color), blue(this.color), fade);
      }
      ellipse(this.x, this.y + yOffset, this.size);
    }
    drawingContext.shadowBlur = 0;
  }

  isOffScreen() {
    return this.pendingDelete && this.deleteCounter > 15;
  }
}

function drawSourceBox() {
  noStroke();
  fill(90);
  rect(sourceX, sourceY + yOffset, sourceW, sourceH, 4);
}

function toggleMode() {
  if (mode === "continuo") {
    mode = "individual";
    toggleButton.html("Continuo");
    fireButton.show();
  } else {
    mode = "continuo";
    toggleButton.html("Individual");
    fireButton.hide();
  }
}

function fireParticle() {
  particles.push(new Particle());
}

function drawDetectors() {
  detectorPositions = [];
  let spacing = 220;
  let startX = 300;
  let y = detectorY + yOffset;
  let numBoxes =
    experimentType === "sgz"
      ? 1
      : experimentType === "sgz-sgz" || experimentType === "sgz-sgx"
      ? 2
      : 3;

  const boxLabels =
    experimentType === "sgz-sgx-sgz"
      ? ["SGz", "SGx", "SGz"]
      : experimentType === "sgz-sgx"
      ? ["SGz", "SGx"]
      : experimentType === "sgz-sgz"
      ? ["SGz", "SGz"]
      : ["SGz"];

  for (let i = 0; i < numBoxes; i++) {
    let x = startX + i * spacing;
    fill(180);
    noStroke();
    rect(x, y, boxW, boxH, 6);
    detectorPositions.push(x + boxW / 2);

    fill(40);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(boxLabels[i] || "", x + boxW / 2, y + boxH / 2);
    textAlign(LEFT, BASELINE);
  }
}

function drawHorizontalHistogramAt(placeX, placeY) {
  let probLabels, histCounts;
  if (experimentType === "sgz") {
    probLabels = ["+z", "-z"];
    histCounts = histogramCounts;
  } else if (experimentType === "sgz-sgz") {
    probLabels = ["+z", "-z"];
    histCounts = finalHistogramCounts;
  } else if (experimentType === "sgz-sgx") {
    probLabels = ["+x", "-x"];
    histCounts = finalHistogramCounts;
  } else if (experimentType === "sgz-sgx-sgz") {
    probLabels = ["+z", "-z"];
    histCounts = finalHistogramCounts;
  }

  let total = histCounts[0] + histCounts[1];
  let probPos = total > 0 ? histCounts[0] / total : 0;
  let probNeg = total > 0 ? histCounts[1] / total : 0;

  let barHeight = 20;
  let maxBarWidth = 200;

  // --- Barra Azul (Superior) ---
  let yBlue = placeY - 25 - barHeight / 2;
  let wBlue = probPos * maxBarWidth;

  fill(100, 180, 240); // Azul
  rect(placeX, yBlue, wBlue, barHeight);

  noFill();
  stroke(100, 100, 100, 50);
  rect(placeX, yBlue, maxBarWidth, barHeight);
  noStroke();

  // MODIFICACIÓN: Agregada etiqueta del estado (+z o +x)
  fill(255);
  textSize(12);
  textAlign(LEFT, CENTER);
  text(
    probLabels[0] + "  " + nf(probPos * 100, 1, 1) + "%",
    placeX + wBlue + 5,
    yBlue + barHeight / 2
  );

  // --- Barra Roja (Inferior) ---
  let yRed = placeY + 25 - barHeight / 2;
  let wRed = probNeg * maxBarWidth;

  fill(240, 120, 110); // Rojo
  rect(placeX, yRed, wRed, barHeight);

  noFill();
  stroke(100, 100, 100, 50);
  rect(placeX, yRed, maxBarWidth, barHeight);
  noStroke();

  // MODIFICACIÓN: Agregada etiqueta del estado (-z o -x)
  fill(255);
  text(
    probLabels[1] + "  " + nf(probNeg * 100, 1, 1) + "%",
    placeX + wRed + 5,
    yRed + barHeight / 2
  );
}

function drawProbabilitiesGraphAt(placeX, placeY) {
  let labels, histPlus, histMinus;
  if (experimentType === "sgz") {
    labels = ["+z", "-z"];
    histPlus = probHistoryPlus;
    histMinus = probHistoryMinus;
  } else if (experimentType === "sgz-sgz") {
    labels = ["+z", "-z"];
    histPlus = probHistoryPlus;
    histMinus = probHistoryMinus;
  } else if (experimentType === "sgz-sgx") {
    labels = ["+x", "-x"];
    histPlus = probHistoryPlus;
    histMinus = probHistoryMinus;
  } else if (experimentType === "sgz-sgx-sgz") {
    labels = ["+z", "-z"];
    histPlus = probHistoryPlus;
    histMinus = probHistoryMinus;
  }

  let left = placeX,
    top = placeY;
  let widthP = 350,
    heightP = 150;

  fill(255, 20);
  stroke(180);
  strokeWeight(1);
  rect(left, top, widthP, heightP, 6);

  fill(255);
  noStroke();
  textSize(15);
  textAlign(CENTER, BASELINE);
  text(
    "Evolución de probabilidades experimentales",
    left + widthP / 2,
    top - 18
  );

  // --- Etiqueta eje X con contador ---
  let totalParticulas = histPlus.length;
  textSize(13);
  textAlign(CENTER, TOP);
  fill(255);
  text(
    "Partículas medidas (N: " + totalParticulas + ")",
    left + widthP / 2,
    top + heightP + 24
  );

  // Ejes
  textSize(10);
  textAlign(RIGHT, CENTER);
  fill(255);
  stroke(160);
  strokeWeight(1);
  line(left, top, left, top + heightP);
  line(left, top + heightP, left + widthP, top + heightP);
  text("1.0", left - 8, top + 2);
  text("0.5", left - 8, top + heightP / 2);
  text("0.0", left - 8, top + heightP - 2);

  textAlign(LEFT, BASELINE);

  if (histPlus.length < 2 && histMinus.length < 2) return;

  stroke(100, 180, 240);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < histPlus.length; i++) {
    let px = left + (i * widthP) / Math.max(1, histPlus.length - 1);
    let py = top + heightP - histPlus[i] * heightP;
    vertex(px, py);
  }
  endShape();

  stroke(240, 120, 110);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < histMinus.length; i++) {
    let px = left + (i * widthP) / Math.max(1, histMinus.length - 1);
    let py = top + heightP - histMinus[i] * heightP;
    vertex(px, py);
  }
  endShape();

  noStroke();
  textSize(13);
  textAlign(LEFT, CENTER);
  fill(100, 180, 240);
  text(labels[0], left + 5, top + 18);
  fill(240, 120, 110);
  text(labels[1], left + 70, top + 18);
  textAlign(LEFT, BASELINE);
}
