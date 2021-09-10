let l; // Longitud de las cuerdas
let m; // Masa
let theta0, theta; // Angulos
let theta_MAS;
let omega0, omega; // Velocidades angulares
let omega_MAS;
let g; // Gravedad
let t;
let fps = 60;
let h = 1/60; // Paso de tiempo
//let h1 = 0.05/h;
let h2 = 0.5 * h;
let w0;
let desfase;
let A;
let x1, y1, x2, y2;
let k1, k2, k3, k4;

let boton_play, boton_pause, boton_reset;
let boton_MAS, boton_aplicar;
let osciladorIsOn = false;
let penduloIsOn = true;

var timer;
var counter = 0;
let play = true;

let table;
let registrar = true;
let datos;
var agregar_linea;
let fila;
var counter_datos;
let tmax_datos = 120;

let m0,L0,g0,theta_0,omega_0;

function setup() {
  createCanvas(600, 600);
  frameRate(60);
  
  theta0 = 30;
  omega0 = 0;
  
  m = createSlider(2, 10, 6);
  m.position(215, 10);
  l = createSlider(1, 250, 150);
  l.position(215, 35);
  g = createSlider(1, 20, 9.8, 0.1);
  g.position(215, 60);
  theta00 = createSlider(0, 360, theta0, 1);
  omega00 = createSlider(-3, 3, omega0, 0.5);
  
  timer = createP("timer");
  setInterval(timeIt, 1000);
  timer.position(65, 70);
  timer.style('font-size','25px');
  
  let d = createDiv();
  d.style('transform: rotate(' + (270) + 'deg);');
  d.position(460, 200);
  d.child(theta00);
  
  let f = createDiv();
  f.style('transform: rotate(' + (270) + 'deg);');
  f.position(500, 200);
  f.child(omega00);
  
  boton_aplicar = createButton('Aplicar');
  boton_aplicar.mousePressed(cambios);
  boton_aplicar.position(533, 340);

  theta0 *= PI/180
  theta = theta0; // Angulos
  theta_MAS = null;
  omega = omega0; // Velocidades angulares
  omega_MAS = null;
  t = 0;
  
  boton_play = createButton('Play');
  boton_play.mousePressed(seguir);
  boton_play.position(10, 10);
  
  boton_pause = createButton('Pause');
  boton_pause.mousePressed(pausa);
  boton_pause.position(60, 10);
  
  boton_reset = createButton('Reset');
  boton_reset.mousePressed(inicial);
  boton_reset.position(120, 10);
  
  boton_MAS = createButton('Oscilador armonico');
  boton_MAS.style('background-color', color(255,50,60));
  boton_MAS.mousePressed(oscilador);
  boton_MAS.position(450, 10);
  
  boton_pendulo = createButton('NO pendulo real');
  boton_pendulo.style('background-color', color(0,255,0));
  boton_pendulo.mousePressed(pendulo);
  boton_pendulo.position(468, 50);
  
  boton_guardar = createButton('Iniciar registro');
  boton_guardar.mousePressed(guardar);
  boton_guardar.position(40, 50);
}

function draw() {
  background(255);

  fill(0);
  text('Angulo', 520, 120);
  text(theta00.value(), 535, 320);
  text('w', 575, 120);
  text(omega00.value(), 577, 320);
  text('m', 195, 25);
  text(m.value() + ' kg', 385, 25);
  text('L', 195, 50);
  text(l.value() + ' cm', 385, 50);
  text('g', 195, 75);
  text(g.value() + ' m/s2', 385, 75);
  
  translate(width/2-30, height/2);

  if (penduloIsOn){
    x1 = l.value()*sin(theta);
    y1 = l.value()*cos(theta);

    line(0, 0, x1, y1);
    fill(0, 255, 0);
    ellipse(x1, y1, m.value()*10, m.value()*10);

    omega += -h2 * g.value()*sin(theta)/(l.value()/100);
    theta += h * omega;
    omega += -h2 * g.value()*sin(theta)/(l.value()/100);
  }

  // Muestra el oscilador armonico
  if (osciladorIsOn){
    w0 = sqrt(g.value()/(l.value()/100));
    desfase = atan(w0*theta0/omega0);
    A = theta0/sin(desfase);
    
    x2 = l.value()*sin(theta_MAS);
    y2 = l.value()*cos(theta_MAS);
    t += h;
    
    line(0, 0, x2, y2);
    fill(255, 0, 0);
    ellipse(x2, y2, m.value()*10, m.value()*10);
    
    theta_MAS = A*sin(w0*t + desfase);
  }
}

function inicial(){
  clear();
  createCanvas(600, 600);
  background(255);
  
  fill(0);
  text('Angulo', 520, 120);
  text(theta00.value(), 535, 320);
  text('w', 575, 120);
  text(omega00.value(), 577, 320);
  text('m', 195, 25);
  text(m.value() + ' kg', 385, 25);
  text('L', 195, 50);
  text(l.value() + ' cm', 385, 50);
  text('g', 195, 75);
  text(g.value() + ' m/s2', 385, 75);
  translate(width/2-30, height/2);
  
  theta = theta0; // Angulos
  omega = omega0; // Velocidades angulares
  counter = 0;
  timer.html("0:00")

  x1 = l.value()*sin(theta);
  y1 = l.value()*cos(theta);

  line(0, 0, x1, y1);
  fill(0, 255, 0);
  ellipse(x1, y1, m.value()*10, m.value()*10);
  
  if (osciladorIsOn){
    theta_MAS = theta0;
    omega_MAS = omega0;
    t = 0;
    
    x2 = l.value()*sin(theta_MAS);
    y2 = l.value()*cos(theta_MAS);
    
    line(0, 0, x2, y2);
    fill(255, 0, 0);
    ellipse(x2, y2, m.value()*10, m.value()*10);
  }
}

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

function cambios(){
  theta0 = theta00.value()*PI/180;
  omega0 = omega00.value();
  inicial();
}

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

function pausa(){
  noLoop();
  play = false;
}

function seguir(){
  loop();
  play = true;
}

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