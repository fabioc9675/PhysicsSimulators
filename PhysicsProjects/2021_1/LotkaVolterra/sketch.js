/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Carlos Betancur                                *
 * *          Yessica Lenis                                  *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

// Parametros globales del problema
// inicializacion y valores por defecto
let k1 = 3;
let k2 = 0.02;
let k3 = 0.0006;
let k4 = 0.5;

// Condiciones de poblacion inicial
let p0 = 500,
  d0 = 100;

// Crea las listas en las que se guardaran los datos
let presas = [];
let depredadores = [];
let tiempo = [0]; // Lista que guarda el paso del tiempo
let dt = 0.01; // paso temporal
let diag_fase = [];
let presasVStiempo = [];
let depredadoresVStiempo = [];
let NumPresas = p0;
let NumDepredadores = d0;
let contador = 0;
let Presas = [];
let Depredadores = [];
let iniciar = 0;

let error = 0;

// Variables para el tamaño de la ventana
let w = window.innerWidth; //ancho de la mesa de billar
let h = window.innerHeight; //altura de la mesa de billar

// Define variables para crear los botones
let boton_graph;

let botonPar1;
let inputPar1;

let botonPar2;
let inputPar2;

let botonPar3;
let inputPar3;

let botonPar4;
let inputPar4;

function setup() {
  createCanvas(w, h);

  frameRate(10);
  for (let i = 0; i < 10 * NumPresas; i++) {
    Presas.push(new particle());
  }
  for (let i = 0; i < 10 * NumDepredadores; i++) {
    Depredadores.push(new particle());
  }

  boton_graph = createButton("Graficar");
  boton_graph.position(windowWidth / 2 - 200, windowHeight / 2 + 210);
  boton_graph.mousePressed(mostrar);
  boton_graph.size(100, 20);

  boton_reini = createButton("Reiniciar");
  boton_reini.position(windowWidth / 2 - 200, windowHeight / 2 + 240);
  boton_reini.mousePressed(reiniciar);
  boton_reini.size(100, 20);

  botonPar1 = createButton("k1");
  botonPar1.position(windowWidth / 2 - 230, windowHeight / 2 + 90);
  botonPar1.mousePressed(entrarPar1);

  inputPar1 = createInput("");
  inputPar1.value(k1);
  inputPar1.position(windowWidth / 2 - 200, windowHeight / 2 + 90);
  inputPar1.size(120);

  botonPar2 = createButton("k2");
  botonPar2.position(windowWidth / 2 - 230, windowHeight / 2 + 120);
  botonPar2.mousePressed(entrarPar2);

  inputPar2 = createInput("");
  inputPar2.value(k2);
  inputPar2.position(windowWidth / 2 - 200, windowHeight / 2 + 120);
  inputPar2.size(120);

  botonPar3 = createButton("k3");
  botonPar3.position(windowWidth / 2 - 230, windowHeight / 2 + 150);
  botonPar3.mousePressed(entrarPar3);

  inputPar3 = createInput("");
  inputPar3.value(k3);
  inputPar3.position(windowWidth / 2 - 200, windowHeight / 2 + 150);
  inputPar3.size(120);

  botonPar4 = createButton("k4");
  botonPar4.position(windowWidth / 2 - 230, windowHeight / 2 + 180);
  botonPar4.mousePressed(entrarPar4);

  inputPar4 = createInput("");
  inputPar4.value(k4);
  inputPar4.position(windowWidth / 2 - 200, windowHeight / 2 + 180);
  inputPar4.size(120);

  iniciarCalculo();

  // Creamos la grafica 1

  plot = new GPlot(this); // Creamos la grafica
  plot.setPos(0, 0); // Posicion de la grafica
  plot.setOuterDim(400, height / 2); // Dimension de la grafica

  // Etiquetas de la grafica
  plot.setTitleText("Diagrama de fase");
  plot.getXAxis().setAxisLabelText("Presas");
  plot.getYAxis().setAxisLabelText("Depredadores");

  // Creamos la grafica 2
  plot2 = new GPlot(this); // Creamos la grafica
  plot2.setPos(400, 0); // Posicion de la grafica
  plot2.setOuterDim(400, height / 2); // Dimension de la grafica

  // Etiquetas de la grafica
  plot2.setTitleText("Población Presa");
  plot2.getXAxis().setAxisLabelText("Tiempo");
  plot2.getYAxis().setAxisLabelText("Presas");

  // Creamos la grafica 3
  plot3 = new GPlot(this); // Creamos la grafica
  plot3.setPos(800, 0); // Posicion de la grafica
  plot3.setOuterDim(400, height / 2); // Dimension de la grafica

  // Etiquetas de la grafica
  plot3.setTitleText("Población depredador");
  plot3.getXAxis().setAxisLabelText("Tiempo");
  plot3.getYAxis().setAxisLabelText("Depredadores");
}

function draw() {
  background(220);

  fill(30, 20, 20);
  text(
    "El propósito de este sistema es predecir la evolución y coexistencia entre dos especies donde una es el alimento de la otra, a este modelo se le conoce como sistema predador- presa",
    windowWidth / 2 - 430,
    windowHeight / 2 + 90,
    150,
    300
  );

  if (error == 1) {
    iniciar = 0;
    text(
      "Falló la simulación, presione reiniciar",
      windowWidth / 2 - 200,
      windowHeight / 2 + 60
    );
  }

  if (iniciar == 1) {
    if (contador < 700) {
      calcular(contador); // Llama el algoritmo
      NumPresas = presas[contador];
      NumDepredadores = depredadores[contador];
      contador = contador + 1;
    }

    plot.defaultDraw();
    plot2.defaultDraw();
    plot3.defaultDraw();

    try {
      for (let i = 0; i < NumPresas; i++) {
        Presas[i].movep();
        Presas[i].displayp();
        Presas[i].checkEdgep();
      }
      for (let i = 0; i < NumDepredadores; i++) {
        Depredadores[i].moved();
        Depredadores[i].displayd();
        Depredadores[i].checkEdged();
      }
    } catch {
      error = 1;
      console.log("error");
    }
  }
}

function iniciarCalculo() {
  //Borra la lista para crear una nueva grafica al cambiar los parametros
  // presas.splice(0);
  // depredadores.splice(0);

  //Agrega las condiciones iniciales de la poblacion
  append(presas, p0);
  append(depredadores, d0);
}

// La funcion calcular soluciona la ecuacion diferencial con el algoritmo RK4
function calcular(i) {
  // Aplicamos el metodo de RungeKutta de orden 4
  let KU1P = rata_presa(presas[i], depredadores[i]);
  let KU2P = rata_presa(
    presas[i] + 0.5 * dt,
    depredadores[i] + 0.5 * KU1P * dt
  );
  let KU3P = rata_presa(
    presas[i] + 0.5 * dt,
    depredadores[i] + 0.5 * KU2P * dt
  );
  let KU4P = rata_presa(presas[i] + dt, depredadores[i] + KU3P * dt);

  let KU1D = rata_depredador(presas[i], depredadores[i]);
  let KU2D = rata_depredador(
    presas[i] + 0.5 * dt,
    depredadores[i] + 0.5 * KU1D * dt
  );
  let KU3D = rata_depredador(
    presas[i] + 0.5 * dt,
    depredadores[i] + 0.5 * KU2D * dt
  );
  let KU4D = rata_depredador(presas[i] + dt, depredadores[i] + KU3D * dt);

  let p = presas[i] + (1 / 6) * dt * (KU1P + 2 * KU2P + 2 * KU3P + KU4P);
  let d = depredadores[i] + (1 / 6) * dt * (KU1D + 2 * KU2D + 2 * KU3D + KU4D);

  let t = tiempo[i] + dt;
  diag_fase[i] = new GPoint(p, d);
  presasVStiempo[i] = new GPoint(t, p);
  depredadoresVStiempo[i] = new GPoint(t, d);

  // Agrega la evolucion encontrada a las listas
  append(presas, p);
  append(depredadores, d);
  append(tiempo, t);

  // Add the points
  plot.setPoints(diag_fase); // Puntos a graficar
  plot2.setPoints(presasVStiempo); // Puntos a graficar
  plot3.setPoints(depredadoresVStiempo); // Puntos a graficar

  // colores de las graficas
  plot.setPointColor(this.color("green"));
  plot.setLineColor(this.color(20, 20, 20));

  plot2.setPointColor(this.color("purple"));
  plot2.setLineColor(this.color(20, 20, 20));

  plot3.setPointColor(this.color("red"));
  plot3.setLineColor(this.color(20, 20, 20));
}
// Funcion que llama la funcion calular y muestra las graficas
function mostrar() {
  k1 = float(inputPar1.value());
  k2 = float(inputPar2.value());
  k3 = float(inputPar3.value());
  k4 = float(inputPar4.value());

  iniciar = 1;
}

// Funcion que reinicia los valores por defecto
function reiniciar() {
  p0 = 500;
  d0 = 100;
  // Crea las listas en las que se guardaran los datos
  presas = [];
  depredadores = [];
  tiempo = [0]; // Lista que guarda el paso del tiempo
  diag_fase = [];
  presasVStiempo = [];
  depredadoresVStiempo = [];

  contador = 0;
  Presas = [];
  Depredadores = [];

  iniciar = 0;
  error = 0;
  // setup();

  for (let i = 0; i < 10 * NumPresas; i++) {
    Presas.push(new particle());
  }
  for (let i = 0; i < 10 * NumDepredadores; i++) {
    Depredadores.push(new particle());
  }

  iniciarCalculo();
}

// Funciones que piden ingresar los valores de los paramtetros
function entrarPar1() {
  k1 = float(inputPar1.value());
}

function entrarPar2() {
  k2 = float(inputPar2.value());
}

function entrarPar3() {
  k3 = float(inputPar3.value());
}

function entrarPar4() {
  k4 = float(inputPar4.value());
}

//Funciones que modelan el sistema dinamico
//Tasa de cambio de las presas
function rata_presa(x1, x2) {
  return -k2 * x1 * x2 + k1 * x1;
}
//Tasa de cambio de los depredadores
function rata_depredador(x1, x2) {
  return k3 * x1 * x2 - k4 * x2;
  //return k3 * x1 * x2 - k4 * x2-0.005*x2*x2;
}

class particle {
  constructor() {
    this.xPos = width / 2 + random(width / 2);
    this.yPos = height / 2 + random(height / 2);
    this.speed = createVector(random(-2, 2), random(-2, 2));
    //this.sizep=random(0,10);
    //this.sized=random(0,10);
    this.sizep = 5;
    this.sized = 10;
  }
  movep() {
    // Le da moviviento a las presas
    this.xPos = this.xPos + this.speed.x;
    this.yPos = this.yPos + this.speed.y;
  }
  moved() {
    // Le da movimiento a los depredadores
    this.xPos = this.xPos + this.speed.x;
    this.yPos = this.yPos + this.speed.y;
  }
  displayp() {
    // Grafica circulos purpuras presas
    fill("purple");
    circle(this.xPos, this.yPos, this.sizep);
  }
  displayd() {
    // Grafica circulos rojos depredadores
    fill("red");
    circle();
    circle(this.xPos, this.yPos, this.sized);
  }
  checkEdgep() {
    //Chequea los bordes presas
    if (this.xPos > width || this.xPos < width / 2) {
      this.speed.x = -1 * this.speed.x;
    }
    if (this.yPos > height || this.yPos < height / 2) {
      this.speed.y = -1 * this.speed.y;
    }
  }
  checkEdged() {
    //Chequea los bordes depredadores
    if (this.xPos > width || this.xPos < width / 2) {
      this.speed.x = -1 * this.speed.x;
    }
    if (this.yPos > height || this.yPos < height / 2) {
      this.speed.y = -1 * this.speed.y;
    }
  }
}
