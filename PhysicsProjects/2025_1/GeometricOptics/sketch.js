/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 ****** Simulador de óptica geométrica ***********
 * ***********************************************************
 * * Autores: Salome Osorio Muñoz
 * *          Melissa Estrada Murillo
 * * Institucion: Universidad de Antioquia
 * * Curso: Laboratorio avanzado 3 2025-1
 * ***********************************************************/

let f = 100; // distancia focal de la lente o espejo
let R = 2 * f; // radio de curvatura (usado para espejos esféricos)
let mirrorX; // posición horizontal del espejo
let lensX; // posición horizontal de la lente
let centerY; // centro vertical del lienzo (eje óptico)
let slider; // control deslizante para la posición del objeto
let heightSlider; // control deslizante para la altura del objeto
let tipoSelector; // menú para seleccionar el tipo de lente o espejo
let sistemaSelector; // menú para seleccionar el sistema óptico (lente o espejo)
let objectTypeSelector; // menú para seleccionar el tipo de objeto (flecha o imagen)
let focalSlider; // control deslizante para la distancia focal

// Colores para los rayos
let rayColors = ["#FF0000", "#00FF00", "#0000FF"]; // Rojo, Verde, Azul
let rayColor = "#1f77b4"; // color por defecto (para compatibilidad)

// Variables para la imagen de Hello Kitty
let kittyImg;
let kittyWidth = 40;
let kittyHeight = 60;

// Precargar la imagen de Hello Kitty
function preload() {
  kittyImg = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/GeometricOptics/assets/kitty.png"
  );
}

// Esta función inicializa el lienzo y todos los controles de interfaz:
function setup() {
  createCanvas(800, 500); // crea un lienzo de 800x500 píxeles (más alto para los controles)
  mirrorX = width * 0.35;
  lensX = width / 2;
  centerY = height / 2;

  let controlContainer = createDiv();
  controlContainer.style("display", "flex");
  controlContainer.style("justify-content", "center");
  controlContainer.style("gap", "20px");
  controlContainer.style("flex-wrap", "wrap");
  controlContainer.position(20, 10);
  controlContainer.style("width", "100%");

  // Slider de posición del objeto
  let sliderLabel = createDiv("Posición del objeto:");
  sliderLabel.style("font-size", "14px");
  sliderLabel.style("text-align", "center");
  slider = createSlider(50, 300, 150, 1);
  let sliderBox = createDiv();
  sliderBox.child(sliderLabel);
  sliderBox.child(slider);
  sliderBox.style("text-align", "center");
  controlContainer.child(sliderBox);

  // Slider de altura del objeto
  let heightLabel = createDiv("Altura del objeto:");
  heightLabel.style("font-size", "14px");
  heightLabel.style("text-align", "center");
  heightSlider = createSlider(20, 120, 60, 1);
  let heightBox = createDiv();
  heightBox.child(heightLabel);
  heightBox.child(heightSlider);
  heightBox.style("text-align", "center");
  controlContainer.child(heightBox);

  // Slider de distancia focal
  let focalLabel = createDiv("Distancia focal:");
  focalLabel.style("font-size", "14px");
  focalLabel.style("text-align", "center");
  focalSlider = createSlider(50, 200, 100, 1);
  focalSlider.input(updateFocalLength);
  let focalBox = createDiv();
  focalBox.child(focalLabel);
  focalBox.child(focalSlider);
  focalBox.style("text-align", "center");
  controlContainer.child(focalBox);

  // Tipo de objeto (flecha o imagen)
  let objectTypeLabel = createDiv("Tipo de objeto:");
  objectTypeLabel.style("font-size", "14px");
  objectTypeLabel.style("text-align", "center");
  objectTypeSelector = createSelect();
  objectTypeSelector.option("Flecha");
  objectTypeSelector.option("Hello Kitty");
  objectTypeSelector.selected("Flecha");
  let objectTypeBox = createDiv();
  objectTypeBox.child(objectTypeLabel);
  objectTypeBox.child(objectTypeSelector);
  objectTypeBox.style("text-align", "center");
  controlContainer.child(objectTypeBox);

  // Tipo (dinámico según sistema)
  let tipoLabel = createDiv("Tipo:");
  tipoLabel.style("font-size", "14px");
  tipoLabel.style("text-align", "center");
  tipoSelector = createSelect();
  tipoSelector.option("Convergente");
  tipoSelector.option("Divergente");
  tipoSelector.selected("Convergente");
  let tipoBox = createDiv();
  tipoBox.child(tipoLabel);
  tipoBox.child(tipoSelector);
  tipoBox.style("text-align", "center");
  controlContainer.child(tipoBox);

  // Sistema óptico
  let sistemaLabel = createDiv("Sistema óptico:");
  sistemaLabel.style("font-size", "14px");
  sistemaLabel.style("text-align", "center");
  sistemaSelector = createSelect();
  sistemaSelector.option("Lente");
  sistemaSelector.option("Espejo");
  sistemaSelector.selected("Lente");
  sistemaSelector.changed(actualizarOpcionesTipo);
  let sistemaBox = createDiv();
  sistemaBox.child(sistemaLabel);
  sistemaBox.child(sistemaSelector);
  sistemaBox.style("text-align", "center");
  controlContainer.child(sistemaBox);
}

function updateFocalLength() {
  f = focalSlider.value();
  R = 2 * f;
}

// Este método borra y redefine las opciones del menú desplegable tipoSelector en función
// de si el usuario ha seleccionado una lente o un espejo.
function actualizarOpcionesTipo() {
  let sistema = sistemaSelector.value();
  tipoSelector.elt.innerHTML = ""; // limpia opciones

  if (sistema === "Lente") {
    tipoSelector.option("Convergente");
    tipoSelector.option("Divergente");
  } else {
    tipoSelector.option("Plano");
    tipoSelector.option("Cóncavo");
    tipoSelector.option("Convexo");
  }
  // asegurarse de que haya opciones antes de acceder a ellas
  if (tipoSelector.elt.options.length > 0) {
    tipoSelector.selected(tipoSelector.elt.options[0].value);
  }
}

// Esta función detecta el sistema y tipo seleccionados y llama a la función de dibujo
// correspondiente: dibujarConvergente(), dibujarEspejoPlano(), etc.
function draw() {
  background(255); // limpia el fondo
  let sistema = sistemaSelector.value(); // obtiene el sistema óptico seleccionado
  let tipo = tipoSelector.value(); // obtiene el tipo de lente/espejo

  // Ajustar dinámicamente el punto central del sistema
  if (sistema === "Lente") {
    lensX = width / 2; // centrado
  } else if (sistema === "Espejo") {
    mirrorX = width * 0.55; // mover a la derecha
  }

  if (sistema === "Lente") {
    if (tipo === "Convergente") dibujarConvergente();
    else if (tipo === "Divergente") dibujarDivergente();
  } else if (sistema === "Espejo") {
    if (tipo === "Plano") dibujarEspejoPlano();
    else if (tipo === "Cóncavo") dibujarEspejoConcavo();
    else if (tipo === "Convexo") dibujarEspejoConvexo();
  }
}

// Funciones de dibujo de cada sistema óptico
// Las siguientes funciones se encargan de:
// Dibujar el sistema  óptico con su geometría correspondiente
// Dibujar el objeto como una flecha verde o imagen
// Trazar los rayos 1,2 y 3 con colores diferentes
// Calcular y dibujar la imagen (real o virtual)
// Calcular y mostrar la magnificación M.

function dibujarEspejoPlano() {
  let do_ = slider.value();
  let ho = heightSlider.value();
  let objectX = lensX - do_;
  let objectY = centerY - ho;
  let objectTip = createVector(objectX, objectY);
  let mirrorPointHoriz = createVector(lensX, objectY);

  background(255);
  // === DIBUJO ===
  stroke(0);
  line(0, centerY, width, centerY); // eje óptico

  // Diseño del espejo plano(rectángulo alargado)
  let mirrorWidth = 10; // Grosor del espejo
  let mirrorHeight = 300; // Altura del espejo

  // Relleno azul claro
  fill(200, 230, 255, 100); // Azul claro
  noStroke();
  rect(lensX, centerY - mirrorHeight / 2, mirrorWidth, mirrorHeight);

  // Borde azul oscuro
  stroke(100, 200, 255); // Azul oscuro
  strokeWeight(2);
  noFill();
  rect(lensX, centerY - mirrorHeight / 2, mirrorWidth, mirrorHeight);

  // Espejo (línea vertical punteada)
  let mirrorCenterX = lensX + mirrorWidth / 2;
  drawingContext.setLineDash([5, 5]);
  stroke(200);
  strokeWeight(2); // línea más delgada
  line(mirrorCenterX, 0, mirrorCenterX, height);
  drawingContext.setLineDash([]);
  strokeWeight(3);

  // Dibujar objeto (flecha o imagen)
  drawObject(objectX, objectY, ho);

  // Etiquetas objeto
  noStroke();
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text(`${(ho * 0.1).toFixed(1)} cm`, objectX, objectY - 10);
  text(`${(do_ * 0.1).toFixed(1)} cm`, objectX, centerY + 20);

  // === RAYOS ===
  // Rayo 1: horizontal hacia el espejo (sólido)
  stroke(rayColors[0]);
  strokeWeight(2);
  drawingContext.setLineDash([]);
  line(objectTip.x, objectTip.y, mirrorPointHoriz.x, mirrorPointHoriz.y);

  // Rayo reflejado 1 (horizontal) — punteado
  drawingContext.setLineDash([5, 5]);
  let reflected1End = createVector(
    mirrorPointHoriz.x + 350,
    mirrorPointHoriz.y
  );
  line(
    mirrorPointHoriz.x,
    mirrorPointHoriz.y,
    reflected1End.x,
    reflected1End.y
  );
  drawingContext.setLineDash([]);

  // Rayo 2: diagonal incidente (sólido)
  let incidencePoint = createVector(lensX, centerY);
  stroke(rayColors[1]);
  strokeWeight(2);
  drawingContext.setLineDash([]);
  line(objectTip.x, objectTip.y, incidencePoint.x, incidencePoint.y);

  // Rayo 2 reflejado (sólido)
  let incidentVec = p5.Vector.sub(incidencePoint, objectTip);
  let normal = createVector(1, 0);
  let reflectedVec = reflect(incidentVec, normal).setMag(200);
  let reflected2End = p5.Vector.add(incidencePoint, reflectedVec);
  line(incidencePoint.x, incidencePoint.y, reflected2End.x, reflected2End.y);

  // Prolongación del rayo 1 hacia atrás (punteada)
  drawingContext.setLineDash([5, 5]);
  stroke(rayColors[0]);
  let back1 = p5.Vector.sub(objectTip, mirrorPointHoriz).setMag(100);
  let extBack1 = p5.Vector.add(mirrorPointHoriz, back1);
  line(mirrorPointHoriz.x, mirrorPointHoriz.y, extBack1.x, extBack1.y);
  drawingContext.setLineDash([]);

  // Prolongación del rayo reflejado 2 hacia atrás (punteada)
  drawingContext.setLineDash([5, 5]);
  stroke(rayColors[1]);
  let backReflected = p5.Vector.mult(reflectedVec, -1).setMag(300);
  let extReflected = p5.Vector.add(incidencePoint, backReflected);
  line(incidencePoint.x, incidencePoint.y, extReflected.x, extReflected.y);
  drawingContext.setLineDash([]);

  // Intersección entre prolongaciones
  let virtualImage = getIntersection(
    mirrorPointHoriz,
    extBack1,
    incidencePoint,
    extReflected
  );

  // Imagen virtual (Hello Kitty o flecha)
  if (!isNaN(virtualImage.x)) {
    if (objectTypeSelector.value() === "Flecha") {
      // Dibujar flecha azul como antes
      stroke("blue");
      strokeWeight(3);
      line(virtualImage.x, centerY, virtualImage.x, virtualImage.y);
      fill("blue");
      triangle(
        virtualImage.x,
        virtualImage.y,
        virtualImage.x - 5,
        virtualImage.y + 10,
        virtualImage.x + 5,
        virtualImage.y + 10
      );
    } else {
      // Dibujar Hello Kitty como imagen virtual
      drawKitty(virtualImage.x, virtualImage.y, ho, false);
    }

    // Etiquetas imagen (se mantienen igual)
    noStroke();
    fill(0);
    textSize(12);
    textAlign(CENTER);
    text(`${(ho * 0.1).toFixed(1)} cm`, virtualImage.x, virtualImage.y - 10);
    text(`${(do_ * 0.1).toFixed(1)} cm`, virtualImage.x, centerY + 20);
    text(`M = 1.00`, virtualImage.x, centerY + 35);
  }
}

function dibujarEspejoConcavo() {
  background(255);
  let do_ = slider.value();
  let ho = heightSlider.value();
  let objectX = mirrorX - do_;
  let objectY = centerY - ho;
  let objectTip = createVector(objectX, objectY);
  let F = createVector(mirrorX - f, centerY);
  let C = createVector(mirrorX - R, centerY);

  // === RAYOS ===
  // Rayo 1: paralelo → pasa por F
  let rayo1_1 = objectTip.copy();
  let rayo1_2 = createVector(mirrorX, objectTip.y);
  let dir1 = p5.Vector.sub(F, rayo1_2);
  dir1.setMag(500);
  let rayo1_3 = p5.Vector.add(rayo1_2, dir1);

  // Rayo 2: hacia F → refleja paralelo
  let rayo2_1 = objectTip.copy();
  let dir2 = p5.Vector.sub(F, objectTip);
  dir2.setMag(300);
  let preMirror2 = p5.Vector.add(objectTip, dir2);
  let rayo2_2 = getIntersection(
    objectTip,
    preMirror2,
    createVector(mirrorX, 0),
    createVector(mirrorX, height)
  );
  let rayo2_3 = createVector(rayo2_2.x - 500, rayo2_2.y);

  // Rayo 3: hacia C → refleja sobre sí mismo
  let rayo3_1 = objectTip.copy();
  let dir3 = p5.Vector.sub(C, objectTip);
  dir3.setMag(500);
  let rayo3_2 = p5.Vector.add(objectTip, dir3);

  // Punto imagen
  let isReal = do_ > f;
  let imageTip = isReal
    ? getIntersection(rayo1_2, rayo1_3, rayo2_2, rayo2_3)
    : getIntersection(
        extendBackwards(rayo1_2, rayo1_3)[0],
        extendBackwards(rayo1_2, rayo1_3)[1],
        extendBackwards(rayo2_2, rayo2_3)[0],
        extendBackwards(rayo2_2, rayo2_3)[1]
      );

  // === DIBUJO ===
  stroke(0);
  line(0, centerY, width, centerY);

  // Línea punteada vertical en el vértice
  drawingContext.setLineDash([5, 5]);
  stroke(150);
  line(mirrorX, 0, mirrorX, height);
  drawingContext.setLineDash([]);

  // Espejo cóncavo
  stroke(100, 200, 255);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let y = centerY - 180; y <= centerY + 180; y += 1) {
    let dx = sqrt(sq(R) - sq(y - centerY));
    vertex(mirrorX + dx - R, y);
  }
  endShape();

  // F y C
  fill(0);
  noStroke();
  ellipse(F.x, F.y, 5);
  ellipse(C.x, C.y, 5);
  textSize(12);
  textAlign(CENTER);
  text("F", F.x, F.y + 15);
  text("C", C.x, C.y + 15);

  // Dibujar objeto (flecha o imagen)
  drawObject(objectX, objectY, ho);

  noStroke();
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text(`${(heightSlider.value() * 0.1).toFixed(1)} cm`, objectX, objectY - 10);

  // Imagen
  if (!isNaN(imageTip.x)) {
    if (isReal) {
      if (objectTypeSelector.value() === "Flecha") {
        stroke("gold");
        strokeWeight(3);
        line(imageTip.x, centerY, imageTip.x, imageTip.y);
        fill("gold");
        triangle(
          imageTip.x,
          imageTip.y,
          imageTip.x - 5,
          imageTip.y - 10,
          imageTip.x + 5,
          imageTip.y - 10
        );
      } else {
        // Imagen real (invertida)
        drawKitty(imageTip.x, imageTip.y, heightSlider.value(), true);
      }
    } else {
      // Imagen virtual: derecha
      let ext1 = extendBackwards(rayo1_2, rayo1_3);
      let ext2 = extendBackwards(rayo2_2, rayo2_3);
      let ext3 = extendBackwards(rayo3_1, rayo3_2);

      if (objectTypeSelector.value() === "Flecha") {
        stroke("blue");
        strokeWeight(3);
        line(imageTip.x, centerY, imageTip.x, imageTip.y);
        fill("blue");
        triangle(
          imageTip.x,
          imageTip.y,
          imageTip.x - 5,
          imageTip.y + 10,
          imageTip.x + 5,
          imageTip.y + 10
        );
      } else {
        drawKitty(imageTip.x, imageTip.y, heightSlider.value(), false);
      }

      // Rayos extendidos (se mantienen igual)
      drawingContext.setLineDash([5, 5]);
      stroke(rayColors[0]);
      line(rayo1_2.x, rayo1_2.y, ext1[1].x, ext1[1].y);
      stroke(rayColors[1]);
      line(rayo2_2.x, rayo2_2.y, ext2[1].x, ext2[1].y);
      stroke(rayColors[2]);
      line(rayo3_1.x, rayo3_1.y, ext3[1].x, ext3[1].y);
      drawingContext.setLineDash([]);
    }
  }

  // Rayos reflejados
  stroke(rayColors[0]);
  strokeWeight(2);
  line(rayo1_1.x, rayo1_1.y, rayo1_2.x, rayo1_2.y);
  line(rayo1_2.x, rayo1_2.y, rayo1_3.x, rayo1_3.y);

  stroke(rayColors[1]);
  line(rayo2_1.x, rayo2_1.y, rayo2_2.x, rayo2_2.y);
  line(rayo2_2.x, rayo2_2.y, rayo2_3.x, rayo2_3.y);

  stroke(rayColors[2]);
  line(rayo3_1.x, rayo3_1.y, rayo3_2.x, rayo3_2.y);

  // === MOSTRAR POSICIÓN DEL OBJETO Y MAGNIFICACIÓN ===
  noStroke();
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text(`${(do_ * 0.1).toFixed(1)} cm`, objectX, centerY + 20); // distancia del objeto

  if (!isNaN(imageTip.x)) {
    let di = imageTip.x - mirrorX;
    let M = -di / do_;
    text(`M = ${M.toFixed(2)}`, imageTip.x, centerY + 35); // magnificación
  }
}

function dibujarEspejoConvexo() {
  let do_ = slider.value();
  let ho = heightSlider.value();

  let objectX = mirrorX - do_;
  let objectY = centerY - ho;
  let objectTip = createVector(objectX, objectY);
  let F = createVector(mirrorX + f, centerY);
  let C = createVector(mirrorX + R, centerY);

  // === RAYOS ===

  // Rayo 1: paralelo → se refleja como si viniera de F
  let rayo1_1 = objectTip.copy();
  let rayo1_2 = createVector(mirrorX, objectTip.y);
  let dir1_virtual = p5.Vector.sub(rayo1_2, F);
  dir1_virtual.setMag(300);
  let rayo1_3 = p5.Vector.add(rayo1_2, dir1_virtual);
  let ext1 = extendBackwards(rayo1_2, rayo1_3);

  // Rayo 2: hacia F (virtual) → refleja paralelo
  let dir2 = p5.Vector.sub(F, objectTip);
  dir2.setMag(300);
  let preMirror2 = p5.Vector.add(objectTip, dir2);
  let rayo2_2 = getIntersection(
    objectTip,
    preMirror2,
    createVector(mirrorX, 0),
    createVector(mirrorX, height)
  );
  let rayo2_3 = createVector(rayo2_2.x + 300, rayo2_2.y);
  let ext2 = extendBackwards(rayo2_2, rayo2_3);

  // Rayo 3: hacia C → refleja sobre sí mismo
  let dir3 = p5.Vector.sub(C, objectTip);
  dir3.setMag(500);
  let rayo3_1 = objectTip.copy();
  let rayo3_2 = p5.Vector.add(objectTip, dir3);
  let ext3 = extendBackwards(rayo3_1, rayo3_2);

  // Imagen virtual
  let virtualImage = getIntersection(ext1[0], ext1[1], ext2[0], ext2[1]);

  // === DIBUJO ===

  // Eje óptico
  stroke(0);
  line(0, centerY, width, centerY);

  // Línea punteada vertical en el vértice
  drawingContext.setLineDash([5, 5]);
  stroke(150);
  line(mirrorX, 0, mirrorX, height);
  drawingContext.setLineDash([]);

  // Espejo convexo (lado izquierdo)
  stroke(100, 200, 255);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let y = centerY - 180; y <= centerY + 180; y += 1) {
    let dx = sqrt(sq(R) - sq(y - centerY));
    vertex(mirrorX - dx + R, y);
  }
  endShape();

  // F y C
  fill(0);
  noStroke();
  ellipse(F.x, F.y, 5);
  ellipse(C.x, C.y, 5);
  textSize(12);
  textAlign(CENTER);
  text("F", F.x, F.y + 15);
  text("C", C.x, C.y + 15);

  // Dibujar objeto (flecha o imagen)
  drawObject(objectX, objectY, ho);

  noStroke();
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text(`${(heightSlider.value() * 0.1).toFixed(1)} cm`, objectX, objectY - 10);

  // Imagen virtual
  if (!isNaN(virtualImage.x)) {
    if (objectTypeSelector.value() === "Flecha") {
      stroke("blue");
      strokeWeight(3);
      line(virtualImage.x, centerY, virtualImage.x, virtualImage.y);
      fill("blue");
      triangle(
        virtualImage.x,
        virtualImage.y,
        virtualImage.x - 5,
        virtualImage.y + 10,
        virtualImage.x + 5,
        virtualImage.y + 10
      );
    } else {
      // Hello Kitty para imagen virtual (derecha)
      drawKitty(virtualImage.x, virtualImage.y, heightSlider.value(), false);
    }
  }

  // Función para dibujar segmentos con línea punteada o sólida
  function drawSegment(p1, p2, color) {
    if (p1.x >= mirrorX && p2.x >= mirrorX) {
      drawingContext.setLineDash([5, 5]);
    } else {
      drawingContext.setLineDash([]);
    }
    stroke(color);
    line(p1.x, p1.y, p2.x, p2.y);
  }

  // Rayos reflejados (líneas sólidas a la izquierda, punteadas a la derecha)
  strokeWeight(2);
  drawSegment(rayo1_1, rayo1_2, rayColors[0]);
  drawSegment(rayo1_2, rayo1_3, rayColors[0]);

  drawSegment(objectTip, rayo2_2, rayColors[1]);
  drawSegment(rayo2_2, rayo2_3, rayColors[1]);

  drawSegment(rayo3_1, rayo3_2, rayColors[2]);

  // Rayos extendidos
  drawSegment(rayo1_2, ext1[1], rayColors[0]);
  drawSegment(rayo2_2, ext2[1], rayColors[1]);
  drawSegment(rayo3_1, ext3[1], rayColors[2]);

  drawingContext.setLineDash([]);

  // Mostrar distancia del objeto y magnificación
  noStroke();
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text(`${(do_ * 0.1).toFixed(1)} cm`, objectX, centerY + 20);

  if (!isNaN(virtualImage.x)) {
    let di = virtualImage.x - mirrorX;
    let M = -di / do_;
    text(`M = ${M.toFixed(2)}`, virtualImage.x, centerY + 35);
  }
}

function dibujarConvergente() {
  let do_ = slider.value();
  let ho = heightSlider.value();
  let objectX = lensX - do_;
  let objectY = centerY - ho;
  let objectTip = createVector(objectX, objectY);
  let F1 = createVector(lensX - f, centerY);
  let F2 = createVector(lensX + f, centerY);

  // === RAYOS ===
  let rayo1_1 = objectTip.copy();
  let rayo1_2 = createVector(lensX, objectTip.y);
  let dir1 = p5.Vector.sub(F2, rayo1_2);
  dir1.setMag(700);
  let rayo1_3 = p5.Vector.add(rayo1_2, dir1);

  let rayo2_1 = objectTip.copy();
  let dir2 = p5.Vector.sub(F1, objectTip);
  dir2.setMag(300);
  let preLente = p5.Vector.add(objectTip, dir2);
  let rayo2_2 = getIntersection(
    objectTip,
    preLente,
    createVector(lensX, 0),
    createVector(lensX, height)
  );
  let rayo2_3 = createVector(lensX + 500, rayo2_2.y);

  let imageTip = getIntersection(rayo1_2, rayo1_3, rayo2_2, rayo2_3);

  // === DIBUJO ===
  stroke(0);
  line(0, centerY, width, centerY);
  drawingContext.setLineDash([5, 5]);
  stroke(150);
  line(lensX, 0, lensX, height);
  drawingContext.setLineDash([]);
  stroke(100, 200, 255);
  fill(200, 230, 255, 100);
  ellipse(lensX, centerY, 20, 200);

  fill(0);
  noStroke();
  ellipse(F1.x, F1.y, 5);
  ellipse(F2.x, F2.y, 5);
  textSize(12);
  textAlign(CENTER);
  text("F₁", F1.x, F1.y + 15);
  text("F₂", F2.x, F2.y + 15);

  // Dibujar objeto (flecha o imagen)
  drawObject(objectX, objectY, ho);

  noStroke();
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text(`${(heightSlider.value() * 0.1).toFixed(1)} cm`, objectX, objectY - 10);

  // Mostrar distancia objeto en cm
  noStroke();
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text(`${(do_ * 0.1).toFixed(1)} cm`, objectX, centerY + 20);

  let isReal = do_ > f;

  if (isReal && !isNaN(imageTip.x)) {
    if (objectTypeSelector.value() === "Flecha") {
      stroke("gold");
      strokeWeight(3);
      line(imageTip.x, centerY, imageTip.x, imageTip.y);
      fill("gold");
      triangle(
        imageTip.x,
        imageTip.y,
        imageTip.x - 5,
        imageTip.y - 10,
        imageTip.x + 5,
        imageTip.y - 10
      );
    } else {
      // Imagen real invertida (Hello Kitty)
      drawKitty(imageTip.x, imageTip.y, heightSlider.value(), true);
    }

    // Mostrar distancia imagen en cm
    noStroke();
    fill(0);
    text(
      `${(Math.abs(imageTip.x - lensX) * 0.1).toFixed(1)} cm`,
      imageTip.x,
      centerY + 20
    );
    let di = imageTip.x - lensX;
    let M = -di / do_;
    text(`M = ${M.toFixed(2)}`, imageTip.x, centerY + 35);
  } else if (!isReal && !isNaN(imageTip.x)) {
    let ext1 = extendBackwards(rayo1_2, rayo1_3);
    let ext2 = extendBackwards(rayo2_2, rayo2_3);
    let virtualImage = getIntersection(ext1[0], ext1[1], ext2[0], ext2[1]);

    if (objectTypeSelector.value() === "Flecha") {
      stroke("blue");
      strokeWeight(3);
      line(virtualImage.x, centerY, virtualImage.x, virtualImage.y);
      fill("blue");
      triangle(
        virtualImage.x,
        virtualImage.y,
        virtualImage.x - 5,
        virtualImage.y + 10,
        virtualImage.x + 5,
        virtualImage.y + 10
      );
    } else {
      // Imagen virtual derecha (Hello Kitty)
      drawKitty(virtualImage.x, virtualImage.y, heightSlider.value(), false);
    }

    // Mostrar distancia imagen virtual en cm
    noStroke();
    fill(0);
    text(
      `${(Math.abs(virtualImage.x - lensX) * 0.1).toFixed(1)} cm`,
      virtualImage.x,
      centerY + 20
    );
    let di = virtualImage.x - lensX;
    let M = -di / do_;
    text(`M = ${M.toFixed(2)}`, virtualImage.x, centerY + 35);

    drawingContext.setLineDash([5, 5]);
    stroke(rayColors[0]);
    line(rayo1_2.x, rayo1_2.y, ext1[1].x, ext1[1].y);
    stroke(rayColors[1]);
    line(rayo2_2.x, rayo2_2.y, ext2[1].x, ext2[1].y);

    let ext3_dir = p5.Vector.sub(objectTip, createVector(lensX, centerY));
    ext3_dir.setMag(300);
    let ext3_end = p5.Vector.add(objectTip, ext3_dir);
    stroke(rayColors[2]);
    line(objectTip.x, objectTip.y, ext3_end.x, ext3_end.y);

    let rayo2_ext_dir = p5.Vector.sub(objectTip, F1);
    rayo2_ext_dir.setMag(400);
    let rayo2_ext_end = p5.Vector.add(F1, rayo2_ext_dir);
    stroke(rayColors[1]);
    line(F1.x, F1.y, rayo2_ext_end.x, rayo2_ext_end.y);
    drawingContext.setLineDash([]);
  }

  strokeWeight(2);
  stroke(rayColors[0]);
  line(rayo1_1.x, rayo1_1.y, rayo1_2.x, rayo1_2.y);
  line(rayo1_2.x, rayo1_2.y, rayo1_3.x, rayo1_3.y);

  stroke(rayColors[1]);
  line(rayo2_1.x, rayo2_1.y, rayo2_2.x, rayo2_2.y);
  line(rayo2_2.x, rayo2_2.y, rayo2_3.x, rayo2_3.y);

  stroke(rayColors[2]);
  line(objectTip.x, objectTip.y, lensX, centerY);
  if (isReal) line(lensX, centerY, imageTip.x, imageTip.y);
}

function dibujarDivergente() {
  let do_ = slider.value();
  let ho = heightSlider.value();
  let objectX = lensX - do_;
  let objectY = centerY - ho;
  let objectTip = createVector(objectX, objectY);
  let F1 = createVector(lensX - f, centerY);
  let F2 = createVector(lensX + f, centerY);

  // === RAYOS ===
  let rayo1_1 = objectTip.copy();
  let rayo1_2 = createVector(lensX, objectTip.y);
  let dir1_virtual = p5.Vector.sub(rayo1_2, F1);
  dir1_virtual.setMag(300);
  let rayo1_3 = p5.Vector.add(rayo1_2, dir1_virtual);

  let rayo2_1 = objectTip.copy();
  let dir2 = p5.Vector.sub(F2, objectTip);
  dir2.setMag(300);
  let preLente2 = p5.Vector.add(objectTip, dir2);
  let rayo2_2 = getIntersection(
    objectTip,
    preLente2,
    createVector(lensX, 0),
    createVector(lensX, height)
  );
  let rayo2_3 = createVector(rayo2_2.x + 300, rayo2_2.y);

  let dir3 = p5.Vector.sub(createVector(lensX, centerY), objectTip);
  dir3.setMag(400);
  let rayo3_1 = objectTip.copy();
  let rayo3_2 = p5.Vector.add(objectTip, dir3);

  let ext1 = extendBackwards(rayo1_2, rayo1_3);
  let ext2 = extendBackwards(rayo2_2, rayo2_3);
  let virtualImage = getIntersection(ext1[0], ext1[1], ext2[0], ext2[1]);

  // === DIBUJO ===
  stroke(0);
  line(0, centerY, width, centerY);
  drawingContext.setLineDash([5, 5]);
  stroke(150);
  line(lensX, 0, lensX, height);
  drawingContext.setLineDash([]);
  stroke(100, 200, 255);
  fill(200, 230, 255, 100);
  beginShape();
  vertex(lensX - 20, centerY - 100);
  bezierVertex(
    lensX - 5,
    centerY - 60,
    lensX - 5,
    centerY + 60,
    lensX - 20,
    centerY + 100
  );
  vertex(lensX + 20, centerY + 100);
  bezierVertex(
    lensX + 5,
    centerY + 60,
    lensX + 5,
    centerY - 60,
    lensX + 20,
    centerY - 100
  );
  endShape(CLOSE);

  fill(0);
  noStroke();
  ellipse(F1.x, F1.y, 5);
  ellipse(F2.x, F2.y, 5);
  textSize(12);
  textAlign(CENTER);
  text("F₁", F1.x, F1.y + 15);
  text("F₂", F2.x, F2.y + 15);

  // Dibujar objeto (flecha o imagen)
  drawObject(objectX, objectY, ho);

  noStroke();
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text(`${(heightSlider.value() * 0.1).toFixed(1)} cm`, objectX, objectY - 10);

  // Mostrar distancia objeto en cm
  noStroke();
  fill(0);
  text(`${(do_ * 0.1).toFixed(1)} cm`, objectX, centerY + 20);

  if (!isNaN(virtualImage.x)) {
    if (objectTypeSelector.value() === "Flecha") {
      stroke("gold");
      strokeWeight(3);
      line(virtualImage.x, centerY, virtualImage.x, virtualImage.y);
      fill("gold");
      triangle(
        virtualImage.x,
        virtualImage.y,
        virtualImage.x - 5,
        virtualImage.y + 10,
        virtualImage.x + 5,
        virtualImage.y + 10
      );
    } else {
      // Hello Kitty para imagen virtual (derecha)
      drawKitty(virtualImage.x, virtualImage.y, heightSlider.value(), false);
    }

    // Mostrar distancia imagen virtual en cm
    noStroke();
    fill(0);
    text(
      `${(Math.abs(virtualImage.x - lensX) * 0.1).toFixed(1)} cm`,
      virtualImage.x,
      centerY + 20
    );
  }
  let di = virtualImage.x - lensX;
  let M = -di / do_;
  text(`M = ${M.toFixed(2)}`, virtualImage.x, centerY + 35);

  strokeWeight(2);
  stroke(rayColors[0]);
  line(rayo1_1.x, rayo1_1.y, rayo1_2.x, rayo1_2.y);
  line(rayo1_2.x, rayo1_2.y, rayo1_3.x, rayo1_3.y);

  stroke(rayColors[1]);
  line(rayo2_1.x, rayo2_1.y, rayo2_2.x, rayo2_2.y);
  line(rayo2_2.x, rayo2_2.y, rayo2_3.x, rayo2_3.y);

  stroke(rayColors[2]);
  line(rayo3_1.x, rayo3_1.y, rayo3_2.x, rayo3_2.y);

  drawingContext.setLineDash([5, 5]);
  stroke(rayColors[0]);
  line(rayo1_2.x, rayo1_2.y, ext1[1].x, ext1[1].y);
  stroke(rayColors[1]);
  line(rayo2_2.x, rayo2_2.y, ext2[1].x, ext2[1].y);
  stroke(rayColors[1]);
  line(rayo2_1.x, rayo2_1.y, F2.x, F2.y);
  drawingContext.setLineDash([]);
}

function drawKitty(x, y, height, isInverted = false) {
  push();

  // Calculamos la posición vertical (centro de la imagen)
  let imageCenterY = (centerY + y) / 2;

  // Calculamos el factor de escala
  let targetHeight = abs(centerY - y);
  let scaleFactor = targetHeight / kittyHeight;

  // Posicionamos
  translate(x, imageCenterY);

  // Aplicamos inversión vertical si es necesario
  if (isInverted) {
    scale(scaleFactor, -scaleFactor); // Invertir verticalmente
  } else {
    scale(scaleFactor); // Escala normal
  }

  imageMode(CENTER);
  image(kittyImg, 0, 0, kittyWidth, kittyHeight);
  pop();
}

// Función para dibujar el objeto (flecha o imagen según selección)
function drawObject(x, y, height) {
  if (objectTypeSelector.value() === "Flecha") {
    // Comportamiento original de la flecha
    stroke("green");
    strokeWeight(3);
    line(x, centerY, x, y);
    fill("green");
    triangle(x, y, x - 5, y + 10, x + 5, y + 10);
  } else {
    // Dibujar Hello Kitty con el mismo comportamiento que la flecha
    drawKitty(x, y, height);
  }
}
// Función para dibujar el objeto (flecha o imagen según selección)
function drawObject(x, y, height) {
  if (objectTypeSelector.value() === "Flecha") {
    // Comportamiento original de la flecha
    stroke("green");
    strokeWeight(3);
    line(x, centerY, x, y);
    fill("green");
    triangle(x, y, x - 5, y + 10, x + 5, y + 10);
  } else {
    // Dibujar Hello Kitty con el mismo comportamiento que la flecha
    drawKitty(x, y, height);
  }
}

// Función para calcular el vector reflejado a partir del vector incidente y la normal.
function reflect(incident, normal) {
  let dot = incident.dot(normal);
  return p5.Vector.sub(incident, p5.Vector.mult(normal, 2 * dot));
}

// Función para calcular el punto de intersección entre dos segmentos definidos por los
//puntos (p1, p2) y (p3, p4). Se usa para hallar el punto donde los rayos convergen.
function getIntersection(p1, p2, p3, p4) {
  let x1 = p1.x,
    y1 = p1.y;
  let x2 = p2.x,
    y2 = p2.y;
  let x3 = p3.x,
    y3 = p3.y;
  let x4 = p4.x,
    y4 = p4.y;

  let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (den === 0) return createVector(NaN, NaN);

  let xi =
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / den;
  let yi =
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / den;

  return createVector(xi, yi);
}

//Extiende un rayo hacia atrás a partir del vector dirección de p1 → p2.
//Se utiliza para dibujar trayectorias virtuales
function extendBackwards(p1, p2) {
  let dir = p5.Vector.sub(p1, p2);
  dir.setMag(300);
  return [p1.copy(), p5.Vector.add(p1, dir)];
}
