
let canvas;
//comentarioooooooooooooooooo

let table;
let balls = [];

let dt = 1;

let fontsize = 100;

let collisions = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  frameRate(200);

  table = new Table(-400, -250, 800, 500);

  for(let i = 0; i<12; i++) {
    balls.push(new Ball(20, createVector(random(-3,3),random(-3,3)), createVector(random(-3,3), random(-3,3))));

    for(let j = 0; j < i; j++) {
      let d = dist(balls[i].pos.x, balls[i].pos.y, balls[j].pos.x, balls[j].pos.y);
      if (d <= balls[i].r) {
        balls[i].pos.x += 2*balls[i].r;
      }
    }
  }

  textSize(fontsize);
	textAlign(LEFT, CENTER);

}

function draw() {
  translate(windowWidth / 2, windowHeight / 2);
  background(220);


  table.show();

  for (let i = 0; i < balls.length; i++) {
    for (let j = i; j < balls.length; j++) {
      if (i !== j) {
        balls[i].collision(balls[j]);
      }
    }
    table.collision(balls[i]);

    balls[i].update();
    balls[i].show();
    
  }

  text("Collisions = " + nfc(collisions, 0), 300, -240);


}


// creation of billar table
let Table = function (_x, _y, _w, _h) {
  this.x = _x;
	this.y = _y;
	this.w = _w;
	this.h = _h;

  this.show = function () {
    noStroke();
    fill(80);
    rect(this.x, this.y, this.w, this.h);
  }

  this.collision = function (child) {
    if ((child.pos.x < this.x +child.r/2) || (child.pos.x > this.x + this.w -child.r/2) ) {
      child.pos.x -= child.vel.x * dt;
      child.vel.x *= -1;
      // collisions += 1;
    }
    if ((child.pos.y < this.y +child.r/2) || (child.pos.y > this.y + this.h -child.r/2) ) {
      child.pos.y -= child.vel.y * dt;
      child.vel.y *= -1;
      // collisions += 1;
    }
  }
};


// creation of billar ball
let Ball = function (_r, _pos, _vel) {
  this.r = _r;
  this.pos = _pos;
  this.vel = _vel;
  this.mass = 1;
  this.moment = this.mass * this.vel;
  this.energy = 0.5*this.mass*this.vel.magSq();

  this.show = function() {
    noStroke();
    fill(180);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }

  this.update = function () {
    // update the position
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    this.energy = 0.5*this.mass*this.vel.magSq();
  }

  this.collision = function (child) {
    let d = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y);
    let dv = this.pos.copy().sub(child.pos); 

    let en = (this.energy + child.energy) / 2;

    if (d < (this.r/2 + child.r/2 + (0.1 * child.r/2))) {
      let newMag = sqrt((2*en)/this.mass);
      
      
      this.vel.reflect(dv);
      this.vel.setMag(newMag);
      this.pos.x += 1*this.vel.x * dt;
      this.pos.y += 1*this.vel.y * dt;

      
       child.vel.reflect(dv);
       child.vel.setMag(newMag);
       child.pos.x += 1*child.vel.x * dt;
      child.pos.y += 1*child.vel.y * dt;

       collisions += 0.5;
    }
  }
}

