/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Luis Adrian Avendaño Londoño                   *
 * *          Santiago Quintero Cordoba                      *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let suelo;
let dt = 1 / 30; //que tanto se avanza en el tiempo
let gravedad = 0;
let y0 = 100; //se crea la una variable la cual nos define a velocidad inicial
let fontsize = 14;
let radio = 10;
let t = 0;

//Se crean 4 botones y 3 cajas de texto para sus respectivos botones
let botonAltura;
let inputAltura;

let botonMasa;
let inputMasa;

let botonGravedad;
let inputGravedad;

let Guardar;
let simular;

let x = [];
let v = [];
let j = 0;

////////////////////////////

// Se crean las variables donde se almacenaran las energías
let K; //Énergía cinetica
let V; //Énergía potencial
let E; //Énergía total
///////////////

//se crea una variable la cual servira para almacenar los datos de una tabla y su funcion de añadir
let tabla;
let añadir;
/////////////////////////////

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  frameRate(30); //numero de interacciones por segundo
  gravedad = createVector(0, 9.8); //Se crea un vector que será la gravedad
  suelo = new Tierra(-width / 2, 0, width, height); //se crea el fondo
  //Tomar en cuenta que el programa toma positivo hacia abajo y negativo hacia arriba

  pelota = new Balon(1000, createVector(-width / 4, -100), createVector(0, 0)); //se crea la particula

  simular = false;

  textSize(fontsize);
  textAlign(LEFT, CENTER);

  //creacion de los botones anteriormente definidos
  botonAltura = createButton("Cambiar Altura(m)  ");
  botonAltura.position(width / 2, height / 2 - 60);
  botonAltura.mousePressed(changeAltura); //accion del boton al darle clic

  inputAltura = createInput("100");
  inputAltura.position(width / 2 + 122, height / 2 - 60);
  inputAltura.size(120);

  botonMasa = createButton("Cambiar Masa(kg)    ");
  botonMasa.position(width / 2, height / 2 - 100);
  botonMasa.mousePressed(changeMasa); //accion del boton al darle clic

  inputMasa = createInput("1000");
  inputMasa.position(width / 2 + 122, height / 2 - 100);
  inputMasa.size(120);

  botonGravedad = createButton("Cambiar Gravedad");
  botonGravedad.position(width / 2, height / 2 - 140);
  botonGravedad.mousePressed(changeGravedad); //accion del boton al darle clic

  inputGravedad = createInput("9.8");
  inputGravedad.position(width / 2 + 122, height / 2 - 140);
  inputGravedad.size(120);

  Guardar = createButton("Guardar");
  Guardar.position(width / 2, height / 2 - 20);
  Guardar.mousePressed(guardar); //accion del boton al darle clic

  botonSimulacion = createButton("Iniciar Simulación");
  botonSimulacion.position(width / 2, height / 2 - 180);
  botonSimulacion.mousePressed(iniciarSimulacion); //accion del boton al darle clic

  //////////////

  tabla = new p5.Table();

  tabla.addColumn("Masa");
  tabla.addColumn("Gravedad");
  tabla.addColumn("Energía cinetica");
  tabla.addColumn("Energía potencial");
  tabla.addColumn("Energía mecanica");
  tabla.addColumn("Velocidad");
  tabla.addColumn("Altura");
}

//creacion de las funciones que le daran la accion correspondientes a los botones
function changeAltura() {
  //Cambio de altura
  pos = int(inputAltura.value());
  pelota.bounces = 0;

  if (pos >= radio && pos <= 360) {
    pelota.pos.y = -pos;
    pelota.vel.x = 0;
    pelota.vel.y = 0;
    y0 = pos;
    t = 0;
    x = [];
    v = [];
    j = 0;
    simular = true; // loop(); //hace que draw() se repita si se llego a usar noLoop();
  }
}

function changeMasa() {
  //Cambio de masa
  mass = int(inputMasa.value());
  pelota.bounces = 0;

  if (mass > 0 && mass <= 1000) {
    pelota.pos.y = -y0;
    pelota.vel.x = 0;
    pelota.vel.y = 0.0;
    pelota.mass = mass;
    t = 0;
    x = [];
    v = [];
    j = 0;
    simular = true; // loop();
  }
}

function changeGravedad() {
  //Cambio de gravedad
  g = int(inputGravedad.value());
  pelota.bounces = 0;

  if (g > 0 && g <= 100) {
    pelota.pos.y = -y0;
    pelota.vel.x = 0;
    pelota.vel.y = 0;
    gravedad = createVector(0, g);
    t = 0;
    x = [];
    v = [];
    j = 0;
    simular = true; // loop();
  }
}

function iniciarSimulacion() {
  // boton para iniciar simulacion

  if (pelota.bounces >= 4) {
    pelota.bounces = 0;

    pelota.pos.y = -y0;
    pelota.vel.x = 0;
    pelota.vel.y = 0;
    t = 0;
    x = [];
    v = [];
    j = 0;
  }

  if (simular == false) {
    simular = true;
    botonSimulacion.html("Parar Simulación");
  } else {
    simular = false;
    botonSimulacion.html("Iniciar Simulación");
  }
}

function guardar() {
  //se guardan los elementos de la tabla en un archivo scv
  saveTable(tabla, "datos.csv");
}
//////////////////////////
function draw() {
  //codigo que se repetira infinitas veces hasta que se use un noLoop(); o un sys,exit();

  translate(windowWidth / 2, windowHeight / 2); //movimiento del sistema coordenado de la pantalla
  background(145, 229, 225); // colocar color en la pantallas

  // creacion de las lines que indican los valores de la altura
  for (let i = 0; i <= height / 2; i = i + 20) {
    text(nfc(i) + " m", -width / 2, -i);
    line(-width / 2 + 50, -i, 0, -i);
    stroke(200);
  }
  ////////////////////

  suelo.mostrar();

  if (simular == true) {
    pelota.movimiento(gravedad); //actualiazacion del movimiento de la particula
  }

  pelota.mostrar();

  if (pelota.pos.y >= -radio) {
    //condicion de que cuando la particula llegue al piso se detenga el programa
  }
  if (pelota.bounces == 4) {
    simular = false;
    botonSimulacion.html("Iniciar Simulación");
    // noLoop();
  }

  ///calculo de todas las energías del sistema en KJ
  V =
    (abs(pelota.pos.y + radio) * gravedad.y * pelota.mass) /
    1000; /*para que la energía potencial se anule en la parte 
  baja ya que tomamos el sistema en su parte inferior en lugar del centro, la energía potencial
  no importa mucho donde definamos su cero, lo importante es el cambio en ella*/
  K = (0.5 * pelota.mass * pelota.vel.y ** 2) / 1000;
  E = V + K;

  //En pantalla se muestra como cambian las energias
  text("Energía Potencial (KJ) = " + nfc(V, 3), 10, -height / 2 + 10);
  text("Energía Cinética (KJ) = " + nfc(K, 3), 10, -height / 2 + 40);
  text("Energía Mecánica (KJ) = " + nfc(E, 3), 10, -height / 2 + 70);
  ///////////////////

  if (simular == true) {
    /*
  observar que en el caso qeu el movimiento sea en el eje x y el eje y 
  K=0.5*pelota.mass*(pelota.vel.x**2 + pelota.vel.y**2) / 1000;
  */
    ////////////////

    //Se añaden a la tabla los valores acuales de cada columna
    añadir = tabla.addRow();

    añadir.setNum(
      "Altura",
      -(pelota.pos.y + radio)
    ); /*para que el movimiento sea tomado desde la posicion inferior
  de la particula*/
    añadir.setNum("Velocidad", pelota.vel.y);
    añadir.setNum("Gravedad", gravedad.y);
    añadir.setNum("Masa", pelota.mass);
    añadir.setNum("Energía cinetica", K);
    añadir.setNum("Energía potencial", V);
    añadir.setNum("Energía mecanica", E);
    //////////

    ////////creacion de las grficas
    x[j] = new GPoint(t, -pelota.pos.y);
    v[j] = new GPoint(t, -pelota.vel.y);

    j += 1;
    t += dt;
  }

  ////////creacion de las grficas
  plotx = new GPlot(this); // Se crea la grafica
  plotv = new GPlot(this); // Se crea la grafica

  plotx.setPos(0, 0); // Posicion de la grafica
  plotv.setPos(-width / 2, 0); // Posicion de la grafica

  plotx.setOuterDim(width / 2, height / 2); // Dimension de la grafica
  plotv.setOuterDim(width / 2, height / 2); // Dimension de la grafica

  plotx.setPoints(x); // Puntos a graficar
  plotv.setPoints(v); // Puntos a graficar

  plotx.setTitleText("Posicion vs tiempo en la caida de la pelota"); //titulo de la grafica
  plotv.setTitleText("velocidad vs tiempo en la caida de la pelota"); //titulo de la grafica

  plotx.getXAxis().setAxisLabelText("Tiempo"); //titulo del eje x
  plotv.getXAxis().setAxisLabelText("Tiempo"); //titulo del eje x

  plotx.getYAxis().setAxisLabelText("Posición"); //titulo del eje y
  plotv.getYAxis().setAxisLabelText("Velocidad"); //titulo del eje y

  plotx.defaultDraw(); //Se muestra la grafica
  plotv.defaultDraw(); //Se muestra la grafica
  ///////////////////////
}

// crear tierra
let Tierra = function (_x, _y, _w, _h) {
  this.x = _x;
  this.y = _y;
  this.w = _w;
  this.h = _h;

  this.mostrar = function () {
    noStroke();
    fill(100);
    rect(this.x, this.y, this.w, this.h);
  };
};

let Balon = function (_mass, _pos, _vel) {
  //inicialmente a la particula se le debe dar su
  //masa, posicion
  this.mass = _mass;
  this.pos = _pos;
  this.vel = _vel;
  this.bounces = 0;

  this.mostrar = function () {
    noStroke();
    fill(40);
    ellipse(
      this.pos.x,
      this.pos.y,
      2 * radio,
      2 * radio
    ); /*Se craea una esfera con radio 30 y centrada en
    (this.pos.x, this.pos.y)
    */
  };

  //Actualizacion del movimiento de la particula
  this.movimiento = function (accel) {
    this.vel.x += accel.x * dt;
    this.vel.y += accel.y * dt;
    this.pos.x += this.vel.x * dt;
    this.pos.y = -(y0 - radio - (0.5 * this.vel.y ** 2) / accel.y);
    if (this.pos.y >= -radio) {
      //condicion de que cuando la particula llegue al piso se detenga el programa
      //noLoop();
      this.vel.y = -this.vel.y;
      this.bounces += 1;
    }
  };
};
