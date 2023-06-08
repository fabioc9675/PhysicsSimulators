/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Juan Pablo Ortiz Gil                           *
 * *          Samuel Quitian Gallego                         *
 * *          Waira Murillo García                           *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let bala;

let dt = 1 / 60;
//let g = -15;
let hasPressedMouse = false;
let angleDisplay;
let velDisplay;
let arrowLength = 130;
let locked = false;
let bg;
let start;
let begin;
let now;
let angle = 90;
let angleset = 90;
let vset = 5;
let ymax = 0;
let xmax = 0;

let angley;
let arrowLengthy;

//tierra, luna, marte
const g = [-9.8, -1.63, -3.72]; // m/s**2
const Plan = ["Tierra", "Luna", "Marte"];
const vplan = [5, 2, 5]; //  m/s
let v = vplan[0];
let useg = g[0];

let c = [0.047 / 2, 0, 0.03 / 2];
let usec2 = c[0];
let usec = c[0];

const planets = [
  "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2023_1/ParabolicLaunch/assets/Tierra2.jpg",
  "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2023_1/ParabolicLaunch/assets/Luna2.jpg",
  "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2023_1/ParabolicLaunch/assets/Marte2.jpg",
];
let usep = planets[0];
//boton para iniciar
let button;
let button1;
let slider;
let sliderLabel;
let slidervel;
let slidervelLabel;
let sliderangle;
let sliderangleLabel;
let checkbox;

function setup() {
  //hasPressedMouse = false;
  //locked = false
  bala = new Cuerpo(20, 50, createVector(0, 0), v, 10);
  ymax = 0;
  xmax = 0;
  frameRate(60); //frames por segundo
  bg = loadImage(usep);
  canvas = createCanvas(windowWidth, windowHeight);

  button = createButton("Reiniciar");
  button.position(10, 10);
  button.size(90, 20);
  button.mousePressed(restart);

  button1 = createButton("Start");
  button1.position(50, 150);
  button1.size(90, 20);
  button1.mousePressed(Start);

  const buttonContainer = createDiv();
  buttonContainer.position(10, 10);
  buttonContainer.style("background-color", "black");
  buttonContainer.style("padding", "10px");
  buttonContainer.child(button);
  buttonContainer.style("height", 40 + (g.length + 3) * 30 + "px");
  buttonContainer.style("width", 40 + g.length * 30 + "px");

  const angleContainer = createDiv();
  angleContainer.position(windowWidth - 80 - (g.length + 0.5) * 30, 10);
  angleContainer.style("background-color", "black");
  angleContainer.style("padding", "10px");
  angleContainer.child(button1);
  angleContainer.style("height", 40 + (g.length + 3) * 30 + "px");
  angleContainer.style("width", 45 + (g.length + 0.5) * 30 + "px");

  // Iterar sobre el arreglo g
  for (let i = 0; i < g.length; i++) {
    // Crear botón con valor g[i]
    let button = createButton(Plan[i] + ", g = " + g[i]);
    button.position(10, 40 + i * 30);
    button.mousePressed(updateG(i));
    buttonContainer.child(button);
  }
  angleDisplay = createP();
  angleDisplay.parent(angleContainer);
  velDisplay = createP();
  xmaxDisplay = createP();
  ymaxDisplay = createP();

  slider = createSlider(5, 50, bala.masa);
  slider.parent(buttonContainer);
  slider.position(10, 40 + (g.length + 1) * 30);
  sliderLabel = createP("Masa: " + bala.masa + "kg");
  sliderLabel.position(10, 40 + g.length * 30);
  sliderLabel.parent(buttonContainer);

  slidervel = createSlider(2, 10, vset, 1);
  slidervel.parent(angleContainer);
  slidervel.position(10, 85);
  slidervelLabel = createP("Velocidad: " + vset + "m/s");
  slidervelLabel.position(10, 50);
  slidervelLabel.parent(angleContainer);

  sliderangle = createSlider(0, 180, angle);
  sliderangle.parent(angleContainer);
  sliderangle.position(10, 125);
  sliderangleLabel = createP("Velocidad: " + angleset + "°");
  sliderangleLabel.position(10, 95);
  sliderangleLabel.parent(angleContainer);

  velDisplay.html("Velocidad: ");
  velDisplay.position(10, 25);
  velDisplay.parent(angleContainer);
  velDisplay.style("color", "white");

  xmaxDisplay.html("Xmax: ");
  xmaxDisplay.position(10, 170);
  xmaxDisplay.parent(angleContainer);
  xmaxDisplay.style("color", "white");

  ymaxDisplay.html("Ymax: ");
  ymaxDisplay.position(10, 190);
  ymaxDisplay.parent(angleContainer);
  ymaxDisplay.style("color", "white");

  checkbox = createCheckbox("Quita atmosfera", false);
  checkbox.position(10, 40 + (g.length + 2) * 30);
  checkbox.changed(toggleFunction);
  checkbox.parent(buttonContainer);
  checkbox.style("color", "white");
}

function draw() {
  //background(100,120,150);

  bala.masa = slider.value();
  bala.radio = slider.value() * 3;
  angleset = sliderangle.value();
  vset = slidervel.value();
  background(bg);
  translate(windowWidth / 2, windowHeight - bala.radio / 2); //origen de coordenadas
  rotate(PI);
  scale(-1, 1);
  //console.log(locked);
  //parar al tocar el suelo
  if (locked) {
    bala.velocidad += bala.velocidad * 0.01;
    bala.updateVecVelocidad();
    velDisplay.html("Velocidad: " + (bala.velocidad / 100).toFixed(2) + "m/s");
    velDisplay.position(10, 25);
    velDisplay.style("color", "white");
  } else {
    if (hasPressedMouse && bala.posicion.y > -bala.radio / 1000000) {
      bala.update();
      now = (Date.now() - start) / 1000;
    }
  }
  // Draw the arrow
  let arrowStart = bala.posicion.copy();
  let arrowEnd = createVector(
    mouseX - windowWidth / 2,
    -(mouseY - windowHeight + bala.radio / 2)
  );
  let newAngle = atan2(arrowEnd.y - arrowStart.y, arrowEnd.x - arrowStart.x);
  if (!hasPressedMouse) {
    drawArrow(arrowStart, arrowEnd);
  }

  if (bala.posicion.y > ymax) {
    ymax = bala.posicion.y;
  }
  if (Math.abs(bala.posicion.x) > xmax) {
    xmax = bala.posicion.x;
  }
  if (bala.posicion.y < -bala.radio / 1000000) {
    ymaxDisplay.html("Ymax: " + (ymax / 100).toFixed(2) + "m");
    ymaxDisplay.position(10, 190);
    ymaxDisplay.style("color", "white");

    xmaxDisplay.html("Xmax: " + (xmax / 100).toFixed(2) + "m");
    xmaxDisplay.position(10, 170);
    xmaxDisplay.style("color", "white");
  }

  bala.show();
  if (!hasPressedMouse) {
    angleDisplay.html("Angulo: " + ((newAngle * 180) / PI).toFixed(2));
  }

  angleDisplay.position(10, 5);

  sliderLabel.html("Masa: " + bala.masa + "kg");
  sliderLabel.style("color", "white");
  angleDisplay.style("color", "white");

  slidervelLabel.html("Vel: " + vset + "m/s");
  slidervelLabel.style("color", "white");

  sliderangleLabel.html("Angle: " + angleset + "°");
  sliderangleLabel.style("color", "white");
}

function mousePressed() {
  if (
    (mouseX > 10 && mouseX < 40 + 120) ||
    (mouseX > windowWidth / 1.17 &&
      mouseX < windowWidth &&
      mouseY > 10 &&
      mouseY < 40 + (g.length + 3) * 30 + 20)
  ) {
    overBox = true;
  } else {
    overBox = false;
    locked = true;
  }

  if (!hasPressedMouse && !overBox) {
    let arrowStart = bala.posicion.copy();
    let arrowEnd = createVector(
      mouseX - windowWidth / 2,
      -(mouseY - windowHeight + bala.radio / 2)
    );
    let newAngle = atan2(arrowEnd.y - arrowStart.y, arrowEnd.x - arrowStart.x);
    bala.angulo = newAngle;
    bala.updateVecVelocidad();
    hasPressedMouse = true;
  }
}

function mouseReleased() {
  locked = false;
  start = Date.now();
}

// Draw an arrow from start to end position
function drawArrow(start, end) {
  let angle = atan2(end.y - start.y, end.x - start.x);
  arrowLength = (130 * slider.value()) / 20;
  push();
  translate(start.x, start.y);
  rotate(angle);
  strokeWeight((3 * slider.value()) / 20);
  line(0, 0, arrowLength, 0);
  triangle(
    arrowLength,
    0,
    arrowLength - (30 * slider.value()) / 20,
    -((30 * slider.value()) / 20) / 2,
    arrowLength - (30 * slider.value()) / 20,
    (30 * slider.value()) / 20 / 2
  );
  pop();
}

function drawArrow3(start, end, value) {
  let angle = 0;
  arrowLength = (130 * value) / 20;
  push();
  translate(start.x, start.y);
  rotate(angle);
  strokeWeight((3 * value) / 20);
  line(0, 0, arrowLength, 0);
  triangle(
    arrowLength,
    0,
    arrowLength - (30 * value) / 20,
    -((30 * value) / 20) / 2,
    arrowLength - (30 * value) / 20,
    (30 * value) / 20 / 2
  );
  pop();
}

function drawArrow2(start, end) {
  let angle = atan2(end.y - start.y, end.x - start.x);
  let arrowLength = abs(end.y - start.y) * 0.4; // Adjust the multiplier as needed

  push();
  translate(start.x, start.y);
  rotate(angle);
  strokeWeight(abs(end.y - start.y) * 0.01);
  line(0, 0, arrowLength, 0);
  triangle(
    arrowLength,
    0,
    arrowLength - abs(end.y - start.y) * 0.1,
    (-abs(end.y - start.y) * 0.1) / 2,
    arrowLength - abs(end.y - start.y) * 0.1,
    (abs(end.y - start.y) * 0.1) / 2
  );
  pop();
}
//funcion para el botón
function restart() {
  velDisplay.remove();
  angleDisplay.remove();
  hasPressedMouse = false;
  setup();
  usec = usec2;
  //console.log(usec);
}

function Start() {
  if (hasPressedMouse && bala.posicion.y < -bala.radio / 1000000) {
    velDisplay.remove();
    angleDisplay.remove();
    hasPressedMouse = false;
    setup();
  } else {
    hasPressedMouse = true;
    bala.velocidad = vset * 100;
    bala.angulo = (angleset * PI) / 180;
    bala.updateVecVelocidad();
    console.log(vset, angleset);
    hasPressedMouse = true;
    velDisplay.html("Velocidad: " + (bala.velocidad / 100).toFixed(2) + "m/s");
    velDisplay.position(10, 25);
    velDisplay.style("color", "white");
    hasPressedMouse = true;
  }
}
function updateG(value) {
  return function () {
    // Hacer algo con el nuevo valor de g
    useg = g[value];
    usep = planets[value];
    usec = c[value];
    usec2 = c[value];
    v = vplan[value];
    restart();
  };
}

function toggleFunction() {
  if (this.checked()) {
    usec = 0;
  } else {
    usec = usec2;
  }
}
//defino objeto y sus propiedades
let Cuerpo = function (_masa, _radio, _posicion, _velocidad, _angulo) {
  this.masa = _masa;
  this.posicion = _posicion;
  this.radio = _radio;
  this.angulo = _angulo;
  this.velocidad = _velocidad * 100;
  this.tray = [];
  this.vec_velocidad = new p5.Vector(
    this.velocidad * cos(this.angulo),
    this.velocidad * sin(this.angulo)
  );
  this.updateVecVelocidad = function () {
    this.vec_velocidad = new p5.Vector(
      this.velocidad * cos(this.angulo),
      this.velocidad * sin(this.angulo)
    );
  };
  //función para renderizar el cuerpo
  this.show = function () {
    ellipse(this.posicion.x, this.posicion.y, this.radio, this.radio);

    //trayectoria
    for (let i = 0; i < this.tray.length - 2; i++) {
      line(
        this.tray[i].x,
        this.tray[i].y,
        this.tray[i + 1].x,
        this.tray[i + 1].y
      );
    }
  };
  //evolución temporal
  this.update = function () {
    gravity = createVector(0, useg * 100);
    vhat = createVector(
      this.vec_velocidad.x / this.velocidad,
      this.vec_velocidad.y / this.velocidad
    );
    Fair = createVector(
      usec * -vhat.x * this.velocidad ** 2,
      usec * -vhat.y * this.velocidad ** 2
    );
    Fnet = createVector(
      this.masa * gravity.x + Fair.x,
      this.masa * gravity.y + Fair.y
    );
    a = createVector(Fnet.x / this.masa, Fnet.y / this.masa);

    this.vec_velocidad.x += a.x * dt;
    this.vec_velocidad.y += a.y * dt;

    this.posicion.x += this.vec_velocidad.x * dt;
    this.posicion.y += this.vec_velocidad.y * dt;

    //this.posicion.x+= this.vec_velocidad.x*dt;
    //this.posicion.y += (this.vec_velocidad.y*dt + 1/2*useg*dt**2);

    this.tray.push(this.posicion.copy());

    let arrowStartY = createVector(this.posicion.x, this.posicion.y);
    let arrowEndY = createVector(
      this.posicion.x,
      this.posicion.y + this.vec_velocidad.y
    );
    drawArrow2(arrowStartY, arrowEndY);

    let arrowStartX = createVector(this.posicion.x, this.posicion.y);
    let arrowEndX = createVector(
      this.posicion.x + this.vec_velocidad.x,
      this.posicion.y
    );
    drawArrow3(arrowStartX, arrowEndX, this.vec_velocidad.x / 10);
  };
};
