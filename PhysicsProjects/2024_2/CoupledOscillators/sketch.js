/* ***********************************************************
 * ******* SIMULACIÓN LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: David Alava                                    *
 * *          David Vázquez                                  *
 * *          Caterine Bedoya                                *
 * *          Jhonatan Jurado                                *
 * * Institución: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado III                         *
 * ***********************************************************/

let N = 10;
let k = 0.8;
let m = 1;
let masses = [];
let springs = [];
let mode = 1;
let t = 0;
let dt = 0.05;
let numSlider, kSlider;
let leftWall, rightWall;
let omega = [];

function setup() {
  createCanvas(600, 550); // Espacio adicional para la gráfica de amplitudes
  let controls = createDiv().style("padding", "10px");
  createSpan("Número de partículas: ").parent(controls);
  numSlider = createSlider(2, 10, N, 1).parent(controls);
  createSpan(" Constante elástica: ").parent(controls);
  kSlider = createSlider(0.1, 2, k, 0.1).parent(controls);

  let buttons = createDiv().style("padding", "10px");
  createButton("Nuevo").mousePressed(initializeMasses).parent(buttons);
  createButton(">>")
    .mousePressed(() => {
      mode = min(mode + 1, N);
      updateMode();
    })
    .parent(buttons);
  createButton("<<")
    .mousePressed(() => {
      mode = max(mode - 1, 1);
      updateMode();
    })
    .parent(buttons);

  initializeMasses();
}

function initializeMasses() {
  masses = [];
  springs = [];
  N = numSlider.value();
  k = kSlider.value();

  let spacing = width / (N + 1);

  // Fijar las paredes en los extremos
  leftWall = { x: spacing * 0.5, y: height * 0.3 };
  rightWall = { x: width - spacing * 0.5, y: height * 0.3 };

  let K = new Array(N).fill(0).map(() => new Array(N).fill(0));
  let M = new Array(N).fill(0).map(() => new Array(N).fill(0));

  for (let i = 0; i < N; i++) {
    M[i][i] = m;

    if (i > 0) {
      K[i][i] += k;
      K[i][i - 1] = -k;
      K[i - 1][i] = -k;
    }
    K[i][i] += k;
  }

  let eigenvalues = computeEigenvalues(K, M);
  omega = eigenvalues.map((val) => sqrt(val));

  for (let i = 0; i < N; i++) {
    masses.push({
      x: (i + 1) * spacing,
      y: height * 0.3,
      A: 50 * sin(((i + 1) * PI) / (N + 1)),
      phase: ((i + 1) * PI) / (N + 1),
      omega: omega[i],
    });

    if (i == 0) {
      springs.push({ a: -1, b: i }); // Conexión con la pared izquierda
    }
    if (i > 0) {
      springs.push({ a: i - 1, b: i });
    }
  }
  springs.push({ a: N - 1, b: -2 }); // Conexión con la pared derecha
}

function updateMode() {
  for (let i = 0; i < N; i++) {
    masses[i].omega = sqrt(
      ((4 * k) / m) * pow(sin((mode * PI) / (2 * (N + 1))), 2)
    );
    masses[i].A = 50 * sin(((i + 1) * mode * PI) / (N + 1));
    masses[i].phase = ((i + 1) * PI) / (N + 1);
  }
}

function computeEigenvalues(K, M) {
  let A = new Array(N).fill(0).map(() => new Array(N).fill(0));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      A[i][j] = K[i][j] / M[i][i];
    }
  }

  let eigenvalues = [];
  for (let i = 0; i < N; i++) {
    let x = new Array(N).fill(1);
    let lambda = 0,
      prevLambda = 0;

    for (let iter = 0; iter < 100; iter++) {
      let xNew = new Array(N).fill(0);

      for (let j = 0; j < N; j++) {
        for (let k = 0; k < N; k++) {
          xNew[j] += A[j][k] * x[k];
        }
      }

      let norm = Math.sqrt(xNew.reduce((sum, val) => sum + val * val, 0));
      xNew = xNew.map((val) => val / norm);

      prevLambda = lambda;
      lambda = xNew.reduce((sum, val, idx) => sum + val * x[idx], 0);

      if (Math.abs(lambda - prevLambda) < 1e-6) break;
      x = [...xNew];
    }
    eigenvalues.push(lambda);
  }

  return eigenvalues;
}

// Función para dibujar resortes
function drawSpring(x1, y1, x2, y2, coils = 8, amplitude = 10) {
  stroke(255, 0, 0);
  noFill();
  beginShape();
  let dx = (x2 - x1) / (coils * 2);
  let dy = (y2 - y1) / (coils * 2);
  for (let i = 0; i <= coils * 2; i++) {
    let x = x1 + i * dx;
    let y = y1 + i * dy + (i % 2 === 0 ? amplitude : -amplitude);
    vertex(x, y);
  }
  endShape();
}

function draw() {
  background(240);
  t += dt * (1 / sqrt(k));

  fill(0);
  textSize(14);
  text(`Modo de vibración: ${mode}`, 20, 20);
  text(`Número de partículas: ${N}`, 20, 40);
  text(`Constante elástica: ${k.toFixed(2)}`, 20, 60);

  strokeWeight(2);

  for (let s of springs) {
    let a = s.a === -1 ? leftWall : s.a === -2 ? rightWall : masses[s.a];
    let b = s.b === -1 ? leftWall : s.b === -2 ? rightWall : masses[s.b];

    if (!a || !b) continue;

    drawSpring(
      a.x + (a.A ? a.A * sin(a.omega * t + a.phase) : 0),
      a.y,
      b.x + (b.A ? b.A * sin(b.omega * t + b.phase) : 0),
      b.y
    );
  }

  fill(0);
  for (let m of masses) {
    ellipse(m.x + m.A * sin(m.omega * t + m.phase), m.y, 10, 10);
  }

  // Dibujar las paredes fijas
  fill(100);
  rect(leftWall.x - 10, leftWall.y - 20, 20, 40);
  rect(rightWall.x - 10, rightWall.y - 20, 20, 40);

  // Dibujar la gráfica de amplitudes con bolitas y líneas perpendiculares
  drawAmplitudeGraph();
}

// Función para la gráfica de amplitudes con líneas perpendiculares
function drawAmplitudeGraph() {
  let barY = height - 40;
  stroke(0);
  line(20, barY, width - 20, barY);

  fill(0, 0, 255);
  for (let i = 0; i < N; i++) {
    let x = map(i, 0, N - 1, 30, width - 30);
    let yOffset =
      masses[i].A * sin(masses[i].omega * t + masses[i].phase) * 0.5;
    line(x, barY, x, barY - yOffset);
    ellipse(x, barY - yOffset, 10, 10);
  }
}
