/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Josué Daniel Jaramillo Arroyave                *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let radiusSlider;
let radius = 100; // Radio inicial del círculo

let xOffsetRedInput, yOffsetRedInput, xOffsetBlueInput, yOffsetBlueInput;
let xOffsetRed = 0; // Desplazamiento inicial horizontal de la pelota roja
let yOffsetRed = 0; // Desplazamiento inicial vertical de la pelota roja
let xOffsetBlue = 0; // Desplazamiento inicial horizontal de la pelota azul
let yOffsetBlue = 0; // Desplazamiento inicial vertical de la pelota azul

let ballRed;
let ballBlue;
let ballRadius = 5; // Radio de la pelota
let ballSpeed = 0; // Velocidad de la pelota
let gravity = 9.8; // Gravedad
let isFalling = false; // Variable para controlar si la pelota está cayendo

let trailRed = []; // Array para almacenar las posiciones anteriores de la pelota roja
let trailBlue = []; // Array para almacenar las posiciones anteriores de la pelota azul
let trailLength = 300; // Número máximo de posiciones en la traza

let radiusText,
  xOffsetRedText,
  yOffsetRedText,
  xOffsetBlueText,
  yOffsetBlueText;

let tStep = 0.05; // Paso de tiempo
let elapsedTime = 0; // Contador de tiempo
let positionData = []; // Array para almacenar los datos de posición

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noLoop(); // Para que el dibujo no se repita continuamente

  // Crear los sliders y botones

  // Slider radio
  radiusText = createP("Radio: " + radius);
  radiusText.position(10, 10);
  radiusText.style("color", "white");
  radiusSlider = createSlider(10, 200, 100, 1);
  radiusSlider.position(10, 40);
  radiusSlider.input(updateSimulation);

  // Etiqueta para la pelota azul
  let blueBallText = createP("Pelota azul");
  blueBallText.position(10, 60);
  blueBallText.style("color", "white");

  // Cuadros de entrada para posicion x y y de la pelota azul
  let xLabelBlue = createP("x");
  xLabelBlue.position(10, 75);
  xLabelBlue.style("color", "white");
  xOffsetBlueInput = createInput(xOffsetBlue.toString(), "number");
  xOffsetBlueInput.position(10, 110);
  xOffsetBlueInput.size(50);
  xOffsetBlueInput.input(updateSimulation);

  let yLabelBlue = createP("y");
  yLabelBlue.position(120, 75);
  yLabelBlue.style("color", "white");
  yOffsetBlueInput = createInput(yOffsetBlue.toString(), "number");
  yOffsetBlueInput.position(120, 110);
  yOffsetBlueInput.size(50);
  yOffsetBlueInput.input(updateSimulation);

  // Etiqueta para la pelota roja
  let redBallText = createP("Pelota roja");
  redBallText.position(10, 130);
  redBallText.style("color", "white");

  // Cuadros de entrada para posicion x y y de la pelota roja
  let xLabelRed = createP("x");
  xLabelRed.position(10, 145);
  xLabelRed.style("color", "white");
  xOffsetRedInput = createInput(xOffsetRed.toString(), "number");
  xOffsetRedInput.position(10, 180);
  xOffsetRedInput.size(50);
  xOffsetRedInput.input(updateSimulation);

  let yLabelRed = createP("y");
  yLabelRed.position(120, 145);
  yLabelRed.style("color", "white");
  yOffsetRedInput = createInput(yOffsetRed.toString(), "number");
  yOffsetRedInput.position(120, 180);
  yOffsetRedInput.size(50);
  yOffsetRedInput.input(updateSimulation);

  // Crear botones
  let buttonWidth = 80;
  let buttonHeight = 30;

  // Boton comenzar
  let startButton = createButton("Comenzar");
  startButton.position(10, window.innerHeight - 100);
  startButton.size(buttonWidth, buttonHeight);
  startButton.style("border-radius", "50%");
  startButton.style("background-color", "#4CAF50"); // Color de fondo verde
  startButton.style("color", "white"); // Color del texto blanco
  startButton.mousePressed(startFalling);

  // Boton reiniciar
  let restartButton = createButton("Reiniciar");
  restartButton.position(100, window.innerHeight - 100);
  restartButton.size(buttonWidth, buttonHeight);
  restartButton.style("border-radius", "50%");
  restartButton.style("background-color", "#f44336"); // Color de fondo rojo
  restartButton.style("color", "white"); // Color del texto blanco
  restartButton.mousePressed(restartSimulation);

  // Boton guardar
  let saveButton = createButton("Guardar");
  saveButton.position(190, window.innerHeight - 100);
  saveButton.size(buttonWidth, buttonHeight);
  saveButton.style("border-radius", "50%");
  saveButton.style("background-color", "#2196F3"); // Color de fondo azul
  saveButton.style("color", "white"); // Color del texto blanco
  saveButton.mousePressed(saveData);

  // Inicializar valores de los sliders
  radius = radiusSlider.value();
  xOffsetRed = parseFloat(xOffsetRedInput.value());
  yOffsetRed = parseFloat(yOffsetRedInput.value());
  xOffsetBlue = parseFloat(xOffsetBlueInput.value());
  yOffsetBlue = parseFloat(yOffsetBlueInput.value());

  initializeBalls();
}

function draw() {
  background(0); // Fondo negro

  // Dibujar el círculo
  stroke(255); // Color blanco para el borde
  strokeWeight(4); // Grosor del borde
  noFill();
  ellipse(width / 2, height / 2, radius * 2, radius * 2); // Radio = diámetro / 2

  // Dibujar las trazas de las pelotas
  drawTrail(trailRed, "red");
  drawTrail(trailBlue, "blue");

  // Dibujar el contador de tiempo
  fill(255); // Color blanco para el texto
  noStroke();
  textSize(20);
  text("Tiempo: " + nf(elapsedTime, 1, 2) + " s", width - 190, 30);

  // Actualizar y dibujar las pelotas
  if (isFalling) {
    updateBalls();
    elapsedTime += tStep; // Incrementar el tiempo
    recordPosition(); // Registrar las posiciones actuales
  }
  drawBalls();
}

function updateSimulation() {
  radius = radiusSlider.value();
  xOffsetRed = parseFloat(xOffsetRedInput.value());
  yOffsetRed = parseFloat(yOffsetRedInput.value());
  xOffsetBlue = parseFloat(xOffsetBlueInput.value());
  yOffsetBlue = parseFloat(yOffsetBlueInput.value());

  radiusText.html("Radio: " + radius);

  restartSimulation();
}

function initializeBalls() {
  ballRed = {
    x: width / 2 + xOffsetRed,
    y: height / 2 + yOffsetRed,
    xSpeed: ballSpeed,
    ySpeed: ballSpeed,
  };

  ballBlue = {
    x: width / 2 + xOffsetBlue,
    y: height / 2 + yOffsetBlue,
    xSpeed: ballSpeed,
    ySpeed: ballSpeed,
  };

  trailRed = [];
  trailBlue = [];
  positionData = []; // Reiniciar datos de posición
}

function updateBalls() {
  ballRed.ySpeed += gravity * tStep;
  ballBlue.ySpeed += gravity * tStep;

  ballRed.x += ballRed.xSpeed * tStep;
  ballRed.y += ballRed.ySpeed * tStep;
  ballBlue.x += ballBlue.xSpeed * tStep;
  ballBlue.y += ballBlue.ySpeed * tStep;

  trailRed.push({ x: ballRed.x, y: ballRed.y });
  trailBlue.push({ x: ballBlue.x, y: ballBlue.y });

  if (trailRed.length > trailLength) {
    trailRed.shift();
  }
  if (trailBlue.length > trailLength) {
    trailBlue.shift();
  }

  checkCollision(ballRed, trailRed);
  checkCollision(ballBlue, trailBlue);
}

function checkCollision(ball, trail) {
  let distance = dist(width / 2, height / 2, ball.x, ball.y);
  if (distance + ballRadius > radius) {
    let angle = atan2(ball.y - height / 2, ball.x - width / 2);

    let normalX = cos(angle);
    let normalY = sin(angle);

    let dotProduct = ball.xSpeed * normalX + ball.ySpeed * normalY;
    ball.xSpeed -= 2 * dotProduct * normalX;
    ball.ySpeed -= 2 * dotProduct * normalY;

    let overlap = distance + ballRadius - radius;
    ball.x -= overlap * normalX;
    ball.y -= overlap * normalY;
  }
}

function drawBalls() {
  fill(255, 0, 0); // Color rojo para la pelota
  noStroke();
  ellipse(ballRed.x, ballRed.y, ballRadius * 2, ballRadius * 2);

  fill(0, 0, 255); // Color azul para la pelota
  noStroke();
  ellipse(ballBlue.x, ballBlue.y, ballRadius * 2, ballRadius * 2);
}

function drawTrail(trail, color) {
  noFill();
  stroke(color);
  strokeWeight(2);

  beginShape();
  for (let i = 0; i < trail.length; i++) {
    vertex(trail[i].x, trail[i].y);
  }
  endShape();
}

function startFalling() {
  isFalling = true;
  loop();
}

function restartSimulation() {
  isFalling = false;
  noLoop();
  elapsedTime = 0; // Reiniciar el contador de tiempo
  initializeBalls();
  redraw();
}

function recordPosition() {
  let dataPoint = `${nf(elapsedTime, 1, 2)}, ${nf(ballBlue.x, 1, 2)}, ${nf(
    ballBlue.y,
    1,
    2
  )}, ${nf(ballRed.x, 1, 2)}, ${nf(ballRed.y, 1, 2)}`;
  positionData.push(dataPoint);
}

function saveData() {
  saveStrings(positionData, "pelotas_posiciones.txt");
}
