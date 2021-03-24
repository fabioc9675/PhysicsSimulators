/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Author: Fabian Castaño                                  *
 * * Institution: University of Antioquia                    *
 * * Course: Laboratorio avanzado 3                          *
 * ***********************************************************/


// Tutorial to install node.js and server to run app
// https://github.com/processing/p5.js/wiki/Local-server

// Tutorial to download basic example of p5.js app
// https://p5js.org/get-started/
// https://p5js.org/download/

// Linear Regression with TensorFlow.js
// https://thecodingtrain.com/CodingChallenges/104-linear-regression-tfjs.html
// https://youtu.be/dLp10CFIvxI

// informacion de referencia
// https://flems.io/#0=N4IgtglgJlA2CmIBcBWAHAOjQJgDQgDMIEBnZAbVADsBDMRJEDACwBcxYR8BjAeytbwByEAB4oEAG4ACaAF4AOiBoAHFUoB8ogPQTJGkAF9c1OgyYArMj36DhjbrBokS0gIJrp8AB52orgCV4Gm5WDABhXjAVfiFWaWAFKmlpPioSVgAnAFdQ3kyAChVM3hUSAEoEpJSUkmyVeELi0orqmtZmCBIMMABPIIJpOWkgkLDuTODBAYLytsMktoBlAGt4Vm5mIekiyrkNKqo2mpUMEnX67dmhg8TkmpTTgCMQlYBzEuyqKAKlAGICAQAAwgoFKcoAbmOKQWR3uJwwUEyNAA7lc9rdqtDpLCYYt7nxorEBAARaAAWV4X1Y1zuDw6XR6vQACihtlR4GiVCgCgzuqt1ptcNI+UyBhhuNlMpMBHN7rC2jKoI1adDJqwpclfvCauIpNJJgQ5MBRX0BoYNPiHikdHpLTq5XiqAq4fjRqESQB5ckYJUqxasUQeFTSbT24WqFTlLggQkqYiNEQvJ7wTj4c4IUIQfhkRgARgALEgAGxGEwgWj0EQSlwxtJ2VgiIwAXXwsAgVBWucoFbMIkmYxjUs4jDYrDKSG02i+KneEqi2gHoWnYCgi+CoUR8EkqdK9AEGCsMdYvQaIhIEwgKkbxlMVcYS9YAFooFEh5kRyAxxOpzO54T1zGF8F2yVdANCYCwC3HdYD3OJD2sEATzPRgL0yK8b3LStzG5d9P2-EhJ2nKhZzeecwG0bkAAE8wwWiAE5tHbJ5KJQHoOwQ49T3MNCMJbfBsJEVkAEkADkAgAUTccIABUjCAA
// https://codesandbox.io/s/solar-system-hqbnx?file=/src/index.js:3872-3965
// https://github.com/michaelruppe/art/tree/master/solar-system-p5
// https://dev.to/christiankastner/integrating-p5-js-with-react-i0d
// https://www.youtube.com/watch?v=HZ4D3wDRaec
// https://www.youtube.com/watch?v=pgFnZyL8zEA
// https://www.youtube.com/watch?v=_yXQayoxJOg&t=4s


let sun;
let planets = [];
let G = 1;
let numPlanets = 1;
let destabilise = 0.1;


function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.mouseClicked(handleClick);

    sun = new Body(100, createVector(0, 0), createVector(0, 0));
    sun.mass = 300 * sun.mass;

    for (let i = 0; i < numPlanets; i++) {
        // planet position
        let r = random(sun.r, min(windowWidth / 2, windowHeight / 2));
        let theta = random(TWO_PI);
        let planetPos = createVector(r * cos(theta), r * sin(theta));

        // planet veocity (orbit velocity)
        let planetVel = planetPos.copy();
        planetVel.rotate(HALF_PI);
        planetVel.setMag(sqrt(G * sun.mass / planetPos.mag()));
        if (random(1) < 0.2) {
            planetVel.mult(-1);
        }
        planetVel.mult(random(1 - destabilise, 1 + destabilise));
        planets.push(new Body(random(2, 25), planetPos, planetVel));
    }
};

function draw() {

    translate(windowWidth / 2, windowHeight / 2);
    background(180);
    sun.show();

    for (let i = 0; i < planets.length; i++) {
        sun.attract(planets[i]);
        for (let j = 0; j < planets.length; j++) {
            if (i !== j) {
                planets[i].attract(planets[j]);
            }
        }
        planets[i].update();
        planets[i].show();
        planets[i].attract(sun);
        sun.update();
    }
};

function handleClick() {
    // planet position
    let r = random(sun.r, min(windowWidth / 2, windowHeight / 2));
    let theta = random(TWO_PI);
    let planetPos = createVector(r * cos(theta), r * sin(theta));

    // planet velocity (orbit velocity)
    let planetVel = planetPos.copy();
    planetVel.rotate(HALF_PI);
    planetVel.setMag(sqrt(G * sun.mass / planetPos.mag()));
    if (random(1) < 0.2) {
        planetVel.mult(-1);
    }
    planetVel.mult(random(1 - destabilise, 1 + destabilise));
    planets.push(new Body(random(2, 25), planetPos, planetVel));
};


let Body = function (_mass, _pos, _vel) {
    this.mass = _mass;
    this.pos = _pos;
    this.vel = _vel;
    this.r = this.mass;
    this.path = [];

    this.show = function () {
        noStroke();
        fill(255);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
        stroke(30);

        for (let i = 0; i < this.path.length - 2; i++) {
            line(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y)
        }
    };

    this.update = function () {
        // update the position
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.path.push(this.pos.copy());
        if (this.path.length > 100) {
            this.path.splice(0, 1); // keep path a constant length
        }
    };

    this.applyForce = function (f) {
        this.vel.x += f.x / this.mass; // f = ma => a = f/m
        this.vel.y += f.y / this.mass; // f = ma => a = f/m
    };

    // gravitational interaction
    this.attract = function (child) {
        let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y);
        let f = this.pos.copy().sub(child.pos);
        f.setMag((G * this.mass * child.mass) / (r * r));
        child.applyForce(f);
    };
};





