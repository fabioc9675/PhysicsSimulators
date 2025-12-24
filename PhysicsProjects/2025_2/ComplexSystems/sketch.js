/*************************************************************
 ******** Simulación interactiva del atractor de Rössler — mapa de bifurcación — coeficientes de Lyapunov **********************
 *************************************************************
 ** Autor: Sara Alejandra Carvajal Ramírez                                
 ** Ana María Arcila                                                    
 ** Institución: Universidad de Antioquia                             
 ** Curso: Laboratorio avanzado 3  2025-1                        
 *************************************************************/

//Definimos las variables del sistema (estado inicial)
let x = 0.1, y = 0, z = 0;

// Parámetros base del modelo de Rössler 
let a = 0.2, b = 0.2, c = 5.7;

let ultimoC = c; 
// Escala gráfica en la proyección del atractor
let escala = 20;

let inputA, inputB, inputC;
let buttonApply, buttonPause, buttonReset, buttonSave;

let paused = false;
let datos = [];
let anchoSimu = 570, anchoMapa = 400;

let saveButton;

//En estos se almacenan todo lo que irá al CSV
let dataCSV = [];
let mapaCalculado = false;
let mapaBuffer;

function setup() {
  createCanvas(anchoSimu + anchoMapa, 550);
  background(0);
  frameRate(60);
  colorMode(HSB, 360, 100, 100, 100);
  textFont("monospace");
  createInterface();
  
  saveButton = createButton("Guardar CSV");
  saveButton.position(600, height + 10);
  saveButton.mousePressed(guardarCSV);

  // Buffer donde se dibuja el mapa una sola vez
  mapaBuffer = createGraphics(anchoMapa, height);
  mapaBuffer.colorMode(HSB, 360, 100, 100, 100);
  mapaBuffer.textFont("monospace");

  //El botón de guardado exporta todos los datos generados

}

function draw() {

  if (!paused) {
    push();
    translate(anchoSimu / 2, height / 2);
    scale(escala, -escala);

    //Modulación suave de parámetros para marcar la trayectoria
    let aD = a + 0.02 * sin(frameCount * 0.002);
    let cD = c + 0.05 * cos(frameCount * 0.001);

    /*Los pasos de la simulación se modifican aquí*/
    for (let i = 0; i < 4; i++) {
      let dt = 0.02;

      //Campo vectorial del atractor de Rössler
      let dx = -y - z;
      let dy = x + aD * y;
      let dz = b + z * (x - cD);

      //Integración tipo Euler explícito
      x += dt * dx;
      y += dt * dy;
      z += dt * dz;

      //Aqui se pueden modificar los colores de la trayectoria
      let hue = (map(z, 10, 100, 400, 600) + frameCount * 0.3) % 360;

      stroke(hue, 100, 80, 100);
      strokeWeight(0.16);
      noFill();
      point(x, y);

      //Cálculo local de Lyapunov para el estado actual
      let lyap = calcularLyapunov(aD, b, cD);

      //Se guarda en la estructura principal
      datos.push({x, y, z, a: aD, b, c: cD, lyap});

      //Se guarda un registro detallado para el CSV (cada frame integrado)
      dataCSV.push([frameCount, aD, b, cD, x, y, z, lyap]);
    }

    pop();
  }

  drawAxes();  
  drawParameterBox(calcularLyapunov(a, b, c));
  drawBifurcationMap();  // ← este ya no recalcula nunca más
}

function drawAxes() {
  push();
  translate(anchoSimu / 2, height / 2);

  //Ejes cartesianos de referencia
  stroke(255);
  line(-anchoSimu/2+25, 0, anchoSimu/2-25, 0);
  line(0, -height/2+25, 0, height/2-25);

  textSize(9);
  textAlign(CENTER, CENTER);

  //Estética: Marcadores regulares de los ejes principales
  for (let i = -24; i <= 24; i += 1) {
    let px = (i / 2) * escala;
    let py = -(i / 2) * escala;

    stroke(255, 120);
    line(px, -2, px, 2);
    line(-2, py, 2, py);

    noStroke();
    if (i !== 0 && i % 2 === 0) {
      fill(255);
      text(i, px, 18);
      text(i, -22, py);
    }
  }

  fill(255);
  text("x", anchoSimu/2 - 35, 15);
  text("y", 15, -height/2 + 35);
  pop();
}

/* Cuadro de información - Parámetros, exponentes y régimen*/
function drawParameterBox(lyap) {
  push();
  fill(255, 150);
  stroke(255, 100);
  rect(10, 10, 210, 120, 6);
  noStroke();
  fill(0);

  textSize(13);

  text(`a = ${a.toFixed(3)}`, 20, 30);
  text(`b = ${b.toFixed(3)}`, 20, 50);
  text(`c = ${c.toFixed(3)}`, 20, 70);

  // Se incluyen rangos teóricos sugeridos para estudiar el sistema
  textSize(11);
  fill(40);
  text("0.0 ≤ a ≤ 0.5", 110, 30);
  text("0.0 ≤ b ≤ 1.0", 110, 50);
  text("3.0 ≤ c ≤ 15.0", 110, 70);

  // Semáforo dinámico según signo del Lyapunov
  let col, reg;
  if (lyap > 0.02) { col = color(0,200,200); reg = "Caótico"; }
  else if (lyap > -0.02) { col = color(100,200,100); reg = "Transición"; }
  else { col = color(200,100,100); reg = "Estable"; }

  fill(col);
  textSize(13);
  text(`λ₁ ≈ ${lyap.toFixed(3)}`, 20, 95);
  text(`Régimen: ${reg}`, 20, 112);

  pop();
}

/*Mostrar el diagrama de bifurcaciones*/
function drawBifurcationMap() {

  //Alerta para evitar BUGS: Si C cambió desde la última vez regenerar mapa una sola vez -> Esto ya se implementa
  if (c !== ultimoC) {
    mapaCalculado = false;
    ultimoC = c;
  }

  if (!mapaCalculado) {
    generarMapaEnBuffer();
    mapaCalculado = true;
  }

  //Dibujar el buffer precomputado
  image(mapaBuffer, anchoSimu, 0);
}
/*Función que restringe la generación del mapa a una sola vez por ejecución para evitar lags*/
function generarMapaEnBuffer() {

  let pg = mapaBuffer;

  pg.background(0);
  pg.textFont("monospace");

  pg.push();
  pg.translate(0, 20);

  pg.textSize(14);
  pg.fill(255);
  pg.text("Mapa de bifurcación (c)", 110, 0);

  let cMin = 3, cMax = 15;
  let pasos = 300;

  let margenSup = 30, margenInf = 70, margenIzq = 50, margenDer = 30;
  let anchoGraf = anchoMapa - margenIzq - margenDer;
  let altoMapa = height - margenSup - margenInf - 30;

  //Marco del gráfico de Bifurcación
  pg.stroke(180);
  pg.noFill();
  pg.rect(margenIzq, margenSup - 10, anchoGraf, altoMapa + 33);

  pg.fill(255);
  pg.textSize(12);
  pg.textAlign(CENTER, CENTER);

  pg.text("c", margenIzq + anchoGraf / 2, margenSup + altoMapa + 35);

  // Estética: Etiqueta del eje vertical
  pg.push();
  pg.translate(margenIzq - 30, margenSup + altoMapa / 2);
  pg.rotate(-HALF_PI);
  pg.text("x", 0, 0);
  pg.pop();

  // Estética: Marcas horizontales
  for (let cTick = 3; cTick <= 15; cTick += 1) {
    let px = map(cTick, cMin, cMax, margenIzq, margenIzq + anchoGraf );
    pg.stroke(180);
    pg.line(px, margenSup + altoMapa +23, px, margenSup + altoMapa + 10);
    pg.noStroke();
    pg.text(cTick.toFixed(0), px, margenSup + altoMapa +40);
  }

  // Estética: Marcas verticales
  for (let xTick = -30; xTick <= 30; xTick += 10) {
    let py = map(xTick, -30, 30, margenSup + altoMapa, margenSup);
    pg.stroke(180);
    pg.line(margenIzq - 3, py, margenIzq - 8, py);
    pg.noStroke();
    pg.text(xTick, margenIzq - 20, py);
  }

  /*Se grafica el mapa de bifurcación y cargan los datos al CSV*/
  for (let i = 0; i < pasos; i++) {
    let cVal = map(i, 0, pasos, cMin, cMax);

    let xx = 0.1, yy = 0, zz = 0;

    let ly = calcularLyapunov(a, b, cVal);
    let col;
    if (ly > 0.02) col = pg.color(0,200,200);
    else if (ly > -0.02) col = pg.color(100,200,100);
    else col = pg.color(200,100,100);

    pg.stroke(col);

    for (let k = 0; k < 3000; k++) {
      let dt = 0.02;
      let dx = -yy - zz;
      let dy = xx + a * yy;
      let dz = b + zz * (xx - cVal);

      xx += dt * dx;
      yy += dt * dy;
      zz += dt * dz;

      if (k > 1500 && k % 5 === 0) {
        let px = map(cVal, cMin, cMax, margenIzq, margenIzq + anchoGraf);
        let py = map(xx, -30, 30, margenSup + altoMapa, margenSup);

        pg.point(px, py);

        //Registramos los datos 
        dataCSV.push([cVal, xx, yy, zz, ly]);
      }
    }
  }

  pg.pop();
}


/* Se crea el entorno sobre el cuál se puede interactuar con la simulación*/
function createInterface() {

  // Cada elemento se acomoda bajo el frame
  let yPos = height + 10;

  createSpan("a = ").position(20, yPos).style("color", "black");
  inputA = createInput(a.toString()).position(45, yPos).size(50);

  createSpan("b = ").position(120, yPos).style("color", "black");
  inputB = createInput(b.toString()).position(145, yPos).size(50);

  createSpan("c = ").position(220, yPos).style("color", "black");
  inputC = createInput(c.toString()).position(245, yPos).size(50);

  // Botones de control principal
  buttonApply = createButton("Ejecutar").position(320, yPos)
    .mousePressed(applyParameters);

  buttonPause = createButton("Pausar / Reanudar").position(400, yPos)
    .mousePressed(() => paused = !paused);

  buttonReset = createButton("Reiniciar").position(530, yPos)
    .mousePressed(() => {
      // El botón reinicia la simulación al estado por defecto
      x = 0.1; y = 0; z = 0;
      datos = [];
      dataCSV = [];
      background(0);
    });
}

/* Aplicación de parámetros ingresados por el usuario*/
function applyParameters() {
  let na = parseFloat(inputA.value());
  let nb = parseFloat(inputB.value());
  let nc = parseFloat(inputC.value());


  if (!isNaN(na) && !isNaN(nb) && !isNaN(nc)) {
    a = na; b = nb; c = nc;

    x = 0.1; y = 0; z = 0;
    datos = [];
    dataCSV = [];
    background(0);
    mapaCalculado = false;

  }
}

/* Exponente de Lyapunov máximo*/
function calcularLyapunov(a, b, c) {
  let xL = 0.1, yL = 0, zL = 0;
  let v = [1, 0, 0];    // dirección inicial del vector tangente
  let sum = 0;
  let dt = 0.02;

  for (let i = 0; i < 2000; i++) {

    // Definir el jacobiano del sistema en el punto actual
    let J = [
      [0, -1, -1],
      [1, a, 0],
      [zL, 0, xL - c]
    ];

    //Avance del sistema - Evolución
    let dx = -yL - zL;
    let dy = xL + a * yL;
    let dz = b + zL * (xL - c);

    xL += dt * dx;
    yL += dt * dy;
    zL += dt * dz;

    // Avance del vector tangente
    let vx = J[0][0]*v[0] + J[0][1]*v[1] + J[0][2]*v[2];
    let vy = J[1][0]*v[0] + J[1][1]*v[1] + J[1][2]*v[2];
    let vz = J[2][0]*v[0] + J[2][1]*v[1] + J[2][2]*v[2];

    //Aplicar renormalización al sistema 
    let norm = Math.sqrt(vx*vx + vy*vy + vz*vz);
    if (norm > 0) {
      sum += Math.log(norm);
      v = [vx/norm, vy/norm, vz/norm];
    }
  }

  return sum / 2000;
}
/* Se exportan los datos en formato CSV */
function guardarCSV() {
  console.log("↪ Ejecutando guardarCSV(), dataCSV:", dataCSV.length);
  if (dataCSV.length === 0) {
    console.log("No hay datos para guardar");
    return;
  }

  let filas = [];
  filas.push("id,a,b,c,x,y,z,lyap");

  let id = 0;

  dataCSV.forEach(row => {

    //Simulación principal
    if (row.length === 8) {
      filas.push([
        id,        // id
        row[1],    // a
        row[2],    // b
        row[3],    // c
        row[4],    // x
        row[5],    // y
        row[6],    // z
        row[7]     // lyap
      ].join(","));
    }

    //Mapa de bifurcación
    else if (row.length === 5) {
      filas.push([
        id,
        "",
        "",
        row[0],   //cVal
        row[1],   //x
        row[2],   //y
        row[3],   //z
        row[4]    //lyap
      ].join(","));
    }

    id++;
  });

  //Esta línea sí descarga los datos a csv 
  saveStrings(filas, "datos.csv");
}