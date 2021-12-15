/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Rafael Barrera                                 *
 * *          Andrea Valencia                                *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

// declarar variables
let pared1;
let pared2;
let mesa;
let caja1;
let caja2;
let dt = 1 / 30;
let botonMasa1;
let inputMasa1;
let botonMasa2;
let inputMasa2;
let botonK1;
let inputK1;
let botonK2;
let inputK2;
let botonK3;
let inputK3;
let botonA1;
let inputA1;
let botonA2;
let inputA2;
let botonF1;
let inputF1;
let botonF2;
let inputF2;

let masam1 = 80;
let masam2 = 200;
let K1 = 20;
let K2 = 10;
let K3 = 30;
let A1 = 10;
let A2 = 15;
let F1 = 1;
let F2 = 0;

let fontsize = 15;

let posvstiemp1 = [];
let posvstiemp2 = [];
let contador = 0;

//el cero de la pantalla es windowWidth/2,windowHeight/2 = (0,0)
// en la funcion setup se inicializan las cosas
function setup() {
  createCanvas(windowWidth, windowHeight); //ventana
  frameRate(30);

  // inicializacion de texto
  textSize(fontsize);
  textAlign(LEFT, CENTER);

  // pareja boton-campo de txto para cambiar la masa de caja1
  botonMasa1 = createButton("Cambiar masa1");
  botonMasa1.position(10, 20);
  botonMasa1.size(130);
  botonMasa1.mousePressed(changeMass1);

  inputMasa1 = createInput("");
  inputMasa1.position(140, 20);
  inputMasa1.size(120);

  // pareja boton-campo de txto para cambiar la masa de caja2
  botonMasa2 = createButton("Cambiar masa2");
  botonMasa2.position(10, 40);
  botonMasa2.size(130);
  botonMasa2.mousePressed(changeMass2);

  inputMasa2 = createInput("");
  inputMasa2.position(140, 40);
  inputMasa2.size(120);

  // pareja boton-campo de txto para cambiar la constante1 del resorte
  botonK1 = createButton("Cambiar K1");
  botonK1.position(10, 60);
  botonK1.size(130);
  botonK1.mousePressed(changeK1);

  inputK1 = createInput("");
  inputK1.position(140, 60);
  inputK1.size(120);

  // pareja boton-campo de txto para cambiar la constante2 del resorte
  botonK2 = createButton("Cambiar K2");
  botonK2.position(10, 80);
  botonK2.size(130);
  botonK2.mousePressed(changeK2);

  inputK2 = createInput("");
  inputK2.position(140, 80);
  inputK2.size(120);

  // pareja boton-campo de txto para cambiar la constante3 del resorte
  botonK3 = createButton("Cambiar K3");
  botonK3.position(10, 100);
  botonK3.size(130);
  botonK3.mousePressed(changeK3);

  inputK3 = createInput("");
  inputK3.position(140, 100);
  inputK3.size(120);

  // pareja boton-campo de txto para cambiar la amplitud1 del resorte
  botonA1 = createButton("Cambiar A1");
  botonA1.position(10, 120);
  botonA1.size(130);
  botonA1.mousePressed(changeA1);

  inputA1 = createInput("");
  inputA1.position(140, 120);
  inputA1.size(120);

  // pareja boton-campo de txto para cambiar la amplitud2 del resorte
  botonA2 = createButton("Cambiar A2");
  botonA2.position(10, 140);
  botonA2.size(130);
  botonA2.mousePressed(changeA2);

  inputA2 = createInput("");
  inputA2.position(140, 140);
  inputA2.size(120);

  // pareja boton-campo de txto para cambiar la fasEF1
  botonF1 = createButton("Cambiar F1");
  botonF1.position(10, 160);
  botonF1.size(130);
  botonF1.mousePressed(changeF1);

  inputF1 = createInput("");
  inputF1.position(140, 160);
  inputF1.size(120);

  // pareja boton-campo de txto para cambiar la faseF2
  botonF2 = createButton("Cambiar F2");
  botonF2.position(10, 180);
  botonF2.size(130);
  botonF2.mousePressed(changeF2);

  inputF2 = createInput("");
  inputF2.position(140, 180);
  inputF2.size(120);

  // instanciamos mesa,pared y cajas.
  pared1 = new pared(350, 0, 40, 800);
  pared2 = new pared(-390, 0, 40, 800);
  mesa = new pared(-350, 150, 700, 30);
  caja1 = new caja(100, 60, 90, "blue");
  caja2 = new caja(-200, 60, 90, "red");
}

// en la funcion draw() se muestran las cosas en pantalla
function draw() {
  translate(windowWidth / 2, windowHeight / 2);
  background(0, 0, 0); // color en la pantala

  // Texto en pantalla
  fill("red");
  text("Valor actualizado de masa m1 a = " + nfc(masam1, 0), -630, -80);
  text("Valor actualizado de masa m2 a = " + nfc(masam2, 0), -630, -60);
  text("Valor actualizado de K1 a = " + nfc(K1, 0), -630, -40);
  text("Valor actualizado de K2 a = " + nfc(K2, 0), -630, -20);
  text("Valor actualizado de K3 a = " + nfc(K3, 0), -630, 0);
  text("Valor actualizado de A1 a = " + nfc(A1, 0), -630, 20);
  text("Valor actualizado de A2 a = " + nfc(A2, 0), -630, 40);
  text("Valor actualizado de F1 a = " + nfc(F1, 0), -630, 60);
  text("Valor actualizado de F2 a = " + nfc(F2, 0), -630, 80);

  pared1.mostrar(); //pared derecha
  pared2.mostrar(); //pared izquierda
  mesa.mostrar(); //mesa de las caja,s
  caja1.movimiento1(A1, A2, K1, K2, K3, masam1, masam2, F1, F2); // amp1, amp2, k1, k2, m1, m2, fas1, fas2
  caja2.movimiento2(A1, A2, K1, K2, K3, masam1, masam2, F1, F2);
  caja1.mostrar(); // caja derecha
  caja2.mostrar(); //caja izquierda
  console.log("contador", contador);
  console.log("posc1", caja1.x);
  console.log("posc2", caja2.x);
  console.log("tiempo", dt);
  posvstiemp1[contador] = new GPoint(dt, caja1.x);
  posvstiemp2[contador] = new GPoint(dt, caja2.x);

  if (posvstiemp1.length > 300) {
    posvstiemp1.splice(0, 1); // keep path a constant length
    posvstiemp2.splice(0, 1); // keep path a constant length
    contador = 299;
  }

  plot = new GPlot(this); // Creamos la grafica
  plot.setPos(150, -300); // Posicion de la grafica
  plot.setOuterDim(480, 297); // Dimension de la grafica

  // Add the points
  plot.setPoints(posvstiemp1); // Puntos a graficar

  //Etiquetas de la grafica
  plot.setTitleText("Grafica1 caja azul");
  plot.getXAxis().setAxisLabelText("Tiempo");
  plot.getYAxis().setAxisLabelText("Posición");
  plot.defaultDraw();

  plot2 = new GPlot(this); // Creamos la grafica
  plot2.setPos(-347, -300); // Posicion de la grafica
  plot2.setOuterDim(480, 297); // Dimension de la grafica

  // Add the points
  plot2.setPoints(posvstiemp2); // Puntos a graficar

  //Etiquetas de la grafica
  plot2.setTitleText("Grafica2 caja roja");
  plot2.getXAxis().setAxisLabelText("Tiempo");
  plot2.getYAxis().setAxisLabelText("Posición");
  plot2.defaultDraw();
  contador = contador + 1;
}

let pared = function (_x, _y, _w, _h) {
  this.x = _x;
  this.y = _y;
  this.w = _w;
  this.h = _h;

  this.mostrar = function () {
    noStroke(); //bordes
    fill("rgb(0,255,0)"); //color
    rect(this.x, this.y, this.w, this.h);
  };
};

// funcion para cambiar Masa1 de la caja1
function changeMass1() {
  masam1 = int(inputMasa1.value());
  inputMasa1.value("");

  caja1.m1 = masam1;
  caja2.m1 = masam1;
}

// funcion para cambiar Masa2 de la caja2
function changeMass2() {
  masam2 = int(inputMasa2.value());
  inputMasa2.value("");

  caja1.m2 = masam2;
  caja2.m2 = masam2;
}

// funcion para cambiar K1
function changeK1() {
  K1 = int(inputK1.value());
  inputK1.value("");

  caja1.k1 = K1;
  caja2.k1 = K1;
}

// funcion para cambiar K2
function changeK2() {
  K2 = int(inputK2.value());
  inputK2.value("");

  caja1.k2 = K2;
  caja2.k2 = K2;
}

// funcion para cambiar K3
function changeK3() {
  K3 = int(inputK3.value());
  inputK3.value("");

  caja1.k3 = K3;
  caja2.k3 = K3;
}

// funcion para cambiar A1
function changeA1() {
  A1 = int(inputA1.value());
  inputA1.value("");

  caja1.amp1 = A1;
  caja2.amp1 = A1;
}
// funcion para cambiar A2
function changeA2() {
  A2 = int(inputA2.value());
  inputA2.value("");

  caja1.amp2 = A2;
  caja2.amp2 = A2;
}

// funcion para cambiar F1
function changeF1() {
  F1 = int(inputF1.value());
  inputF1.value("");

  caja1.fas1 = F1;
  caja2.fas1 = F1;
}

// funcion para cambiar F2
function changeF2() {
  F2 = int(inputF2.value());
  inputF2.value("");

  caja1.fas2 = F2;
  caja2.fas2 = F2;
}

// funcion caja
let caja = function (_x, _y, _w, _color) {
  this.x = _x; // posicion en x
  this.y = _y; // posicion en y
  this.w = _w; //dimensiones caja
  this.color = _color; //color caja

  this.mostrar = function () {
    noStroke();
    fill(this.color);
    square(this.x, this.y, this.w);
  };

  this.movimiento1 = function (
    _amp1,
    _amp2,
    _k1,
    _k2,
    _k3,
    _m1,
    _m2,
    _fas1,
    _fas2
  ) {
    this.amp1 = _amp1;
    this.amp2 = _amp2;
    this.k1 = _k1;
    this.k2 = _k2;
    this.k3 = _k3;
    this.m1 = _m1;
    this.m2 = _m2;
    this.fas1 = _fas1;
    this.fas2 = _fas2;

    dt = dt + 0.6;

    this.a = (this.k1 + this.k2) / this.m1 + (this.k2 + this.k3) / this.m2;
    this.b =
      ((this.k1 + this.k2) / this.m1 - (this.k2 + this.k3) / this.m2) ** 2;
    this.c = 4 * (this.k2 / this.m1) * (this.k2 / this.m2);
    this.omega1 = sqrt(0.5 * (this.a + sqrt(this.b - this.c)));
    this.omega2 = sqrt(0.5 * (this.a - sqrt(this.b - this.c)));

    this.x =
      this.x +
      this.amp1 * sin(this.omega1 * dt + this.fas1) +
      this.amp2 * sin(this.omega2 * dt + this.fas2);
  };

  this.movimiento2 = function (
    _amp1,
    _amp2,
    _k1,
    _k2,
    _k3,
    _m1,
    _m2,
    _fas1,
    _fas2
  ) {
    this.amp1 = _amp1;
    this.amp2 = _amp2;
    this.k1 = _k1;
    this.k2 = _k2;
    this.k3 = _k3;
    this.m1 = _m1;
    this.m2 = _m2;
    this.fas1 = _fas1;
    this.fas2 = _fas2;

    this.a = (this.k1 + this.k2) / this.m1 + (this.k2 + this.k3) / this.m2;
    this.b =
      ((this.k1 + this.k2) / this.m1 - (this.k2 + this.k3) / this.m2) ** 2;
    this.c = 4 * (this.k2 / this.m1) * (this.k2 / this.m2);
    this.omega3 = sqrt(0.5 * (this.a + sqrt(this.b - this.c)));
    this.omega4 = sqrt(0.5 * (this.a - sqrt(this.b - this.c)));

    this.x =
      this.x +
      this.amp1 * sin(this.omega3 * dt + this.fas1) -
      this.amp2 * sin(this.omega4 * dt + this.fas2);
  };
};
