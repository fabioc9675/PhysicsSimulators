/* 
SIMULACIÓN OSCILADOR AMORTIGUADO.
Autor: Juan David Ramírez Cadavid
Institución: Universidad de Antioquia
Programa: Física
Curso: Laboratorio Avanzado III
*/
//Variables y parámetros del sistema
let A; //Longitud de deformación del resorte medida en cm
let k; //Constante elástica del resorte medida en N/m
let m; // Masa de la partícula medida en Kg
let l1; // Constante de amortiguamiento medido en N s/m
let t; // Tiempo
let y1, y2, y3; // Posiciones relativas
let phi; //Desfase angular
let fps = 60; //Paso temporal
let h = 1 / fps; //Evolución del sistema
//VARIABLES QUE CONTROLAN EL SISTEMA
//Botón de play, pause, reset, aplicar
let boton_play, boton_pause, boton_reset, boton_aplicar;

// Variables activación del cronómetro

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

//Variables tamaño de ventana
let wi = window.innerWidth;
let he = window.innerHeight;

//Posiciones iniciales

let y30, y20, y10;

//Generación de frame
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);
  // Parámetros iniciales para el sistema
  A0 = 30;
  k0 = 2;
  m0 = 2;
  l10 = 0;
  phi0 = 0;
  // Creación de los sliders (limite inferior, limite superior, inicial, paso)
  A = createSlider(30, 300, A0, 5);
  k = createSlider(0.5, 15, k0, 0.5);
  m = createSlider(0.1, 20, m0, 0.1);
  l1 = createSlider(0.0, 0.2, l10, 0.005);
  phi = createSlider(0, 180, phi0, 1);

  // Posición del cronómetro y estilo

  timer = createP("timer");
  setInterval(timeIt, 1000);
  timer.position(100, 55);
  timer.style("font-size", "25px");

  // Control de la deformación del resorte

  let amplitud = createDiv();
  amplitud.style("transform: rotate(" + 270 + "deg);");
  amplitud.position(0.02 * wi, 270);
  amplitud.child(A);

  // Control de la constante elástica del resorte

  let elastica = createDiv();
  elastica.style("transform: rotate(" + 270 + "deg);");
  elastica.position(0.1 * wi, 270);
  elastica.child(k);

  // Control de la masa

  let masa = createDiv();
  masa.style("transform: rotate(" + 270 + "deg);");
  masa.position(0.18 * wi, 270);
  masa.child(m);
  // Control del coeficiente de fricción o viscosidad
  let viscosidad = createDiv();
  viscosidad.style("transform: rotate(" + 270 + "deg);");
  viscosidad.position(0.73 * wi, 270);
  viscosidad.child(l1);
  // Control del ángulo de desfase
  let angulo = createDiv();
  angulo.style("transform: rotate(" + 270 + "deg);");
  angulo.position(0.85 * wi, 270);
  angulo.child(phi);
  // Posición de los botones de aplicar, play, pause, Reset y guardar
  boton_aplicar = createButton("Aplicar");
  boton_aplicar.mousePressed(cambios);
  boton_aplicar.position(0.85 * wi, 410);

  boton_play = createButton("Play");
  boton_play.mousePressed(seguir);
  boton_play.position(25, 20);

  boton_pause = createButton("Pause");
  boton_pause.mousePressed(pausa);
  boton_pause.position(75, 20);

  boton_reset = createButton("Reset");
  boton_reset.mousePressed(inicial);
  boton_reset.position(140, 20);

  boton_guardar = createButton("Registro");
  boton_guardar.mousePressed(guardar);
  boton_guardar.position(210, 20);

  //Condiciones Iniciales
  t = 0;
  A0 = A.value();
  k0 = k.value();
  m0 = m.value();
  l10 = l1.value();
  phi0 = phi.value();
}
// Dubujar estructuras, textos y datos de los objetos asociado a funciones.
function draw() {
  background(175);
  // Textos de controles
  fill(0);
  text("Elongación (cm)", 0.04 * wi, 185);
  text(A.value(), 0.1 * wi, 390);

  text("K (N/m)", 0.17 * wi, 185);
  text(k.value(), 0.195 * wi, 390);

  text("m (Kg)", 0.27 * wi, 185);
  text(m.value(), 0.28 * wi, 390);

  text("L(N s /m)", 0.78 * wi, 190);
  text(l1.value(), 0.81 * wi, 390);

  text("Desfase (rad)", 0.87 * wi, 190);
  text(phi.value(), 0.93 * wi, 390);

  translate(windowWidth / 2 + 20, windowHeight / 2 - 30);
  // Aplicación de condicional para selección del tipo de oscilador
  b = (l1.value() / (2 * m.value())) ^ 2; //Coeficiente de amortiguamiento
  c = k.value() / m.value(); //Frecuencia de oscilación

  if (b - c > 0) {
    amortiguado();
  }

  if (b - c == 0) {
    critico();
  }

  if (b - c < 0) {
    subamortiguado();
  }
}
// Función que reinicia la simulación
function inicial() {
  clear();
  createCanvas(windowWidth, windowHeight);
  background(175);

  fill(0);

  text("Elongación(cm)", 0.04 * wi, 185);
  text(A.value(), 0.1 * wi, 390);

  text("K (N/m)", 0.17 * wi, 185);
  text(k.value(), 0.195 * wi, 390);

  text("m (Kg)", 0.27 * wi, 185);
  text(m.value(), 0.28 * wi, 390);

  text("L(N s /m)", 0.78 * wi, 190);
  text(l1.value(), 0.81 * wi, 390);

  text("Desfase (rad)", 0.87 * wi, 190);
  text(phi.value(), 0.93 * wi, 390);

  translate(windowWidth / 2 + 20, windowHeight / 2 - 30);
  y30 = A.value();
  y10 = A.value();
  y20 = A.value();
  counter = 0;
  timer.html("0:00");

  b = (l1.value() / (2 * m.value())) ^ 2;
  c = k.value() / m.value();

  if (b - c > 0) {
    amortiguado();
  }

  if (b - c == 0) {
    critico();
  }

  if (b - c < 0) {
    subamortiguado();
  }
}
// Función para el oscilador amortiguado
function amortiguado() {
  gamma11 =
    l1.value() / (2 * m.value()) +
    sqrt((l1.value() / (2 * m.value())) ^ (2 - k.value() / m.value()));
  gamma12 =
    l1.value() / (2 * m.value()) -
    sqrt((l1.value() / (2 * m.value())) ^ (2 - k.value() / m.value()));
  y1 =
    A.value() * exp(-gamma11 * t) + A.value() * exp(-gamma12 * t) + A.value();
  t += h;

  strokeWeight(2);
  line(0, 0, 0, y1);
  fill(255, 0, 0);
  ellipse(0, y1, m.value() * 10, m.value() * 10);
}
//Función para el oscilador criticamente amortiguado
function critico() {
  gamma21 =
    l1.value() / (2 * m.value()) +
    sqrt((l1.value() / (2 * m.value())) ^ (2 - k.value() / m.value()));
  y2 =
    A.value() * exp(-gamma21 * t) +
    A.value() * t * exp(-gamma21 * t) +
    A.value();
  t += h;

  strokeWeight(2);
  line(0, 0, 0, y2);
  fill(0, 255, 0);
  ellipse(0, y2, m.value() * 10, m.value() * 10);
}
// Función para el oscilador subamortiguado
function subamortiguado() {
  gamma31 = l1.value() / (2 * m.value());
  w0 = k.value() / m.value();
  ww = sqrt(w0 - gamma31 * gamma31);
  phir = phi.value();
  y3 = A.value() * exp(-gamma31 * t) * sin(ww * t + phir) + A.value();
  t += h;

  strokeWeight(2);
  line(0, 0, 0, y3);
  fill(0, 0, 255);
  ellipse(0, y3, m.value() * 10, m.value() * 10);
}
//Función que recibelos cambios e inicializa con la posición correspondiente
function cambios() {
  y30 = A.value();
  y10 = A.value();
  y20 = A.value();
  inicial();
}

//Función que activa el conteo del cronómetro
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
//Función vinculado al botón pausa
function pausa() {
  noLoop();
  play = false;
}
//Función vinculada al botón play y pause para continuar
function seguir() {
  loop();
  play = true;
}
//Función para guardar o almacenar los registros
function guardar() {
  if (registrar) {
    registrar = false;
    boton_guardar.html("Guardar");

    y30 = y3;
    y10 = y1;
    y20 = y2;

    datos = new p5.Table();
    datos.addColumn("t");
    datos.addColumn("y1");
    datos.addColumn("y2");
    datos.addColumn("y3");

    fila = datos.addRow();

    counter_datos = 0;
    agregar_linea = setInterval(linea, 1000);
  } else {
    fila.set(
      "t",
      "A = " +
        A.value() +
        ",k = " +
        k.value() +
        " ,m = " +
        m.value() +
        " ,l = " +
        l1.value() +
        " ,Desfase = " +
        phi.value()
    );
    clearInterval(agregar_linea);
    registrar = true;
    boton_guardar.html("Registro");
    save(datos, "datos_oscilador_amortiguado.csv");
  }
}
//Función que establece el almacenamiento de filas para las variables
function linea() {
  counter_datos++;
  if ((counter_datos <= tmax_datos) & play) {
    fila.set("t", counter);
    fila.set("y1", y1);
    fila.set("y2", y2);
    fila.set("y3", y3);
    fila = datos.addRow();
  } else if (counter_datos > tmax_datos) {
    fila.set(
      "t",
      "A = " +
        A.value() +
        ",k = " +
        k.value() +
        " ,m = " +
        m.value() +
        " ,l = " +
        l1.value() +
        " ,Desfase = " +
        phi.value()
    );
    clearInterval(agregar_linea);
    registrar = true;
    boton_guardar.html("Registro");
    save(datos, "datos_oscilador_amortiguado.csv");
  }
}
