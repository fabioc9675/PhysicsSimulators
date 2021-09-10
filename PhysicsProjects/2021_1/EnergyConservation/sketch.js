/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores:Luis Adrian Avendaño Londoño                     *
 **          Santiago Quintero Cordoba                        *
 * * Institucion: Universidad de Antioquia                    *
 * * Curso: Laboratorio avanzado 3                            *
 * ***********************************************************/

 let suelo;
 let dt = 1 / 30; //que tanto se avanza en el tiempo
 let gravedad = 0;//Se crea un vector que será la gravedad
 let y0=100;//se crea la una variable la cual nos define a velocidad inicial
 let fontsize = 14;
 
 //Se crean 4 botones y 3 cajas de texto para sus respectivos botones
 let botonAltura;
 let inputAltura;
 
 
 let botonMasa;
 let inputMasa;
 
 let botonGravedad;
 let inputGravedad;
 
 let Guardar;
 ////////////////////////////
 
 // Se crean las variables donde se almacenaran las energías 
 let K;//Énergía cinetica
 let V;//Énergía potencial
 let E;//Énergía total
 ///////////////
 
 //se crea una variable la cual servira para almacenar los datos de una tabla y su funcion de añadir
 let tabla;
 let añadir;
 /////////////////////////////
 
 function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  frameRate(30); //numero de interacciones por segundo
  gravedad = createVector(0, 9.8);//Se crea un vector que será la gravedad

  suelo = new Tierra(-width/2, 0, width, height); //se crea el fondo

  //Tomar en cuenta que el programa toma positivo hacia abajo y negativo hacia arriba

  pelota = new Balon(1000, createVector(0, -100), createVector(0, 0));//se crea la particula 

  textSize(fontsize);
  textAlign(LEFT, CENTER);

  //creacion de los botones anteriormente definidos
  botonAltura = createButton('Cambiar Altura en m');
  botonAltura.position(30, height/2 +5);
  botonAltura.mousePressed(changeAltura);//accion del boton al darle clic

  inputAltura = createInput('');
  inputAltura.position(130, height/2 + 5);
  inputAltura.size(120);

  botonMasa = createButton('Cambiar Masa en kg');
  botonMasa.position(30, height/2 + 35);
  botonMasa.mousePressed(changeMasa);//accion del boton al darle clic

  inputMasa = createInput('');
  inputMasa.position(130, height/2 + 35);
  inputMasa.size(120);

  botonGravedad = createButton('Cambiar Gravedad');
  botonGravedad.position(30, height/2 + 65);
  botonGravedad.mousePressed(changeGravedad);//accion del boton al darle clic

  inputGravedad = createInput('');
  inputGravedad.position(130, height/2 + 65);
  inputGravedad.size(120);

  Guardar = createButton('Guardar');
  Guardar.position(30, height/2 + 95);
  Guardar.mousePressed(guardar);//accion del boton al darle clic
  //////////////

  tabla = new p5.Table();

  tabla.addColumn('Masa');
  tabla.addColumn('Gravedad');
  tabla.addColumn('Energía cinetica');
  tabla.addColumn('Energía potencial');
  tabla.addColumn('Energía mecanica');
  tabla.addColumn('Velocidad');
  tabla.addColumn('Altura');
}



//creacion de las funciones que le daran la accion correspondientes a los botones
function changeAltura() { //Cambio de altura
  pos = int(inputAltura.value());
  inputAltura.value('');

  if (pos >=30 && pos < 360) {
    pelota.pos.y = -pos;
    pelota.vel.x = 0;
    pelota.vel.y = 0;
    y0=pos;
    loop();//hace que draw() se repita si se llego a usar noLoop();
  }
}

function changeMasa() {//Cambio de masa
  mass = int(inputMasa.value());
  inputMasa.value('');

  if (mass >0 && mass < 1000) {
    pelota.pos.y = -y0;
    pelota.vel.x = 0;
    pelota.vel.y = 0.0;
    pelota.mass = mass;
    loop();
  }
}

function changeGravedad() {//Cambio de gravedad
  g = int(inputGravedad.value());
  inputGravedad.value('');

  if (g >0 && g < 100) {
    pelota.pos.y = -y0;
    pelota.vel.x = 0;
    pelota.vel.y = 0;
    gravedad = createVector(0,g);
    loop();
  }
}

function guardar() {//se guardan los elementos de la tabla en un archivo scv
  saveTable(tabla, 'datos.csv');
}
//////////////////////////
function draw() { //codigo que se repetira infinitas veces hasta que se use un noLoop(); o un sys,exit(); 

  translate(windowWidth / 2, windowHeight / 2);//movimiento del sistema coordenado de la pantalla
  background(145,229, 225); // colocar color en la pantallas

  // creacion de las lines que indican los valores de la altura 
  for(let i=0; i<=height/2 ;i =i+20){
    text(nfc(i) + " m" , -width/2, -i);
    line(-width/2 + 50, -i, width/2, -i);
    stroke(100);
  } 
  ////////////////////

  suelo.mostrar();
  pelota.movimiento(gravedad);//actualiazacion del movimiento de la particula
  pelota.mostrar(); 
  if (pelota.pos.y >=-30){//condicion de que cuando la particula llegue al piso se detenga el programa
    noLoop();
  }

  ///calculo de todas las energías del sistema en KJ
  V=abs(pelota.pos.y+30)*gravedad.y*pelota.mass / 1000;/*para que la energía potencial se anule en la parte 
  baja ya que tomamos el sistema en su parte inferior en lugar del centro, la energía potencial
  no importa mucho donde definamos su cero, lo importante es el cambio en ella*/ 
  K=0.5*pelota.mass*pelota.vel.y**2 / 1000;
  E = V + K;

  /*
  observar que en el caso qeu el movimiento sea en el eje x y el eje y 
  K=0.5*pelota.mass*(pelota.vel.x**2 + pelota.vel.y**2) / 1000;
  */
  ////////////////

  //Se añaden a la tabla los valores acuales de cada columna
  añadir = tabla.addRow();

  añadir.setNum('Altura',-(pelota.pos.y+30));/*para que el movimiento sea tomado desde la posicion inferior
  de la particula*/
  añadir.setNum('Velocidad',pelota.vel.y);
  añadir.setNum('Gravedad',gravedad.y);
  añadir.setNum('Masa',pelota.mass);
  añadir.setNum('Energía cinetica',K);
  añadir.setNum('Energía potencial',V);
  añadir.setNum('Energía mecanica',E);
//////////

//En pantalla se muestra como cambian las energias
  text("Energía Potencial (KJ) = " + nfc(V, 3), 0, 10);
  text("Energía Cinética (KJ) = " + nfc(K, 3), 0, 30);
  text("Energía Mecánica (KJ) = " + nfc(E, 3), 0, 50);
  ///////////////////
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
  }
}

let Balon = function (_mass, _pos, _vel) {//inicialmente a la particula se le debe dar su
  //masa, posicion
  this.mass = _mass;
  this.pos = _pos;
  this.vel = _vel;

  this.mostrar = function () {
    noStroke();
    fill(40);
    ellipse(this.pos.x, this.pos.y, 60, 60);/*Se craea una esfera con radio 30 y centrada en
    (this.pos.x, this.pos.y)
    */
  }

  //Actualizacion del movimiento de la particula
  this.movimiento = function (accel) {
    this.vel.x += accel.x * dt;
    this.vel.y += accel.y * dt;
    this.pos.x += this.vel.x * dt;
    this.pos.y = -((y0-30) - 0.5*(this.vel.y**2)/accel.y) ;
  }

  /*Otra forma para hallar this.vel.y es con 
  this.vel.y = sqrt(2*accel.y * abs(y0+this.pos.y))
  
  
  Observar que y0+this.pos.y es una resta ya que y0 es definido de forma positiva mientras que this.pos.y
  es negativo por la forma en la que el programa toma las posiciones hacia arriba

  de forma parecida puede hallarse this.pos.y por medio de las ecuaciones de la conservacion de la energía,
  este metodo no fue usado ya que si el movimiento es en x y y entonces hay que añadir otro termino al 
  calculo lo cual es mayor trabajo computacional
  */
////////////////
}
