/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Jacobo Parodi Díez                             *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let gravc = 0.098; // Gravedad en cm/s**2
let cD = 0.1; // Coeficiente de arrastre
let mover; // Esfera
let liquid; // Líquido

// Inputs
let i1, i2, i3, i4, i5, i6;
let Ip = [i1, i2, i3, i4, i5, i6];
let Iv = [1000, 1, 20, 15, 0, 0];

// Ingreso de posición dinámica
let fixed = false;
let x0 = 100,
  y0 = 0;

// Guardado de datos

let datos;
let newdata;

// Textos

let TXT = [
  "Densidad (kg/m3):",
  "Viscosidad (N s/m2):",
  "Masa (kg):",
  "Radio (cm):",
  "Velocidad x (m/s):",
  "Velocidad y (m/s):",
];

// Botones

let b1, b2, b3, b4;
let Bt = [b1, b2, b3, b4];

// Tiempos

let StartTime;
let timescl = 1.67; // Reescalamiento temporal
let startpauseTime = 0;
let endpauseTime = 0;
let pauseTime = 0;

// Listas vacías para gráficas

let V = [];

let Etot = [];
let Epot = [];
let Ekin = [];

let j = [];

function setup() {
  createCanvas(900, 500);

  // Cuadros de ingreso de info

  for (let i = 0; i < 6; i++) {
    Ip[i] = createInput(Iv[i]);
    Ip[i].position(450, 15 + i * 25);
    Ip[i].size(60);
  }

  // Botones

  Bt[0] = createButton("Pausar");
  Bt[0].position(720 - Bt[0].width / 2, 90);
  Bt[0].mousePressed(Pausar);

  Bt[1] = createButton("Reanudar");
  Bt[1].position(720 - Bt[1].width / 2, 90);
  Bt[1].mousePressed(Reanudar);
  Bt[1].hide();

  Bt[2] = createButton("Reiniciar");
  Bt[2].position(720 - Bt[2].width / 2, 120);
  Bt[2].mousePressed(Reiniciar);

  Bt[3] = createButton("Guardar Datos");
  Bt[3].position(720 - Bt[3].width / 2, 150);
  Bt[3].mousePressed(Guardar);

  // Crear objeto líquido y esfera (reseting la crea)

  liquid = new Liquid(0, 250, 200, 250, 0.001, 1.002);
  reseting();

  // Tabla para guardar los datos

  datos = new p5.Table();

  datos.addColumn("Tiempo");
  datos.addColumn("Posicion X");
  datos.addColumn("Posicion Y");
  datos.addColumn("Velocidad X");
  datos.addColumn("Velocidad Y");
  datos.addColumn("Rapidez");
  datos.addColumn("Energia cinetica");
  datos.addColumn("Energia potencial");

  // Establecer tiempo inicial
  startTime = millis();
}

function draw() {
  background(220);

  // Calcular el tiempo transcurrido en segundos
  let elapsedTime = (millis() - startTime - pauseTime) / 1000 / timescl;

  // Cuadros de dialogo

  stroke(150);
  fill(10);
  textSize(16);
  textAlign(LEFT, TOP);

  for (let i = 0; i < 6; i++) {
    text(TXT[i], 285, 18 + i * 25);
  }

  text(
    "Densidad esfera: " + str(nfc(mover.density * 1e6, 2)) + " kg/m3",
    285,
    18 + 6 * 25
  );

  text("Fluido:", 215, 30);
  text("Esfera:", 215, 115);

  textAlign(CENTER, TOP);
  textSize(22);
  text("Principio de Arquimedes", 720, 20);
  text("Controles:", 720, 50);

  DrawBoxes();

  let hund = liquid.contains(mover);
  let rey = liquid.Reynolds(mover);

  // Dibujar el agua
  liquid.display(mover, hund);

  // Las fuerzas se aplican según el valor de h

  // Calcular fuerzas
  let dragForce = liquid.calculateDrag(mover, hund);
  let bouyForce = liquid.calculateBouy(mover, hund);
  let gravity = createVector(0, gravc * mover.mass);

  // Aplicar fuerzas
  mover.applyForce(dragForce);
  mover.applyForce(bouyForce);
  mover.applyForce(gravity);

  // Refrescar y mostrar
  mover.update();
  mover.display();
  mover.checkEdges();

  // Gráfica 1: Rapidez y rapidez de cambio de régimen

  let vreg = (500 * liquid.m) / (liquid.p * mover.radius * 1e4);
  let magvel = mover.velocity.mag();

  V[j] = new GPoint(elapsedTime, magvel);

  plotv = new GPlot(this);
  plotv.setPos(200, 200);
  plotv.setOuterDim(350, 300);

  plotv.addLayer("layer 1", V);
  if (rey < 1000) {
    plotv.getLayer("layer 1").setPointColor("#6B9FDE");
  } else {
    plotv.getLayer("layer 1").setPointColor("#F25229");
  }
  plotv.getLayer("layer 1").setPointSize(4);

  plotv.getXAxis().setAxisLabelText("Tiempo (s)");
  plotv.getYAxis().setAxisLabelText("Rapidez (m/s)");

  plotv.defaultDraw();

  // Gráfica 2: Energia

  let epot = mover.EnergiaPot(liquid);
  let ekin = 0.5 * mover.mass * magvel * magvel;

  Epot[j] = new GPoint(elapsedTime, epot);
  Ekin[j] = new GPoint(elapsedTime, ekin);

  plotE = new GPlot(this);
  plotE.setPos(550, 200);
  plotE.setOuterDim(350, 300);
  plotE.addLayer("layer 1", Epot);
  plotE.getLayer("layer 1").setPointColor("#F25229");
  plotE.getLayer("layer 1").setPointSize(2);

  plotE.addLayer("layer 2", Ekin);
  plotE.getLayer("layer 2").setPointColor("#6B9FDE");
  plotE.getLayer("layer 2").setPointSize(2);

  plotE.getXAxis().setAxisLabelText("Tiempo (s)");
  plotE.getYAxis().setAxisLabelText("Energía [J]");
  plotE.defaultDraw();

  j += 1;

  // Guardado de datos

  newdata = datos.addRow();

  newdata.setNum("Tiempo", elapsedTime);
  newdata.setNum("Posicion X", mover.position.x);
  newdata.setNum("Posicion Y", mover.position.y);
  newdata.setNum("Velocidad X", mover.velocity.x);
  newdata.setNum("Velocidad Y", mover.velocity.y);
  newdata.setNum("Rapidez", magvel);
  newdata.setNum("Energia cinetica", ekin);
  newdata.setNum("Energia potencial", epot);

  // Volver a ubicar esfera

  if (mouseX < 200) {
    stroke(150);
    fill(220, 127);
    ellipse(mouseX, mouseY, 2 * mover.radius);
  }
  DrawBoxes();
}

// Reinicia la simuluación

function reseting() {
  let mvm = float(Ip[2].value()); // Masa
  let mvr = float(Ip[3].value()); // Radio
  let mvx = float(Ip[4].value()); // Velocidad x
  let mvy = float(Ip[5].value()); // Velocidad y

  mover = new Mover(mvr, mvm, x0, y0, mvx, -mvy);
  liquid.updateprop();

  // Vaciar gráficas y reiniciar el contador

  V = [];
  Vreg = [];
  Epot = [];
  Ekin = [];

  j = 0;

  // Reiniciar tiempo
  startTime = millis();
}

// Clases

// Clase #1 : Líquido: Se parametriza con la posicion (x,y), altura, ancho (w,h) y su densidad p y viscodidad m

let Liquid = function (x, y, w, h, p, m) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.p = p; // Densidad
  this.m = m; // Viscosidad
};

// Actualizar la densidad del líquido

Liquid.prototype.updateprop = function () {
  this.p = float(Ip[0].value() / 1e6);
  this.m = float(Ip[1].value());
};

// Calculo del número de Reynolds

Liquid.prototype.Reynolds = function (m) {
  // Magnitud de la velocidad del objeto

  let speed = m.velocity.mag();
  return (2e4 * this.p * speed * m.radius) / this.m;
};

// Esta funcion determina el porcentaje de hundimiento h
// 0   -> No está en el agua
// 0-1 -> Está parcialmente sumergida
// 1   -> Está completamente sumergida

Liquid.prototype.contains = function (m) {
  let my = m.position.y;
  let mr = m.radius;

  if (my + mr < this.y) {
    return 0;
  } else {
    if ((my + mr - this.y) / (2 * mr) > 1) {
      return 1;
    } else {
      return (my + mr - this.y) / (2 * mr);
    }
  }
};

// El fluido puede ejercer dos fuerzas sobre el objeto:

// 1. Fuerza de arrastre
Liquid.prototype.calculateDrag = function (m, hund) {
  // Magnitud de la velocidad

  let speed = m.velocity.mag();
  let h = 2 * hund * m.radius;
  let dragMagnitude = 0;

  // El arrastre depende del regimen de Reynolds

  let ry = this.Reynolds(m);

  // Regimen 1: Reynolds > 1000, arraste ~ v^2

  if (ry > 1000) {
    // Area proyectada efectiva

    let area = 0;

    if (hund < 0.5) {
      area = PI * (2 * m.radius * h - h * h);
    } else {
      area = 2 * PI * m.radius * m.radius;
    }

    // Magnitud de la fuerza de arrastre

    dragMagnitude = 0.5 * cD * area * this.p * speed * speed;
  } else {
    // Regimen 2: Reynolds < 1000, arraste ~ v

    // Radio proyectado efectivo

    let rproy = 0;

    if (hund < 0.5) {
      rproy = h / 100;
    } else {
      rproy = m.radius / 100;
    }

    dragMagnitude = (6 * PI * this.m * rproy * speed) / 100;
  }

  // Dirección del arrastre

  let dragForce = m.velocity.copy().mult(-1);

  // Unir magnitud y dirección

  dragForce.setMag(dragMagnitude);

  return dragForce;
};

// 2. Fuerza de empuje
Liquid.prototype.calculateBouy = function (m, hund) {
  let h = 2 * hund * m.radius;
  let volume = ((PI * h * h) / 3) * (3 * m.radius - h);
  let val = volume * this.p * gravc;
  return createVector(0, -1 * val);
};

// Mostrar el líquido

Liquid.prototype.display = function (m, hund) {
  let h = 2 * hund * m.radius;
  //let area = 2*PI*h*m.radius/200;
  let area = 0;

  noStroke();
  fill("#6B9FDE");
  rect(this.x, this.y - area, this.w, this.h + area);
};

// Clase #2 :Mover: Se parametriza con el radio, la masa y la posicion inicial (r,m,x,y)

function Mover(r, m, x, y, vx, vy) {
  // Parámetros constantes
  this.radius = r;
  this.mass = m;
  this.volume = (4 / 3) * PI * r * r * r;
  this.density = this.mass / this.volume;

  // Parametros que se actualizan
  this.position = createVector(x, y);
  this.velocity = createVector(vx, vy);
  this.acceleration = createVector(0, 0);
}

// Segunda ley de Newton: a = m/F

Mover.prototype.applyForce = function (force) {
  let f = p5.Vector.div(force, this.mass);
  this.acceleration.add(f);
};

Mover.prototype.update = function () {
  // v -> a*dt
  this.velocity.add(this.acceleration);

  // x -> v*dt
  this.position.add(this.velocity);

  // Reiniciar aceleración
  this.acceleration.mult(0);
};

// Determinacion de las energías

Mover.prototype.EnergiaPot = function (l) {
  // Conversion de escala: El 0 de y está en la superficie del agua

  let yy = 250 - this.position.y - this.radius;
  let rr = this.radius;
  let mm = this.mass;

  let pp = l.p; // Densidad fluido
  let u = 0; // Volumen efectivo

  if (yy < 0) {
    if (yy < -2 * rr) {
      u = this.volume;
    } else {
      u = (PI / 6) * (4 * rr * yy * yy + yy * yy * yy);
    }
  }

  return gravc * (mm * yy - pp * u * yy);
};

Mover.prototype.display = function () {
  stroke(0);
  strokeWeight(2);
  fill(220, 127);
  ellipse(this.position.x, this.position.y, this.radius * 2);
};

// Función de Rebote

Mover.prototype.checkEdges = function () {
  // Se considera una colision perfectamente elástica

  // Colision con el suelo
  if (this.position.y > height - this.radius) {
    this.velocity.y *= -1;
    this.position.y = height - this.radius;
  }

  // Colision con la pared izquierda
  if (this.position.x - this.radius < 0) {
    this.velocity.x *= -1;
    this.position.x = this.radius;
  }

  // Colision con la pared derecha
  if (this.position.x + this.radius > 200) {
    this.velocity.x *= -1;
    this.position.x = 200 - this.radius;
  }
};

function Pausar() {
  Bt[1].show();
  Bt[0].hide();
  startpauseTime = millis();
  noLoop();
}

function Reanudar() {
  Bt[0].show();
  Bt[1].hide();
  endpauseTime = millis();
  pauseTime += endpauseTime - startpauseTime;
  loop();
}

function Reiniciar() {
  Bt[0].show();
  Bt[1].hide();
  reseting();
  loop();
}

function Guardar() {
  Pausar();
  saveTable(datos, "datos.csv");
}

function DrawBoxes() {
  noFill();
  stroke(120);
  rect(0, 0, 200, 500); // Simulacion
  rect(200, 200, 350, 300); // Grafica 1
  rect(550, 200, 350, 300); // Grafica 2
  rect(200, 0, 700, 200); // Información
}

function mouseClicked() {
  if (mouseX < 200) {
    fixed = true;
    x0 = mouseX;
    y0 = mouseY;
    reseting();
  }
}
