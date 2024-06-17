/* ***********************************************************
 * ******* SIMULACION DE SEMINARIO DE PROFUNDIZACION 1 *******
 * ***********************************************************
 * * Autores: Miller Joel Gordo                              *
 * *          Anderson Uribe Pino                            *
 * *          Vanessa Martínez                               *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Seminario de profundizacion 1                    *
 * ***********************************************************/
//VARIABLES
var botton;
var img_color_led;
var mover = 0;
var lim_der = 500;
var lim_izq = 200;
var x = 100;
var dx = 0;
var img_color_res;
var img_led;
var img_res;
var colorled;
var img_dir_cor;
var N;
var N_alt;
var y = 100;
var dy = 0;
var vol;
var vol_led1;
var vol_led2;
var vel;
var NE;
var AM;
var RES;

//CARGAR IMAGENES
function preload() {
  img_color_led = loadImage(
    "https://raw.githubusercontent.com/MILLER2308/img/main/color%20led.png"
  );
  img_color_res = loadImage(
    "https://raw.githubusercontent.com/MILLER2308/img/main/codigo-colores-resistencias-e1563802288271.jpg"
  );
  img_led = loadImage(
    "https://media-public.canva.com/O-1eg/MAE1_vO-1eg/1/tl.png"
  );
  img_res = loadImage(
    "https://media-public.canva.com/fleow/MAF7G6fleow/1/tl.png"
  );
  img_dir_cor = loadImage(
    "https://raw.githubusercontent.com/MILLER2308/img/main/ley-de-lenz.webp"
  );
}

//CREAR BOTONES
function setup() {
  createCanvas(800, 700);
  //BOTON PARAR IMAN
  miBoton = createButton("Parar Iman");
  miBoton.position(10, 540);
  miBoton.mousePressed(pararIman);
  //BOTON MOVER IMAN
  miBoton = createButton("Mover Iman");
  miBoton.position(100, 540);
  miBoton.mousePressed(moverIman);
  //cheking lineas de campo
  checkbox = createCheckbox("mostrar campo");
  checkbox.position(600, 540);
  //cheking cambiar polos
  checkbox2 = createCheckbox("cambiar polos");
  checkbox2.position(400, 540);
  //colores de led izquierdo
  mySelect = createSelect("led");
  mySelect.position(300, 50);
  mySelect.option("Amarillo");
  mySelect.option("Naranja");
  mySelect.option("Rojo");
  mySelect.option("Verde");
  mySelect.option("Azul");
  mySelect.option("Blanco");
  //colores de led derecha
  mySelect2 = createSelect("led");
  mySelect2.position(440, 50);
  mySelect2.option("Rojo");
  mySelect2.option("Naranja");
  mySelect2.option("Amarillo");
  mySelect2.option("Verde");
  mySelect2.option("Azul");
  mySelect2.option("Blanco");
  //slider para determinar la velocidad
  slider = createSlider(0, 30, 0, 3);
  slider.position(10, 10);
  slider.size(280);
  //cambiar cantidad de espiras
  mySelect3 = createSelect("Numero de espiras");
  mySelect3.position(700, 50);
  mySelect3.option(400);
  mySelect3.option(800);
  mySelect3.option(1200);
  mySelect3.option(1600);

  //colores leds, colores resistencias
  mySelect4 = createSelect("imagen");
  mySelect4.position(5, 70);
  mySelect4.option("imagenes");
  mySelect4.option("color led");
  mySelect4.option("color resistencia");
  mySelect4.option("ley de Lenz");
}

//FUNCION PARAR IMAN
function pararIman() {
  x = 100;
  dx = 0;
  y = 100;
  dy = 0;
}

//FUNCION MOVER IMAN
function moverIman() {
  x = 200;
  dx = N;
  diametro = 1;
  y = 200;
  dy = abs(N - 60);
}

function draw() {
  background(220);
  //VALOR DE LA VELOCIDAD
  fill("white");
  rect(5, 35, 150, 20);
  fill("#03A9F4");
  noFill();
  fill("black");
  text("velocidad = " + vel + " m/s", 10, 50);
  noFill();
  //VARIABLE PÁRA ENCENDIDO DE LEDS
  y += dy;
  if (y < lim_izq) {
    dy = -dy;
  }
  if (y > lim_der) {
    dy = -dy;
  }
  //CENTRAR IMAGENES
  imageMode(CENTER);
  //VARIABLE QUE EVALUA LA VELOCIDAD
  N_alt = slider.value();
  if (N !== N_alt) {
    N = N_alt;
    moverIman();
  }
  //condicional lineas de campo sin cambios de polos.
  if (checkbox.checked() == true && checkbox2.checked() == false) {
    //campo superior
    stroke("rgb(0,0,0)");
    ellipse(x, 200, 800, 400);
    triangle(x - 26, 0, x + 30, -15, x + 30, 15);
    ellipse(x, 250, 600, 300);
    triangle(x - 26, 100, x + 30, 84, x + 30, 115);
    ellipse(x, 300, 400, 200);
    triangle(x - 26, 200, x + 30, 184, x + 30, 215);
    ellipse(x, 350, 200, 100);
    triangle(x - 26, 300, x + 30, 284, x + 30, 315);
    //campo inferior
    ellipse(x, 600, 800, 400);
    triangle(x - 26, 800, x + 30, 784, x + 30, 815);
    ellipse(x, 550, 600, 300);
    triangle(x - 26, 700, x + 30, 684, x + 30, 715);
    ellipse(x, 500, 400, 200);
    triangle(x - 26, 600, x + 30, 584, x + 30, 615);
    ellipse(x, 450, 200, 100);
    triangle(x - 26, 500, x + 30, 484, x + 30, 515);
    noStroke();
    fill(220);
    noFill();
  } else {
  }
  //condicional lineas de campo con cambio de polos
  if (checkbox.checked() == true && checkbox2.checked() == true) {
    //campo superior
    stroke("rgb(0,0,0)");
    ellipse(x, 200, 800, 400);
    triangle(x - 26, 15, x - 26, -15, x + 30, 0);
    ellipse(x, 250, 600, 300);
    triangle(x - 26, 115, x - 26, 84, x + 30, 100);
    ellipse(x, 300, 400, 200);
    triangle(x - 26, 215, x - 26, 184, x + 30, 200);
    ellipse(x, 350, 200, 100);
    triangle(x - 26, 315, x - 26, 284, x + 30, 300);
    //campo inferior
    ellipse(x, 600, 800, 400);
    triangle(x - 26, 815, x - 26, 784, x + 30, 800);
    ellipse(x, 550, 600, 300);
    triangle(x - 26, 715, x - 26, 684, x + 30, 700);
    ellipse(x, 500, 400, 200);
    triangle(x - 26, 615, x - 26, 584, x + 30, 600);
    ellipse(x, 450, 200, 100);
    triangle(x - 26, 515, x - 26, 484, x + 30, 500);
    noStroke();
    fill(220);
    noFill();
  } else {
  }
  //VARIABLE QUE MUEVE EL IMAN
  x += dx;
  //iman diseñado SUR/NORTE
  stroke("white");
  fill("red");
  rect(x - 55, 380, 60, 40);
  fill("blue");
  rect(x + 5, 380, 60, 40);
  fill("white");
  textSize(25);
  text("S", x - 30, 410);
  text("N", x + 30, 410);
  noFill();
  noStroke();
  textSize(12);
  //DEFINICION DE LIMITES EN EL MOVIMIENTO DEL IMAN
  if (x < lim_izq) {
    dx = -dx;
  }
  if (x > lim_der) {
    dx = -dx;
  }
  //condicional cambiar polos
  if (checkbox2.checked()) {
    //iman diseñado NORTE/SUR
    stroke("white");
    fill("red");
    rect(x + 5, 380, 60, 40);
    fill("blue");
    rect(x - 55, 380, 60, 40);
    fill("white");
    textSize(25);
    text("S", x + 30, 410);
    text("N", x - 30, 410);
    noFill();
    noStroke();
    textSize(12);
  }
  //encendido de los led por movimiento derecha sin cambio de polos
  //ENCENDIDO LED IZQUIERDO ROJO, IMAN SUR/NORTE, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Rojo" &&
    dx < 0 &&
    vol > 1.8 &&
    checkbox2.checked() == false
  ) {
    fill("rgb(243,41,41)");
    ellipse(456, 155, 70, 70);
    stroke("rgb(243,41,41)");
    rect(422, 145, 66, 70);
    noFill();
    noStroke();
    vol_led1 = 1.8;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO NARANJA, IMAN SUR/NORTE, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Naranja" &&
    dx < 0 &&
    vol > 2.3 &&
    checkbox2.checked() == false
  ) {
    fill("#D36E25");
    ellipse(456, 155, 70, 70);
    rect(422, 145, 66, 70);
    noFill();
    vol_led1 = 2.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO AMARILLO, IMAN SUR/NORTE, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Amarillo" &&
    dx < 0 &&
    vol > 1.6 &&
    checkbox2.checked() == false
  ) {
    fill("#F1DC1E");
    ellipse(456, 155, 70, 70);
    rect(422, 145, 66, 70);
    noFill();
    vol_led1 = 1.6;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO VERDE, IMAN SUR/NORTE, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Verde" &&
    dx < 0 &&
    vol > 2.3 &&
    checkbox2.checked() == false
  ) {
    fill("#7DD518");
    ellipse(456, 155, 70, 70);
    rect(422, 145, 66, 70);
    noFill();
    vol_led1 = 2.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO AZUL, IMAN SUR/NORTE, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Azul" &&
    dx < 0 &&
    vol > 3.3 &&
    checkbox2.checked() == false
  ) {
    fill("#2BAFEB");
    ellipse(456, 155, 70, 70);
    rect(422, 145, 66, 70);
    noFill();
    vol_led1 = 3.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO BLANCO, IMAN SUR/NORTE, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Blanco" &&
    dx < 0 &&
    vol > 3.4 &&
    checkbox2.checked() == false
  ) {
    fill("rgb(250,250,250)");
    ellipse(456, 155, 70, 70);
    rect(422, 145, 66, 70);
    noFill();
    vol_led1 = 3.4;
  } else {
  }

  //encendido de los led por movimiento derecha con cambio de polos
  //ENCENDIDO LED IZQUIERDO ROJO, IMAN NORTE/SUR, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Rojo" &&
    dx > 0 &&
    vol > 1.8 &&
    checkbox2.checked() == true
  ) {
    fill("rgb(243,41,41)");
    ellipse(456, 155, 70, 70);
    rect(422, 145, 66, 70);
    noFill();
    vol_led2 = 1.8;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO NARANJA, IMAN NORTE/SUR, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Naranja" &&
    dx > 0 &&
    vol > 2.3 &&
    checkbox2.checked() == true
  ) {
    fill("#D36E25");
    ellipse(456, 155, 70, 70);
    rect(422, 145, 66, 70);
    noFill();
    vol_led2 = 2.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO AMARILLO, IMAN NORTE/SUR, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Amarillo" &&
    dx > 0 &&
    vol > 1.6 &&
    checkbox2.checked() == true
  ) {
    fill("#F1DC1E");
    ellipse(456, 155, 70, 70);
    rect(422, 145, 66, 70);
    noFill();
    vol_led2 = 1.6;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO VERDE, IMAN NORTE/SUR, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Verde" &&
    dx > 0 &&
    vol > 2.3 &&
    checkbox2.checked() == true
  ) {
    fill("#7DD518");
    ellipse(456, 155, 70, 70);
    rect(422, 145, 66, 70);
    noFill();
    vol_led2 = 2.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO AZUL, IMAN NORTE/SUR, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Azul" &&
    dx > 0 &&
    vol > 3.3 &&
    checkbox2.checked() == true
  ) {
    fill("#2BAFEB");
    ellipse(456, 155, 70, 70);
    rect(422, 145, 66, 70);
    noFill();
    vol_led2 = 2.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO BLANCO, IMAN NORTE/SUR, MOVIMIENTO DE IZQUIERDA A DERECHA
  if (
    y > 250 &&
    y < 450 &&
    mySelect2.value() === "Blanco" &&
    dx > 0 &&
    vol > 3.3 &&
    checkbox2.checked() == true
  ) {
    fill("rgb(250,250,250)");
    ellipse(456, 155, 70, 70);
    rect(422, 145, 66, 70);
    noFill();
    vol_led2 = 3.3;
  } else {
  }

  //encendido de los led por movimiento izquierda sin cambio de polos
  //ENCENDIDO LED IZQUIERDO ROJO, IMAN SUR/NORTE, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Rojo" &&
    dx > 0 &&
    vol > 1.8 &&
    checkbox2.checked() == false
  ) {
    fill("rgb(243,41,41)");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led2 = 1.8;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO NARANJA, IMAN SUR/NORTE, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Naranja" &&
    dx > 0 &&
    vol > 2.3 &&
    checkbox2.checked() == false
  ) {
    fill("#D36E25");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led2 = 2.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO AMARILLO, IMAN SUR/NORTE, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Amarillo" &&
    dx > 0 &&
    vol > 1.6 &&
    checkbox2.checked() == false
  ) {
    fill("#F1DC1E");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led2 = 1.6;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO VERDE, IMAN SUR/NORTE, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Verde" &&
    dx > 0 &&
    vol > 2.3 &&
    checkbox2.checked() == false
  ) {
    fill("#7DD518");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led2 = 2.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO AZUL, IMAN SUR/NORTE, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Azul" &&
    dx > 0 &&
    vol > 3.3 &&
    checkbox2.checked() == false
  ) {
    fill("#2BAFEB");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led2 = 3.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO BLANCO, IMAN SUR/NORTE, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Blanco" &&
    dx > 0 &&
    vol > 3.3 &&
    checkbox2.checked() == false
  ) {
    fill("rgb(250,250,250)");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led2 = 3.3;
  } else {
  }

  //encendido de los led por movimiento izquierda con cambio de polos
  //ENCENDIDO LED IZQUIERDO ROJO, IMAN NORTE/SUR, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Rojo" &&
    dx < 0 &&
    vol > 1.8 &&
    checkbox2.checked() == true
  ) {
    fill("rgb(243,41,41)");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led1 = 1.8;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO NARANJA, IMAN NORTE/SUR, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Naranja" &&
    dx < 0 &&
    vol > 2.3 &&
    checkbox2.checked() == true
  ) {
    fill("#D36E25");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led1 = 2.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO AMARILLO, IMAN NORTE/SUR, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Amarillo" &&
    dx < 0 &&
    vol > 1.6 &&
    checkbox2.checked() == true
  ) {
    fill("#F1DC1E");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led1 = 1.6;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO VERDE, IMAN NORTE/SUR, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Verde" &&
    dx < 0 &&
    vol > 2.3 &&
    checkbox2.checked() == true
  ) {
    fill("#7DD518");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led1 = 2.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO AZUL, IMAN NORTE/SUR, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Azul" &&
    dx < 0 &&
    vol > 3.3 &&
    checkbox2.checked() == true
  ) {
    fill("#2BAFEB");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led1 = 3.3;
  } else {
  }
  //ENCENDIDO LED IZQUIERDO BLANCO, IMAN NORTE/SUR, MOVIMIENTO DE DERECHA A IZQUIERDA
  if (
    y > 250 &&
    y < 450 &&
    mySelect.value() === "Blanco" &&
    dx < 0 &&
    vol > 3.3 &&
    checkbox2.checked() == true
  ) {
    fill("rgb(250,250,250)");
    ellipse(346, 155, 70, 70);
    rect(312, 145, 66, 70);
    noFill();
    vol_led1 = 3.3;
  } else {
  }

  //cambiar bobinas
  //BOBINA DE 400 ESPIRAS
  if (mySelect3.value() === "400") {
    fill("#CB6D51");
    stroke("black");
    arc(329, 360, 5, 220, PI, 2 * PI);
    ellipse(470, 400, 10, 100);
    ellipse(465, 400, 10, 100);
    ellipse(460, 400, 10, 100);
    ellipse(455, 400, 10, 100);
    ellipse(450, 400, 10, 100);
    ellipse(445, 400, 10, 100);
    ellipse(440, 400, 10, 100);
    ellipse(435, 400, 10, 100);
    ellipse(430, 400, 10, 100);
    ellipse(425, 400, 10, 100);
    ellipse(420, 400, 10, 100);
    ellipse(415, 400, 10, 100);
    ellipse(410, 400, 10, 100);
    ellipse(405, 400, 10, 100);
    ellipse(400, 400, 10, 100);
    ellipse(395, 400, 10, 100);
    ellipse(390, 400, 10, 100);
    ellipse(385, 400, 10, 100);
    ellipse(380, 400, 10, 100);
    ellipse(375, 400, 10, 100);
    ellipse(370, 400, 10, 100);
    ellipse(365, 400, 10, 100);
    ellipse(360, 400, 10, 100);
    ellipse(355, 400, 10, 100);
    ellipse(350, 400, 10, 100);
    ellipse(345, 400, 10, 100);
    ellipse(340, 400, 10, 100);
    ellipse(335, 400, 10, 100);
    ellipse(330, 400, 10, 100);
    arc(471, 361, 5, 220, PI, 2 * PI);
    fill(100);
    ellipse(329, 400, 3, 70);
    noFill();
    noStroke();
  }
  //BOBINA DE 800 ESPIRAS
  if (mySelect3.value() === "800") {
    fill("#CB6D51");
    stroke("black");
    arc(330, 350, 5, 220, PI, 2 * PI);
    ellipse(470, 400, 10, 130);
    ellipse(465, 400, 10, 130);
    ellipse(460, 400, 10, 130);
    ellipse(455, 400, 10, 130);
    ellipse(450, 400, 10, 130);
    ellipse(445, 400, 10, 130);
    ellipse(440, 400, 10, 130);
    ellipse(435, 400, 10, 130);
    ellipse(430, 400, 10, 130);
    ellipse(425, 400, 10, 130);
    ellipse(420, 400, 10, 130);
    ellipse(415, 400, 10, 130);
    ellipse(410, 400, 10, 130);
    ellipse(405, 400, 10, 130);
    ellipse(400, 400, 10, 130);
    ellipse(395, 400, 10, 130);
    ellipse(390, 400, 10, 130);
    ellipse(385, 400, 10, 130);
    ellipse(380, 400, 10, 130);
    ellipse(375, 400, 10, 130);
    ellipse(370, 400, 10, 130);
    ellipse(365, 400, 10, 130);
    ellipse(360, 400, 10, 130);
    ellipse(355, 400, 10, 130);
    ellipse(350, 400, 10, 130);
    ellipse(345, 400, 10, 130);
    ellipse(340, 400, 10, 130);
    ellipse(335, 400, 10, 130);
    ellipse(330, 400, 10, 130);
    ellipse(330, 400, 10, 100);
    arc(472, 365, 5, 220, PI, 2 * PI);
    fill(100);
    ellipse(329, 400, 3, 70);
    noFill();
    noStroke();
  }
  //BOBINA DE 1200 ESPIRAS
  if (mySelect3.value() === "1200") {
    fill("#CB6D51");
    stroke("black");
    arc(328, 335, 5, 180, PI, 2 * PI);
    //arc(470,360,5,220,PI,2*PI);
    ellipse(470, 400, 14, 170);
    ellipse(465, 400, 14, 170);
    ellipse(460, 400, 14, 170);
    ellipse(455, 400, 14, 170);
    ellipse(450, 400, 14, 170);
    ellipse(445, 400, 14, 170);
    ellipse(440, 400, 14, 170);
    ellipse(435, 400, 14, 170);
    ellipse(430, 400, 14, 170);
    ellipse(425, 400, 14, 170);
    ellipse(420, 400, 14, 170);
    ellipse(415, 400, 14, 170);
    ellipse(410, 400, 14, 170);
    ellipse(405, 400, 14, 170);
    ellipse(400, 400, 14, 170);
    ellipse(395, 400, 14, 170);
    ellipse(390, 400, 14, 170);
    ellipse(385, 400, 14, 170);
    ellipse(380, 400, 14, 170);
    ellipse(375, 400, 14, 170);
    ellipse(370, 400, 14, 170);
    ellipse(365, 400, 14, 170);
    ellipse(360, 400, 14, 170);
    ellipse(355, 400, 14, 170);
    ellipse(350, 400, 14, 170);
    ellipse(345, 400, 14, 170);
    ellipse(340, 400, 14, 170);
    ellipse(335, 400, 14, 170);
    ellipse(330, 400, 14, 170);
    ellipse(330, 400, 10, 130);
    ellipse(330, 400, 10, 100);
    arc(474, 360, 5, 220, PI, 2 * PI);
    //arc(332,335,5,180,PI,2*PI)
    fill(100);
    ellipse(329, 400, 3, 70);
    noFill();
    noStroke();
  }
  //BOBINA DE 1600 ESPIRAS
  if (mySelect3.value() === "1600") {
    fill("#CB6D51");
    stroke("black");
    arc(329, 300, 5, 80, PI, 2 * PI);
    //arc(470,360,5,220,PI,2*PI);
    ellipse(470, 400, 16, 220);
    ellipse(465, 400, 16, 220);
    ellipse(460, 400, 16, 220);
    ellipse(455, 400, 16, 220);
    ellipse(450, 400, 16, 220);
    ellipse(445, 400, 16, 220);
    ellipse(440, 400, 16, 220);
    ellipse(435, 400, 16, 220);
    ellipse(430, 400, 16, 220);
    ellipse(425, 400, 16, 220);
    ellipse(420, 400, 16, 220);
    ellipse(415, 400, 16, 220);
    ellipse(410, 400, 16, 220);
    ellipse(405, 400, 16, 220);
    ellipse(400, 400, 16, 220);
    ellipse(395, 400, 16, 220);
    ellipse(390, 400, 16, 220);
    ellipse(385, 400, 16, 220);
    ellipse(380, 400, 16, 220);
    ellipse(375, 400, 16, 220);
    ellipse(370, 400, 16, 220);
    ellipse(365, 400, 16, 220);
    ellipse(360, 400, 16, 220);
    ellipse(355, 400, 16, 220);
    ellipse(350, 400, 16, 220);
    ellipse(345, 400, 16, 220);
    ellipse(340, 400, 16, 220);
    ellipse(335, 400, 16, 220);
    ellipse(330, 400, 16, 220);
    ellipse(330, 400, 14, 170);
    ellipse(330, 400, 10, 130);
    ellipse(330, 400, 10, 100);
    arc(475, 360, 5, 220, PI, 2 * PI);
    //arc(330,300,5,80,PI,2*PI)
    fill(100);
    ellipse(329, 400, 3, 70);
    noFill();
    noStroke();
  }
  //VER CUADRO DE LEDS Y RESISTENCIAS
  //color de led voltaje
  if (mySelect4.value() === "color led") {
    image(img_color_led, 80, 180, 150, 150);
  }
  //color resistencia
  if (mySelect4.value() === "color resistencia") {
    image(img_color_res, 145, 220, 280, 240);
  }
  //color ley de Lenz
  if (mySelect4.value() === "ley de Lenz") {
    image(img_dir_cor, 145, 220, 280, 240);
  }
  //IMAGENES DE LEDS Y RESISTENCIA
  image(img_led, 400, 190, 200, 150);
  fill(220);
  rect(365, 250, 70, 10);
  fill(0);
  rect(472, 240, 5, 25);
  image(img_res, 400, 255, 90, 20);
  //formula para la velocidad del iman
  vel = round(3 * N * 0.0006, 3);
  //para la ley de Ohm tendremos que la intencidad requerida de 0.02 Amperios, lo que es igual a decir 20mA
  fill("rgb(239,239,243)");
  stroke("black");
  rect(600, 150, 150, 100);
  noFill();
  noStroke();
  //formula para la fuerza electromotriz en terminos de velocidad, asumiendo el numero de espiras como NE y el campo magnetico constante de 4 teslas
  //VOLTAJE
  vol = round(((NE * ((2 * PI * 36) / 1000)) / 3) * vel, 2);
  //NUMERO DE ESPIRAS
  NE = mySelect3.value();
  //AMPERAJE
  AM = 0.02;
  //RESISTENCIA
  if (vol_led1 < vol_led2) {
    RES = round((vol - vol_led1) / AM, 2);
  } else {
    RES = round((vol - vol_led2) / AM, 2);
  }
  //CUADRO DE LA LEY DE OHM
  fill("black");
  stroke("black");
  text("voltaje = " + vol, 620, 170);
  text("Amperaje = " + AM, 620, 200);
  text("Resistencia = " + RES, 620, 230);
  noStroke();
  noFill();
  //CUADRO NUMERO DE ESPIRAS
  fill("rgb(239,239,243)");
  stroke("black");
  rect(650, 25, 100, 20);
  noFill();
  fill("black");
  stroke("black");
  text("# ESPIRAS", 670, 40);
  noStroke();
  noFill();
}
