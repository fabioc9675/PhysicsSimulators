/* ************************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 ******************
 * ************************************************************
 * * Autores:Jonathan Posada                         
 *           Luis Miguel Galvis
 *           Laura Sofía Arango 
 * * Institudo de Física, Universidad de Antioquia           *
 * ***********************************************************/

// definir constantes por defecto
let hbar = 1;
let w = 1;
let m = 0.5;

// definir arreglos vácios donde se llenaran los valores de x y y
// para graficar las funciones de onda
let xValues = [];
let xValuesp = [];
let yPsi0 = [];
let yPsi1 = [];
let yPsi2 = [];
let yPsi3 = [];
let yPsi4 = [];
let yPsi5 = [];

let xValues0 = [];
let yValues0 = [];
let xValues1 = [];
let yValues1 = [];
let xValues2 = [];
let yValues2 = [];
let xValues3 = [];  
let yValues3 = [];
let xValues4 = [];
let yValues4 = [];
let xValues5 = [];
let yValues5 = [];


let yPsi0sq = [];
let yPsi1sq = [];
let yPsi2sq = [];
let yPsi3sq = [];
let yPsi4sq = [];

// definir valores por defecto para los checkboxes
let showPsi0 = true;
let showPsi1 = true;
let showPsi2 = true;
let showPsi3 = true;
let showPsi4 = true;
let showPsi5 = true;

// slider para seleccionar la masa
let selectM;
let selectLabel;

// tiempo y paso para las gráficas animadas
let t = 0;
let dt = 0.01;
let maxT = 50;


// setup
function setup() {
  createCanvas(1200, 550);

  // Llenar el arreglo de valores x para las funciones de onda estáticas
  for (let x = -5; x <= 5; x += 0.02) {
    xValues.push(x);
  }

  // // Llenar el arreglo de valores x para el cuadrado de las funciones de onda
  for (let x = -5; x <= 5; x += 0.02) {
    xValuesp.push(x);
  }

  
  // Llenar el arreglo de valores x para la animación
  for (let x = -5; x <= 5; x += 0.1) {
    xValues0.push(x);
  }

  for (let x = -5; x <= 5; x += 0.1) {
    xValues1.push(x);
  }

  for (let x = -5; x <= 5; x += 0.1) {
    xValues2.push(x);
  }
  for (let x = -5; x <= 5; x += 0.1) {
    xValues3.push(x);
  }

  for (let x = -5; x <= 5; x += 0.1) {
    xValues4.push(x);
  }

  for (let x = -5; x <= 5; x += 0.1) {
    xValues5.push(x);
  }

  ///////////////////


  // Llenar los arreglos de valores y para cada función de onda
  for (let x of xValues) {
    yPsi0.push(psio(x, 1, 1) + hbar * w / 2);
    yPsi1.push(psi1(x, 1, 1) + hbar * w * 3 / 2);
    yPsi2.push(psi2(x, 1, 1) + hbar * w * 5 / 2);
    yPsi3.push(psi3(x, 1, 1) + hbar * w * 7 / 2);
    yPsi4.push(psi4(x, 1, 1) + hbar * w * 9 / 2);
    yPsi5.push(sum(x, 1, 1) + hbar*w);
  }

  // Llenar los arreglos de valores y para cada función de onda al cuadrado
  for (let x of xValuesp) {
    yPsi0sq.push(psio(x, 1, 1)**2 + hbar * w / 2);
    yPsi1sq.push(psi1(x, 1, 1)**2 + hbar * w * 3 / 2);
    yPsi2sq.push(psi2(x, 1, 1)**2 + hbar * w * 5 / 2);
    yPsi3sq.push(psi3(x, 1, 1)**2 + hbar * w * 7 / 2);
    yPsi4sq.push(psi4(x, 1, 1)**2 + hbar * w * 9 / 2);

  }


  // Crear checkboxes para mostrar u ocultar las funciones
  let checkboxPsi0 = createCheckbox('n = 0', true);
  checkboxPsi0.style('color', 'black')
  let checkboxPsi1 = createCheckbox('n = 1', true);
  checkboxPsi1.style('color', 'black')
  let checkboxPsi2 = createCheckbox('n = 2', true);
  checkboxPsi2.style('color', 'black')
  let checkboxPsi3 = createCheckbox('n = 3', true);
  checkboxPsi3.style('color', 'black')
  let checkboxPsi4 = createCheckbox('n = 4', true);
  checkboxPsi4.style('color', 'black')
  let checkboxPsi5 = createCheckbox('superposición', true);
  checkboxPsi5.style('color', 'black')

  // posición y fuente para los checkboxes
  checkboxPsi0.position(310, 453);
  checkboxPsi0.size(100, 100);
  checkboxPsi0.style('font-size', '19px');
  checkboxPsi1.position(410, 453);
  checkboxPsi1.size(100, 100);
  checkboxPsi1.style('font-size', '19px');
  checkboxPsi2.position(510, 453);
  checkboxPsi2.size(100, 100);
  checkboxPsi2.style('font-size', '19px');
  checkboxPsi3.position(610, 453);
  checkboxPsi3.size(100, 100);
  checkboxPsi3.style('font-size', '19px');
  checkboxPsi4.position(710, 453);
  checkboxPsi4.size(100, 100);
  checkboxPsi4.style('font-size', '19px');
  checkboxPsi5.position(810, 453);
  checkboxPsi5.size(150, 150);
  checkboxPsi5.style('font-size', '17px');

  // Volver a dibujar cuando cambia el estado del checkbox
  
  checkboxPsi0.changed(() => {
    showPsi0 = checkboxPsi0.checked();
    redraw(); 
  });

  checkboxPsi1.changed(() => {
    showPsi1 = checkboxPsi1.checked();
    redraw(); 
  });

  checkboxPsi2.changed(() => {
    showPsi2 = checkboxPsi2.checked();
  });

  checkboxPsi3.changed(() => {
    showPsi3 = checkboxPsi3.checked();
  });


  checkboxPsi4.changed(() => {
    showPsi4 = checkboxPsi4.checked();
    redraw(); 
  });

  checkboxPsi5.changed(() => {
    showPsi5 = checkboxPsi5.checked();
    redraw(); 
  });

  // slider para seleccionar la masa 
  selectM = createSelect();
  selectM.position(690, 510);
  textFont('Georgia');
  selectLabel = createP('Seleccionar masa:');
  selectLabel.position(520, 500);
  selectLabel.style('color', 'black');
  

  
  // valores de la masa quese pueden escoger
  selectM.option('0.5');
  selectM.option('1.0');
  selectM.option('2.0');

  // actualizar el valor de m
  selectM.changed(updateM);


}


//////// draw ////////////////////////////

function draw() {

  //background(202, 240, 249); // establecer el color sólido
  background(backgroundImage);  // fondo de imagen 
  
  
  textSize(14); // Establece el tamaño de fuente
  textFont('Georgia');
  strokeWeight(0);
  stroke(0);
  fill(0);
  
  // títulos y textos 
  text("Densidades de Probabilidad", 890, 34);
  text("Funciones de Onda - Primeros Niveles de  Energía", 60, 34);
  text("Evolución  Temporal de las Funciones de Onda", 450, 34);
  
  text("Seleccionar Niveles", 550, 440);
  text("V(x)", 80, 140);
  text("Posición", 220, 420);
  text("Posición", 620, 420);
  text("Posición", 980, 420);
  text("E0", 27, 355);
  text("E1", 27, 330);
  text("E2", 27, 305);
  text("E3", 27, 280);
  text("E4", 27, 255);

  // dibujar el primer recuadro blanco
  stroke(0);
  strokeWeight(3);
  fill(255, 255, 255);
  rect(50, 50, 800 - 450, height - 200);
  
  
  // dibujar segundo recuadro blanco
  let rightRectX = 800 - 370;
  let rightRectY = 50;
  let rightRectWidth = 350;
  let rightRectHeight = height - 200;
  stroke(0);
  strokeWeight(3);
  fill(255);
  rect(rightRectX, rightRectY, rightRectWidth, rightRectHeight);

// dibujar tercer recuadro
  stroke(0);
  strokeWeight(3);
  fill(255);
  rect(1200 - 390, 50, 350, height - 200);



// dibujar rectángulo donde van los checkboxes
  stroke(0);
  strokeWeight(2);
  fill(255);
  rect(300, 450, 700, 30);

////// Gráficas para las animaciones (recuadro del medio) /////////

  //// animación para psi0 
  if (showPsi0) {
  stroke(29, 120, 116); // Color azul
  noFill();
  beginShape();

  for (let i = 0; i < xValues0.length; i++) {
    let xVal = map(xValues0[i], -5, 5, rightRectX, rightRectX + rightRectWidth);
    let yVal = map(psi0_t(xValues0[i], t), -1, 1, rightRectY + rightRectHeight, rightRectY);
    vertex(xVal, yVal);
  }

  endShape();

  // Actualizar el tiempo
  t += dt;

  // Reiniciar el tiempo cuando alcanza el tiempo máximo
  if (t > maxT) {
    t = 0;
  }


  }

  //// animación para psi1
  if (showPsi1) {
    stroke(226, 114, 91); 
    noFill();
    beginShape();
    for (let i = 0; i < xValues1.length; i++) {0
      let xVal = map(xValues1[i], -5, 5, rightRectX, rightRectX + rightRectWidth);
      let yVal = map(psi1_t(xValues1[i], t), -1, 1, rightRectY + rightRectHeight, rightRectY);
      vertex(xVal, yVal);
    }
  
    endShape();
  
    // Actualizar el tiempo
    t += dt;
  
    // Reiniciar el tiempo cuando alcanza el tiempo máximo
    if (t > maxT) {
      t = 0;
    }
  
  
    }
  
  //// animación para psi2
  if (showPsi2) {
    stroke(114, 104, 166);  
    noFill();
    beginShape();
    for (let i = 0; i < xValues2.length; i++) {
      let xVal = map(xValues2[i], -5, 5, rightRectX, rightRectX + rightRectWidth);
      let yVal = map(psi2_t(xValues2[i], t), -1, 1, rightRectY + rightRectHeight, 50);
      vertex(xVal, yVal);
    }
  
    endShape();
  
    // Actualizar el tiempo
    t += dt;
  
    // Reiniciar el tiempo cuando alcanza el tiempo máximo
    if (t > maxT) {
      t = 0;
    }
  
  
    }

  
  //// animación para psi3
  if (showPsi3) {
    stroke(120, 192, 168);
    noFill();
    beginShape();
    for (let i = 0; i < xValues3.length; i++) {
      let xVal = map(xValues3[i], -5, 5, rightRectX, rightRectX + rightRectWidth);
      let yVal = map(psi3_t(xValues3[i], t), -1, 1, rightRectY + rightRectHeight, rightRectY);
      vertex(xVal, yVal);
    }
  
    endShape();
  
    // Actualizar el tiempo
    t += dt;
  
    // Reiniciar el tiempo cuando alcanza el tiempo máximo
    if (t > maxT) {
      t = 0;
    }
  
  
    }
  
  //// animación para psi4
  if (showPsi4) {
    stroke(230, 59, 96);  
    noFill();
    beginShape();
    for (let i = 0; i < xValues4.length; i++) {
      let xVal = map(xValues4[i], -5, 5, rightRectX, rightRectX + rightRectWidth);
      let yVal = map(psi4_(xValues4[i], t), -1, 1, rightRectY + rightRectHeight, 50);
      vertex(xVal, yVal);
    }
  
    endShape();
  
    // Actualizar el tiempo
    t += dt;
  
    // Reiniciar el tiempo cuando alcanza el tiempo máximo
    if (t > maxT) {
      t = 0;
    }
  
  
    }

    //// animación para psi5 (superposición de estados)
  if (showPsi5) {
    stroke(0, 0, 0);  
    noFill();
    beginShape();
    for (let i = 0; i < xValues5.length; i++) {
      let xVal = map(xValues5[i], -5, 5, rightRectX, rightRectX + rightRectWidth);
      let yVal = map(sum_psi(xValues5[i], t), -1, 1, rightRectY + rightRectHeight, 50);
      vertex(xVal, yVal);
    }
  
    endShape();
  
    // Actualizar el tiempo
    t += dt;
  
    // Reiniciar el tiempo cuando alcanza el tiempo máximo
    if (t > maxT) {
      t = 0;
    }
  
  
    }



  

  ///////////////////// gráficas estáticas /////////////////////////////

  // Definir los límites y la escala
  let xMin = -5;
  let xMax = 5;
  
  let yMin = min(min(yPsi0), min(yPsi1), min(yPsi2), min(yPsi3), min(yPsi4), potencial(xMin, 1, 1));
  let yMax = max(max(yPsi0), max(yPsi1), max(yPsi2), max(yPsi3), max(yPsi4), potencial(xMax, 1, 1));

  let ySquaredMin = min(min(yPsi0sq), min(yPsi1sq), min(yPsi2sq), min(yPsi3sq), min(yPsi4sq));
  let ySquaredMax = max(max(yPsi0sq), max(yPsi1sq), max(yPsi2sq), max(yPsi3sq), max(yPsi4sq));


  // dibujar el potencial
  stroke(0);
  noFill();
  beginShape();
  for (let i = 0; i < xValues.length; i++) {
    let x = map(xValues[i], xMin, xMax, 50, 800 - 400);
    let y = map(potencial(xValues[i], 1, 1), yMin, yMax, height - 200, 50);
    vertex(x, y);
  }
  endShape();
  


  // Dibujar funciones de onda estáticas
  
  /// psi0
  if (showPsi0) {
    stroke(29, 120, 116);
    noFill();
    beginShape();
    for (let i = 0; i < xValues.length; i++) {
      let x = map(xValues[i], xMin, xMax, 50, 800 - 400);
      let y = map(yPsi0[i], yMin, yMax, height - 200, 50);
      vertex(x, y);
    }0
    endShape();
  }
  
  /// psi1
  if (showPsi1) {
    stroke(226, 114, 91);
    noFill();
    beginShape();
    for (let i = 0; i < xValues.length; i++) {
      let x = map(xValues[i], xMin, xMax, 50, 800 - 400);
      let y = map(yPsi1[i], yMin, yMax, height - 200, 50);
      vertex(x, y);
    }
    endShape();
  }

  /// psi2
  if (showPsi2) {
    stroke(114, 104, 166);  // Color morado (Psi2)
    noFill();
    beginShape();
    for (let i = 0; i < xValues.length; i++) {
      let x = map(xValues[i], xMin, xMax, 50, 800 - 400);
      let y = map(yPsi2[i], yMin, yMax, height - 200, 50);
      vertex(x, y);

    }
    endShape();
  }
  
  /// psi3
  if (showPsi3) {
    stroke(120, 192, 168); // Color amarillo (Psi3)
    noFill();
    beginShape();
    for (let i = 0; i < xValues.length; i++) {
      let x = map(xValues[i], xMin, xMax, 50, 800 - 400);
      let y = map(yPsi3[i], yMin, yMax, height - 200, 50);
      vertex(x, y);
    }
    endShape();
  }

  /// psi4
  if (showPsi4) {
    stroke(230, 59, 96); // Color cyan (Psi4)
    noFill();
    beginShape();
    for (let i = 0; i < xValues.length; i++) {
      let x = map(xValues[i], xMin, xMax, 50, 800 - 400);
      let y = map(yPsi4[i], yMin, yMax, height - 200, 50);
      vertex(x, y);
    }
    endShape();
  }


////// dibujar funciones de onda en el tercer recuadro ///////////////////
  
  /// psi0
  if (showPsi0) {
    stroke(29, 120, 116);
    noFill();
    beginShape();
    for (let i = 0; i < xValues.length; i++) {
      let x = map(xValues[i], xMin, xMax, 1200 - 390, 1200 - 390 + 350);
      let ySquared = map(yPsi0sq[i], ySquaredMin, ySquaredMax, height - 200, 50); 
      vertex(x, ySquared);
    }
    endShape();
  }

  /// psi1
  if (showPsi1) {
    stroke(226, 114, 91);
    noFill();
    beginShape();
    for (let i = 0; i < xValues.length; i++) {
      let x = map(xValues[i], xMin, xMax, 1200 - 390, 1200 - 390 + 350);
      let ySquared = map(yPsi1sq[i], ySquaredMin, ySquaredMax, height - 140, 50); 
      vertex(x, ySquared);
    }
    endShape();
  }

  /// psi2
  if (showPsi2) {
    stroke(114, 104, 166);
    noFill();
    beginShape();
    for (let i = 0; i < xValues.length; i++) {
      let x = map(xValues[i], xMin, xMax, 1200 - 390, 1200 - 390 + 350);
      let ySquared = map(yPsi2sq[i], ySquaredMin, ySquaredMax, height - 20, 50); // Ajusta el mapeo en y
      vertex(x, ySquared);
    }
    endShape();
  }

  /// psi3
  if (showPsi3) {
    stroke(120, 192, 168);
    noFill();
    beginShape();
    for (let i = 0; i < xValues.length; i++) {
      let x = map(xValues[i], xMin, xMax, 1200 - 390, 1200 - 390 + 350);
      let ySquared = map(yPsi3sq[i], ySquaredMin, ySquaredMax, height + 300, 50); // Ajusta el mapeo en y
      vertex(x, ySquared);
    }
    endShape();
  }

  /// psi4
  if (showPsi4) {
    stroke(230, 59, 96); 
    noFill();
    beginShape();
    for (let i = 0; i < xValues.length; i++) {
      let x = map(xValues[i], xMin, xMax, 1200 - 390, 1200 - 390 + 350);
      let ySquared = map(yPsi4sq[i], ySquaredMin, ySquaredMax, height -235, 50); // Ajusta el mapeo en y
      vertex(x, ySquared*4);
    }
    endShape();
  }

    
///// Dibujar la líneas horizontal punteadas //////////////////////
  /// E0
  let yLine = map(hbar * w / 2, yMin, yMax, height - 200, 50);
  stroke(0); 
  strokeWeight(2); 
  strokeCap(SQUARE);
  for (let x = 50; x < 800 - 400; x += 10) {
    line(x, yLine, x + 5, yLine);
    x += 10;
  }
  // línea horizontal punteada equivalente en el tercer recuadro
  let yLinesq = map(hbar * w / 2, yMin, yMax, height - 200, 50);
  stroke(0); 
  strokeWeight(2); 
  strokeCap(SQUARE);
  for (let x = 810; x < 1200 - 40; x += 10) {
    line(x, yLinesq, x + 5, yLinesq);
    x += 10;
  }


  /// E1
  let yLine1 = map(hbar * w * 3/ 2, yMin, yMax, height - 200, 50);
  stroke(0); 
  strokeWeight(2); 
  strokeCap(SQUARE); 
  for (let x = 50; x < 800 - 400; x += 10) {
    line(x, yLine1, x + 5, yLine1);
    x += 10;
  }

  let yLine1sq = map(hbar * w * 3/ 2, yMin, yMax, height - 200, 50);
  stroke(0); 
  strokeWeight(2); 
  strokeCap(SQUARE); 
  for (let x = 810; x < 1200 - 40; x += 10) {
    line(x, yLine1sq, x + 5, yLine1sq);
    x += 10;
  }

  /// E2
  let yLine2 = map(hbar * w * 5/ 2, yMin, yMax, height - 200, 50);
  stroke(0); 
  strokeWeight(2); 
  strokeCap(SQUARE); 
  for (let x = 50; x < 800 - 400; x += 10) {
    line(x, yLine2, x + 5, yLine2);
    x += 10;
  }

  let yLine2sq = map(hbar * w * 5/ 2, yMin, yMax, height - 200, 50);
  stroke(0); 
  strokeWeight(2); 
  strokeCap(SQUARE); 
  for (let x = 810; x < 1200 - 40; x += 10) {
    line(x, yLine2sq, x + 5, yLine2sq);
    x += 10;
  }


  /// E3
  let yLine3 = map(hbar * w * 7/ 2, yMin, yMax, height - 200, 50);
  stroke(0); 
  strokeWeight(2); 
  strokeCap(SQUARE); 
  for (let x = 50; x <800 - 400; x += 10) {
    line(x, yLine3, x + 5, yLine3);
    x += 10;
  }

  let yLine3sq = map(hbar * w * 7/ 2, yMin, yMax, height - 200, 50);
  stroke(0); 
  strokeWeight(2); 
  strokeCap(SQUARE); 
  for (let x = 810; x < 1200 - 40; x += 10) {
    line(x, yLine3sq, x + 5, yLine3sq);
    x += 10;
  }

  /// E4
  let yLine4 = map(hbar * w * 9/ 2, yMin, yMax, height - 200, 50);
  stroke(0); 
  strokeWeight(2); 
  strokeCap(SQUARE); 
  for (let x = 50; x < 800 - 400; x += 10) {
    line(x, yLine4, x + 5, yLine4);0
    x += 10;
  }

  let yLine4sqq = map(hbar * w * 9/ 2, yMin, yMax, height - 200, 50);
  stroke(0); 
  strokeWeight(2); 
  strokeCap(SQUARE); 
  for (let x = 810; x < 1200 - 40; x += 10) {
    line(x, yLine4sqq, x + 5, yLine4sqq);0
    x += 10;
  }



}

/////  funciones de onda estáticas //////////////////////////
/// psi0
function psio(x, m, w) {
  return sqrt(m * w / (PI * hbar)) * exp(-m * w * x * x / (2 * hbar));
}

/// psi1
function psi1(x, m, w) {
  return (1 / sqrt(2)) * sqrt(m * w / (PI * hbar)) * 2 * sqrt(m * w / hbar) * x * exp(-m * w * x * x / (2 * hbar));
}

/// psi2
function psi2(x, m, w) {
  return (1 / sqrt(8)) * sqrt(m * w / (PI * hbar)) * (4 * (m * w / hbar) * x * x - 2) * exp(-m * w * x * x / (2 * hbar));
}

/// psi3
function psi3(x, m, w) {
  return (1 / sqrt(48)) * sqrt(m * w / (PI * hbar)) * (8 * (m * w / hbar) ** (3 / 2) * x ** 3 - 12 * sqrt(m * w / hbar) * x) * exp(-m * w * x * x / (2 * hbar));
}

/// psi4
function psi4(x, m, w) {
  return (1 / sqrt(384)) * sqrt(m * w / (PI * hbar)) * (16 * (m * w / hbar) ** 2 * x ** 4 - 48 * (m * w / hbar) * x ** 2 + 12) * exp(-m * w * x * x / (2 * hbar));
}

/// superposición
function sum(x, m, w){
  return psio(x, m, w) + psi1(x, m, w) + psi2(x, m, w) + psi3(x, m, w) + psi4(x, m, w);
}

///// potencial //////////////////////
function potencial(x, m, w) {
  return 0.5 * m * w * w * x * x;
}

///// funciones de onda propagadas en el tiempo ///////

/// psi0
function psi0_t(x, t) {
  let result =  (m * w / (Math.PI*hbar)) * Math.exp((-m * w * 2 * x * x) / 2*hbar) * Math.cos(w * t);
  return result;
}

/// psi1
function psi1_t(x, t) {
  let result =  1/(2)**(1/2) * (m * w / (Math.PI*hbar))**(1/4) * Math.exp((-m * w * 2 * x * x) / 2*hbar) * Math.cos(w * t) * 2 * Math.sqrt(m * w / hbar) * x;
  return result;
}

/// psi2
function psi2_t(x, t){
  let result =  1/(8)**(1/2) * (m * w / (Math.PI*hbar))**(1/4) * Math.exp((-m * w * 2 * x * x) / 2*hbar) * Math.cos(w * t) * (4 * (m * w / hbar) * x * x - 2);
  return result;
}

/// psi3
function psi3_t(x, t){
  let result =  1/(48)**(1/2) * (m * w / (Math.PI*hbar))**(1/4) * Math.exp((-m * w * 2 * x * x) / 2*hbar) * Math.cos(w * t) * (8 * (m * w / hbar) ** (3 / 2) * x ** 3 - 12 * Math.sqrt(m * w / hbar) * x);
  return result;
}

/// psi4
function psi4_(x, t){
  let result1 = 1/(384)**(1/2) * (m * w / (Math.PI*hbar))**(1/4) * Math.exp((-m * w * 2 * x * x) / (2*hbar)) * Math.cos(w * t) * (16 * (m * w / hbar) ** 2 * x ** 4 - 48 *Math.sqrt(m * w / hbar) * x ** 2 + 12);
  return result1;
}

/// superposición de los primeros 5 estados
function sum_psi(x, t){
  let result = psi0_t(x, t) + psi1_t(x, t) + psi2_t(x, t) + psi3_t(x, t) + psi4_(x, t);
  return result
}


/// actualizar el valor de m
function updateM() {
  let selectedValue = selectM.value();

  // Convierte el valor seleccionado en un número si es necesario
  m = parseFloat(selectedValue);

}


/// cargar la imagen para el fondo 
function preload() {
  // Carga la imagen de fondo
  backgroundImage = loadImage('background.jpg');
}




