/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Author: Fabian Castaño                                  *
 * * Institution: University of Antioquia                    *
 * * Course: Laboratorio avanzado 3                          *
 * ***********************************************************/

var locs = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  var res = 20;
  var countX = ceil(width / res) + 1;
  var countY = ceil(height / res) + 1;

  for (var j = 0; j < countY; j++) {
    for (var i = 0; i < countX; i++) {
      locs.push(new p5.Vector(res * i, res * j));
    }
  };

  noFill();
  stroke(50);
}

function draw() {
  background(150);
  for (var i = locs.length - 1; i >= 0; i--) {
    var h = calcVec(locs[i].x - mouseX, locs[i].y - mouseY);
    push();
    translate(locs[i].x, locs[i].y);
    rotate(h.heading());
    line(0, 0, 0, - 15);
    pop();
  };
}

function calcVec(x, y) {
  return new p5.Vector(y - x, - x - y);
}