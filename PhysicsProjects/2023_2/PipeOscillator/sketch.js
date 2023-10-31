// ****************************************************************************
// * Autor: Gustavo Adolfo Castrillón Yepes y Ana María Correa Castrillón     *
// * Ondas dentro de un tubo                                                  *
// * p5.Js (10-23-2023) Medellín                                              *
// * Institucion: Universidad de Antioquia                                    *
// * Curso: Laboratorio avanzado 3                                            *  
// * Inspirado en el trabajo de Walter Fendt (www.walter-fendt.de)            *
// * https://www.walter-fendt.de/html5/phen/standinglongitudinalwaves_en.htm  *
// **************************************************************************** 

// Definición de colores
let colorBackground = "#f0f0f0"; //Color de fondo 
let colorElongation = "#ff0000"; //Color del texto
let colorParticle = "#0000ff"; //Color de la partícula

// Constantes físicas y de animación
let C_SI = 343.5; // Velocidad del sonido
let C_PIX = 2000; // Animación en píxeles
let LEN = 500; // Longitud del tubo en la animación


let FONT = 'Arial'; //Fuente de los botones
let FONT_TAMANO = '14'; //Tamaño de la fuente 

// Variables para el lienzo (canvas)
let canvas;
let width_pantalla = 1920; //Ancho del canva
let height_pantalla = 1080; //Alto del canva

//Variables para estructurar los elementos

const radioWidth = 200; // Ancho de los elementos de radio
let constan_1x = 50 ; //Posición para estructurar botones
let constan_1y = 130;
let LEFT_1 = 60; // Posición inicial del tubo

// Variables de radio buttons y botones
let rboo, rbco, rbcc;
let lbosc, lbosr;
let bu1, bu2;
let ipL;
let opwl, opfr;

// Variables de tiempo y tipo de onda
let t0;
let t;
let type;
let nrOsc;

// Variables para cálculos
let lengthReal;
let lambdaReal;
let lambda;
let lambda4;
let nyReal;
let omega;
let k;
let aMax;
let cos_1;
let xT, yT;

// Otros parámetros
let decimalSeparator = ",";

let text01 = "Forma del tubo:";
let text02 = "Ambos lados abiertos";
let text03 = "Un lado abierto";
let text04 = "Ambos lados cerrados";
let text05 = "Modo vibracional:";
let text07 = "Disminuir";
let text08 = "Aumentar";
let text09 = "Longitud del tubo:";
let text10 = "Longitud de onda:";
let text11 = "Frecuencia:";

let author = "Gustavo Castrillon y Ana Correa";

let meter = "m";                                           // Metros
let hertz = "Hz";                                          // Hertz

let text12 = "Desplazamiento de las partículas";           
let text13 = "Divergence from average pressure";           

// Simbolos:
let symbolPosition = "x";                                  // Simbolo de x
let symbolDeltaX = "\u0394x";                              // Simbolo de deltaX
let symbolDeltaP = "\u0394p";                              // Simbolo de deltaP 
let symbolNode = "N";                                      // Simbolo del nodo N 
let symbolAntinode = "A";                                  // Simbolo del antinodo A



// Inicialización y eventos
function setup() {
  
  canvas = createCanvas(1920, 1080);
  canvas.id('myCanvas');
  
  lbosc = createP(text01); // Crear un párrafo con texto inicial
  lbosc.position(constan_1x+10, constan_1y + 10); // Establecer la posición del párrafo en el lienzo
  lbosc.style('font-family', FONT); // Cambiar la fuente
  lbosc.style('font-size', FONT_TAMANO);    // Cambiar el tamaño de fuente
  lbosc.style('width', radioWidth + 'px'); // Ajusta el ancho del elemento de radio
  
  // Crea y posiciona los elementos de radio en una línea vertical
  rboo = createRadio();
  rboo.option(text02);
  rboo.option(text03);
  rboo.option(text04);
  rboo.style('display','inline');
  rboo.style('width', 500 + 'px'); // Ajusta el ancho del elemento de radio
  rboo.position(constan_1x + 10, constan_1y + 50);
  
  bu1 = createButton(text07);
  bu1.position(constan_1x + 10, constan_1y + 150);
  bu1.mousePressed(reactionLower);
  bu1.style('font-family', FONT); // Cambiar la fuente
  bu1.style('font-size', FONT_TAMANO);
  bu1.size(200, 50);

  bu2 = createButton(text08);
  bu2.position(constan_1x + 250, constan_1y + 150);
  bu2.style('font-family', FONT); // Cambiar la fuente
  bu2.style('font-size', FONT_TAMANO);
  bu2.mousePressed(reactionHigher);
  bu2.size(200, 50);
  
  opvr = createP(text05);
  opvr.position(constan_1x + 10, constan_1y + 80);
  opvr.style('font-family', FONT); // Cambiar la fuente
  opvr.style('font-size', FONT_TAMANO);
  opvr.style('width', radioWidth + 'px');
  
  lbosr = createP('Fundamental'); // Crear un párrafo con texto inicial
  lbosr.position(constan_1x+150, constan_1y + 80); // Establecer la posición del párrafo en el lienzo
  lbosr.style('font-family', FONT); // Cambiar la fuente
  lbosr.style('font-size', FONT_TAMANO);
  lbosr.style('color', colorElongation);
  lbosr.style('width', radioWidth + 'px'); // Ajusta el ancho del elemento de radio
  
  ipL = createInput("1.0");
  ipL.position(constan_1x + 150, constan_1y + 240);
  ipL.style('font-family', FONT); // Cambiar la fuente
  ipL.style('font-size', FONT_TAMANO);
  ipL.size(100, FONT_TAMANO-4); // Cambiar el tamaño del cuadro de entrada
  ipL.input(reactionEnter); 
  
  um = createP(meter);
  um.position(constan_1x + 270, constan_1y + 220);
  um.style('font-family', FONT); 
  um.style('font-size', FONT_TAMANO);
  
  oplt = createP(text09);
  oplt.position(constan_1x + 10, constan_1y + 220);
  oplt.style('font-family', FONT);
  oplt.style('font-size', FONT_TAMANO);
  oplt.style('width',radioWidth +'px');
  
  ul = createP(meter);
  ul.position(constan_1x + 270, constan_1y + 250);
  ul.style('font-family', FONT); // 
  ul.style('font-size', FONT_TAMANO);
  
  oplo = createP(text10);
  oplo.position(constan_1x + 10, constan_1y + 250);
  oplo.style('font-family', FONT); 
  oplo.style('font-size', FONT_TAMANO);
  oplo.style('width',radioWidth +'px');
  
  molo = createP(lambdaReal);
  molo.position(constan_1x + 150, constan_1y + 250);
  molo.style('font-family', FONT); 
  molo.style('font-size', FONT_TAMANO);
  molo.style('color', colorElongation);
  molo.style('width',radioWidth + 'px');
  
  opfr = createP(nyReal);
  opfr.position(constan_1x + 150, constan_1y + 280);
  opfr.style('font-family', FONT); 
  opfr.style('font-size', FONT_TAMANO);
  opfr.style('color', colorElongation);
  opfr.style('width', radioWidth + 'px');
  
  uf = createP(hertz);
  uf.position(constan_1x + 270, constan_1y + 280);
  uf.style('font-family', FONT); 
  uf.style('font-size', FONT_TAMANO);
  
  mofr = createP(text11);
  mofr.position(constan_1x + 10, constan_1y + 280);
  mofr.style('font-family', FONT); 
  mofr.style('font-size', FONT_TAMANO);
  mofr.style('width',radioWidth + 'px');
  
  type = 0;
  nrOsc = 0;
  lengthReal = 1;
  t = 0;
  t0 = new Date();
  
  ipL.value(ToString(lengthReal, 3, false));
  focus(ipL);
  newOscillation();
  setInterval(paint, 40);
  
  rboo.changed(reactionRadioButton);

  bu1.mousePressed(reactionLower);
  bu2.mousePressed(reactionHigher);
  
  canvas.mousePressed(reactionDown);
  canvas.touchStarted(reactionDown);
  ipL.input(reactionEnter);
}

// Función para manejar los radio buttons
function reactionRadioButton() {
  let selectedOption = rboo.value();
  if(selectedOption==text02){
    type = 0; 
  }else if(selectedOption==text03){
    type = 1; 
  }else if(selectedOption == text04){
    type = 2;
  }
  else{
    type = 0;
  }
  reaction();
  focus(ipL);
}

// Disminuye el número de oscilaciones
function reactionLower() {
  if (nrOsc < 1) return;
  else{
    nrOsc--;
    changeTextBasedOnOscillationLevel(nrOsc);
    calculation();
    paint();
    newOscillation();
  }
  focus(ipL);
}

// Aumenta el número de oscilaciones
function reactionHigher() {
  if (nrOsc > 4) return;
  else{ 
    nrOsc++;
    changeTextBasedOnOscillationLevel(nrOsc);
    calculation();
    paint();
    newOscillation();
  }
  focus(ipL);
}

function changeTextBasedOnOscillationLevel(level) {
  if (level >= 0 && level <= 5) {
    let newText = ''; 
    switch (level) {
      case 0:
        newText = "Fundamental";
        break;
      case 1:
        newText = "1er nivel";
        break;
      case 2:
        newText = "2do nivel";
        break;
      case 3:
        newText = "3er nivel";
        break;
      case 4:
        newText = "4to nivel";
        break;
      case 5:
        newText = "5to nivel";
        break;
    }

    lbosr.html(newText); 
  }
}

function reaction(){
  input_1();
  calculation();
  paint();
}

function reactionEnter() {
  if (key === 'Enter') {
    lengthReal = inputNumber(ipL,3,false,0.1,10);
    newOscillation();
    reaction(); // Llama a la función "reaction" cuando se presiona la tecla Enter
  }
  focus(ipL);
}

function focus(ip) {
  ip.elt.focus();
  let n = ip.value().length;
  ip.elt.setSelectionRange(n, n);
}

function reactionDown(x,y){
  let canvasx = canvas.position().x; 
  let canvasy = canvas.position().y; 
  x -=canvasx; y-= canvasy; 
  if(x>=LEFT_1 && x<=LEFT_1 + LEN && y>=30 && y<=90){
    xT = x; yT = y;
  }
  else xT = yT = -1; 
}

// Actualiza la visualización tras cambiar el número de oscilaciones
function newOscillation() {
  input_1();
  bu1.elt.disabled = (nrOsc < 1);
  bu2.elt.disabled = (nrOsc > 4);
  focus(ipL);
}

// Cálculos necesarios para la simulación
function calculation() {
  let factor;
  if (type == 1) {
    factor = 4.0 / (2 * nrOsc + 1);
  } else {
    factor = 2.0 / (nrOsc + 1);
  }
  lambdaReal = factor * lengthReal;
  lambda = factor * LEN;
  lambda4 = lambda / 4;
  omega = C_PIX / (lambda * 2 * Math.PI);
  k = 2 * Math.PI / lambda;
  nyReal = C_SI / lambdaReal;

  let s = lambdaReal.toPrecision(3);

  if (nyReal < 1000) {
    s = nyReal.toPrecision(3);
  } else {
    s = nyReal.toFixed(0);
  }
  molo.html(lambdaReal.toPrecision(3));
  opfr.html(s.replace(".", decimalSeparator));
  aMax = lambda / 24;
  xT = yT = -1;
}

function position(x0) {
  
  let arg = (x0 - LEFT_1) * k; // Argumento (radianes)
  
  let a = aMax * (type === 0 ? cos(arg) : sin(arg)); // Amplitud (píxeles)
  
  let retorno = x0 + a*cos_1;
  
  return retorno; // Valor de retorno
}

function dpPixel(x0) {
  let arg = (x0 - LEFT) * k; // Argumento (radianes)
  let a = aMax * (type === 0 ? sin(arg) : -cos(arg)); // Amplitud (píxeles)
  return a * cos; // Valor de retorno
}

function ToString(n, d, fix) {
  let s = (fix ? n.toFixed(d) : n.toPrecision(d)); // Cadena con punto decimal
  return s.replace(".", decimalSeparator); // Reemplazar el punto por el separador decimal
}

// Función auxiliar para validar números de entrada
function inputNumber(ef, d, fix, min, max) {
  let s = ef.value();
  s = s.replace(",", ".");
  let n = parseFloat(s);

  if (isNaN(n)) n = 0;
  if (n < min) n = min;
  if (n > max) n = max;

  ef.value(n.toFixed(d));
  return n;
}

// Función para manejar la entrada de datos
function input_1() {
  lengthReal = inputNumber(ipL, 3, false, 0.1, 10);
}

// Inicializa el trazo para dibujar elementos
function newPath() {
  stroke(0);
  strokeWeight(1);
}

// Dibuja una línea
function line_1(x1, y1, x2, y2, c) {
  newPath();
  if (c) {
    fill(c);
    stroke(c);
  }
  line(x1, y1, x2, y2);
}

// Dibuja un círculo
function circle_1(x, y, r, c) {
  if (c) {
    fill(c);  // Establece el color de relleno condicionalmente
    stroke(c);
  }
  ellipse(x, y, r * 2, r * 2);  // Dibuja un círculo
}

// Dibuja marcas en el tubo
function drawMarks(n, y) {
  fill(0);
  let iMax = Math.round(LEN / lambda4);
  let leftNode = (type >= 1);

  if (n == 2) leftNode = !leftNode;

  for (let i = 0; i <= iMax; i++) {
    let xM = LEFT_1 + i * lambda4;
    line_1(xM, y - 3, xM, y + 3);

    if (n == 0) continue;

    let s = symbolNode;

    if ((leftNode && i % 2 == 1) || (!leftNode && i % 2 == 0)) {
      s = symbolAntinode;
    }

    text(s, xM - 3, y + 13);
  }
}

// Dibuja partículas en series
function seriesParticles(x, yMin, yMax) {
  fill(colorParticle);
  let posX = position(x);
  //Circle revisado, esta generando las partículas.
  for (let y = yMin; y <= yMax; y += 20) {
    circle_1(posX, y, 2, colorParticle);
  }
}

// Dibuja el tubo y las partículas
function drawTube() {
  cos_1 = cos(omega * t); 

  fill(0);
  rect(LEFT_1, 27, LEN, 3);
  rect(LEFT_1, 90, LEN, 3);
  
  //Dibuja las paredes dentro del tubo
  if (type >= 1) {
    rect(LEFT_1 - 3, 27, 3, 66);
  }
  
  if (type == 2) {
    rect(LEFT_1 + LEN, 27, 3, 66);
  }
  
  drawMarks(0, 27);
  drawMarks(0, 92);
  
  //Dibuja las particulas
  for (let x = LEFT_1 + 10; x <= LEFT_1 + LEN - 10; x += 20) {
    seriesParticles(x, 40, 80);
  }
  for (let x = LEFT_1; x <= LEFT_1 + LEN; x += 20) {
    seriesParticles(x, 50, 70);
  }
  for (let x = LEFT_1; x <= LEFT_1 + LEN + 10; x += 20) {
    seriesParticles(x, 50, 70);
  }
  
  if (yT < 0) return;
  
  let x_1 = position(xT);
   
  line_1(xT, yT, x_1, yT, colorElongation);
  circle_1(xT, yT, 2, colorElongation);
}

// Dibuja una onda sinusoidal
function drawSinus(x, y, per, ampl, xMin, xMax) {
  let k = TWO_PI / per;
  beginShape();
  strokeWeight(1);
  
  for (let xx = xMin; xx <= xMax; xx++) {
    let yy = y - ampl * sin(k * (xx - x));
    vertex(xx, yy);
  }
  endShape();
}

// Actualiza la animación
function paint() {
  background(colorBackground);

  t = (millis() - t0) / 1000;

  drawTube(); 
  drawMarks(1, 100);
}

function draw() {
  paint();
  t = (millis() - t0) / 1000;
  xT = LEFT_1 + LEN / 2 + aMax * cos(omega * t);
  yT = height - 20;
  drawTube();
}
