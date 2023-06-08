/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Samuel Hoyos                                   *
 * *          Esteban Marulanda                              *
 * *          Carlos Granada                                 *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let s = 0;
let = m = 1;
let q = 1;
let t = 0;
let dt = 1 / 300;
var img;
let posvstiemp1 = [];
let posvstiemp2 = [];
let posvstiemp3 = [];
let contador1 = 0;
let contador2 = 0;
let contador3 = 0;
let vx = 200;
let vy = 200;
let vz = 0;
let bx = 0;
let by = 10;
let bz = 0;
let ex = 0;
let ey = 0;
let ez = 0;

function preload() {
  if (q < 0) {
    img = loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/6/61/Electric_charge_symbol_negative.svg"
    );
  }
  if (q > 0) {
    img = loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/2/20/Electric_charge_symbol_positive.svg"
    );
  }
}
function setup() {
  //ventana

  canvas = createCanvas(windowWidth, windowHeight * 1.5);
  botonvelx = createButton("Vx");

  botonvelx.mousePressed(changevx);

  inputvel_x = createInput(str(vx));

  inputvel_x.size(120);

  botonvely = createButton("Vy");
  botonvely.mousePressed(changevy);

  inputvel_y = createInput(str(vy));

  botonvelz = createButton("Vz");
  botonvelz.mousePressed(changevz);

  inputvel_z = createInput(str(vz));

  botonbx = createButton("Bx");
  botonbx.mousePressed(changebx);

  inputB_x = createInput(str(bx));

  inputB_x.size(120);
  botonby = createButton("By");
  botonby.mousePressed(changeby);

  inputB_y = createInput(str(by));

  botonbz = createButton("Bz");
  botonbz.mousePressed(changebz);

  inputB_z = createInput(str(bz));

  botonex = createButton("Ex");
  botonex.mousePressed(changeex);

  inputE_x = createInput(str(ex));
  inputE_x.size(120);

  botoney = createButton("Ey");
  botoney.mousePressed(changeey);

  inputE_y = createInput(str(ey));

  botonez = createButton("Ez");
  botonez.mousePressed(changeez);
  inputE_z = createInput(str(ez));

  botonq = createButton("q");
  botonq.mousePressed(changeq);
  inputq = createInput(str(q));
  inputq.size(120);

  Enviar = createButton("Enter");
  Config_inicial = createButton("Configuración sugerida");
  Config_inicial.mouseClicked(Predeterminado);
  Enviar.mouseClicked(Initialize);

  var XY = createButton("Plano XY");
  var XZ = createButton("Plano XZ");
  var YZ = createButton("Plano YZ");
  XY.mouseClicked(SelectionXY);
  XZ.mouseClicked(SelectionXZ);
  YZ.mouseClicked(SelectionYZ);
  XY.position(width, 0);
  XZ.position(width, 40);
  YZ.position(width, 80);
  Carga = new Charge(10, createVector(0, 0, 0));
}

function Initialize() {
  r0 = createVector(0, 0, 0);
  s = 2; // por defecto;
  v0 = createVector(inputvel_x.value(), inputvel_y.value(), inputvel_z.value());
  E = createVector(inputE_x.value(), inputE_y.value(), inputE_z.value());
  B = createVector(inputB_x.value(), inputB_y.value(), inputB_z.value());
  if (B.y == 0 && B.x == 0 && B.z == 0) {
    B.y = 0.000001;
  }
  r0 = createVector(0, 0, 0);
  BB = sqrt(B.x * B.x + B.y * B.y + B.z * B.z);
  costheta = B.x / BB;
  sintheta = sqrt(1 - costheta * costheta);
  n2 = B.z / sqrt(B.y * B.y + B.z * B.z);
  n3 = -B.y / sqrt(B.y * B.y + B.z * B.z);
  v_123_0 = createVector(
    v0.x * costheta - v0.y * n3 * sintheta + v0.z * n2 * sintheta,
    v0.x * n3 * sintheta +
      v0.y * costheta +
      v0.y * n2 * n2 * (1 - costheta) +
      v0.z * n2 * n3 * (1 - costheta),
    -v0.x * n2 * sintheta +
      v0.y * n2 * n3 * (1 - costheta) +
      v0.z * costheta +
      v0.z * n3 * n3 * (1 - costheta)
  );
  E_123 = createVector(
    E.x * costheta - E.y * n3 * sintheta + E.z * n2 * sintheta,
    E.x * n3 * sintheta +
      E.y * costheta +
      E.y * n2 * n2 * (1 - costheta) +
      E.z * n2 * n3 * (1 - costheta),
    -E.x * n2 * sintheta +
      E.y * n2 * n3 * (1 - costheta) +
      E.z * costheta +
      E.z * n3 * n3 * (1 - costheta)
  );
}

function Predeterminado() {
  s = 2; // por defecto;

  r0 = createVector(0, 0, 0);
  v0 = createVector(200, 200, 0);
  E = createVector(0, 0, 0);
  B = createVector(0, 10, 0);
  r0 = createVector(0, 0, 0);
  BB = sqrt(B.x * B.x + B.y * B.y + B.z * B.z);
  costheta = B.x / BB;
  sintheta = sqrt(1 - costheta * costheta);
  n2 = B.z / sqrt(B.y * B.y + B.z * B.z);
  n3 = -B.y / sqrt(B.y * B.y + B.z * B.z);
  v_123_0 = createVector(
    v0.x * costheta - v0.y * n3 * sintheta + v0.z * n2 * sintheta,
    v0.x * n3 * sintheta +
      v0.y * costheta +
      v0.y * n2 * n2 * (1 - costheta) +
      v0.z * n2 * n3 * (1 - costheta),
    -v0.x * n2 * sintheta +
      v0.y * n2 * n3 * (1 - costheta) +
      v0.z * costheta +
      v0.z * n3 * n3 * (1 - costheta)
  );
  E_123 = createVector(
    E.x * costheta - E.y * n3 * sintheta + E.z * n2 * sintheta,
    E.x * n3 * sintheta +
      E.y * costheta +
      E.y * n2 * n2 * (1 - costheta) +
      E.z * n2 * n3 * (1 - costheta),
    -E.x * n2 * sintheta +
      E.y * n2 * n3 * (1 - costheta) +
      E.z * costheta +
      E.z * n3 * n3 * (1 - costheta)
  );
}
function SelectionXY() {
  s = 1;
  borrar();
  setup();
}

function SelectionXZ() {
  s = 2;
  borrar();
  setup();
}

function SelectionYZ() {
  s = 3;
  borrar();
  setup();
}

function borrar() {
  botonvelx.remove();
  botonvely.remove();
  botonvelz.remove();

  botonbx.remove();
  botonby.remove();
  botonbz.remove();
  botonex.remove();
  botoney.remove();
  botonez.remove();
  botonq.remove();

  inputvel_x.remove();
  inputvel_y.remove();
  inputvel_z.remove();
  inputB_x.remove();
  inputB_y.remove();
  inputB_z.remove();
  inputE_x.remove();
  inputE_y.remove();
  inputE_z.remove();
  inputq.remove();
  Enviar.remove();
  Config_inicial.remove();
}
function changevx() {
  vx = int(inputvel_x.value());
  borrar();
  Initialize();
  setup();
}

function changevy() {
  vy = int(inputvel_y.value());
  borrar();
  Initialize();
  setup();
}

function changevz() {
  vz = int(inputvel_z.value());
  borrar();
  Initialize();
  setup();
}

function changebx() {
  bx = int(inputB_x.value());
  borrar();
  Initialize();
  setup();
}

function changeby() {
  by = int(inputB_y.value());
  borrar();
  Initialize();
  setup();
}

function changebz() {
  bz = int(inputB_z.value());
  borrar();
  Initialize();
  setup();
}

function changeex() {
  ex = int(inputE_x.value());
  borrar();
  Initialize();
  setup();
}

function changeey() {
  ez = int(inputE_y.value());
  borrar();
  Initialize();
  setup();
}

function changeez() {
  ez = int(inputE_z.value());
  borrar();
  Initialize();
  setup();
}

function changeq() {
  q = int(inputq.value());
  borrar();
  Initialize();
  preload();
  setup();
}

function draw() {
  background(12, 142, 142);
  translate(width / 2, height * 0.6);
  //scale(1,-1);
  if (s == 1) {
    Carga.movimientoXY();
    posvstiemp1[contador1] = new GPoint(Carga.pos.z, Carga.pos.x);

    plot1 = new GPlot(this); // Creamos la grafica
    plot1.setPos(-300, -430); // Posicion de la grafica
    plot1.setOuterDim(width / 40, height / 40); // Dimension de la grafica

    plot1.setTitleText("Plano XY");

    // Add the points
    plot1.setPoints(posvstiemp1); // Puntos a graficar

    plot1.getXAxis().setAxisLabelText("Y");
    plot1.getYAxis().setAxisLabelText("X");
    plot1.defaultDraw();
    contador1 = contador1 + 1;
  }
  if (s == 2) {
    Carga.movimientoXZ();
    posvstiemp2[contador2] = new GPoint(Carga.pos.y, Carga.pos.x);

    plot2 = new GPlot(this); // Creamos la grafica
    plot2.setPos(-300, -430); // Posicion de la grafica
    plot2.setOuterDim(width / 40, height / 40); // Dimension de la grafica

    plot2.setTitleText("Plano XZ");

    // Add the points
    plot2.setPoints(posvstiemp2); // Puntos a graficar

    plot2.getXAxis().setAxisLabelText("Y");
    plot2.getYAxis().setAxisLabelText("X");
    plot2.defaultDraw();
    contador2 = contador2 + 1;
  }
  if (s == 3) {
    Carga.movimientoYZ();

    posvstiemp3[contador3] = new GPoint(Carga.pos.y, Carga.pos.z);

    plot3 = new GPlot(this); // Creamos la grafica
    plot3.setPos(-300, -430); // Posicion de la grafica
    plot3.setOuterDim(width / 40, height / 40); // Dimension de la grafica

    plot3.setTitleText("Plano YZ");

    // Add the points
    plot3.setPoints(posvstiemp3); // Puntos a graficar

    plot3.getXAxis().setAxisLabelText("Y");
    plot3.getYAxis().setAxisLabelText("Z");
    plot3.defaultDraw();
    contador3 = contador3 + 1;
  }
  Carga.mostrar();
}

let Charge = function (_rad, _pos) {
  this.rad = _rad;
  this.pos = _pos;
  this.trayectoria = [];

  this.mostrar = function () {
    noStroke();
    fill(40);
    image(img, this.pos.x, this.pos.y, 20, 20);
    imageMode(CENTER);
    //ellipse(this.pos.x,this.pos.y,this.rad,this.rad);

    stroke(40);
    strokeWeight(3);
    for (let i = 0; i < this.trayectoria.length - 2; i++) {
      line(
        this.trayectoria[i].x,
        this.trayectoria[i].y,
        this.trayectoria[i + 1].x,
        this.trayectoria[i + 1].y
      );
    }
  };

  this.movimientoXY = function () {
    r_123 = createVector(
      r0.x + v_123_0.x * t + (q / (2 * m)) * E_123.x * t * t,
      r0.y +
        (E_123.y / BB) * t -
        (m / (q * BB)) * (E_123.y / BB + v_123_0.z) * cos((q / m) * BB * t) +
        (m / (q * BB)) * (v_123_0.z - E_123.y / BB) +
        (m / (q * BB)) * (v_123_0.y - E_123.z / BB) * sin((q / m) * BB * t),
      r0.z -
        (E_123.y / BB) * t +
        (m / (q * BB)) * (v_123_0.z + E_123.y / BB) * sin((q / m) * BB * t) -
        (m / (q * BB)) * (v_123_0.y - E_123.z / BB) +
        (m / (q * BB)) * (v_123_0.y - E_123.z / BB) * cos((q / m) * BB * t)
    );
    r = createVector(
      r_123.x * costheta - r_123.y * n3 * sintheta + r_123.z * n2 * sintheta,
      r_123.x * n3 * sintheta +
        r_123.y * costheta +
        r_123.y * n2 * n2 * (1 - costheta) +
        r_123.z * n2 * n3 * (1 - costheta),
      -r_123.x * n2 * sintheta +
        r_123.y * n2 * n3 * (1 - costheta) +
        r_123.z * costheta +
        r_123.z * n3 * n3 * (1 - costheta)
    );
    this.pos.x = r.x;
    this.pos.y = r.y;
    this.trayectoria.push(this.pos.copy());
    if (this.trayectoria.length > 200) {
      this.trayectoria.splice(0, 1);
    }
    t += dt;
  };

  this.movimientoXZ = function () {
    r_123 = createVector(
      r0.x + v_123_0.x * t + (q / (2 * m)) * E_123.x * t * t,
      r0.y +
        (E_123.y / BB) * t -
        (m / (q * BB)) * (E_123.y / BB + v_123_0.z) * cos((q / m) * BB * t) +
        (m / (q * BB)) * (v_123_0.z - E_123.y / BB) +
        (m / (q * BB)) * (v_123_0.y - E_123.z / BB) * sin((q / m) * BB * t),
      r0.z -
        (E_123.y / BB) * t +
        (m / (q * BB)) * (v_123_0.z + E_123.y / BB) * sin((q / m) * BB * t) -
        (m / (q * BB)) * (v_123_0.y - E_123.z / BB) +
        (m / (q * BB)) * (v_123_0.y - E_123.z / BB) * cos((q / m) * BB * t)
    );
    r = createVector(
      r_123.x * costheta - r_123.y * n3 * sintheta + r_123.z * n2 * sintheta,
      r_123.x * n3 * sintheta +
        r_123.y * costheta +
        r_123.y * n2 * n2 * (1 - costheta) +
        r_123.z * n2 * n3 * (1 - costheta),
      -r_123.x * n2 * sintheta +
        r_123.y * n2 * n3 * (1 - costheta) +
        r_123.z * costheta +
        r_123.z * n3 * n3 * (1 - costheta)
    );
    this.pos.x = r.x;
    this.pos.y = r.z;
    this.trayectoria.push(this.pos.copy());
    if (this.trayectoria.length > 200) {
      this.trayectoria.splice(0, 1);
    }
    t += dt;
  };

  this.movimientoYZ = function () {
    r_123 = createVector(
      r0.x + v_123_0.x * t + (q / (2 * m)) * E_123.x * t * t,
      r0.y +
        (E_123.y / BB) * t -
        (m / (q * BB)) * (E_123.y / BB + v_123_0.z) * cos((q / m) * BB * t) +
        (m / (q * BB)) * (v_123_0.z - E_123.y / BB) +
        (m / (q * BB)) * (v_123_0.y - E_123.z / BB) * sin((q / m) * BB * t),
      r0.z -
        (E_123.y / BB) * t +
        (m / (q * BB)) * (v_123_0.z + E_123.y / BB) * sin((q / m) * BB * t) -
        (m / (q * BB)) * (v_123_0.y - E_123.z / BB) +
        (m / (q * BB)) * (v_123_0.y - E_123.z / BB) * cos((q / m) * BB * t)
    );
    r = createVector(
      r_123.x * costheta - r_123.y * n3 * sintheta + r_123.z * n2 * sintheta,
      r_123.x * n3 * sintheta +
        r_123.y * costheta +
        r_123.y * n2 * n2 * (1 - costheta) +
        r_123.z * n2 * n3 * (1 - costheta),
      -r_123.x * n2 * sintheta +
        r_123.y * n2 * n3 * (1 - costheta) +
        r_123.z * costheta +
        r_123.z * n3 * n3 * (1 - costheta)
    );
    this.pos.x = r.y;
    this.pos.y = r.z;
    this.trayectoria.push(this.pos.copy());
    if (this.trayectoria.length > 200) {
      this.trayectoria.splice(0, 1);
    }
    t += dt;
  };
};
