/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Fabián Yamith Tovar                            *
 * *          Alejandro Valencia Ossa                        *
 * *          Emmanuel Sánchez Vásquez                       *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let dt = 1 / 30;
let velocidad1;
let img;
let img1;
let img2;

function preload() {
  img1 = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2024_1/TimeDilation/assets/background.jpeg"
  );
  img2 = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2024_1/TimeDilation/assets/watch.jfif"
  );
  img = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2024_1/TimeDilation/assets/rocket.webp"
  );
}
class sistema_particula {
  constructor(mas_p, pos_c, vel_c, rad_p, apotema_c, col_p, col_c) {
    this.gamma = 1;
    this.mas = mas_p;
    this.pos = pos_c;
    this.vel = vel_c;
    this.rad = rad_p;
    this.col_p = col_p;
    this.col_c = col_c;
    this.apotema = apotema_c;
    this.pos_p = createVector(this.pos.x, this.pos.y);
    this.vel_p = createVector(0, 80);
    this.trayectoria = [];
    this.toque = 0; // Variable para contar el tiempo de contacto con el borde
  }

  mostrar(cohete) {
    rectMode(RADIUS);
    fill(this.col_c);
    stroke("black");

    if (cohete == "SI") {
      image(img, this.pos.x - 90, this.pos.y - 300, 200, 600);
    }
    // rect(this.pos.x, this.pos.y, this.apotema, this.apotema);
    image(img2, this.pos.x - 55, this.pos.y - 55, 110, 110);
    ellipseMode(RADIUS);
    fill(this.col_p);
    noStroke();
    ellipse(this.pos_p.x, this.pos_p.y, this.rad, this.rad);
  }

  estela() {
    stroke("red");
    for (let i = 0; i <= this.trayectoria.length - 2; i++) {
      line(
        this.trayectoria[i].x,
        this.trayectoria[i].y,
        this.trayectoria[i + 1].x,
        this.trayectoria[i + 1].y
      );
    }
  }

  movimiento() {
    this.gamma = sqrt(1 - pow(this.vel.x / 200, 2) - pow(this.vel.y / 200, 2));
    this.dt1 = dt * this.gamma;

    this.pos_p.x += this.vel_p.x * this.dt1 + this.vel.x * dt;
    this.pos_p.y += this.vel_p.y * this.dt1 + this.vel.y * dt;

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    // Cuando el sistema llega al borde derecho, reinicia su movimiento desde el lado izquierdo
    if (this.pos.x > width / 2 + this.apotema) {
      this.pos.x = -width / 2 - this.apotema;
      this.pos_p.x = this.pos.x;
      this.trayectoria = []; // Reinicia la trayectoria
    } else {
      // Si no ha llegado al borde derecho, sigue registrando la trayectoria
      this.trayectoria.push(this.pos_p.copy());
      if (this.trayectoria.length > 30) {
        this.trayectoria.splice(0, 1);
      }
    }
  }

  rebote() {
    if (abs(this.pos_p.x - (this.pos.x - this.apotema)) < this.rad) {
      this.pos_p.x = this.pos.x - this.apotema + this.rad;
      this.vel_p.x *= -1;
      this.toque++; // Incrementa el tiempo de contacto con el borde
    } else if (abs(this.pos_p.x - (this.pos.x + this.apotema)) < this.rad) {
      this.pos_p.x = this.pos.x + this.apotema - this.rad;
      this.vel_p.x *= -1;
      this.toque++; // Incrementa el tiempo de contacto con el borde
    } else if (abs(this.pos_p.y - (this.pos.y - this.apotema)) < this.rad) {
      this.pos_p.y = this.pos.y - this.apotema + this.rad;
      this.vel_p.y *= -1;
      this.toque++; // Incrementa el tiempo de contacto con el borde
    } else if (abs(this.pos_p.y - (this.pos.y + this.apotema)) < this.rad) {
      this.pos_p.y = this.pos.y + this.apotema - this.rad;
      this.vel_p.y *= -1;
      this.toque++; // Incrementa el tiempo de contacto con el borde
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  button = createButton("Reiniciar");
  button.position(10, 10);
  button.size(90, 20);
  button.mousePressed(restart);

  velocidad1 = createSlider(0, 199.99, 0);
  velocidad1.position(20, height - 85);
  velocidad1.size(150);

  //part #n = new sistema_particula(masa-partícula, createVector(posición-x-caja, posición-y-caja, createVector(velocidad-x-caja, velocidad-y-caja), radio-partícula, lado de la caja, color-partícula, color-caja);

  part1 = new sistema_particula(
    10,
    createVector(-(width / 2) + 100, -(height / 2) + 150),
    createVector(0, 0),
    width / 100,
    50,
    "red",
    "black"
  );
  part2 = new sistema_particula(
    10,
    createVector(0, height / 2 - 70),
    createVector(0, 0),
    width / 100,
    50,
    "red",
    "black"
  );
}

function draw() {
  translate(width / 2, height / 2);
  background(img1);

  part1.vel.x = velocidad1.value();

  part1.movimiento();
  part1.mostrar("SI");
  part1.estela();

  part2.movimiento();
  part2.mostrar("NO");
  part2.estela();

  part2.rebote();
  part1.rebote();

  stroke("white");
  fill("black");
  rect(-(width / 2) + 150, height / 2 - 130, 140, 120);

  stroke("white");
  fill("black");
  rect(width / 2 - 100, height / 2 - 60, 90, 50);

  // Muestra el tiempo de contacto con el borde
  fill("white");
  stroke("white");
  textSize(20);

  //
  //equation();
  //
  textAlign(RIGHT);
  text("Reloj en reposo: " + part2.toque, -(width / 2) + 250, height / 2 - 165);
  text(
    "Reloj en movimiento: " + part1.toque,
    -(width / 2) + 250,
    height / 2 - 135
  );

  textAlign(RIGHT);
  textSize(20);
  fill("red");
  stroke("red");
  text(velocidad1.value() / 2 + "% de c", -(width / 2) + 280, height / 2 - 75);

  textSize(30);
  fill("#33FFF6");
  stroke("#33FFF6");
  text("Número de tic-tacs", -(width / 2) + 277, height / 2 - 210);

  textSize(15);
  fill("#33FFF6");
  stroke("#33FFF6");
  text("Velocidad del sistema", -(width / 2) + 170, height / 2 - 90);
  fill("red");
  stroke("red");
  text("c: Velocidad de la luz", -(width / 2) + 170, height / 2 - 30);

  textAlign(LEFT);
  fill("#33FFF6");
  stroke("white");
  textSize(25);
  text("Δt = γ Δt' ", width / 2 - 150, height / 2 - 75);
  fill("#33FFF6");
  stroke("white");
  textSize(25);
  text("γ=" + round(part1.gamma, 5), width / 2 - 145, height / 2 - 30);
}
function restart() {
  velocidad1.remove();
  setup();
}
