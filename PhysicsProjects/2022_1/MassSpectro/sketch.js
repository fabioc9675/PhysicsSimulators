/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Alejandro Restrepo                             *
 * *          Juan Sebastián Ramírez                         *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let particle = []; //Lista particulas en la simulación
var numpart = 0; //número de particulas, se inicializa en 0

//se inicia función setup de estructura inicial
function setup() {
  // se determina el tamaño de la ventana de la simulación para que sea cuadrada
  if (windowWidth > windowHeight) createCanvas(windowWidth, windowWidth);
  else createCanvas(windowHeight, windowHeight);

  textStyle(BOLDITALIC);
  textSize(16);

  // se crean los slider para carga, masa, campo y velocidad de la partícula
  Charge = createSlider(-10, 10, 2, 1);
  Charge.position(windowWidth - 250, 10);
  Charge.style("width", "200px");

  Mass = createSlider(1, 50, 10, 1);
  Mass.position(windowWidth - 250, 60);
  Mass.style("width", "200px");

  B = createSlider(-10, 10, 10, 1);
  B.position(windowWidth - 250, 110);
  B.style("width", "200px");

  v = createSlider(100, 500, 50, 1);
  v.position(windowWidth - 250, 170);
  v.style("width", "200px");

  // se creaan los botones para disparar y borrar y se elige su posición en la ventana
  var button = createButton("Disparar");
  button.position(windowWidth - 250, 250);
  button.style("width", "200px", "button");
  button.mousePressed(RunButton); //activa función para disparar
  var button2 = createButton("Borrar");
  button2.position(windowWidth - 250, 280);
  button2.style("width", "200px", "button");
  button2.mousePressed(DeleteParticles); //activa la función borrar cuando se da clic en el botón

  var button3 = createButton("Guardar Datos");
  button3.position(windowWidth - 250, 400);
  button3.style("width", "200px", "button");
  button3.mousePressed(GuardarDatos); //activa la función
  stroke(0, 0, 0, 0);
}

//Función Guardar datos
function GuardarDatos() {
  for (let i = 0; i < numpart; i++) {
    let table = new p5.Table();
    table.addColumn("x");
    table.addColumn("y");
    table.addColumn("vx");
    table.addColumn("vy");
    var xant = 0;
    var k = 0;
    for (let j = 0; j < particle[i].path.length; j++) {
      let newRow = table.addRow();
      if (xant - particle[i].path[j + 1].x == 0) {
        if (k == 0) {
          k++;
        } else {
          break;
        }
      }
      newRow.setNum("x", particle[i].path[j].x);
      newRow.setNum("y", particle[i].path[j].y);
      newRow.setNum("vx", particle[i].veltray[j].x);
      newRow.setNum("vy", particle[i].veltray[j].y);
      xant = particle[i].path[j].x;
    }

    saveTable(table, "Particle_" + str(i + 1) + ".csv");
  }

  /*let obj =new Object();
  for (let i = 0; i < numpart; i++) {
    obj["Particula"+str(i+1)]= createStringDict({x: particle[i].path.x, y: particle[i].path.y })
  }
  createStringDict(obj).saveTable('Datos');*/
}

// Función borrar
function DeleteParticles() {
  // se eliminan todas las particulas de la lista de particulas
  particle.splice(0, particle.length);
  numpart = 0; // se cambia el número de particulas a cero
}
//función  que carga las imagenes para el campo saliendo o entrando(punto o cruz)
function preload() {
  img1 = loadImage(
    "https://raw.githubusercontent.com/arestrepogiraldo2200/LabSimulation/master/1.png"
  );
  img2 = loadImage(
    "https://raw.githubusercontent.com/arestrepogiraldo2200/LabSimulation/master/2.png"
  );
}

//esta función nos permite dibujar cada frame de la simulación
function draw() {
  // se define el fondo a partir de si el campo magnético es positivo, negativo o cero
  // así se muestran las cruces, el punto o en blanco dependiendo del campo
  if (B.value() < 0) background(img1);
  else if (B.value() == 0) background("#D9E8E9");
  else background(img2);
  let valC = Charge.value();
  fill(0, 0, 0);
  // se escriben los valores correspondientes a las caracteristicas análizadas en el frame
  // que varia segun se mueva el slider
  stroke(0, 0, 0, 0);
  rect(0, height / 2 - 5, 5, 10);
  text("Carga: " + Charge.value(), windowWidth - 250, 30, 70, 80);

  text("Masa: " + Mass.value(), windowWidth - 250, 80, 70, 80);

  text("Campo: " + B.value(), windowWidth - 250, 130, 70, 80);

  text("Velocidad: " + v.value(), windowWidth - 250, 190, 70, 80);

  fill(255, 0, 0);
  text("Vector-Fuerza", windowWidth - 250, 320, 30, 80);
  fill(0, 255, 0);
  text("Vector-Velocidad", windowWidth - 250, 340, 30, 80);

  // se traslada el centro de coordenadas a centro de la ventana
  translate(width / 2, height / 2);
  // se realiza el movimiento y se dibuja cada partícula para el frame
  for (let i = 0; i < numpart; i++) {
    particle[i].move(); // se mueve
    particle[i].show(); // se dibuja
  }
}

// función que crea una nueva partícula, con valores de parámetros según los slider en el punto
function RunButton() {
  // se extraen los valores de las características
  let valC = Charge.value();
  let valB = B.value();
  let valM = Mass.value();
  let valv = v.value();
  // se crea vector de posición y se inicializa
  let partPos2 = createVector(-canvas.width / 2 - 20, 0);
  // se crea la nueva partícula  y se aumenta en valor de numpart en 1
  particle.push(new Body(valB, 0, valM, valC, partPos2, valv));
  numpart += 1;
}

// función que crea la partícula
function Body(_B, _k, _m, _q, _pos, _vel) {
  // se definen los parametros que caracterizan la partícula
  this.k = _k; // condición que nos indica la primera vez que la particula para por la coordenada x= -canvas.width/2
  this.r = (_m * _vel) / (_q * _B); //radio de la trayectoria
  this.dt = 1 / this.r; // paso de tiempo por frame
  this.t = 0; // tiempo en la trayectoria
  //parámetros y velocidad
  this.B = _B;
  this.m = _m;
  this.q = _q;
  this.pos = _pos;
  this.v = _vel;
  this.vel = createVector(_vel, 0);
  this.d = 10; //diametro de la particula
  this.path = []; // puntos de la trayectoria en cada t
  this.veltray = []; //velocidad en x y y en cada punto coordenado
  this.pathLen = Infinity;
  //función que dibuja la partícula para cada t, la linea de trayectoria y vector de posición
  this.show = function () {
    //stroke(0,50)
    fill(0, 0, 0);
    //linea de trayectoria
    stroke(0);
    for (let i = 0; i < this.path.length - 2; i++) {
      line(
        this.path[i].x,
        this.path[i].y,
        this.path[i + 1].x,
        this.path[i + 1].y
      );
    }
    strokeWeight(2);
    let n = this.path.length;
    // vector de posición
    if (n > 3) {
      stroke(0);
      let x0 = this.pos.x;
      let y0 = this.path[n - 2].y;
      triangle(x0, y0 + 8, -6 + x0, y0, 6 + x0, y0);
      line(-canvas.width / 2, 0, this.pos.x, this.pos.y);
      let a = atan2(this.pos.y - this.r, this.pos.x + canvas.width / 2);

      a -= PI / 2.0;
      stroke(255, 0, 0);
      let F = this.q * this.v * this.B;
      x0 = sin(a) * abs(F / 100) + this.pos.x;
      y0 = -cos(a) * abs(F / 100) + this.pos.y;
      line(this.pos.x, this.pos.y, x0, y0);
      stroke(0, 255, 0);
      let dir = this.r / abs(this.r);
      x0 = -cos(a) * (this.v / 5) * dir + this.pos.x;
      y0 = -sin(a) * (this.v / 5) * dir + this.pos.y;
      line(this.pos.x, this.pos.y, x0, y0);

      stroke(0, 0, 0, 0);
    }

    // se dibuja la partícula para cada posición
    strokeWeight(1);
    stroke(0);
    fill(255);
    circle(this.pos.x, this.pos.y, this.d);
  };

  // función que produce el movimiento de la partícula, evoluciona la posición con t
  this.move = function () {
    // condición que verifica si ya llego a la pared por segunda vez
    //aquí termina el movimiento
    if (this.pos.x - 0.5 <= -canvas.width / 2 && this.k > 0) {
      this.t = 1 / this.dt; // se deja el tiempo fijo para que no evolucione la trayectoria
      fill(230, 0, 0);
      strokeWeight(10);
      stroke(0, 0, 0, 0);
      // se imprime el radio de la trayectoria
      text(
        "R= " + abs(this.r.toFixed(2)),
        -canvas.width / 2 + 5,
        this.r,
        70,
        80
      );
      strokeWeight(1);
    }
    // si la particula la supero la pared por primera vez se aumenta k, para indicar que salio del cañon
    else if (this.pos.x >= -canvas.width / 2) {
      this.k += 1;
    }
    if (abs(this.r) == Infinity) {
      // si el radio es infinito la trayectoria es una linea recta
      this.pos.x += this.vel.x / 100;
    } else {
      // si no la trayectoria es una circunferencia
      // se evoluciona la posición en x,y y la velocidad para  t
      this.pos.x = this.r * sin(PI * this.t * this.dt) - canvas.width / 2;
      this.t += 1;
      this.pos.y = this.r * (1 - cos(PI * this.t * this.dt));
      this.vel.x +=
        ((this.q / this.m) * this.vel.y * this.B * this.t) / this.dt;
      this.vel.y +=
        (-(this.q / this.m) * this.vel.x * this.B * this.t) / this.dt;
    }
    // e añade la nueva posición para la partícula
    let a = atan2(this.pos.y - this.r, this.pos.x + canvas.width / 2);
    a -= PI / 2.0;
    let dir = this.r / abs(this.r);
    this.veltray.push(
      createVector(-cos(a) * this.v * dir, -sin(a) * this.v * dir)
    );
    this.path.push(createVector(this.pos.x, this.pos.y));
  };
}
