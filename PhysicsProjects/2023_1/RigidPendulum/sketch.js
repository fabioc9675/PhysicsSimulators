/* ***********************************************************
 * ***************** PENDULO DOBLE RIGIDO ********************
 * ***********************************************************
 * * Autores: Samuel Vasco                                   *
 * *          Kevin Cortes                                   *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

// declarar variables

let theta1, theta2; // Ángulos de los Rectangulos
let omega1, omega2; // Velocidades angulares de los Rectangulos
let A1, B1; // Dimensiones de rectangulo
let A2, B2; // Dimensiones de rectangulo
let L1; // Distancia del pivote 1 al pivote 2
let R1; // Distancia del pivote 1 al centro de masa 1
let R2; // Distancia del pivote 2 al centro de masa 2
let phi, alfa; // Ángulo entre L1 y R1 y angulo entre las lineas p2v6 y R2
let I1, I2; // Momentos de inercia Rectangulos
let m1, m2; // Masas de los rectangulos
let g; // Aceleración debido a la gravedad
let time; // Tiempo inicial
let timeStep; // Paso de tiempo.
let theta;

let botonTheta1;
let inputTheta1;

let botonAncho1; // Botones para los parametros de entrad
let inputAncho1;

let botonLargo1;
let inputLargo1;

let botonMasa1;
let inputMasa1;

let botonTheta2;
let inputTheta2;

let botonAncho2;
let inputAncho2;

let botonLargo2;
let inputLargo2;

let botonMasa2;
let inputMasa2;

let botonReset;

let botonPlay;
let play = true;

let posvstiemp1 = [];
let posvstiemp2 = [];
let contador = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  ///////////////////////////////////////////////////////////////////////////
  // creacion de boton
  // pareja boton-campo de txto para cambiar theta1
  botonTheta1 = createButton("Posicion Angular Primer Rectangulo");
  botonTheta1.position(windowWidth / 2 - 450, windowHeight / 2 - 40);
  botonTheta1.mousePressed(changeTheta1);
  inputTheta1 = createInput("");
  inputTheta1.position(windowWidth / 2 - 200, windowHeight / 2 - 40);
  inputTheta1.size(120);

  // pareja boton-campo de txto para cambiar ancho del rectangulo 1
  botonAncho1 = createButton("Ancho Primer Rectangulo");
  botonAncho1.position(50, 50);
  botonAncho1.mousePressed(changeWidth1);
  inputAncho1 = createInput("");
  inputAncho1.position(220, 50);
  inputAncho1.size(120);

  // pareja boton-campo de txto para cambiar largo del rectangulo 1
  botonLargo1 = createButton("Largo Primer Rectangulo");
  botonLargo1.position(50, 80);
  botonLargo1.mousePressed(changeHeigth1);
  inputLargo1 = createInput("");
  inputLargo1.position(220, 80);
  inputLargo1.size(120);

  // pareja boton-campo de txto para cambiar masa del rectangulo 1
  botonMasa1 = createButton("Masa Primer Rectangulo");
  botonMasa1.position(50, 110);
  botonMasa1.mousePressed(changeMass1);
  inputMasa1 = createInput("");
  inputMasa1.position(220, 110);
  inputMasa1.size(120);

  //pareja boton-campo de txto para cambiar theta2
  botonTheta2 = createButton("Posicion Angular Segundo Rectangulo");
  botonTheta2.position(windowWidth / 2 - 450, windowHeight / 2 - 10);
  botonTheta2.mousePressed(changeTheta2);
  inputTheta2 = createInput("");
  inputTheta2.position(windowWidth / 2 - 200, windowHeight / 2 - 10);
  inputTheta2.size(120);

  // pareja boton-campo de txto para cambiar ancho del rectangulo 1
  botonAncho2 = createButton("Ancho Segundo Rectangulo");
  botonAncho2.position(45, 150);
  botonAncho2.mousePressed(changeWidth2);
  inputAncho2 = createInput("");
  inputAncho2.position(228, 150);
  inputAncho2.size(120);

  // pareja boton-campo de txto para cambiar largo del rectangulo 2
  botonLargo2 = createButton("Largo Segundo Rectangulo");
  botonLargo2.position(45, 180);
  botonLargo2.mousePressed(changeHeigth2);
  inputLargo2 = createInput("");
  inputLargo2.position(228, 180);
  inputLargo2.size(120);

  // pareja boton-campo de txto para cambiar masa del rectangulo 1
  botonMasa2 = createButton("Masa Segundo Rectangulo");
  botonMasa2.position(45, 210);
  botonMasa2.mousePressed(changeMass2);
  inputMasa2 = createInput("");
  inputMasa2.position(228, 210);
  inputMasa2.size(120);

  // pareja boton para reiniciar la simulacion,
  botonReset = createButton("Reset");
  botonReset.position(windowWidth / 2 - 30, windowHeight / 2 + 160);
  botonReset.mousePressed(reset);

  // pareja boton para pausar la simulacion
  botonPlay = createButton("Pause");
  botonPlay.position(windowWidth / 2 - 30, windowHeight / 2 + 125);
  botonPlay.mousePressed(Play);

  ////////////////////////////////////////////////////////////////////////////
  theta1 = PI / 4; // Ángulo inicial del primer Rectangulo (90 grados)
  theta2 = PI / 6; // Ángulo inicial del segundo Rectangulo (90 grados)
  omega1 = 0; // Velocidad angular inicial del primer Rectangulo
  omega2 = 0; // Velocidad angular inicial del segundo Rectangulo
  m1 = 10; // Masa del primer Rectangulo
  m2 = 10; // Masa del segundo Rectangulo

  A1 = 80; // Ancho del primer Rectangulo
  B1 = 150; // Longitud del primer Rectangulo
  A2 = 80; // Ancho del segundo Rectangulo
  B2 = 150; // Longitud del segundo Rectangulo
  L1 = ((A1 / 2) ** 2 + B1 ** 2) ** 0.5; // Distancia del pivote 1 al pivote 2
  R1 = B1 / 2; // Distancia del pivote 1 al centro de masa 1
  phi = atan(A1 / (2 * B1)); // Ángulo entre L1 y R1
  alfa = atan(A2 / B2); // Ángulo constante entre las lineas p2v6 y R2
  R2 = 0.5 * (A2 ** 2 + B2 ** 2) ** 0.5; // Distancia del pivote 2 al centro de masa del rectángulo 2
  I1 = (1 / 12) * m1 * (A1 ** 2 + B1 ** 2); // Momento de inercia Rectangulo 1
  I2 = (1 / 12) * m2 * (A2 ** 2 + B2 ** 2); // Momento de inercia Rectangulo 2

  g = 9.8; // Aceleración debido a la gravedad

  time = 0; // Tiempo inicial
  timeStep = 0.1; // Paso de tiempo
}

// funcion que retorna un array con las EDO de primer orden del sistema
function getDerivatives(theta1, theta2, omega1, omega2) {
  let dTheta1 = omega1;
  let dTheta2 = omega2;

  let num1 = -2 * g * m1 * R1 * (I2 + m2 * R2 ** 2) * sin(theta1);
  let num2 = -L1 * m2 * g * (2 * I2 + m2 * R2 ** 2) * sin(theta1 + phi);
  let num3 = -L1 * m2 * R2 * g * m2 * R2 * sin(theta1 - 2 * theta2 + phi);
  let num4 =
    -L1 *
    m2 *
    R2 *
    2 *
    (omega2 ** 2 * (I2 + m2 * R2 ** 2) +
      omega1 ** 2 * L1 * m2 * R2 * cos(theta1 - theta2 + phi)) *
    sin(theta1 - theta2 + phi);
  let den =
    2 * I2 * L1 ** 2 * m2 +
    2 * I2 * m1 * R1 ** 2 +
    (L1 * m2 * R2) ** 2 +
    2 * m1 * m2 * (R1 * R2) ** 2 +
    2 * I1 * (I2 + m2 * R2 ** 2) -
    (L1 * m2 * R2) ** 2 * cos(2 * (theta1 - theta2 + phi));
  // Ecuacion de segunda derivada de la posicion angular para el centro de masa del rectángulo 1
  let dOmega1 = (num1 + num2 + num3 + num4) / den;

  num1 =
    -m2 * R2 * g * (2 * I1 + L1 ** 2 * m2 + 2 * m1 * R1 ** 2) * sin(theta2);
  num2 =
    m2 *
    R2 *
    L1 *
    (g * m1 * R1 * sin(theta2 - phi) +
      2 *
        omega1 ** 2 *
        (I1 + L1 ** 2 * m2 + m1 * R1 ** 2) *
        sin(theta1 - theta2 + phi));
  num3 =
    m2 *
    R2 *
    L1 *
    (omega2 ** 2 * L1 * m2 * R2 * sin(2 * (theta1 - theta2 + phi)) +
      g * m1 * R1 * sin(2 * theta1 - theta2 + phi) +
      g * L1 * m2 * sin(2 * theta1 - theta2 + 2 * phi));
  den =
    2 * I2 * L1 ** 2 * m2 +
    2 * I2 * m1 * R1 ** 2 +
    (L1 * m2 * R2) ** 2 +
    2 * m1 * m2 * (R1 * R2) ** 2 +
    2 * I1 * (I2 + m2 * R2 ** 2) -
    (L1 * m2 * R2) ** 2 * cos(2 * (theta1 - theta2 + phi));
  // Ecuacion de segunda derivada de la posicion angular para el centro de masa del rectángulo 2
  let dOmega2 = (num1 + num2 + num3) / den;

  return [dTheta1, dTheta2, dOmega1, dOmega2];
}

function draw() {
  background(245);
  //translate(760,80);
  translate(windowWidth / 2 + 200, windowHeight / 2 - 265);
  if (play) {
    // Calcular las derivadas de los ángulos y las velocidades angulares utilizando el método de Runge-Kutta de cuarto orden
    let k1 = getDerivatives(theta1, theta2, omega1, omega2);
    let k2 = getDerivatives(
      theta1 + 0.5 * timeStep * k1[0],
      theta2 + 0.5 * timeStep * k1[1],
      omega1 + 0.5 * timeStep * k1[2],
      omega2 + 0.5 * timeStep * k1[3]
    );
    let k3 = getDerivatives(
      theta1 + 0.5 * timeStep * k2[0],
      theta2 + 0.5 * timeStep * k2[1],
      omega1 + 0.5 * timeStep * k2[2],
      omega2 + 0.5 * timeStep * k2[3]
    );
    let k4 = getDerivatives(
      theta1 + timeStep * k3[0],
      theta2 + timeStep * k3[1],
      omega1 + timeStep * k3[2],
      omega2 + timeStep * k3[3]
    );

    // Actualizar los ángulos y las velocidades angulares utilizando el método de Runge-Kutta de cuarto orde
    theta1 += (timeStep / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    theta2 += (timeStep / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    omega1 += (timeStep / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
    omega2 += (timeStep / 6) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);

    // Calcular las posiciones del centro de masa del rectagulo 1
    let x1 = R1 * sin(theta1);
    let y1 = R1 * cos(theta1);

    //Posicion de los vertices de los rectangulos en cada frame
    let v1x = (A1 / 2) * cos(theta1);
    let v1y = -(A1 / 2) * sin(theta1);

    let v2x = -v1x;
    let v2y = -v1y;

    let v3x = v2x + B1 * sin(theta1); //L1*sin(theta1-phi);
    let v3y = v2y + B1 * cos(theta1); //L1*cos(theta1-phi);

    let p2x = v3x + A1 * cos(theta1); //L1*sin(theta1+phi);
    let p2y = v3y - A1 * sin(theta1); //L1*cos(theta1+phi);

    // Calcular las posiciones del centro de masa del rectagulo 1
    let x2 = p2x + R2 * sin(theta2);
    let y2 = p2y + R2 * cos(theta2);

    let v4x = p2x + A2 * cos(theta2 - alfa);
    let v4y = p2y - A2 * sin(theta2 - alfa);

    let v5x = p2x + 2 * R2 * sin(theta2);
    let v5y = p2y + 2 * R2 * cos(theta2);

    let v6x = p2x + B2 * sin(theta2 - alfa);
    let v6y = p2y + B2 * cos(theta2 - alfa);

    // Dibujar los Rectangulos
    stroke(0, 0, 255);
    fill(0, 0, 255);
    ellipse(0, 0, 10, 10); //Pivote 1
    ellipse(p2x, p2y, 10, 10); //Pivote 2

    stroke(255, 0, 0);
    fill(255, 0, 0);
    ellipse(x1, y1, 7, 7); // centro de masa 1
    ellipse(x2, y2, 7, 7); // centro de masa 2

    stroke(0);
    strokeWeight(3);
    line(v1x, v1y, v2x, v2y); //linea entre v1 y v2
    line(v2x, v2y, v3x, v3y); //linea entre v2 y v3
    line(v3x, v3y, p2x, p2y); //linea entre v3 y p2
    line(p2x, p2y, v1x, v1y); //linea entre p2 y v1

    line(p2x, p2y, v4x, v4y); //linea entre p2 y v4
    line(v4x, v4y, v5x, v5y); //linea entre v4 y v5
    line(v5x, v5y, v6x, v6y); //linea entre v5 y v6
    line(v6x, v6y, p2x, p2y); //linea entre v6 y p2

    // Actualizar el tiempo transcurrido
    time += timeStep;

    ///////////////////////////////////////////////////////////////////
    //GRAFICA
    posvstiemp1[contador] = new GPoint(theta1, omega1);
    posvstiemp2[contador] = new GPoint(theta2, omega2);

    if (posvstiemp1.length > 800) {
      posvstiemp1.splice(0, 1); // keep path a constant length
      posvstiemp2.splice(0, 1); // keep path a constant length
      contador = 799;
    }

    plot = new GPlot(this); // Creamos la grafica
    plot.setPos(-windowWidth / 2 - 195, windowHeight / 2 + 10); // Posicion de la grafica
    plot.setOuterDim(440, 250); // Dimension de la grafica

    // Add the points
    plot.setPoints(posvstiemp1); // Puntos a graficar

    //Etiquetas de la grafica
    plot.setTitleText("Diagrama de Fase sólido 1");
    plot.getXAxis().setAxisLabelText("Theta1");
    plot.getYAxis().setAxisLabelText("Omega1");
    plot.defaultDraw();

    plot2 = new GPlot(this); // Creamos la grafica
    plot2.setPos(-windowWidth / 2 + 350, windowHeight / 2 + 10); // Posicion de la grafica
    plot2.setOuterDim(440, 250); // Dimension de la grafica

    // Add the points
    plot2.setPoints(posvstiemp2); // Puntos a graficar

    //Etiquetas de la grafica
    plot2.setTitleText("Diagrama de Fase sólido 2");
    plot2.getXAxis().setAxisLabelText("Theta2");
    plot2.getYAxis().setAxisLabelText("Omega2");
    plot2.defaultDraw();
    contador = contador + 1;
  } else {
    // Calcular las posiciones del centro de masa del rectagulo 1
    let x1 = R1 * sin(theta1);
    let y1 = R1 * cos(theta1);

    //Posicion de los vertices de los rectangulos en cada frame
    let v1x = (A1 / 2) * cos(theta1);
    let v1y = -(A1 / 2) * sin(theta1);

    let v2x = -v1x;
    let v2y = -v1y;

    let v3x = v2x + B1 * sin(theta1); //L1*sin(theta1-phi);
    let v3y = v2y + B1 * cos(theta1); //L1*cos(theta1-phi);

    let p2x = v3x + A1 * cos(theta1); //L1*sin(theta1+phi);
    let p2y = v3y - A1 * sin(theta1); //L1*cos(theta1+phi);

    // Calcular las posiciones del centro de masa del rectagulo 1
    let x2 = p2x + R2 * sin(theta2);
    let y2 = p2y + R2 * cos(theta2);

    let v4x = p2x + A2 * cos(theta2 - alfa);
    let v4y = p2y - A2 * sin(theta2 - alfa);

    let v5x = p2x + 2 * R2 * sin(theta2);
    let v5y = p2y + 2 * R2 * cos(theta2);

    let v6x = p2x + B2 * sin(theta2 - alfa);
    let v6y = p2y + B2 * cos(theta2 - alfa);

    // Dibujar los Rectangulos
    stroke(0, 0, 255);
    fill(0, 0, 255);
    ellipse(0, 0, 10, 10); //Pivote 1
    ellipse(p2x, p2y, 10, 10); //Pivote 2

    stroke(255, 0, 0);
    fill(255, 0, 0);
    ellipse(x1, y1, 7, 7); // centro de masa 1
    ellipse(x2, y2, 7, 7); // centro de masa 2

    stroke(0);
    strokeWeight(3);
    line(v1x, v1y, v2x, v2y); //linea entre v1 y v2
    line(v2x, v2y, v3x, v3y); //linea entre v2 y v3
    line(v3x, v3y, p2x, p2y); //linea entre v3 y p2
    line(p2x, p2y, v1x, v1y); //linea entre p2 y v1

    line(p2x, p2y, v4x, v4y); //linea entre p2 y v4
    line(v4x, v4y, v5x, v5y); //linea entre v4 y v5
    line(v5x, v5y, v6x, v6y); //linea entre v5 y v6
    line(v6x, v6y, p2x, p2y); //linea entre v6 y p2

    plot = new GPlot(this); // Creamos la grafica
    plot.setPos(-windowWidth / 2 - 195, windowHeight / 2 + 10); // Posicion de la grafica
    plot.setOuterDim(440, 250); // Dimension de la grafica

    // Add the points
    plot.setPoints(posvstiemp1); // Puntos a graficar

    //Etiquetas de la grafica
    plot.setTitleText("Diagrama de Fase sólido 1");
    plot.getXAxis().setAxisLabelText("Theta1");
    plot.getYAxis().setAxisLabelText("Omega1");
    plot.defaultDraw();

    plot2 = new GPlot(this); // Creamos la grafica
    plot2.setPos(-windowWidth / 2 + 350, windowHeight / 2 + 10); // Posicion de la grafica
    plot2.setOuterDim(440, 250); // Dimension de la grafica

    // Add the points
    plot2.setPoints(posvstiemp2); // Puntos a graficar

    //Etiquetas de la grafica
    plot2.setTitleText("Diagrama de Fase sólido 2");
    plot2.getXAxis().setAxisLabelText("Theta2");
    plot2.getYAxis().setAxisLabelText("Omega2");
    plot2.defaultDraw();
  }
}

// funcion para cambiar theta1
function changeTheta1() {
  theta = (int(inputTheta1.value()) * PI) / 180;

  if (theta >= -PI && theta <= PI) {
    theta1 = theta;
  }
}

// funcion para cambiar el ancho del rectangulo 1
function changeWidth1() {
  ancho = int(inputAncho1.value());

  if (ancho > 0 && ancho < 500) {
    A1 = ancho;
    L1 = ((A1 / 2) ** 2 + B1 ** 2) ** 0.5;
    R1 = B1 / 2;
    phi = atan(A1 / (2 * B1));
    I1 = (1 / 12) * m1 * (A1 ** 2 + B1 ** 2);
  }
}

// funcion para cambiar el largo del rectangulo 1 1
function changeHeigth1() {
  largo = int(inputLargo1.value());

  if (largo > 0 && largo < 500) {
    B1 = largo;
    L1 = ((A1 / 2) ** 2 + B1 ** 2) ** 0.5;
    phi = atan(A1 / (2 * B1));
    R1 = B1 / 2;
    I1 = (1 / 12) * m1 * (A1 ** 2 + B1 ** 2);
  }
}

// funcion para cambiar la masa del rectangulo 1 1
function changeMass1() {
  masa = int(inputMasa1.value());

  if (masa > 0 && masa < 500) {
    m1 = masa;
    I1 = (1 / 12) * m1 * (A1 ** 2 + B1 ** 2);
  }
}

// funcion para cambiar theta2
function changeTheta2() {
  theta = (int(inputTheta2.value()) * PI) / 180;

  if (theta >= -PI && theta <= PI) {
    theta2 = theta;
  }
}

// funcion para cambiar el ancho del rectangulo 2
function changeWidth2() {
  ancho = int(inputAncho2.value());

  if (ancho > 0 && ancho < 500) {
    A2 = ancho;
    alfa = atan(A2 / B2);
    R2 = 0.5 * (A2 ** 2 + B2 ** 2) ** 0.5;
    I2 = (1 / 12) * m2 * (A2 ** 2 + B2 ** 2);
  }
}

// funcion para cambiar el largo del rectangulo 2
function changeHeigth2() {
  largo = int(inputLargo2.value());

  if (largo > 0 && largo < 500) {
    B2 = largo;
    alfa = atan(A2 / B2);
    I2 = (1 / 12) * m2 * (A2 ** 2 + B2 ** 2);
    R2 = 0.5 * (A2 ** 2 + B2 ** 2) ** 0.5;
  }
}

// funcion para cambiar la masa del rectangulo 1
function changeMass2() {
  masa = int(inputMasa2.value());

  if (masa > 0 && masa < 500) {
    m2 = masa;
    I2 = (1 / 12) * m2 * (A2 ** 2 + B2 ** 2);
  }
}

function reset() {
  theta1 = PI / 4;
  theta2 = PI / 6;
  omega1 = 0;
  omega2 = 0;
  A1 = 80;
  B1 = 150;
  A2 = 80;
  B2 = 150;
  L1 = ((A1 / 2) ** 2 + B1 ** 2) ** 0.5;
  R1 = B1 / 2;
  phi = atan(A1 / (2 * B1));
  alfa = atan(A2 / B2);
  R2 = 0.5 * (A2 ** 2 + B2 ** 2) ** 0.5;
  I1 = (1 / 12) * m1 * (A1 ** 2 + B1 ** 2);
  I2 = (1 / 12) * m2 * (A2 ** 2 + B2 ** 2);

  posvstiemp1 = [];
  posvstiemp2 = [];
  contador = 0;
}

function Play() {
  if (play) {
    play = !play; //negacion de la variable booleana
    botonPlay.html("Play");
  } else {
    botonPlay.html("Pause");
    play = !play; //negacion de la variable booleana
  }
}
