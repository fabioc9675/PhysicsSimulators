/*************************************************************
 ******** General top simulation *****************************
 *************************************************************
 ** Autor: Luciano Muñoz                  ********************
 **        Juan David Salcedo             ********************
 ** Institución: Universidad de Antioquia ********************
 ** Curso: Laboratorio avanzado 3  2025-1 ********************
 *************************************************************/

// Libraries: ajax, MyriadPro.otf

const dt = 0.05;
let t = 0;

const trail = [];
const TRAIL_MAX = 700; // 200
const DEG = Math.PI / 180; // 1 degree in radians

const params = {
  I1: 2,
  I2: 2,
  I3: 1,
  m: 0.1,
  g: 9.8,
  l: 0.3,
};

// Initial state (resettable)
let state = [
  46 * DEG, // θ(0)
  0.0, // φ(0)
  0.0, // ψ(0)
  54.02 * DEG, // p_θ(0)
  297.94 * DEG, // p_φ(0)
  378.15 * DEG, // p_ψ(0)
];

let myFont;

function preload() {
  // Put a .ttf or .otf font in your project folder
  myFont = loadFont("https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/PeonsaSolution/assets/MyriadPro-Regular.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera(-500, -400, -100, 0, 0, 0, 0, 1, 0);

  angleMode(RADIANS);
  document
    .getElementById("resetBtn")
    .addEventListener("click", resetSimulation);

  textFont(myFont);
  textAlign(CENTER, CENTER);
  textSize(0.1);
}

function draw() {
  background(250);
  orbitControl();

  // Apply one step of Runge-Kutta
  rk4Step(state, dt);
  t += dt;

  const tip = bodyAxisTip(state);
  trail.push(tip);
  if (trail.length > TRAIL_MAX) trail.shift();

  scale(150);
  lights();

  push();
  rotateX(HALF_PI);
  rotateZ(HALF_PI * 1.5);

  drawAxes();

  // Fading trail
  noFill();
  strokeWeight(1.5);
  beginShape();
  for (let i = 0; i < trail.length; i++) {
    let v = trail[i];
    let alpha = map(i, 0, trail.length - 1, 50, 255);
    stroke(20, alpha);
    vertex(v.x, v.y, v.z);
  }
  endShape();

  // Current axis
  strokeWeight(3);
  stroke(200, 0, 0);
  line(0, 0, 0, 1.2 * tip.x, 1.2 * tip.y, 1.2 * tip.z);

  drawTop(tip, state[2]);
  pop();
}

// Restart
function resetSimulation() {
  //  Update parameters, too
  params.I1 = parseFloat(document.getElementById("I1").value);
  params.I2 = parseFloat(document.getElementById("I2").value);
  params.I3 = parseFloat(document.getElementById("I3").value);
  params.m = parseFloat(document.getElementById("m").value);
  params.g = parseFloat(document.getElementById("g").value);
  params.l = parseFloat(document.getElementById("l").value);

  // Reset state to initial conditions
  state = [
    parseFloat(document.getElementById("theta").value) * DEG,
    parseFloat(document.getElementById("phi").value) * DEG,
    parseFloat(document.getElementById("psi").value) * DEG,
    parseFloat(document.getElementById("p_theta").value) * DEG,
    parseFloat(document.getElementById("p_phi").value) * DEG,
    parseFloat(document.getElementById("p_psi").value) * DEG,
  ];

  //  Reset time and clear trail
  t = 0;
  trail.length = 0;
}

// 3D top
function drawTop(dir, psi) {
  push();
  const up = createVector(0, -1, 0);
  const axis = p5.Vector.cross(up, dir);
  const angle = Math.acos(up.dot(dir));
  if (axis.mag() > 1e-6) {
    rotate(angle, [axis.x, axis.y, axis.z]);
  }

  translate(0, -0.5, 0);
  noStroke();
  ambientMaterial(0, 0, 0); //  Black but visible with lights
  cone(0.15, 1);

  stroke(255, 0, 0);
  strokeWeight(4);
  line(0, 0, 0, 0, 0, 0);

  translate(0, -0.7, 0);

  const r = 0.2;
  const x = r * Math.cos(psi);
  const y = r * Math.sin(psi);

  // Rotate so ellipse lies in XZ plane
  rotateX(HALF_PI);

  // Circle
  noFill();
  stroke(0, 100, 200, 150);
  strokeWeight(0.5);
  ellipse(0, 0, 2 * r, 2 * r);

  // Arrowhead
  stroke(0, 100, 200);
  strokeWeight(3);
  line(0, 0, x, y);

  push();
  translate(x, y, 0);
  rotate(Math.atan2(y, x));
  line(0, 0, -0.08, 0.05);
  line(0, 0, -0.08, -0.05);
  pop();
}

// Física (igual que antes)
function massMatrix(th, ph, ps) {
  const { I1, I2, I3 } = params;
  const sTh = Math.sin(th),
    cTh = Math.cos(th);
  const sPs = Math.sin(ps),
    cPs = Math.cos(ps);
  const M11 = I1 * cPs * cPs + I2 * sPs * sPs;
  const M12 = (I1 - I2) * sTh * sPs * cPs;
  const M13 = 0;
  const M21 = M12;
  const M22 = sTh * sTh * (I1 * sPs * sPs + I2 * cPs * cPs) + I3 * cTh * cTh;
  const M23 = I3 * cTh;
  const M31 = M13;
  const M32 = M23;
  const M33 = I3;
  return [
    [M11, M12, M13],
    [M21, M22, M23],
    [M31, M32, M33],
  ];
}

function invert3(m) {
  const [a, b, c, d, e, f] = [
    m[0][0],
    m[0][1],
    m[0][2],
    m[1][1],
    m[1][2],
    m[2][2],
  ];
  const det = a * (d * f - e * e) - b * b * f;
  if (Math.abs(det) < 1e-12) throw "singular matrix";
  const inv = [
    [d * f - e * e, c * e - b * f, b * e - c * d],
    [c * e - b * f, a * f - c * c, b * c - a * e],
    [b * e - c * d, b * c - a * e, a * d - b * b],
  ];
  const idet = 1 / det;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) inv[i][j] *= idet;
  return inv;
}

function velocities(Q, P) {
  const M = massMatrix(Q[0], Q[1], Q[2]);
  const Minv = invert3(M);
  return mulMatVec(Minv, P);
}

function momentaDot(Q, Qdot) {
  const { I1, I2, I3, m, g, l } = params;
  const [th, ph, ps] = Q;
  const [thd, phd, psd] = Qdot;
  const sTh = Math.sin(th),
    cTh = Math.cos(th);
  const sPs = Math.sin(ps),
    cPs = Math.cos(ps);
  const dp1 =
    I2 * phd * cTh * cPs * (phd * sTh * cPs - thd * sPs) +
    I1 * phd * cTh * sPs * (phd * sTh * sPs + thd * cPs) -
    I3 * phd * sTh * (phd * cTh + psd) +
    m * g * l * sTh;
  const dp2 = 0;
  const dp3 =
    I1 * (phd * sTh * sPs + thd * cPs) * (phd * sTh * cPs - thd * sPs) -
    I2 * (phd * sTh * cPs - thd * sPs) * (phd * sTh * sPs + thd * cPs);
  return [dp1, dp2, dp3];
}

function derivatives(_, y) {
  const Q = y.slice(0, 3);
  const P = y.slice(3, 6);
  const Qdot = velocities(Q, P);
  const Pdot = momentaDot(Q, Qdot);
  return Qdot.concat(Pdot);
}

function rk4Step(y, h) {
  const k1 = derivatives(t, y);
  const k2 = derivatives(t + h / 2, addScaled(y, k1, h / 2));
  const k3 = derivatives(t + h / 2, addScaled(y, k2, h / 2));
  const k4 = derivatives(t + h, addScaled(y, k3, h));
  for (let i = 0; i < y.length; i++)
    y[i] += (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
}

// Helper functions
function addScaled(y, k, a) {
  return y.map((yi, i) => yi + a * k[i]);
}

function mulMatVec(M, v) {
  return [
    M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2],
    M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2],
    M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2],
  ];
}

function bodyAxisTip(y) {
  const th = y[0],
    ph = y[1];
  return createVector(
    Math.sin(th) * Math.cos(ph),
    Math.sin(th) * Math.sin(ph),
    Math.cos(th)
  );
}

function drawAxes() {
  const AXIS_LEN = 0.5;
  strokeWeight(1.5);

  // X-axis
  stroke(220, 30, 30);
  line(0, 0, 0, AXIS_LEN, 0, 0);
  push();
  translate(AXIS_LEN + 0.05, 0, 0);
  rotateY(PI); // face the camera
  fill(220, 30, 30);
  noStroke();
  textSize(0.2); // scaled to your scene
  text("X", 0, 0);
  pop();

  // Y-axis
  stroke(30, 220, 30);
  line(0, 0, 0, 0, AXIS_LEN, 0);
  push();
  translate(0, AXIS_LEN + 0.05, 0);
  rotateY(PI);
  fill(30, 220, 30);
  noStroke();
  textSize(0.2);
  text("Y", 0, 0);
  pop();

  // Z-axis
  stroke(30, 30, 220);
  line(0, 0, 0, 0, 0, AXIS_LEN);
  push();
  translate(0, 0, AXIS_LEN + 0.05);
  //rotateY(PI);
  fill(30, 30, 220);
  noStroke();
  textSize(0.2);
  text("Z", 0, 0);
  pop();
}
