/************************************************
Simulación --> Péndulo Simple
Autores: Daniel Henao, Alexander Valencia 
Instituto de Física, Universidad de Antioquia
************************************************/

//-----------------------------------------------
// Variables y parámetros del sistema simulado
//-----------------------------------------------
let l; // Longitud de las cuerdas
let m; // Masa
let theta0, theta; // Angulos
let theta_MAS;
let omega0, omega; // Velocidades angulares
let omega_MAS;
let g; // Aceleración de la gravedad
let t; // Variable asociada al paso temporal
let fps = 60;
let h = 1/60; // Paso temporal, evolución sistema
let h2 = 0.5 * h;
let w0; // Velocidad angular oscilador
let desfase; // Desfase angular oscilador
let A; // Amplitud angular oscilador 
let x1, y1, x2, y2; // Coordenadas de posición

//-----------------------------------------------
// Variables que generan controles de simulación:
//Play, Pause, Reset, Oscilador, Pendulo, Aplicar
//-----------------------------------------------

let boton_play, boton_pause, boton_reset;
let boton_MAS, boton_aplicar;
let osciladorIsOn = false;
let penduloIsOn = true;

//-----------------------------------------------
// Variables globales activación del cronómetro 
//-----------------------------------------------
var timer;
var counter = 0;
let play = true;

//-----------------------------------------------
// Variables para el control: Iniciar Registro.
// Utilizado en el almacenamiento de los datos.
//-----------------------------------------------
let table;
let registrar = true;
let datos;
var agregar_linea;
let fila;
var counter_datos;
let tmax_datos = 120;

//-----------------------------------------------
// Variables que asignan condiciones iniciales
//-----------------------------------------------
let m0,L0,g0,theta_0,omega_0;

/************************************************
Generación frame, propiedades iniciales objetos:
píxeles (820 ancho, 366 alto) | 60 fotogramas/s 
************************************************/
function setup() {
  createCanvas(820, 366);
  frameRate(60);

//-----------------------------------------------
// Valor inicial: ángulos y velocidades
//-----------------------------------------------
  // Cambios posibles mediante el Botón Aplicar 
  theta0 = 30;
  omega0 = 0;

//-----------------------------------------------
// RANGOS. Variables y Parámetros | Cronómetro: 
//-----------------------------------------------
  // Masa, Longitud, Gravedad; argumentos de
  // valores --> (inferior, superior, inicial)
  m = createSlider(2, 10, 6);
  l = createSlider(30, 230, 150);
  g = createSlider(1, 20, 9.8, 0.1);
  
  // Amplitud, Velocidad; argumentos de valores
  // --> (inferior, superior, inicial, paso)
  theta00 = createSlider(-180, 180, theta0, 1);
  omega00 = createSlider(-3, 3, omega0, 0.5);
  
  // Rango, posición y estilo del cronómetro
  timer = createP("timer");
  setInterval(timeIt, 1000);
  timer.position(80, 30);
  timer.style('font-size','25px');
  
//-----------------------------------------------
// Activación de controles --> barras verticales: 
//-----------------------------------------------
  // (1) Control de Masa, m[kg]
  let masa = createDiv();
  masa.style('transform: rotate(' + (270) + 'deg);');
  masa.position(-30, 220);
  masa.child(m);
  
  // (2) Control de Longitud, L[cm]
  let longitud = createDiv();
  longitud.style('transform: rotate(' + (270) + 'deg);');
  longitud.position(25, 220);
  longitud.child(l);
  
  // (3) Control de Gravedad, g [m/s2]
  let gravedad = createDiv();
  gravedad.style('transform: rotate(' + (270) + 'deg);');
  gravedad.position(80, 220);
  gravedad.child(g);
  
  // (4) Control de Angulo
  let d = createDiv();
  d.style('transform: rotate(' + (270) + 'deg);');
  d.position(620, 190);
  d.child(theta00);
  
  // (5) Control de Velocidad Angular, w
  let f = createDiv();
  f.style('transform: rotate(' + (270) + 'deg);');
  f.position(670, 190);
  f.child(omega00);
  
//-----------------------------------------------
// Activación de controles --> botones: 
//-----------------------------------------------
  // Botón (1)--> Aplicar | Angulos y Velocidades 
  boton_aplicar = createButton('Aplicar');
  boton_aplicar.mousePressed(cambios);
  boton_aplicar.position(697, 330);
  
  // Aplicación cambios en Angulos y Velocidades,
  // como condición inicial de dinámica sistema
  theta0 *= PI/180
  theta = theta0; // Angulos
  theta_MAS = null;
  omega = omega0; // Velocidades angulares
  omega_MAS = null;
  t = 0;

  // Botón (2)--> Play | Iniciar Simulación
  boton_play = createButton('Play');
  boton_play.mousePressed(seguir);
  boton_play.position(20, 10);
  
  // Botón (3)--> Pause | Suspender, Pausar
  boton_pause = createButton('Pause');
  boton_pause.mousePressed(pausa);
  boton_pause.position(75, 10);
  
  // Botón (4)--> Reset | Reestablecer Simulación
  boton_reset = createButton('Reset');
  boton_reset.mousePressed(inicial);
  boton_reset.position(140, 10);
  
  // Botón (5)--> Oscilador | Péndulo M.A.S.
  boton_MAS = createButton('Oscilador armonico');
  boton_MAS.style('background-color', color(255,50,60));
  boton_MAS.mousePressed(oscilador);
  boton_MAS.position(660, 10);
  
  // Botón (6)--> Péndulo Simple | Péndulo Real
  boton_pendulo = createButton('NO pendulo real');
  boton_pendulo.style('background-color', color(0,255,0));
  boton_pendulo.mousePressed(pendulo);
  boton_pendulo.position(670, 50);
  
  // Botón (7)--> Iniciar Registro | Guardar
  boton_guardar = createButton('Iniciar registro');
  boton_guardar.mousePressed(guardar);
  boton_guardar.position(210, 10);
}

/************************************************
Estructura de textos y objetos en la interfaz:
Color de fondo blanco --> background(255)
************************************************/
function draw() {
  background(255);

  // Textos de controles --> barras verticales
  fill(0);
  text('Angulo', 680, 110);
  text(theta00.value(), 692, 310);
  text('w', 745, 110);
  text(omega00.value(), 745, 310);
  text('m [kg]', 35, 135);
  text(m.value(), 44, 340);
  text('L [cm]', 89, 135);
  text(l.value(), 94, 340);
  text('g [m/s2]', 140, 135);
  text(g.value(), 150, 340);

//-----------------------------------------------
// Visualización de los péndulos:
//-----------------------------------------------
  // Posicionamiento de péndulos en la interfaz
  translate(width/2+20, height/2-30);
  
  // (A) Péndulo real --> coordenadas(x1, y1)
  if (penduloIsOn){
    x1 = l.value()*sin(theta);
    y1 = l.value()*cos(theta);

    strokeWeight(2);
    line(0, 0, x1, y1);
    fill(0, 255, 0);
    ellipse(x1, y1, m.value()*10, m.value()*10);

    // Dinámica. Solución numérica péndulo real:
    // Aplicación algoritmo Verlet en simulación
    omega += -h2 * g.value()*sin(theta)/(l.value()/100);
    theta += h * omega;
    omega += -h2 * g.value()*sin(theta)/(l.value()/100);
  }

  // (B) Péndulo M.A.S. --> coordenadas(x2, y2)
  if (osciladorIsOn){
    
    // Dinámica del oscilador armónico simple:
    w0 = sqrt(g.value()/(l.value()/100));
    desfase = atan(w0*theta0/omega0);
    A = theta0/sin(desfase);
    
    x2 = l.value()*sin(theta_MAS);
    y2 = l.value()*cos(theta_MAS);
    t += h;
    
    strokeWeight(2);
    line(0, 0, x2, y2);
    fill(255, 0, 0);
    ellipse(x2, y2, m.value()*10, m.value()*10);
    
    // Solución oscilador armónico simple:
    theta_MAS = A*sin(w0*t + desfase);
  }
}

/************************************************
Estructura que reinicia la simulación, con todas
las condiciones predefinidas en la interfaz: se
acoplan líneas de las funciones draw() y setup()
************************************************/
function inicial(){
  clear();
  createCanvas(820, 366);
  background(255);
  
  fill(0);
  text('Angulo', 680, 110);
  text(theta00.value(), 692, 310);
  text('w', 745, 110);
  text(omega00.value(), 745, 310);
  text('m [kg]', 35, 135);
  text(m.value(), 44, 340);
  text('L [cm]', 89, 135);
  text(l.value(), 94, 340);
  text('g [m/s2]', 140, 135);
  text(g.value(), 150, 340);
  
  translate(width/2+20, height/2-30);
  
  theta = theta0; // Angulos
  omega = omega0; // Velocidades angulares
  counter = 0;
  timer.html("0:00")

  x1 = l.value()*sin(theta);
  y1 = l.value()*cos(theta);

  strokeWeight(2);
  line(0, 0, x1, y1);
  fill(0, 255, 0);
  ellipse(x1, y1, m.value()*10, m.value()*10);
  
  if (osciladorIsOn){
    theta_MAS = theta0;
    omega_MAS = omega0;
    t = 0;
    
    x2 = l.value()*sin(theta_MAS);
    y2 = l.value()*cos(theta_MAS);
    
    strokeWeight(2);
    line(0, 0, x2, y2);
    fill(255, 0, 0);
    ellipse(x2, y2, m.value()*10, m.value()*10);
  }
}

/************************************************
Función que permite visualizar péndulo oscilador.
NO pendulo oscilador --> Se desactiva el objeto
************************************************/
function oscilador(){
  if (osciladorIsOn){
    osciladorIsOn = false;
    theta_MAS = null;
    omega_MAS = null;
    boton_MAS.html('Oscilador armonico');
  }
  else{
    theta_MAS = theta0;
    omega_MAS = omega0;
    theta = theta0;
    omega = omega0;
    t = 0;
    osciladorIsOn = true;
    boton_MAS.html('NO oscilador armonico');
  }
}

/************************************************
Función que permite visualizar péndulo real.
NO pendulo real --> Se desactiva el objeto
************************************************/
function pendulo(){
  if (penduloIsOn){
    penduloIsOn = false;
    boton_pendulo.html('Pendulo real');
  }
  else{
    theta = theta0;
    omega = omega0;
    theta_MAS = theta0;
    omega_MAS = omega0;
    t = 0;
    penduloIsOn = true;
    boton_pendulo.html('NO pendulo real');
  }
}

/************************************************
Función conectada al Botón Aplicar. Introduce
cambios de Angulo y Velocidad angular (iniciales)
************************************************/
function cambios(){
  theta0 = theta00.value()*PI/180;
  omega0 = omega00.value();
  inicial();
}

/************************************************
Función que activa conteo temporal en cronómetro
************************************************/
function timeIt() {
  if (play){
    counter++;
  }
  minutos = floor(counter/60);
  segundos = counter % 60;
  
  if (segundos <= 9){
    timer.html(minutos + ":0" + segundos);
  }
  else{
    timer.html(minutos + ":" + segundos);
  }
}

/************************************************
Función vinculada al Botón Pause
************************************************/
function pausa(){
  noLoop();
  play = false;
}

/************************************************
Función vinculada al Botón Play <-- (Botón Pause)
continuar simulación luego de suspenderla [Play]
************************************************/
function seguir(){
  loop();
  play = true;
}

/************************************************
Funciones vinculadas al Botón Iniciar Registro:
************************************************/
//-----------------------------------------------
// Botón Guardar: se activa al Iniciar Registro
// para almacenar datos --> variables, parámetros
//-----------------------------------------------
function guardar() {
  if (registrar){
    registrar = false;
    boton_guardar.html('Guardar')
    
    m0 = m.value();
    L0 = l.value();
    g0 = g.value();
    theta_0 = theta00.value();
    omega_0 = omega00.value();
      
    datos = new p5.Table();
    datos.addColumn('t');
    datos.addColumn('angulo');
    datos.addColumn('angulo_MAS');
    datos.addColumn('w');
    datos.addColumn('w_MAS');
    fila = datos.addRow();
  
    counter_datos = 0;
    agregar_linea = setInterval(linea, 1000);
  }
  
  else{
    fila.set('t', 'm = ' + m0 + ', L = ' + L0 + ', g = ' + g0 + ', theta0 = ' + theta_0 + ', omega0 = ' + omega_0);
    clearInterval(agregar_linea);
    registrar = true;
    boton_guardar.html('Iniciar registro')
    save(datos, "datos_pendulo.csv");
  }
}

//-----------------------------------------------
// Línea: establece filas para datos almacenados;
// una fila cada segundo de tiempo del movimiento
// Variables: t, angulo, velocidad M.A.S.
// Valores fijos: m, L, g, angulo M.A.S.
//-----------------------------------------------
function linea(){
  counter_datos++;
  if (counter_datos <= tmax_datos & play) {
    fila.set('t', counter);
    fila.set('angulo', degrees(theta));
    fila.set('angulo_MAS', degrees(theta_MAS));
    fila.set('w', omega);
    fila.set('w_MAS', omega_MAS);
    fila = datos.addRow();
  }
  else if (counter_datos > tmax_datos){
    fila.set('t', 'm = ' + m0 + ', L = ' + L0 + ', g = ' + g0 + ', theta0 = ' + theta_0 + ', omega0 = ' + omega_0);
    clearInterval(agregar_linea);
    registrar = true;
    boton_guardar.html('Iniciar registro')
    save(datos, "datos_pendulo.csv");
  }
}
