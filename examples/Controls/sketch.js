/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Author: Fabian Castaño
 * * Institution: University of Antioquia
 * * Course: Laboratorio avanzado 3
 * ***********************************************************/

// para los controles debe agregar en el html la siguiente paquete como script, ver html
/* src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.0/addons/p5.dom.min.js" */
// esto agrega el paquete DOM para los controles

let ball;
let dt = 1 / 30;

let button;

let fontsize = 14;
let valBG = 220;

let sliderx;
let slidery;
let valSLx = 10;
let valSLy = 10;

let botonRadio;
let inputRadio;

let radio = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // creacion de boton
  button = createButton('Clear');
  button.position(windowWidth / 2 - 25, windowHeight / 2 + 150);
  button.mousePressed(changeBG);
  button.size(100, 20)

  // inicializacion de texto
  textSize(fontsize);
  textAlign(LEFT, CENTER);

  // creacion de un slider
  sliderx = createSlider(10, 100, 10);
  sliderx.position(windowWidth / 2 - 50, windowHeight / 2 + 180);
  sliderx.style('width', '150px');

  // creacion de un slider
  slidery = createSlider(10, 100, 50);
  slidery.position(windowWidth / 2 - 50, windowHeight / 2 + 200);
  slidery.style('width', '150px');

  // pareja boton-campo de txto para cambiar el radio del circulo
  botonRadio = createButton('Cambiar R');
  botonRadio.position(50, 50);
  botonRadio.mousePressed(changeRad);

  inputRadio = createInput('');
  inputRadio.position(150, 50);
  inputRadio.size(120);

  reset();
}

function draw() {
  translate(windowWidth / 2, windowHeight / 2);
  background(valBG);
  text("Freq Y = " + nfc(valSLy, 2), 120, -100);
  text("Freq X = " + nfc(valSLx, 2), 120, -70);

  if (radio > 5 && radio < 60) {
    text("Valor actualizado a = " + nfc(radio, 0), -200, -160);
  } else {
    text("Error, valor no valido", -200, -160);
  }

  ball.update();
  ball.show();
}


// funcion para cambiar el radio de la ball
function changeRad() {
  radio = int(inputRadio.value());
  inputRadio.value('');

  if (radio > 5 && radio < 60) {
    ball.r = radio;
  }
}


function changeBG() {
  // valBG = random(255);

  ball.path = [];
}


function reset() {
  ball = new Ball(50, createVector(0, 0), createVector(0, 0));

}


let Ball = function (_mass, _pos, _vel) {
  this.mass = _mass;
  this.pos = _pos;
  this.vel = _vel;
  this.r = this.mass;
  this.acel = createVector(0, 0);  // acceleration vector
  this.path = [];
  this.t = 0;
  this.fx = 1;
  this.fy = 5;
  this.dx = 0;
  this.dy = PI / 2;

  // draw in the canvas
  this.show = function () {
    noStroke();
    fill(23);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
    stroke(25);

    for (let i = 0; i < this.path.length - 2; i++) {
      line(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y)
    }
  }


  // update velocity
  this.update = function () {
    // captura del valor del slider
    this.fx = sliderx.value() / 10;
    this.fy = slidery.value() / 10;
    valSLx = this.fx;
    valSLy = this.fy;

    this.t += dt / 10;
    this.pos.x = 100 * sin((2 * PI * this.t * this.fx) + this.dx);
    this.pos.y = 100 * sin((2 * PI * this.t * this.fy) + this.dy);

    this.path.push(this.pos.copy());
    if (this.path.length > 500) {
      this.path.splice(0, 1); // keep path a constant length
    }

  }

};

