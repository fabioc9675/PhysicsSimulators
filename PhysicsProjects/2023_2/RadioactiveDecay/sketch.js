/* ************************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 ******************
 * ************************************************************
 * * Autores: Simón González Gómez, Santiago Galvis Duque     *
 *            y José Luis Builes Canchala                     *
 * * Institución: Universidad de Antioquia                    *
 * ***********************************************************/
// Inicializando Objetos

let sliderNel1, sliderNel2, startButton;
let simulationStarted = false;

// Fijamos algunos valores iniciales

let Nel1 = 1000;
let Nel2 = 100;
let lambdael1 = Math.log(2) / 14.8;
let lambdael2 = Math.log(2) / 10.8;
let dt = 0.01;
let t = Array.from({length: 10000}, (_, i) => i * dt);

// Funcion que calcula arreglos para los Decaimientos

function calculateDecay(Nel1, Nel2, lambdael1, lambdael2) {
  let dt = 0.01;
  let t = Array.from({length: 10000}, (_, i) => i * dt);
  let Pel1 = 1 - Math.exp(-lambdael1 * dt);
  let Pel2 = 1 - Math.exp(-lambdael2 * dt);
  let Nel1list = [Nel1];
  let Nel2list = [Nel2];

  for(let i = 0; i < t.length; i++){
    let Randel1 = Array.from({length: Nel1list[Nel1list.length - 1]}, () => Math.random());
    let Randel2 = Array.from({length: Nel2list[Nel2list.length - 1]}, () => Math.random());
    let decayel1 = Randel1.map(x => x < Pel1);
    let decayel2 = Randel2.map(x => x < Pel2);
    let newNel1 = Nel1list[Nel1list.length - 1] - decayel1.reduce((a, b) => a + b, 0);
    let newNel2 = Nel2list[Nel2list.length - 1] + decayel1.reduce((a, b) => a + b, 0) - decayel2.reduce((a, b) => a + b, 0);

    // Check if the calculated values are negative. If they are, set them to zero.
    newNel1 = newNel1 < 0 ? 0 : newNel1;
    newNel2 = newNel2 < 0 ? 0 : newNel2;

    Nel1list.push(newNel1);
    Nel2list.push(newNel2);
  }

  return [Nel1list, Nel2list];
}

// Función para descargar valores de decaimiento
function downloadData() {
  let data = calculateDecay(Nel1, Nel2, lambdael1, lambdael2);
  let blob1 = new Blob([data[0]], {type: 'text/plain'});
  let blob2 = new Blob([data[1]], {type: 'text/plain'});
  let url1 = URL.createObjectURL(blob1);
  let url2 = URL.createObjectURL(blob2);
  downloadFile(url1, 'Data1.txt');
  downloadFile(url2, 'Data2.txt');
}

function downloadFile(url, fileName) {
  let a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Configuración del Canvas

// Dimensiones
let canvasX = 1248;
let canvasY = 790;
let padding = 20; // Padding de la gráfica
let bkgndColor = 220; // Color

// Otras dimensiones
let graphWidth = canvasX*0.70;
let graphHeight = canvasY*0.70;
let canvas2X = padding;
let canvas2Y = 140;
let gridSize = 30;

// Setup de la Simulación
function setup() {

  // Creando Canvas
  createCanvas(canvasX, canvasY);
  innerCanvas = createGraphics(graphWidth+4*padding, graphHeight+4.5*padding);
  frameRate(60);
  background(bkgndColor);

  // Creando Sliders

  // Número de Elementos
  sliderNel1 = createSlider(0, 2000, Nel1);
  sliderNel1.position(130, 70);
  sliderNel1.input(resetSimulation);

  sliderNel2 = createSlider(0, 200, Nel2);
  sliderNel2.position(130, 100);
  sliderNel2.input(resetSimulation);

// Tasa de decaimiento Lambda
  sliderLambdaEl1 = createSlider(0, 0.2, lambdael1, 0.01);
  sliderLambdaEl1.position(370, 70);
  sliderLambdaEl1.input(resetSimulation);

  sliderLambdaEl2 = createSlider(0, 0.2, lambdael2, 0.01);
  sliderLambdaEl2.position(370, 100);
  sliderLambdaEl2.input(resetSimulation);

  // Creando Botón de Inicio
  startButton = createButton('Generar datos');
  startButton.position(600, 75);
  startButton.mousePressed(startSimulation);

  // Creando Botón de Descarga
  downloadButton = createButton('Descargar datos');
  downloadButton.position(710, 75);
  downloadButton.mousePressed(downloadData);

  // Grid
  innerCanvas.background(bkgndColor+20);
  image(innerCanvas, canvas2X,canvas2Y);

  for (let x = 3*canvas2X; x < graphWidth+60; x += gridSize) {
    for (let y = canvas2Y+30; y < graphHeight+185; y += gridSize) {
      fill(bkgndColor+30);
      strokeWeight(0.1);
      stroke(0,0,0);
      noFill();
      rect(x, y, gridSize, gridSize);
    }
  }

  // Texto adicional
  strokeWeight(1);
  stroke(0);
  textSize(20);
  text("Decaimiento",graphWidth/2, canvas2Y+20); // Título
  textSize(16);
  text("Tiempo", graphWidth / 2, graphHeight+220); // Eje X
  push();
  rotate(-HALF_PI);
  text("Número de átomos",  -graphHeight, 2.2*padding); // Eje Y
  pop();
}

// Reseteo de simulación cada vez que se modifiquen los Sliders
function resetSimulation() {
    simulationStarted = false;
    background(bkgndColor); // Limpiar plot
    textSize(16);

  	Nel1 = sliderNel1.value();
   	Nel2 = sliderNel2.value();
  	lambdael1 = sliderLambdaEl1.value();
    lambdael2 = sliderLambdaEl2.value();

    strokeWeight(1);
    stroke(0);

    // Creando Sliders y texto adicional
    text("Átomos Iniciales",sliderNel1.x+5,sliderNel1.y-10);
    text(Nel1, sliderNel1.x + sliderNel1.width+10, sliderNel1.y+15);
    text(Nel2, sliderNel2.x + sliderNel2.width+10, sliderNel2.y+15);

    text("Factor de Decaimiento",sliderLambdaEl1.x+5,sliderLambdaEl1.y-10);
    text(lambdael1, sliderLambdaEl1.x + sliderLambdaEl1.width+10, sliderLambdaEl1.y+15);
    text(lambdael2, sliderLambdaEl2.x + sliderLambdaEl2.width+10, sliderLambdaEl2.y+15);

    stroke(255,0,0);
    text("Elemento 1", sliderNel1.x-100, sliderNel1.y+15);

    stroke(0,0,255);
    text("Elemento 2", sliderNel2.x-100, sliderNel2.y+15);

    // Grid
    image(innerCanvas, canvas2X,canvas2Y);
    for (let x = 3*canvas2X; x < graphWidth+60; x += gridSize) {
      for (let y = canvas2Y+30; y < graphHeight+185; y += gridSize) {
        fill(bkgndColor+30);
        strokeWeight(0.1);
        stroke(0,0,0);
        noFill();
        rect(x, y, gridSize, gridSize);
      }
    }

    strokeWeight(1);
    stroke(0);
    textSize(20);
    text("Decaimiento",graphWidth/2, canvas2Y+20); // Title
    textSize(16);
    text("Tiempo", graphWidth / 2, graphHeight+220); // X-axis label
    push();
    rotate(-HALF_PI);
    text("Número de átomos",  -graphHeight, 2.2*padding); // Y-axis label
    pop();

}

// Simulación
function startSimulation() {
  if (!simulationStarted) {
    simulationStarted = true;
    background(bkgndColor); // Clear the previous plot

    Nel1 = sliderNel1.value();
    Nel2 = sliderNel2.value();

    lambdael1 = sliderLambdaEl1.value();
    lambdael2 = sliderLambdaEl2.value();
    strokeWeight(1);
    stroke(0);

    text("Átomos Iniciales",sliderNel1.x+5,sliderNel1.y-10);
    text(Nel1, sliderNel1.x + sliderNel1.width+10, sliderNel1.y+15);
    text(Nel2, sliderNel2.x + sliderNel2.width+10, sliderNel2.y+15);

    text("Factor de Decaimiento",sliderLambdaEl1.x+5,sliderLambdaEl1.y-10);
    text(lambdael1, sliderLambdaEl1.x + sliderLambdaEl1.width+10, sliderLambdaEl1.y+15);
    text(lambdael2, sliderLambdaEl2.x + sliderLambdaEl2.width+10, sliderLambdaEl2.y+15);

    stroke(255,0,0);
    text("Elemento 1", sliderNel1.x-100, sliderNel1.y+15);

    stroke(0,0,255);
    text("Elemento 2", sliderNel2.x-100, sliderNel2.y+15);

    // Generate the plot
    let [Nel1list, Nel2list] = calculateDecay(Nel1, Nel2, lambdael1, lambdael2);
    let maxYValue = Math.max(Math.max(...Nel1list), Math.max(...Nel2list)); // Get the maximum y value
    let maxXValue = Math.max(...t); // Get the maximum x value


    image(innerCanvas, canvas2X,canvas2Y);
    for (let x = 3*canvas2X; x < graphWidth+60; x += gridSize) {
      for (let y = canvas2Y+30; y < graphHeight+185; y += gridSize) {
        fill(bkgndColor+30);
        strokeWeight(0.1);
        stroke(0,0,0);
        noFill();
        rect(x, y, gridSize, gridSize);
      }
    }

    strokeWeight(1);
    stroke(0);
    textSize(20);
    text("Decaimiento",graphWidth/2, canvas2Y+20); // Title
    textSize(16);
    text("Tiempo", graphWidth / 2, graphHeight+220); // X-axis label
    push();
    rotate(-HALF_PI);
    text("Número de átomos",  -graphHeight, 2.2*padding); // Y-axis label
    pop();


    for(let i = 0; i < t.length; i++){
        let x = map(t[i], 0, maxXValue, padding, graphWidth); // Scale the x value
        let y1 = map(Nel1list[i], 0, maxYValue, graphHeight, padding); // Scale the y value
        let y2 = map(Nel2list[i], 0, maxYValue, graphHeight, padding); // Scale the y value
        stroke(255,0,0);
        point(x+2.5*canvas2X, y1+180);
        stroke(0,0,255);
        point(x+2.5*canvas2X, y2+180);


    }
    stroke(0);
    let y0 = map(Nel1list[Nel1list.length-1], 0, maxYValue, graphHeight, padding)+180;
    line(3.1*canvas2X,y0,2.2*canvas2X+graphWidth,y0);

    stroke(255,0,0);
    text("Elemento 1", graphWidth-18, 200);
    stroke(0,0,255);
    text("Elemento 2", graphWidth-18, 220);

    textSize(12);
    stroke(0);
    text(Nel1,25, 200);
    text(Nel2,27, 685);
    text(0,45, 730);

  }

}

// Función Dibujo
function draw() {

  // Elementos por defecto
  stroke(0);
  textSize(16);
  Nel1 = sliderNel1.value();
  Nel2 = sliderNel2.value();
  lambdael1 = sliderLambdaEl1.value();
  lambdael2 = sliderLambdaEl2.value();

  text("Átomos Iniciales",sliderNel1.x+5,sliderNel1.y-10);
  text(Nel1, sliderNel1.x + sliderNel1.width+10, sliderNel1.y+15);
  text(Nel2, sliderNel2.x + sliderNel2.width+10, sliderNel2.y+15);

  text("Factor de Decaimiento",sliderLambdaEl1.x+5,sliderLambdaEl1.y-10);
  text(lambdael1, sliderLambdaEl1.x + sliderLambdaEl1.width+10, sliderLambdaEl1.y+15);
  text(lambdael2, sliderLambdaEl2.x + sliderLambdaEl2.width+10, sliderLambdaEl2.y+15);

  stroke(255,0,0);
  text("Elemento 1", sliderNel1.x-100, sliderNel1.y+15);

  stroke(0,0,255);
  text("Elemento 2", sliderNel2.x-100, sliderNel2.y+15);

  noLoop(); // No se requiere iteratividad

  }