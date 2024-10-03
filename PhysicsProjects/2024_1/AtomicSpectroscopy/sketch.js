/* ***********************************************************
 * ******* SIMULACION DE SEMINARIO DE PROFUNDIZACION 1 *******
 * ***********************************************************
 * * Autores: Laura Alvarez Ramirezo                         *
 * *          Alejandro López Can                            *
 * *          Sebastián Moreno Parra                         *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Seminario de profundizacion 1                    *
 * ***********************************************************/
//VARIABLES
let dat = 1 / 150;
let At = 0;
let canvasWidth = 800;
let canvasHeight = 500;
let luzemitida = [];
let longitudesOnda = [];
let amplitudOnda = 4;
let longitudOndaMin = 380;
let longitudOndaMax = 780;
let startX = canvasWidth / 2;
let startY = canvasHeight / 2;
let endX = canvasWidth - 145;
let numPoints = 1000;
let img; // Variable para almacenar la imagen cargada
let img2;
let rangosEmision = [];
let menuElementos;

function preload() {
  // Cargar la imagen desde una URL
  img = loadImage(
    "https://github.com/fabioc9675/PhysicsSimulators/blob/devFabian/PhysicsProjects/2024_1/AtomicSpectroscopy/images/panel.png"
  );
  img2 = loadImage(
    "https://github.com/fabioc9675/PhysicsSimulators/blob/devFabian/PhysicsProjects/2024_1/AtomicSpectroscopy/images/TuboDescarga.png"
  );
}

function setup() {
  frameRate(40);
  createCanvas(canvasWidth, canvasHeight);
  textAlign(CENTER);
  textSize(7); // Reducimos el tamaño del texto
  menuElementos = createSelect();
  menuElementos.position(20, 20);
  menuElementos.option("Seleccionar elemento o compuesto");
  menuElementos.option("Hidrógeno");
  menuElementos.option("Helio");
  menuElementos.option("Nitrógeno diatómico");
  menuElementos.option("Neón");
  menuElementos.option("Sodio");
  menuElementos.option("Kriptón");
  menuElementos.option("Yodo");
  menuElementos.option("Mercurio");
  menuElementos.option("Ácido Sulfhídrico");
  menuElementos.option("Compuesto desconocido");
  menuElementos.changed(menuElementosChanged);
}

function menuElementosChanged() {
  switch (menuElementos.value()) {
    case "Seleccionar elemento o compuesto":
      longitudesOnda = [379, 781];
      rangosEmision = [];
      break;
    case "Hidrógeno":
      luzemitida = [200, 210, 256];
      longitudesOnda = [379, 410, 434, 486, 657, 781];
      rangosEmision = [];
      break;
    case "Helio":
      luzemitida = [256, 215, 76];
      longitudesOnda = [
        379, 438, 443, 447, 471, 492, 501, 504, 586, 587, 588, 667, 781,
      ];
      rangosEmision = [];
      break;
    case "Nitrógeno diatómico":
      luzemitida = [224, 168, 94];
      longitudesOnda = [
        379, 409, 433, 485, 584, 593, 608, 613, 625, 632, 639, 650, 655, 667,
        671, 702, 776, 781,
      ];
      rangosEmision = [];
      break;
    case "Neón":
      luzemitida = [256, 80, 40];
      longitudesOnda = [
        379, 540, 585, 588, 603, 607, 616, 621, 626, 633, 638, 640, 650, 659,
        692, 703, 781,
      ];
      rangosEmision = [];
      break;
    case "Sodio":
      luzemitida = [156, 140, 0];
      longitudesOnda = [379, 568, 585, 586, 587, 590, 591, 592, 781];
      rangosEmision = [];
      break;
    case "Kriptón":
      luzemitida = [156, 120, 180];
      longitudesOnda = [
        379, 425, 430, 435, 554, 555, 556, 585, 586, 587, 758, 759, 760, 761,
        768, 781,
      ];
      rangosEmision = [];
      break;
    case "Yodo":
      luzemitida = [256, 120, 120];
      longitudesOnda = [
        379, 403, 404, 434, 435, 436, 544, 545, 546, 547, 576, 577, 695, 696,
        705, 706, 714, 728, 737, 738, 749, 750, 751, 762, 763, 771, 772, 781,
      ];
      rangosEmision = [];
      break;
    case "Mercurio":
      luzemitida = [200, 218, 230];
      longitudesOnda = [
        379, 403, 404, 405, 407, 432, 434, 436, 437, 438, 491, 544, 545, 546,
        547, 548, 575, 576, 577, 579, 580, 689, 690, 691, 781,
      ];
      rangosEmision = [];
      break;
    case "Ácido Sulfhídrico":
      luzemitida = [140, 240, 256];
      longitudesOnda = [
        379, 380, 387, 392, 397, 404, 412, 418, 425, 433, 439, 447, 455, 462,
        470, 479, 485, 491, 516, 577, 587, 655, 781,
      ];
      rangosEmision = [];
      break;
    case "Compuesto desconocido":
      luzemitida = [200, 200, 200];
      longitudesOnda = [
        379, 403, 404, 434, 435, 436, 544, 545, 546, 547, 568, 576, 577, 585,
        586, 587, 590, 591, 592, 695, 696, 705, 706, 714, 728, 737, 738, 749,
        750, 751, 762, 763, 771, 772, 781,
      ];
      rangosEmision = [];
      break;
  }
  for (let i = 0; i < longitudesOnda.length - 1; i++) {
    rangosEmision.push({
      inicio: longitudesOnda[i] + 1,
      fin: longitudesOnda[i + 1] - 1,
    });
  }
}

function draw() {
  // Calculamos las posiciones para alinear a la derecha
  let spectrumWidth = 30; // Ancho de cada espectro
  let spectrumHeight = 300; // Alto de cada espectro
  let scaleWidth = 10; // Ancho de la escala
  let scaleHeight = 300; // Alto de la escala
  let imageWidth = 30; // Ancho de la imagen
  let imageHeight = 300; // Alto de la imagen
  let x = canvasWidth - spectrumWidth - 60 - 20; // Alineado a la derecha y movido 5 unidades a la izquierda
  let imageX = x + spectrumWidth - 150; // Alineado a la izquierda del espectro y a 1 centímetro de distancia
  At += dat;
  amplitudOnda = 5 * sin(2 * PI * At);
  background(0); // Establecemos el color de fondo a negro
  fill(0, 199, 200);
  stroke(256);
  triangle(355, 280, 410, 380, 455, 280);
  fill(0, 245, 254);
  stroke(256);
  quad(355, 280, 360, 275, 460, 275, 455, 280);
  fill(0, 245, 254);
  stroke(256);
  quad(460, 275, 455, 280, 410, 380, 413, 380);
  fill(20);
  stroke(200);
  quad(330, 295, 310, 290, 310, 410, 330, 405);
  fill(0);
  stroke(0);
  quad(316, 348, 324, 349, 324, 351, 316, 352);
  drawSpectrum(
    x,
    (canvasHeight - spectrumHeight) / 2,
    spectrumWidth,
    spectrumHeight,
    rangosEmision
  );
  // Dibuja la escala de longitudes de onda
  let scalePosX = x + spectrumWidth + 10;
  let scalePosY = (canvasHeight - scaleHeight) / 2;
  drawWavelengthScale(scalePosX, scalePosY, scaleWidth, scaleHeight);
  // Dibuja la imagen
  image(
    img,
    imageX + 75,
    (canvasHeight - imageHeight) / 2,
    imageWidth,
    imageHeight
  );
  image(img2, 25, 230, 250, 250);
  // Dibuja el eje de simetría vertical de la imagen
  drawSymmetryAxis(
    imageX,
    (canvasHeight - imageHeight) / 2,
    imageHeight,
    scalePosX,
    scalePosY,
    scaleHeight
  );
  // Calcular la posición vertical correspondiente a longitud de onda en la escala de longitud de onda
  let posYLongitud = map(
    longitudesOnda[1],
    longitudOndaMin,
    longitudOndaMax,
    (canvasHeight - scaleHeight) / 2,
    (canvasHeight + scaleHeight) / 2
  );
  // Calcular el color correspondiente a la longitud de onda del punto de llegada
  let colorRGB = calcularColorRGB(longitudesOnda[1], rangosEmision);
  // Aplicar el color a la línea
  stroke(colorRGB[0], colorRGB[1], colorRGB[2]);
  // Dibuja la línea ondulada desde el punto central hasta el punto de llegada
  beginShape();
  curveVertex(canvasWidth / 2, canvasHeight / 2); // Punto de inicio
  let startX = canvasWidth / 2;
  let startY = canvasHeight / 2;
  let endX = canvasWidth - 145;
  let endY = posYLongitud + 7;
  // Dibujar curvas para longitudOnda2, longitudOnda3, longitudOnda4 y longitudOnda5
  longitudesOnda.forEach((element) => {
    if ((element !== 379) & (element !== 781)) {
      drawWave(
        element,
        numPoints,
        amplitudOnda,
        longitudOndaMin,
        longitudOndaMax,
        canvasWidth,
        canvasHeight,
        scaleHeight,
        rangosEmision
      );
      drawWhiteLight(
        element,
        numPoints,
        amplitudOnda,
        canvasWidth,
        canvasHeight
      );
    }
    drawPlasm(element, canvasWidth, canvasHeight);
  });

  function drawPlasm() {
    {
      noStroke();
      fill(luzemitida);
      quad(257, 415, 262, 415, 262, 285, 257, 285);
    }
  }
}

function drawWhiteLight(numPoints, amplitudOnda, canvasWidth, canvasHeight) {
  stroke(luzemitida);
  noFill();
  beginShape();
  curveVertex(400, 400); // Punto de inicio
  let startX = 402;
  let startY = 350;
  let endX = 320;
  let endY = 350;
  // Ajustar el área blanca al no empezar desde el centro exacto
  let waveStart = startX + (endX - startX) * 0.05;
  let waveEnd = endX - (endX - startX) * 0.05;
  for (let i = 5; i <= numPoints; i++) {
    let t = i / numPoints;
    let x = lerp(waveStart, waveEnd, t);
    let y = lerp(startY, endY, t) + canvasWidth * sin(25 * PI * t); // Coordenada y ondulada
    curveVertex(x, y);
  }
  curveVertex(endX, endY); // Punto de llegada
  endShape();
}

function drawWave(
  longitudOnda,
  numPoints,
  amplitudOnda,
  longitudOndaMin,
  longitudOndaMax,
  canvasWidth,
  canvasHeight,
  scaleHeight,
  rangosEmision
) {
  // Calcular la posición vertical correspondiente a longitud de onda en la escala de longitud de onda
  let posYLongitud = map(
    longitudOnda,
    longitudOndaMin,
    longitudOndaMax,
    (canvasHeight - scaleHeight) / 2,
    (canvasHeight + scaleHeight) / 2
  );
  // Calcular el color correspondiente a la longitud de onda
  let colorRGB = calcularColorRGB(longitudOnda, rangosEmision);
  // Aplicar el color a la línea
  stroke(colorRGB[0], colorRGB[1], colorRGB[2]);
  noFill();
  // Dibujar la curva sinusoidal desde el centro hasta el punto de llegada
  beginShape();
  curveVertex(canvasWidth / 2 - 20, canvasWidth / 2); // Punto de inicio
  let startX = canvasWidth / 2 - 20;
  let startY = 350;
  let endX = canvasWidth - 125;
  let endY = posYLongitud;
  // Ajustar el área blanca al no empezar desde el centro exacto
  let waveStart = startX + (endX - startX) * 0.05;
  let waveEnd = endX - (endX - startX) * 0.05;
  for (let i = 1; i <= numPoints; i++) {
    let t = i / numPoints;
    let x = lerp(waveStart, waveEnd, t);
    let y =
      lerp(startY, endY, t) +
      amplitudOnda * sin((2 * PI * 3000 * t) / longitudOnda); // Coordenada y ondulada
    curveVertex(x, y);
  }
  curveVertex(endX, endY); // Punto de llegada
  endShape();
}

function drawSpectrum(x, y, w, h, rangos) {
  noFill();
  for (let i = y + h; i > y; i--) {
    let longitudOnda = map(i, y, y + h, longitudOndaMin, longitudOndaMax);
    let colorRGB = calcularColorRGB(longitudOnda, rangos);
    stroke(colorRGB[0], colorRGB[1], colorRGB[2]);
    line(x, i, x + w, i);
  }
}

function drawWavelengthScale(x, y, w, h) {
  fill(255);
  noStroke();
  for (let i = 0; i <= 10; i++) {
    let longitudOnda = map(i, 0, 10, longitudOndaMin, longitudOndaMax);
    let posY = map(longitudOnda, longitudOndaMax, longitudOndaMin, y + h, y);
    rect(x, posY, w, 0.5);
    let textoLongitudOnda = int(longitudOnda) + " nm";
    let offset = 5 + (10 + i) * 15; // Ajustamos el offset para invertir el orden de los números
    text(textoLongitudOnda, x + w + 20, posY + 3); // Ajustamos la posición del texto
  }
  noFill();
}

function drawSymmetryAxis(
  imgX,
  imgY,
  imgHeight,
  scalePosX,
  scalePosY,
  scaleHeight
) {
  // Dibujar una línea punteada en el eje de simetría vertical
  stroke(255);
  strokeWeight(1);
  strokeCap(SQUARE);
  let axisValues = [];
  for (let i = scalePosY; i < scalePosY + scaleHeight; i += scaleHeight / 400) {
    let imgXCoord = map(
      i,
      scalePosY,
      scalePosY + scaleHeight,
      imgX,
      imgX + imgHeight
    );
    let value = map(
      imgXCoord,
      imgX,
      imgX + imgHeight,
      longitudOndaMin,
      longitudOndaMax
    );
    axisValues.push(value);
    point(scalePosX - 70, i);
  }
  console.log(axisValues); // Imprime los valores asignados al eje de simetría
}

function calcularColorRGB(longitudOnda, rangos) {
  let r, g, b;
  // Verificar si la longitud de onda está dentro de algún rango definido
  for (let i = 0; i < rangos.length; i++) {
    if (longitudOnda >= rangos[i].inicio && longitudOnda <= rangos[i].fin) {
      r = 0;
      g = 0;
      b = 0;
      return [r, g, b]; // Devolver negro y salir de la función
    }
  }
  // Si no está en un rango definido, calcular el color normalmente
  if (longitudOnda >= 380 && longitudOnda < 440) {
    r = -(longitudOnda - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (longitudOnda >= 440 && longitudOnda < 490) {
    r = 0.0;
    g = (longitudOnda - 440) / (490 - 440);
    b = 1.0;
  } else if (longitudOnda >= 490 && longitudOnda < 510) {
    r = 0.0;
    g = 1.0;
    b = -(longitudOnda - 510) / (510 - 490);
  } else if (longitudOnda >= 510 && longitudOnda < 580) {
    r = (longitudOnda - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (longitudOnda >= 580 && longitudOnda < 645) {
    r = 1.0;
    g = -(longitudOnda - 645) / (645 - 580);
    b = 0.0;
  } else if (longitudOnda >= 645 && longitudOnda <= 780) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  } else {
    r = 0.0;
    g = 0.0;
    b = 0.0;
  }
  // Ajusta los valores de r, g, b
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  return [r, g, b];
}
