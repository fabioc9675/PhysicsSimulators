/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Edwin Dair Zapata                              *
 * *          Andres Felipe Gomez                            *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let g = 9.8; // Aceleración gracitacional

let cC = 0.5; // constante momento inercia Cilindro
let cE = 0.4; // constante momento inercia Esfera
let cA = 1; // constante momento inercia Anillo
let cD = 0.5; // constante momento inercia Disco

let y0;
let z0; // valor inicial de z

//Posiciones figura 1
let yc1, zc1, yr1, zr1, ye1, ze1, yR1, zR1;
//Posiciones figura 2
let yc2, zc2, yr2, zr2, ye2, ze2, yR2, zR2;
//POsiciones figura 3
let yc3, zc3, yr3, zr3, ye3, ze3, yR3, zR3;

//POsiciones figura 4
let yc4, zc4, yr4, zr4, ye4, ze4, yR4, zR4;

let img;
let vias;
let time;

let button;

let button2;

let Figura1, Figura2, Figura3, Figura4;

let select1, select2, select3, select4;

let inputm1, inputm2, inputm3, inputm4;

let inputr1, inputr2, inputr3, inputr4;

let MASA, Angulo;

let valuem1;

let vm1;
//Contador de reinicio
let Contador = 1;
//Contador para las figuras.
let figura1 = 1;
//Velocidades figuras 1
let Vzc1 = 0,
  Vyc1 = 0,
  Vzr1 = 0,
  Vyr1 = 0,
  Vze1 = 0,
  Vye1 = 0,
  VzR1 = 0,
  VyR1 = 0;
//Velocidades figuras 2
let Vzc2 = 0,
  Vyc2 = 0,
  Vzr2 = 0,
  Vyr2 = 0,
  Vze2 = 0,
  Vye2 = 0,
  VzR2 = 0,
  VyR2 = 0;
//Velocidades figuras 3
let Vzc3 = 0,
  Vyc3 = 0,
  Vzr3 = 0,
  Vyr3 = 0,
  Vze3 = 0,
  Vye3 = 0,
  VzR3 = 0,
  VyR3 = 0;
//Velocidades figuras 4
let Vzc4 = 0,
  Vyc4 = 0,
  Vzr4 = 0,
  Vyr4 = 0,
  Vze4 = 0,
  Vye4 = 0,
  VzR4 = 0,
  VyR4 = 0;

// Carga las imagenes de la simulacion.
function preload() {
  img = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2022_1/BodyDrop/Image/cesped.jpeg"
  );
  vias = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2022_1/BodyDrop/Image/vias.jpg"
  );
}

//Crea el canvas 3D.
function setup() {
  createCanvas(1000, 1000, WEBGL);
  camera(0, -100, 300, 0, 0, 0, 0, 1, 0);
  normalMaterial();
  debugMode();
  describe(
    "a 3D box is centered on a grid in a 3D sketch. an icon indicates the direction of each axis: a red line points +X, a green line +Y, and a blue line +Z. the grid and icon disappear when the spacebar is pressed."
  );
  frameRate(30);

  //Crea la seleccion de figuras.

  Figura1 = createP("Figura 1");
  Figura1.style("font-weight", "bold");
  Figura1.position(20, 40);

  Figura2 = createP("Figura 2");
  Figura2.style("font-weight", "bold");
  Figura2.position(20, 80);

  Figura3 = createP("Figura 3");
  Figura3.style("font-weight", "bold");
  Figura3.position(20, 120);

  Figura4 = createP("Figura 4");
  Figura4.style("font-weight", "bold");
  Figura4.position(20, 160);

  //Crea las figuras.

  select1 = createSelect();
  select1.position(100, 55);
  select1.option("-----");
  select1.option("Esfera");
  select1.option("Cilindro");
  select1.option("Anillo");
  select1.option("Disco");

  select2 = createSelect();
  select2.position(100, 95);
  select2.option("-----");
  select2.option("Esfera");
  select2.option("Cilindro");
  select2.option("Anillo");
  select2.option("Disco");

  select3 = createSelect();
  select3.position(100, 135);
  select3.option("-----");
  select3.option("Esfera");
  select3.option("Cilindro");
  select3.option("Anillo");
  select3.option("Disco");

  select4 = createSelect();
  select4.position(100, 175);
  select4.option("-----");
  select4.option("Esfera");
  select4.option("Cilindro");
  select4.option("Anillo");
  select4.option("Disco");

  //Crea los sliders de la masa.

  MASA = createP("Masa[Kg]");
  MASA.style("font-weight", "bold");
  MASA.position(210, 5);

  inputm1 = createInput("50");
  inputm1.size(100);
  inputm1.position(200, 55);

  inputm2 = createInput("100");
  inputm2.size(100);
  inputm2.position(200, 95);

  inputm3 = createInput("150");
  inputm3.size(100);
  inputm3.position(200, 135);

  inputm4 = createInput("200");
  inputm4.size(100);
  inputm4.position(200, 175);

  //Crea los sliders de el radio.

  RADIO = createP("Radio[m]");
  RADIO.style("font-weight", "bold");
  RADIO.position(340, 5);

  inputr1 = createInput("10");
  inputr1.size(100);
  inputr1.position(320, 55);

  inputr2 = createInput("10");
  inputr2.size(100);
  inputr2.position(320, 95);

  inputr3 = createInput("10");
  inputr3.size(100);
  inputr3.position(320, 135);

  inputr4 = createInput("10");
  inputr4.size(100);
  inputr4.position(320, 175);

  Angulo = createP("Angulo[°]");
  Angulo.style("font-weight", "bold");
  Angulo.position(900, 80);

  inputa = createInput("30");
  inputa.size(100);
  inputa.position(880, 120);

  //Boton de iniciar y reiniciar

  button = createButton("Reiniciar");
  button.position(900, 65);
  button.mousePressed(Reset);

  button2 = createButton("Iniciar");
  button2.position(900, 30);
  button2.mousePressed(Start);
}

function Start() {
  Contador = 0;
}

function Reset() {
  y01 = -100 * sin(radians(float(inputa.value()))) - float(inputr1.value());
  z01 = -100 * cos(radians(float(inputa.value())));
  //Reinicia las posiciones figura 1.
  yc1 = y01;
  zc1 = z01;

  yr1 = y01;
  zr1 = z01;

  yR1 = y01;
  zR1 = z01;

  ye1 = y01;
  ze1 = z01;

  //Reinicia las posiciones figura 2.

  y02 = -100 * sin(radians(float(inputa.value()))) - float(inputr2.value());
  z02 = -100 * cos(radians(float(inputa.value())));

  yc2 = y02;
  zc2 = z02;

  yr2 = y02;
  zr2 = z02;

  yR2 = y02;
  zR2 = z02;

  ye2 = y02;
  ze2 = z02;

  //Reinicia las posiciones figura 3.

  y03 = -100 * sin(radians(float(inputa.value()))) - float(inputr2.value());
  z03 = -100 * cos(radians(float(inputa.value())));

  yc3 = y03;
  zc3 = z03;

  yr3 = y03;
  zr3 = z03;

  yR3 = y03;
  zR3 = z03;

  ye3 = y03;
  ze3 = z03;

  //Reinicia las posiciones figura 4.
  y04 = -100 * sin(radians(float(inputa.value()))) - float(inputr2.value());
  z04 = -100 * cos(radians(float(inputa.value())));

  yc4 = y04;
  zc4 = z04;

  yr4 = y04;
  zr4 = z04;

  yR4 = y04;
  zR4 = z04;

  ye4 = y04;
  ze4 = z04;

  //Reinicia las velocidades figura1.
  Vzc1 = 0;
  Vyc1 = 0;

  Vzr1 = 0;
  Vyr1 = 0;

  Vze1 = 0;
  Vye1 = 0;

  VzR1 = 0;
  VyR1 = 0;

  //Reiniciado velcoidades figura2.
  Vzc2 = 0;
  Vyc2 = 0;

  Vzr2 = 0;
  Vyr2 = 0;

  Vze2 = 0;
  Vye2 = 0;

  VzR2 = 0;
  VyR2 = 0;

  //Reiniciado velcoidades figura3.
  Vzc3 = 0;
  Vyc3 = 0;

  Vzr3 = 0;
  Vyr3 = 0;

  Vze3 = 0;
  Vye3 = 0;

  VzR3 = 0;
  VyR3 = 0;

  //Reiniciado velcoidades figura4.
  Vzc4 = 0;
  Vyc4 = 0;

  Vzr4 = 0;
  Vyr4 = 0;

  Vze4 = 0;
  Vye4 = 0;

  VzR4 = 0;
  VyR4 = 0;

  Contador = 1;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Funciones de los cilindros.

function Cilindro1(x0, _ang, r) {
  //  Dibuja un Cilindro
  push();
  if (zc1 < 0) {
    fill(0, 50 - int(inputm1.value()), 255 - int(inputm1.value()));
  }
  if (zc1 >= 0) {
    fill("green");
  }
  translate(x0, yc1, zc1); // (-40,-61,-37);
  rotateZ(PI / 2); //degrees(90));
  cylinder(r, 40);

  pop();

  //Cinematica cilindro.
  if (Contador == 0) {
    vzc1 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cC);
    vyc1 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cC);

    Vzc1 += vzc1;
    Vyc1 += vyc1;

    zc1 =
      -(
        100 -
        Vzc1 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cC)
      ) * cos(radians(_ang));
    yc1 =
      -(
        100 -
        Vyc1 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cC)
      ) *
        sin(radians(_ang)) -
      r;
  }
  //Para reiniciar.
  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yc1 = y0;
    zc1 = z0;
  }
  //Condicion para cuando se llegue al final del plano inclinado.
  if (zc1 >= -10) {
    yc1 = -r;
  }
}

function Cilindro2(x0, _ang, r) {
  //  Dibuja un Cilindro
  push();

  push();
  if (zc2 < 0) {
    fill(0, 50 - int(inputm2.value()), 255 - int(inputm2.value()));
  }

  if (zc2 >= 0) {
    fill("green");
  }
  translate(x0, yc2, zc2); // (-40,-61,-37);
  rotateZ(PI / 2); //degrees(90));
  cylinder(r, 40);

  pop();

  //Cinematica cilindro.
  if (Contador == 0) {
    vzc2 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cC);
    vyc2 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cC);

    Vzc2 += vzc2;
    Vyc2 += vyc2;

    zc2 =
      -(
        100 -
        Vzc2 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cC)
      ) * cos(radians(_ang));
    yc2 =
      -(
        100 -
        Vyc2 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cC)
      ) *
        sin(radians(_ang)) -
      r;
  }
  //Para reiniciar.
  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yc2 = y0;
    zc2 = z0;
  }
  //Condicion para cuando se llegue al final del plano inclinado.
  if (zc2 >= -10) {
    yc2 = -r;
  }
}

function Cilindro3(x0, _ang, r) {
  //  Dibuja un Cilindro
  push();

  if (zc3 < 0) {
    fill(0, 50 - int(inputm3.value()), 255 - int(inputm3.value()));
  }
  if (zc3 >= 0) {
    fill("green");
  }
  translate(x0, yc3, zc3); // (-40,-61,-37);
  rotateZ(PI / 2); //degrees(90));
  cylinder(r, 40);

  pop();

  //Cinematica cilindro.
  if (Contador == 0) {
    vzc3 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cC);
    vyc3 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cC);

    Vzc3 += vzc3;
    Vyc3 += vyc3;

    zc3 =
      -(
        100 -
        Vzc3 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cC)
      ) * cos(radians(_ang));
    yc3 =
      -(
        100 -
        Vyc3 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cC)
      ) *
        sin(radians(_ang)) -
      r;
  }
  //Para reiniciar.
  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yc3 = y0;
    zc3 = z0;
  }
  //Condicion para cuando se llegue al final del plano inclinado.
  if (zc3 >= -10) {
    yc3 = -r;
  }
}

function Cilindro4(x0, _ang, r) {
  //  Dibuja un Cilindro
  push();
  if (zc4 < 0) {
    fill(0, 50 - int(inputm4.value()), 255 - int(inputm4.value()));
  }
  if (zc4 >= 0) {
    fill("green");
  }
  translate(x0, yc4, zc4); // (-40,-61,-37);
  rotateZ(PI / 2); //degrees(90));
  cylinder(r, 40);

  pop();

  //Cinematica cilindro.
  if (Contador == 0) {
    vzc4 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cC);
    vyc4 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cC);

    Vzc4 += vzc4;
    Vyc4 += vyc4;

    zc4 =
      -(
        100 -
        Vzc4 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cC)
      ) * cos(radians(_ang));
    yc4 =
      -(
        100 -
        Vyc4 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cC)
      ) *
        sin(radians(_ang)) -
      r;
  }
  //Para reiniciar.
  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yc4 = y0;
    zc4 = z0;
  }
  //Condicion para cuando se llegue al final del plano inclinado.
  if (zc4 >= -10) {
    yc4 = -r;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Creacion de los anillos

function Anillo1(x0, _ang, r) {
  //Anillo
  push();
  if (zr1 < 0) {
    fill(255 - int(inputm1.value()), 0, 0);
  }
  if (zr1 >= 0) {
    fill("green");
  }
  translate(x0, yr1, zr1); //,-61,-37);
  rotateY(PI / 2); //degrees(90));
  torus(r, 0.3);
  pop();

  //Cinematica de Anillo

  if (Contador == 0) {
    vzr1 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cA);
    vyr1 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cA);

    Vzr1 += vzr1;
    Vyr1 += vyr1;

    zr1 =
      -(
        100 -
        Vzr1 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cA)
      ) * cos(radians(_ang));
    yr1 =
      -(
        100 -
        Vyr1 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cA)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yr1 = y0;
    zr1 = z0;
  }

  //Condicion para cuando se llegue al final del plano inclinado.

  if (zr1 >= -10) {
    yr1 = -r;
  }
}

function Anillo2(x0, _ang, r) {
  //Anillo
  push();
  if (zr2 < 0) {
    fill(255 - int(inputm2.value()), 0, 0);
  }
  if (zr2 >= 0) {
    fill("green");
  }
  translate(x0, yr2, zr2); //,-61,-37);
  rotateY(PI / 2); //degrees(90));
  torus(r, 0.3);
  pop();

  //Cinematica de Anillo

  if (Contador == 0) {
    vzr2 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cA);
    vyr2 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cA);

    Vzr2 += vzr2;
    Vyr2 += vyr2;

    zr2 =
      -(
        100 -
        Vzr2 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cA)
      ) * cos(radians(_ang));
    yr2 =
      -(
        100 -
        Vyr2 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cA)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yr2 = y0;
    zr2 = z0;
  }

  //Condicion para cuando se llegue al final del plano inclinado.

  if (zr2 >= -10) {
    yr2 = -r;
  }
}

function Anillo3(x0, _ang, r) {
  //Anillo
  push();
  if (zr3 < 0) {
    fill(255 - int(inputm3.value()), 0, 0);
  }
  if (zr3 >= 0) {
    fill("green");
  }
  translate(x0, yr3, zr3); //,-61,-37);
  rotateY(PI / 2); //degrees(90));
  torus(r, 0.3);
  pop();

  //Cinematica de Anillo

  if (Contador == 0) {
    vzr3 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cA);
    vyr3 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cA);

    Vzr3 += vzr3;
    Vyr3 += vyr3;

    zr3 =
      -(
        100 -
        Vzr3 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cA)
      ) * cos(radians(_ang));
    yr3 =
      -(
        100 -
        Vyr3 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cA)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yr3 = y0;
    zr3 = z0;
  }

  //Condicion para cuando se llegue al final del plano inclinado.

  if (zr3 >= -10) {
    yr3 = -r;
  }
}

function Anillo4(x0, _ang, r) {
  //Anillo
  push();
  if (zr4 < 0) {
    fill(255 - int(inputm4.value()), 0, 0);
  }
  if (zr4 >= 0) {
    fill("green");
  }
  translate(x0, yr4, zr4); //,-61,-37);
  rotateY(PI / 2); //degrees(90));
  torus(r, 0.3);
  pop();

  //Cinematica de Anillo

  if (Contador == 0) {
    vzr4 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cA);
    vyr4 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cA);

    Vzr4 += vzr4;
    Vyr4 += vyr4;

    zr4 =
      -(
        100 -
        Vzr4 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cA)
      ) * cos(radians(_ang));
    yr4 =
      -(
        100 -
        Vyr4 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cA)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yr4 = y0;
    zr4 = z0;
  }

  //Condicion para cuando se llegue al final del plano inclinado.

  if (zr4 >= -10) {
    yr4 = -r;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Creacion de las esferas.
function Esfera1(x0, _ang, r) {
  // Esfera
  push();
  if (ze1 < 0) {
    fill(255 - int(inputm1.value()), 255 - int(inputm1.value()), 0);
  }

  if (ze1 >= 0) {
    fill("green");
  }
  translate(x0, ye1, ze1); //,-61,-37);
  rotateY(PI / 2); //degrees(90));
  sphere(r);
  pop();

  //Cinematica de la esfera

  if (Contador == 0) {
    vze1 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cE);
    vye1 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cE);

    Vze1 += vze1;
    Vye1 += vye1;

    ze1 =
      -(
        100 -
        Vze1 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cE)
      ) * cos(radians(_ang));
    ye1 =
      -(
        100 -
        Vye1 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cE)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    ye1 = y0;
    ze1 = z0;
  }

  if (ze1 >= -10) {
    ye1 = -r;
  }
}

function Esfera2(x0, _ang, r) {
  // Esfera
  push();
  if (ze2 < 0) {
    fill(255 - int(inputm2.value()), 255 - int(inputm2.value()), 0);
  }
  if (ze2 >= 0) {
    fill("green");
  }
  translate(x0, ye2, ze2); //,-61,-37);
  rotateY(PI / 2); //degrees(90));
  sphere(r);
  pop();

  //Cinematica de la esfera

  if (Contador == 0) {
    vze2 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cE);
    vye2 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cE);

    Vze2 += vze2;
    Vye2 += vye2;

    ze2 =
      -(
        100 -
        Vze2 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cE)
      ) * cos(radians(_ang));
    ye2 =
      -(
        100 -
        Vye2 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cE)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    ye2 = y0;
    ze2 = z0;
  }

  if (ze2 >= -10) {
    ye2 = -r;
  }
}

function Esfera3(x0, _ang, r) {
  // Esfera
  push();
  if (ze3 < 0) {
    fill(255 - int(inputm3.value()), 255 - int(inputm3.value()), 0);
  }
  if (ze3 >= 0) {
    fill("green");
  }
  translate(x0, ye3, ze3); //,-61,-37);
  rotateY(PI / 2); //degrees(90));
  sphere(r);
  pop();

  //Cinematica de la esfera

  if (Contador == 0) {
    vze3 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cE);
    vye3 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cE);

    Vze3 += vze3;
    Vye3 += vye3;

    ze3 =
      -(
        100 -
        Vze3 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cE)
      ) * cos(radians(_ang));
    ye3 =
      -(
        100 -
        Vye3 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cE)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    ye3 = y0;
    ze3 = z0;
  }

  if (ze3 >= -10) {
    ye3 = -r;
  }
}

function Esfera4(x0, _ang, r) {
  // Esfera
  push();
  if (ze4 < 0) {
    fill(255 - int(inputm4.value()), 255 - int(inputm4.value()), 0);
  }
  if (ze4 >= 0) {
    fill("green");
  }
  translate(x0, ye4, ze4); //,-61,-37);
  rotateY(PI / 2); //degrees(90));
  sphere(r);
  pop();

  //Cinematica de la esfera

  if (Contador == 0) {
    vze4 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cE);
    vye4 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cE);

    Vze4 += vze4;
    Vye4 += vye4;

    ze4 =
      -(
        100 -
        Vze4 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cE)
      ) * cos(radians(_ang));
    ye4 =
      -(
        100 -
        Vye4 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cE)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    ye4 = y0;
    ze4 = z0;
  }

  if (ze4 >= -10) {
    ye4 = -r;
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Creacion de los discos.

function Disco1(x0, _ang, r) {
  //Disco
  push();
  if (zR1 < 0) {
    fill(255 - int(inputm1.value()), 0, 220 - int(inputm1.value()));
  }
  //Condicion para que la figura se vuelva verde al llegar al suelo.
  if (zR1 >= 0) {
    fill("green");
  }
  translate(x0, yR1, zR1); //,-61,-37);
  rotateZ(PI / 2); //degrees(90));
  cylinder(r, 3);
  pop();

  //Cinematica de Disco.

  if (Contador == 0) {
    vzR1 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cD);
    vyR1 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cD);

    VzR1 += vzR1;
    VyR1 += vyR1;

    zR1 =
      -(
        100 -
        VzR1 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cD)
      ) * cos(radians(_ang));
    yR1 =
      -(
        100 -
        VyR1 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cD)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yR1 = y0;
    zR1 = z0;
  }

  if (zR1 >= -10) {
    yR1 = -r;
  }
}

function Disco2(x0, _ang, r) {
  //Disco
  push();
  if (zR2 < 0) {
    fill(255 - int(inputm2.value()), 0, 220 - int(inputm2.value()));
  }

  //Condicion para que la figura se vuelva verde al llegar al suelo.
  if (zR2 >= 0) {
    fill("green");
  }
  translate(x0, yR2, zR2); //,-61,-37);
  rotateZ(PI / 2); //degrees(90));
  cylinder(r, 3);
  pop();

  //Cinematica de Disco.

  if (Contador == 0) {
    vzR2 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cD);
    vyR2 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cD);

    VzR2 += vzR2;
    VyR2 += vyR2;

    zR2 =
      -(
        100 -
        VzR2 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cD)
      ) * cos(radians(_ang));
    yR2 =
      -(
        100 -
        VyR2 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cD)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yR2 = y0;
    zR2 = z0;
  }

  if (zR2 >= -10) {
    yR2 = -r;
  }
}

function Disco3(x0, _ang, r) {
  //Disco
  push();
  if (zR3 < 0) {
    fill(255 - int(inputm3.value()), 0, 220 - int(inputm3.value()));
  }
  //Condicion para que la figura se vuelva verde al llegar al suelo.
  if (zR3 >= 0) {
    fill("green");
  }
  translate(x0, yR3, zR3); //,-61,-37);
  rotateZ(PI / 2); //degrees(90));
  cylinder(r, 3);
  pop();

  //Cinematica de Disco.

  if (Contador == 0) {
    vzR3 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cD);
    vyR3 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cD);

    VzR3 += vzR3;
    VyR3 += vyR3;

    zR3 =
      -(
        100 -
        VzR3 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cD)
      ) * cos(radians(_ang));
    yR3 =
      -(
        100 -
        VyR3 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cD)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yR3 = y0;
    zR3 = z0;
  }

  if (zR3 >= -10) {
    yR3 = -r;
  }
}

function Disco4(x0, _ang, r) {
  //Disco
  push();
  if (zR4 < 0) {
    fill(255 - int(inputm4.value()), 0, 220 - int(inputm4.value()));
  }
  //Condicion para que la figura se vuelva verde al llegar al suelo.
  if (zR4 >= 0) {
    fill("green");
  }
  translate(x0, yR4, zR4); //,-61,-37);
  rotateZ(PI / 2); //degrees(90));
  cylinder(r, 3);
  pop();

  //Cinematica de Disco.

  if (Contador == 0) {
    vzR4 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cD);
    vyR4 = (sin(radians(_ang)) * g * (deltaTime / 30)) / (1 + cD);

    VzR4 += vzR4;
    VyR4 += vyR4;

    zR4 =
      -(
        100 -
        VzR4 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cD)
      ) * cos(radians(_ang));
    yR4 =
      -(
        100 -
        VyR4 * (deltaTime / 30) -
        (0.5 * (sin(radians(_ang)) * g * (deltaTime / 30) ** 2)) / (1 + cD)
      ) *
        sin(radians(_ang)) -
      r;
  }

  if (Contador == 1) {
    y0 = -100 * sin(radians(_ang)) - r;
    z0 = -100 * cos(radians(_ang));

    yR4 = y0;
    zR4 = z0;
  }

  if (zR4 >= -10) {
    yR4 = -r;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Termina de crear las figuras para cada opcion.

function draw() {
  background(200);
  orbitControl();

  //Haciendo planos para darle textura al piso.----------------------------------------------------------------------------------------

  // Primer Plano izquierdo
  push();
  translate(-195, 0, 0);
  rotateX(PI / 2);
  texture(img);
  plane(190, 500);
  pop();

  // Primer Plano derecho
  push();
  translate(180, 0, 0);
  rotateX(PI / 2);
  texture(img);
  plane(160, 500);
  pop();

  // vias Plano
  push();
  translate(0, 0, 100);
  rotateX(PI / 2);
  texture(vias);
  plane(200, 300);
  pop();

  //Termina de configurar el piso.-----------------------------------------------------------------------------------------------------
  push();
  sphere(1);
  translate(0, 0, 0);

  // Dibuja el Plano inclinado.
  push();
  translate(
    0,
    -50 * sin(radians(inputa.value())),
    -50 * cos(radians(inputa.value()))
  );
  rotateX(radians(90 - float(inputa.value())));
  texture(vias);
  plane(200, 100);
  pop();

  // Dibuja la Figura1------------------------------------------------------------------------------------------------------------------.

  if (select1.value() == "Cilindro") {
    Cilindro1(-80, float(inputa.value()), float(inputr1.value()));
  }

  if (select1.value() == "Esfera") {
    Esfera1(-80, float(inputa.value()), float(inputr1.value()));
  }

  if (select1.value() == "Anillo") {
    Anillo1(-80, float(inputa.value()), float(inputr1.value()));
  }

  if (select1.value() == "Disco") {
    Disco1(-80, float(inputa.value()), float(inputr1.value()));
  }

  //FIGURA 2----------------------------------------------------------------------------

  if (select2.value() == "Cilindro") {
    Cilindro2(-30, float(inputa.value()), float(inputr2.value()));
  }

  if (select2.value() == "Esfera") {
    Esfera2(-30, float(inputa.value()), float(inputr2.value()));
  }

  if (select2.value() == "Anillo") {
    Anillo2(-30, float(inputa.value()), float(inputr2.value()));
  }

  if (select2.value() == "Disco") {
    Disco2(-30, float(inputa.value()), float(inputr2.value()));
  }

  //FIGURA 3 -----------------------------------------------------------------------------------

  if (select3.value() == "Cilindro") {
    Cilindro3(20, float(inputa.value()), float(inputr3.value()));
  }

  if (select3.value() == "Esfera") {
    Esfera3(20, float(inputa.value()), float(inputr3.value()));
  }

  if (select3.value() == "Anillo") {
    Anillo3(20, float(inputa.value()), float(inputr3.value()));
  }

  if (select3.value() == "Disco") {
    Disco3(20, float(inputa.value()), float(inputr3.value()));
  }

  //FIGURA 4 -----------------------------------------------------------------------------------------
  if (select4.value() == "Cilindro") {
    Cilindro4(80, float(inputa.value()), float(inputr4.value()));
  }

  if (select4.value() == "Esfera") {
    Esfera4(80, float(inputa.value()), float(inputr4.value()));
  }

  if (select4.value() == "Anillo") {
    Anillo4(80, float(inputa.value()), float(inputr4.value()));
  }

  if (select4.value() == "Disco") {
    Disco4(80, float(inputa.value()), float(inputr4.value()));
  }
}
