/* 
SIMULACIÓN PENDULO DOBLE.
Autor: Juan David Ramírez Cadavid
Institución: Universidad de Antioquia
Programa: Física
Curso: Laboratorio Avanzado III
*/
let r1;
let r2;
let m1;
let m2;
let a1;
let a2;
let g;
let a1_v = 0;
let a2_v = 0;
let x1, y1, x2, y2;
let fps = 60; //Paso temporal
let h = 1 / fps; //EvoluciÃ³n del sistema

let px2 = -1;
let py2 = -1;
let cx, cy;

let buffer;

let boton_play, boton_pause, boton_reset, boton_aplicar;

// Variables activaciÃ³n del cronÃ³metro

var timer;
var counter = 0;
let play = true;

// Variables para crear tablas y almacenar datos
let table;
let registrar = true;
let datos;
var agregar_linea;
let fila;
var counter_datos;
let tmax_datos = 120;

let wi = window.innerWidth;
let he = window.innerHeight;
//Posiciones iniciales
let a10, a20;
let x10, x20, y10, y20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);
  pixelDensity(1);
  cx = width / 2;
  cy = 50;
  buffer = createGraphics(width, height);
  buffer.background(175);
  buffer.translate(cx, cy);

  //ParÃ¡metros Iniciales del Sistema
  a1 = PI / 6;
  a2 = PI / 6;
  r10 = 100;
  r20 = 100;
  m10 = 4;
  m20 = 4;
  g0 = 1.0;

  //CreaciÃ³n de Sliders
  r1 = createSlider(1, 150, r10, 1);
  r2 = createSlider(1, 150, r20, 1);
  m1 = createSlider(0.2, 20, m10, 0.2);
  m2 = createSlider(0.2, 20, m20, 0.2);
  g = createSlider(0.0, 30.0, g0, 0.2);

  timer = createP("timer");
  setInterval(timeIt, 1000);
  timer.position(0.63 * wi, 380);
  timer.style("font-size", "25px");

  //
  let radio1 = createDiv();
  radio1.style("transform: rotate(" + 0 + "deg);");
  radio1.position(0.1 * wi, 390);
  radio1.child(r1);

  let radio2 = createDiv();
  radio2.style("transform: rotate(" + 0 + "deg);");
  radio2.position(0.1 * wi, 420);
  radio2.child(r2);

  let masa1 = createDiv();
  masa1.style("transform: rotate(" + 0 + "deg);");
  masa1.position(0.1 * wi, 450);
  masa1.child(m1);

  let masa2 = createDiv();
  masa2.style("transform: rotate(" + 0 + "deg);");
  masa2.position(0.1 * wi, 360);
  masa2.child(m2);

  let gravedad = createDiv();
  gravedad.style("transform: rotate(" + 0 + "deg);");
  gravedad.position(0.1 * wi, 330);
  gravedad.child(g);

  boton_aplicar = createButton("Aplicar");
  boton_aplicar.mousePressed(cambios);
  boton_aplicar.position(0.8 * wi, 360);

  boton_play = createButton("Play");
  boton_play.mousePressed(seguir);
  boton_play.position(0.55 * wi, 360);

  boton_pause = createButton("Pause");
  boton_pause.mousePressed(pausa);
  boton_pause.position(0.45 * wi, 360);

  boton_reset = createButton("Reset");
  boton_reset.mousePressed(inicial);
  boton_reset.position(0.62 * wi, 360);

  boton_guardar = createButton("Registro");
  boton_guardar.mousePressed(guardar);
  boton_guardar.position(0.7 * wi, 360);
}

function draw() {
  background(175);
  imageMode(CORNER);
  image(buffer, 0, 0, width, height);
  fill(0);
  text("r1 (cm)", 0.04 * wi, 405);
  text(r1.value(), 0.31 * wi, 400);

  text("r2 (cm)", 0.04 * wi, 435);
  text(r2.value(), 0.31 * wi, 435);

  text("m1 (Kg)", 0.04 * wi, 470);
  text(m1.value(), 0.31 * wi, 470);

  text("m2 (Kg)", 0.04 * wi, 370);
  text(m2.value(), 0.31 * wi, 370);

  text("g (m/s^2)", 0.04 * wi, 340);
  text(g.value(), 0.31 * wi, 340);

  dpendulo();
}

function dpendulo() {
  let num1 = -g.value() * (2 * m1.value() + m2.value()) * sin(a1);
  let num2 = -m2.value() * g.value() * sin(a1 - 2 * a2);
  let num3 = -2 * sin(a1 - a2) * m2.value();
  let num4 = a2_v * a2_v * r2.value() + a1_v * a1_v * r1.value() * cos(a1 - a2);
  let den =
    r1.value() *
    (2 * m1.value() + m2.value() - m2.value() * cos(2 * a1 - 2 * a2));
  let a1_a = (num1 + num2 + num3 * num4) / den;

  num1 = 2 * sin(a1 - a2);
  num2 = a1_v * a1_v * r1.value() * (m1.value() + m2.value());
  num3 = g.value() * (m1.value() + m2.value()) * cos(a1);
  num4 = a2_v * a2_v * r2.value() * m2.value() * cos(a1 - a2);
  den =
    r2.value() *
    (2 * m1.value() + m2.value() - m2.value() * cos(2 * a1 - 2 * a2));
  let a2_a = (num1 * (num2 + num3 + num4)) / den;

  translate(cx, cy);
  stroke(0);
  strokeWeight(2);

  let x1 = r1.value() * sin(a1);
  let y1 = r1.value() * cos(a1);

  let x2 = x1 + r2.value() * sin(a2);
  let y2 = y1 + r2.value() * cos(a2);

  line(0, 0, x1, y1);
  fill(0);
  ellipse(x1, y1, m1.value(), m1.value());

  line(x1, y1, x2, y2);
  fill(0);
  ellipse(x2, y2, m2.value(), m2.value());

  a1_v += a1_a;
  a2_v += a2_a;
  a1 += a1_v;
  a2 += a2_v;

  //a1_v *= 0.99;
  //a2_v *= 0.99;

  buffer.stroke(0);
  if (frameCount > 1) {
    buffer.line(px2, py2, x2, y2);
  }

  px2 = x2;
  py2 = y2;
}

function inicial() {
  clear();
  createCanvas(windowWidth, windowHeight);

  background(175);
  imageMode(CORNER);
  image(buffer, 0, 0, width, height);
  fill(0);
  text("r1 (cm)", 0.04 * wi, 405);
  text(r1.value(), 0.31 * wi, 400);

  text("r2 (cm)", 0.04 * wi, 435);
  text(r2.value(), 0.31 * wi, 435);

  text("m1 (Kg)", 0.04 * wi, 470);
  text(m1.value(), 0.31 * wi, 470);

  text("m2 (Kg)", 0.4 * wi, 405);
  text(m2.value(), 0.69 * wi, 400);

  text("g (m/s^2)", 0.4 * wi, 435);
  text(g.value(), 0.69 * wi, 435);
  a1 = PI / 6;
  a2 = PI / 6;
  counter = 0;
  timer.html("0:00");

  dpendulo();
}

function cambios() {
  a1 = PI / 6;
  a2 = PI / 6;
  inicial();
}

function timeIt() {
  if (play) {
    counter++;
  }
  minutos = floor(counter / 60);
  segundos = counter % 60;

  if (segundos <= 9) {
    timer.html(minutos + ":0" + segundos);
  } else {
    timer.html(minutos + ":" + segundos);
  }
}

function pausa() {
  noLoop();
  play = false;
}

function seguir() {
  loop();
  play = true;
}

function guardar() {
  if (registrar) {
    registrar = false;
    boton_guardar.html("Guardar");

    datos = new p5.Table();
    datos.addColumn("t");
    datos.addColumn("theta_1");
    datos.addColumn("theta_2");
    fila = datos.addRow();

    counter_datos = 0;
    agregar_linea = setInterval(linea, 1000);
  } else {
    fila.set(
      "t",
      "r1 = " +
        r1.value() +
        ", r2 = " +
        r2.value() +
        ", m1 = " +
        m1.value() +
        ", m2 = " +
        m2.value() +
        ", g = " +
        g.value()
    );
    clearInterval(agregar_linea);
    registrar = true;
    boton_guardar.html("Registro");
    save(datos, "datos_doble_pendulo.csv");
  }
}

function linea() {
  counter_datos++;
  if ((counter_datos <= tmax_datos) & play) {
    fila.set("t", counter);
    fila.set("theta_1", degrees(a1));
    fila.set("theta_2", degrees(a2));
    fila = datos.addRow();
  } else if (counter_datos > tmax_datos) {
    fila.set(
      "t",
      "r1 = " +
        r1.value() +
        ", r2 = " +
        r2.value() +
        ", m1 = " +
        m1.value() +
        ", m2 = " +
        m2.value() +
        ", g = " +
        g.value()
    );
    clearInterval(agregar_linea);
    registrar = true;
    boton_guardar.html("Registro");
    save(datos, "datos_doble_pendulo.csv");
  }
}
