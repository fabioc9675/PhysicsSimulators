let cubo;
let dt = 1 / 30;
let freq = 1;
let amp = 70;
let wall;
let wall2;
let reso;
let reso2;

let img;
function preload() {
  //img = loadImage("coil.png");
  img = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/examples/SpringCoupled/coil.png"
  );
}

function setup() {
  createCanvas(800, 600);
  frameRate(30);
  cubo = new masa(60, 20, createVector(0, 0));
  wall = new Earth(createVector(-400, -300), 100, 600, 0);
  wall2 = new Earth(createVector(350, -300), 50, 600, 0);
  reso = new spring(0.2, 1);
  reso2 = new spring(0.2, 1);
}

function draw() {
  translate(800 / 2, 600 / 2);
  background(0, 55, 65);
  wall.update();
  wall.show();
  wall2.show();
  cubo.update();
  cubo.show();
  reso.drawSpring(wall, cubo);
  reso2.drawSpring(cubo, wall2);
}

let spring = function (_k, _d) {
  this.k = _k;
  this.d = _d;

  this.drawSpring = function (Earth, masa) {
    fill(150, 40, 100);
    let baseWidth = 0.05 * (Earth.pos.x + Earth.size - masa.pos.x) + 25;
    //console.log(baseWidth);

    image(img,
      Earth.pos.x + Earth.size,
      20 - baseWidth,
      abs(Earth.pos.x + Earth.size - masa.pos.x),
      20 + 2 * baseWidth
    );
  };
};

// clase masa
let masa = function (_size, _mass, _pos) {
  this.size = _size;
  this.mass = _mass;
  this.pos = _pos;
  this.t = 0;

  this.x0 = this.pos.x;

  this.show = function () {
    noStroke();
    fill(100, 100, 100);
    rect(this.pos.x, this.pos.y, this.size, this.size);
  };

  this.update = function () {
    this.t += dt;
    this.pos.x = amp * sin(2 * PI * freq * this.t) + this.x0;
  };
};

let Earth = function (_pos, _w, _h, _c) {
  this.pos = _pos;
  this.size = _w;
  this.h = _h;
  this.c = _c;
  this.t = 0;
  this.x0 = _w;

  this.show = function () {
    noStroke();
    fill(175);
    rect(this.pos.x, this.pos.y, this.size, this.h);
  };

  this.update = function () {
    this.t += dt;
    this.size = 80 * sin(0.3 * PI * freq * this.t) + this.x0;
  };
};
