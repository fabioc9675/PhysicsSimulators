/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Author: Fabian Castaño                                  *
 * * Institution: University of Antioquia                    *
 * * Course: Laboratorio avanzado 3                          *
 * ***********************************************************/

let earth;
let ball;
let g = 9;
let dt = 1 / 30;

// drag force
// FD = rho*v^2*Cd*A/2;
let rho = 0.0005;  // fluid density
let Cd = 0.001;  // drag coeficient

let font,
	fontsize = 14;

function preload() {
	// Ensure the .ttf or .otf font stored in the assets directory
	// is loaded before setup() and draw() are called
	//font = loadFont('assets/SourceSansPro-Regular.otf');
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.mouseClicked(handleClick);
	frameRate(30);
	// Set text characteristics
	// textFont(font);
	textSize(fontsize);
	textAlign(LEFT, CENTER);

	reset()
}

function draw() {

	translate(windowWidth / 2, 3 * windowHeight / 4);
	background(180);

	// draw the earth
	earth.show();
	ball.show();

	ball.update();
	ball.printV();

}


function reset() {
	earth = new Earth(-width / 2, 0, width, height / 4, 0.1);
	ball = new Ball(50, createVector(-200, -300), createVector(random(-10, 10), random(-10, 10)));
}

function handleClick() {
	reset();
}


// creation of Earth limit
let Earth = function (_x, _y, _w, _h, _c) {
	this.x = _x;
	this.y = _y;
	this.w = _w;
	this.h = _h;
	this.c = _c;

	this.show = function () {
		noStroke();
		fill(50);
		rect(this.x, this.y, this.w, this.h);
	}
};

// creation of ball
let Ball = function (_mass, _pos, _vel) {
	this.mass = _mass;
	this.pos = _pos;
	this.vel = _vel;
	this.r = this.mass;
	this.acel = createVector(0, 0);  // acceleration vector
	this.path = [];

	// draw in the canvas
	this.show = function () {
		noStroke();
		fill(255);
		ellipse(this.pos.x, this.pos.y, this.r, this.r);
		stroke(25);

		for (let i = 0; i < this.path.length - 2; i++) {
			line(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y)
		}
	}

	// update velocity
	this.update = function () {
		// update the velocity
		this.calAccel();

		// gravitational acceleration
		this.vel.y += g * dt;

		// drag force deceleration
		if (this.vel.y > 0) {
			this.vel.y -= this.acel.y * dt;
		} else {
			this.vel.y += this.acel.y * dt;
		}

		if (this.vel.x > 0) {
			this.vel.x -= this.acel.x * dt;
		} else {
			this.vel.x += this.acel.x * dt;
		}
		//this.vel.x += 1*dt;
		//this.vel.x = 1;
		if (this.pos.y > -1 * (this.r / 2)) {
			//this.vel.mult(-1);
			this.vel.y *= -1;
			this.vel.y += g * dt;
		}
		if ((this.pos.x > width / 2 - this.r / 2) || (this.pos.x < -width / 2 + this.r / 2)) {
			this.vel.x *= -1;
		}
		this.pos.y += (this.vel.y);
		this.pos.x += (this.vel.x);

		this.path.push(this.pos.copy());
		if (this.path.length > 200) {
			this.path.splice(0, 1); // keep path a constant length
		}
	}

	this.calAccel = function () {
		this.acel.x = 0.5 * rho * this.vel.x * this.vel.x * this.r * this.r * PI / this.mass;
		this.acel.y = 0.5 * rho * this.vel.y * this.vel.y * this.r * this.r * PI / this.mass;
	}

	this.printV = function () {
		fill(0);
		text("Velocity = " + nfc(this.vel.y, 2), 100, -300);
		text("Position = " + nfc(this.pos.y, 2), 100, -270);
	}
};
