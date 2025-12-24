/*************************************************************
 ******** Rueda de Maxwell con fricción del aire (dinámica real) **********************
 *************************************************************
 ** Autor: Jeronimo Lopez Gomez                                                                       **
 **        Crismer Figueroa Velez                                                                           **
 **        Valentina Lobo Ruiz                                                                          **
 ** Institución: Universidad de Antioquia                                **
 ** Curso: Laboratorio avanzado 3  2025-1                            **
 *************************************************************/

//(Sliders)
let slider_m; //masa
let slider_R; //radio
let slider_r; //radio eje
let slider_l; //longitud_cuerda
let slider_g; //acel. gravitacional
let slider_omega; //velocidad angular
let slider_t_scale; //velocidad de la simulacion
let slider_Cd; //Coeff Fricción

//Buttons
let btnStart, btnStop, btnRestart;
let act_eje_check;
let friction_check;

let infoButton;
let instButton;
let showInfo = false;
let showInstruc = false;
let instructionScroll = 0;

//Images
let img_spinner;
let bg;
let support;

//---- Inicializacion de Parámetros ----
let m = 0.5; // Masa del Disco (kg)
let g = 9.81; // gravedad (m/s^2)
let y = 0; // posición actual (m)
let v = 0; // velocidad (m/s)
let y_max = 1.2; // longitud de la cuerda (m)
let scalePx = 300; // escala px/m
let R = 20; //radio del disco (m)
let r = 0.3; //radio del eje (m)
let I = 0.5 * m * R * R; //Momento de Inercia del Disco
let angle = 0; // ángulo de rotación (rad)
let omega = 10; // velocidad angular (rad/s)

//---- Parametros de Fricción Viscosa (Aire) ----
let rho = 1.2; //Densidad del Aire
let Cd = 0.47; //Coeficiente de Friccion
let A = Math.PI * R * R; //Area del Disco

// --- Fricción en el Eje (Torque constante) ---
const tau_f = 0.15; // Torque de fricción constante en el eje (N·m)
let F_axle_eq;

const V_STOP_THRESH = 0.01; // umbral para considerar detenido (m/s)
const MAX_V = 200; // seguridad numérica (m/s)

//---- Etapa del Movimiento ----
let phase = "falling"; // falling, bottom,  rising, repeat

// ---- Energías ----
let E_pot = 0;
let E_cin_trans = 0;
let E_cin_rot = 0;
let E_total = 0;
//-------------------

// --- GRAFICA DE ENERGÍA ---

let maxPoints = 300;
let timeHistory = [];
let EPhistory = [];
let EChistory = [];
let ETThistory = [];
let t = 0;

let time = 0;

let playing = false;

//---- Carga de Imagenes ----
function preload() {
  img_spinner = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_2/MaxwellWheel/assets/spinner.png"
  );
  img_bg = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_2/MaxwellWheel/assets/bg.jpg"
  );
  img_supp = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_2/MaxwellWheel/assets/support.png"
  );
}
//----------------------------------------

//---- Fuerza de Amortiguamiento ----
function dragForce(v) {
  return 0.5 * rho * Cd * A * v * Math.abs(v) + F_axle_eq;
}
//----------------------------------------

//----------------------------------------
function setup() {
  createCanvas(1500, 600);
  //createCanvas(700, 1000);

  infoButton = createButton("Contexto del Experimento");
  infoButton.position(500, 555);
  infoButton.mousePressed(() => {
    showInfo = !showInfo;
  });

  instButton = createButton("Instructivo de Uso");
  instButton.position(700, 555);
  instButton.mousePressed(() => {
    showInstruc = !showInstruc;
  });

  //Inicializacion Sliders
  slider_m = createSlider(0.1, 5, 1, 0.1);
  slider_m.position(20, 80);
  slider_m.addClass("sliders");
  slider_R = createSlider(1, 50, 20, 0.5);
  slider_R.position(20, 120);
  slider_R.addClass("sliders");
  slider_l = createSlider(0.1, 3, 1, 0.1);
  slider_l.position(20, 160);
  slider_l.addClass("sliders");
  slider_g = createSlider(0, 20, 9.81, 0.1);
  slider_g.position(20, 200);
  slider_g.addClass("sliders");
  slider_r = createSlider(0, 1, 0.1, 0.01);
  slider_r.position(20, 240);
  slider_r.addClass("sliders");
  slider_t_scale = createSlider(0.1, 4, 1, 0.1);
  slider_t_scale.position(20, 280);
  slider_t_scale.addClass("sliders");
  slider_Cd = createSlider(0.0, 2, 0.47, 0.1);
  slider_Cd.position(20, 320);
  slider_Cd.addClass("sliders");

  //Creacion Botones de Control
  btnStart = createButton("Start");
  btnStart.addClass("ctrlBtn");
  btnStart.position(15, 340);
  btnStart.mousePressed(() => (playing = true));

  act_eje_check = createCheckbox("Quitar Eje Interior (r)", false);
  act_eje_check.position(500, 490);
  act_eje_check.style("color", "white");
  act_eje_check.style("font-family", "Arial, sans-serif"); // o la que prefieras
  act_eje_check.style("font-size", "14px");

  friction_check = createCheckbox("Friccion del Eje", false);
  friction_check.position(500, 515);
  friction_check.style("color", "white");
  friction_check.style("font-family", "Arial, sans-serif"); // o la que prefieras
  friction_check.style("font-size", "14px");

  btnStop = createButton("Stop");
  btnStop.addClass("ctrlBtn");
  btnStop.position(85, 340);
  btnStop.mousePressed(() => (playing = false));

  btnRestart = createButton("Restart");
  btnRestart.addClass("ctrlBtn");
  btnRestart.position(42, 375);
  btnRestart.mousePressed(resetSim);

  resetSim();
}
//----------------------------------------

//---- Reset del Sistema ----
function resetSim() {
  //Parametros iniciales
  y = 0;
  v = 0;
  angle = 0;
  omega = 0;
  phase = "falling";
  time = 0;
  playing = false; //se reinicia pausado

  // Reiniciar historiales de energía
  timeHistory = [];
  EPhistory = [];
  EChistory = [];
  ETThistory = [];
}
//----------------------------------------

//---- Actualización Grafica del Canvas ----
function draw() {
  //tint(50, 255);
  image(img_bg, 0, 0, width, height);
  //noTint();

  image(img_supp, 183, 5, img_supp.width * 0.5, img_supp.height * 0.5);

  //Contenedor Sliders
  push();
  noStroke();
  fill(255, 255, 255, 30);
  rect(10, 50, 160, 370, 15);
  pop();

  //Asignacion de Sliders
  g = slider_g.value();
  y_max = slider_l.value();
  r = slider_r.value();
  R = slider_R.value();
  m = slider_m.value();
  Cd = slider_Cd.value();
  //I         = 0.5 * slider_m.value() * slider_R.value() * slider_R.value();
  A = Math.PI * slider_R.value() * slider_R.value();

  if (act_eje_check.checked()) {
    I = 0;
  } else {
    I = 0.5 * slider_m.value() * slider_R.value() * slider_R.value();
  }

  if (friction_check.checked()) {
    F_axle_eq = tau_f / r;
  } else {
    F_axle_eq = 0;
  }

  // Conversión a píxeles
  let anchorX = width / 2;
  let anchorY = 60;
  let yPx = anchorY + y * scalePx;

  // DIBUJO
  drawScene(anchorX, anchorY, yPx, R);

  if (playing) {
    simulate((deltaTime / 300) * slider_t_scale.value()); // paso de tiempo
  }

  if (!showInfo & !showInstruc) {
    drawEnergyGraph(500, 50, 600, 420);
    drawEnergyBars(1110, 50, 200, 420);
    //drawUI();
  }
}

//---- Dinamica del Movimiento ----
function simulate(dt) {
  time += dt;

  const sub = 10;
  const dt_sub = dt / sub;

  for (let i = 0; i < sub; i++) {
    // calcular aceleración (fuerza neta hacia abajo positiva)
    const Fd = dragForce(v); // signado: opposes v
    const a = (m * g - Fd) / (m + I / (r * r));

    v += a * dt_sub;

    //No exceder el valor v_max
    if (Math.abs(v) > MAX_V) v = Math.sign(v) * MAX_V;
    //Seguridad Numerica garantizando solucion finita en cada iteracion
    if (!isFinite(v)) v = 0;

    //---- Trayectoria y Rotacion ----
    y += v * dt_sub;

    if (act_eje_check.checked()) {
      omega = 0;
    } else {
      omega = v / r;
    }
    angle += omega * dt_sub;
    //--------------------------------

    if (y >= y_max) {
      y = y_max;
      v = -(((m * g - Fd) / (m * g + Fd)) ** 0.5) * v;
    }

    if (y <= 0) {
      y = 0;
    }
  }

  //---- Energia ----
  E_pot = m * g * (y_max - y);
  E_cin_trans = 0.5 * m * v * v;
  E_cin_rot = 0.5 * I * omega * omega;
  E_total = E_pot + E_cin_trans + E_cin_rot;

  timeHistory.push(time);
  EPhistory.push(E_pot);
  EChistory.push(E_cin_trans + E_cin_rot);
  ETThistory.push(E_total);

  // Limitar historial a 600 puntos
  if (timeHistory.length > 1000) {
    timeHistory.shift();
    EPhistory.shift();
    EChistory.shift();
    ETThistory.shift();
  }
}

function drawEnergyGraph(x, y, w, h) {
  push();
  translate(x, y);

  // --- Fondo ---
  fill(20);
  noStroke();
  rect(0, 0, w, h);

  // Márgenes internos
  let left = 55;
  let right = 10;
  let top = 25;
  let bottom = 40;

  let plotW = w - left - right;
  let plotH = h - top - bottom;

  // --- Encontrar máximos ---
  let maxEP = max(EPhistory);
  let maxEC = max(EChistory);
  let maxETT = max(ETThistory);
  let maxVal = max(maxEP, maxEC, maxETT, 0.01) + 2;

  // --- Grid ---
  stroke(80);
  strokeWeight(1);

  // Grid horizontal + etiquetas de energía
  fill(230);
  textSize(10);
  textAlign(RIGHT, CENTER);

  for (let i = 0; i <= 5; i++) {
    let gy = top + (plotH / 5) * i;
    let energyLabel = nf(map(5 - i, 0, 5, 0, maxVal), 1, 2);
    line(left, gy, left + plotW, gy);
    text(energyLabel, left - 5, gy);
  }

  // Grid vertical + etiquetas de tiempo
  textAlign(CENTER, TOP);
  for (let i = 0; i <= 5; i++) {
    let gx = left + (plotW / 5) * i;
    let tLabel = nf(map(i, 0, 5, timeHistory[0], timeHistory.at(-1)), 1, 2);
    line(gx, top, gx, top + plotH);
    text(tLabel, gx, top + plotH + 5);
  }

  // --- Ejes ---
  stroke(200);
  strokeWeight(2);
  line(left, top, left, top + plotH); // eje Y
  line(left, top + plotH, left + plotW, top + plotH); // eje X

  // --- Etiquetas de ejes ---
  fill(255);
  noStroke();
  textSize(13);
  textAlign(CENTER);

  // Label X
  text("Tiempo (s)", left + plotW / 2, top + plotH + 28);

  // Label Y rotado
  push();
  translate(left - 40, top + plotH / 2);
  rotate(-HALF_PI);
  text("Energía (J)", 0, 0);
  pop();

  // --- Graficar Energía Potencial ---
  noFill();
  stroke(0, 150, 255); // azul
  strokeWeight(2);

  beginShape();
  for (let i = 0; i < EPhistory.length; i++) {
    let px = map(
      timeHistory[i],
      timeHistory[0],
      timeHistory.at(-1),
      left,
      left + plotW
    );
    let py = map(EPhistory[i], 0, maxVal, top + plotH, top);
    vertex(px, py);
  }
  endShape();

  // --- Graficar Energía Cinética ---
  stroke(255, 180, 0); // naranja
  strokeWeight(2);

  beginShape();
  for (let i = 0; i < EChistory.length; i++) {
    let px = map(
      timeHistory[i],
      timeHistory[0],
      timeHistory.at(-1),
      left,
      left + plotW
    );
    let py = map(EChistory[i], 0, maxVal, top + plotH, top);
    vertex(px, py);
  }
  endShape();

  // --- Graficar Energía Total ---
  stroke(255); // blanco
  strokeWeight(2);

  beginShape();
  for (let i = 0; i < ETThistory.length; i++) {
    let px = map(
      timeHistory[i],
      timeHistory[0],
      timeHistory.at(-1),
      left,
      left + plotW
    );
    let py = map(ETThistory[i], 0, maxVal, top + plotH, top);
    vertex(px, py);
  }
  endShape();

  // --- Leyenda científica ---
  textSize(12);
  fill(255);
  noStroke();
  textAlign(LEFT, CENTER);

  // Línea azul (EP)
  stroke(0, 150, 255);
  strokeWeight(3);
  line(left + 5, top + 10, left + 25, top + 10);
  noStroke();
  fill(255);
  text("Energía Potencial", left + 30, top + 10);

  // Línea naranja (EC)
  stroke(255, 180, 0);
  strokeWeight(3);
  line(left + 5, top + 28, left + 25, top + 28);
  noStroke();
  fill(255);
  text("Energía Cinética", left + 30, top + 28);

  // Línea blanca (E_total)
  stroke(255);
  strokeWeight(3);
  line(left + 5, top + 46, left + 25, top + 46);
  noStroke();
  fill(255);
  text("Energía Total", left + 30, top + 46);
  pop();
}

function drawEnergyBars(x, y, w, h) {
  push();
  translate(x, y);

  // Fondo
  fill(20);
  noStroke();
  rect(0, 0, w, h);

  // Calcular máximos para normalizar barras
  let maxVal = max(E_pot, E_cin_trans, E_cin_rot, E_total, 0.01);

  // Dimensiones de barras
  let barW = w / 4;
  let barSpacing = 5;

  // ---- BARRA EP ----
  let hEP = map(E_pot, 0, maxVal, 0, h - 40);
  fill(0, 150, 255);
  rect(barSpacing, h - hEP - 20, barW - barSpacing * 2, hEP);
  fill(255);
  textSize(12);
  textAlign(CENTER);
  text("E.P.", barW / 2, h - 5);

  // ---- BARRA EC TRANS ----
  let hECt = map(E_cin_trans, 0, maxVal, 0, h - 40);
  fill(255, 180, 0);
  rect(barW + barSpacing, h - hECt - 20, barW - barSpacing * 2, hECt);
  fill(255);
  text("E.C.T", barW * 1.5, h - 5);

  // ---- BARRA EC ROT ----
  let hECR = map(E_cin_rot, 0, maxVal, 0, h - 40);
  fill(255, 100, 0);
  rect(2 * barW + barSpacing, h - hECR - 20, barW - barSpacing * 2, hECR);
  fill(255);
  text("E.C.R", barW * 2.5, h - 5);

  // ---- BARRA E TOTAL ----
  let hETT = map(E_total, 0, maxVal, 0, h - 40);
  fill(255);
  rect(3 * barW + barSpacing, h - hETT - 20, barW - barSpacing * 2, hETT);
  fill(255);
  text("E. Total", barW * 3.5, h - 5);

  pop();
}

//---- Dibujo de la Escena y elementos graficos ----
function drawScene(ax, ay, yPx, R) {
  //Lineas de Referencia del Movimiento
  stroke(255, 120);
  strokeWeight(1.5);

  //Linea y=0
  line(ax - 500, ay, ax - 300, ay);

  //Linea y = y_max
  let limitYpx = ay + y_max * scalePx;
  line(ax - 500, limitYpx, ax - 300, limitYpx);

  noStroke();
  fill(255, 180);
  textSize(16);
  textAlign(CENTER);
  text("Inicio", ax - 470, ay + 20);
  text("Final", ax - 470, limitYpx - 10);

  // Punto fijo
  fill(240);
  circle(ax - 400, ay, 10);

  // Cuerda
  stroke(255);
  strokeWeight(3);
  line(ax - 400, ay, ax - 400, yPx);

  push();
  translate(ax - 400, yPx);
  rotate(angle);

  // cuerpo del disco
  stroke(255, 180);
  strokeWeight(2);
  fill(255);
  ellipse(0, 0, R * 2);
  imageMode(CENTER);
  image(img_spinner, 0, 0, R * 2, R * 2);
  pop();

  //marcador que rota alrededor del perímetro
  stroke(20);
  strokeWeight(4);

  // punto que se mueve por la circunferencia
  let px = R * cos(angle);
  let py = R * sin(angle);
  point(px, py);

  pop();

  // HUD
  fill(240);
  textSize(14);
  textAlign(LEFT);

  // Etiquetas encima de los sliders
  text(`masa = ${slider_m.value()} kg`, 20, 70);
  text(`Radio = ${slider_R.value()} m`, 20, 110);
  text(`Long. cuerda = ${slider_l.value()} m`, 20, 150);
  text(`g = ${slider_g.value()} m/s²`, 20, 190);
  text(`r. eje = ${slider_r.value()} m`, 20, 230);
  text(`T. scale =  x ${slider_t_scale.value()}`, 20, 270);
  text(`Coeff. Cd =  x ${slider_Cd.value()}`, 20, 310);

  // HUD inferior (sin cambios)
  text(`Tiempo (t)    = ${nf(time, 1, 2)} s`, 20, 440);
  text(`Pos. Vert (y) = ${nf(y, 1, 2)} m`, 20, 460);
  text(`Velocidad (v) = ${nf(v, 1, 2)} m/s`, 20, 480);
  text(`Vel. Ang. (ω) = ${nf(omega, 1, 2)} rad/s`, 20, 500);

  //Energias
  push();
  translate(1130, 480);
  rotate(HALF_PI / 2);
  text(`${nf(E_pot, 1, 2)}`, 0, 0);
  pop();

  push();
  translate(1180, 480);
  rotate(HALF_PI / 2);
  text(`${nf(E_cin_trans, 1, 4)}`, 0, 0);
  pop();

  push();
  translate(1230, 480);
  rotate(HALF_PI / 2);
  text(`${nf(E_cin_rot, 1, 2)}`, 0, 0);
  pop();

  push();
  translate(1280, 480);
  rotate(HALF_PI / 2);
  text(`${nf(E_cin_trans + E_cin_rot + E_pot, 1, 2)}`, 0, 0);
  pop();

  //Titulo
  push();
  textAlign(CENTER);
  textSize(20);
  fill(0, 150);
  text("Rueda de Maxwell - Conservación de la Energía", 235, 570);
  fill(255);
  text("Rueda de Maxwell - Conservación de la Energía", 235, 570);
  pop();

  //Texto Contextual
  function drawInfoPanel() {
    push();

    fill(20, 30, 55);
    noStroke();
    rect(700, 70, 460, 360);

    // Texto
    fill(255);
    textSize(16);
    textAlign(CENTER, TOP);

    text(
      "La Rueda de Maxwell es un sistema físico que consiste en " +
        "un disco pesado con un eje delgado alrededor del cual se " +
        "encuentra enrollada una cuerda, funcionando de manera " +
        "similar a un yoyó clásico. " +
        "Cuando el disco se libera desde el reposo, la gravedad " +
        "provoca su descenso mientras gira debido al torque " +
        "generado por la tensión de la cuerda sobre el eje. " +
        "Durante el desenrollado, la energía potencial " +
        "gravitacional se transforma parcialmente en energía " +
        "cinética traslacional y rotacional, produciendo un " +
        "movimiento más lento que el de una caída libre. " +
        "Al finalizar el desenrollado, el disco continúa girando " +
        "y la cuerda comienza a enrollarse en sentido contrario, " +
        "provocando el ascenso del sistema. " +
        "Este movimiento oscilatorio permite analizar la " +
        "conservación de la energía mecánica, el momento angular " +
        "y la dinámica de cuerpos rígidos bajo torque.",
      +720, // x (un poco dentro del rect)
      +90, // y
      +420, // ancho del texto (rect width - márgenes)
      +320 // alto del texto
    );

    pop();
  }

  function mouseWheel(event) {
    instructionScroll -= event.delta * 0.3; // velocidad del scroll

    // límites (ajusta según el largo del texto)
    instructionScroll = constrain(instructionScroll, -600, 0);

    return false; // evita scroll de la página
  }

  function drawInstruction() {
    fill(35, 40, 50);
    noStroke();
    rect(700, 70, 460, 360);

    fill(255);
    textSize(14);
    textAlign(LEFT, TOP);

    text(
      "La simulación de la Rueda de Maxwell permite explorar el movimiento de un sistema con traslación y rotación acopladas, así como analizar la conservación de la energía mecánica.\n\n" +
        "CONTROLES PRINCIPALES\n" +
        "Start: Inicia la simulación usando los parámetros actuales.\n" +
        "Stop: Pausa el movimiento del sistema.\n" +
        "Restart: Reinicia la simulación y las gráficas de energía.\n\n" +
        "Se recomienda ajustar los parámetros antes de presionar Start.\n\n" +
        "PARAMETROS AJUSTABLES\n" +
        "Masa del disco (kg): Controla la masa total del disco. Afecta la energía potencial y cinética, pero no modifica la forma del movimiento.\n\n" +
        "Radio del disco (m): Determina el tamaño del disco y su momento de inercia. Radios mayores producen un descenso más lento y oscilaciones más prolongadas.\n\n" +
        "Longitud de la cuerda (m): Define la distancia máxima de descenso. Aumentar este valor incrementa la energía potencial inicial.\n\n" +
        "Aceleración gravitacional (m/s^2): Permite simular diferentes entornos. Valores mayores producen movimientos más rápidos. Si g es cero, el sistema no se mueve.\n\n" +
        "Radio del eje (m): Controla el radio alrededor del cual se enrolla la cuerda. Radios pequeños generan mayor velocidad angular y un acoplamiento más fuerte entre traslación y rotación.\n\n" +
        "Escala de tiempo: Ajusta la velocidad visual de la simulación sin alterar la física del sistema.\n\n" +
        "Coeficiente de fricción del aire: Modela la resistencia del aire. Valores mayores producen amortiguamiento y una disminución progresiva de la energía total.\n\n" +
        "OPCIONES ESPECIALES\n" +
        "Quitar eje interior: Elimina el momento de inercia rotacional y aproxima el sistema a una caída libre. Es útil para comparar con la rueda de Maxwell real.\n\n" +
        "Fricción del eje: Activa un torque de fricción constante que disipa energía mecánica y reduce gradualmente la amplitud de las oscilaciones.\n\n" +
        "GRAFICAS DE ENERGIA\n" +
        "La gráfica temporal muestra la evolución de la energía potencial, la energía cinética total y la energía mecánica total. En ausencia de fricción, la energía total se conserva.\n\n" +
        "Las barras de energía representan el reparto energético instantáneo entre energía potencial, cinética traslacional, cinética rotacional y energía total.\n\n" +
        "INDICADORES EN PANTALLA\n" +
        "Se muestran el tiempo, la posición vertical, la velocidad lineal y la velocidad angular, permitiendo relacionar el movimiento con las gráficas de energía.\n\n" +
        "SUGERENCIAS DE EXPLORACION\n" +
        "Analiza qué ocurre al aumentar el radio del disco, eliminar el eje interior o introducir fricción. Observa qué tipo de energía domina en los extremos del movimiento.\n\n" +
        "NOTA SOBRE EL MODELO\n" +
        "Esta simulación utiliza un modelo idealizado. No se consideran efectos como elasticidad de la cuerda, vibraciones ni fricción no lineal, pero captura los aspectos esenciales de la dinámica de la Rueda de Maxwell.",
      720, // x (dentro del rect)
      90 + instructionScroll, // y
      420, // ancho del texto
      320 // alto del texto
    );
  }

  if (showInfo) {
    drawInfoPanel();
  }

  if (showInstruc) {
    drawInstruction();
  }
}
