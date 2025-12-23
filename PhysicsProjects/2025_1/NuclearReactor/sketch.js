/************************************************************
 ******** Reactor RBMK **********************
 *************************************************************
 ** Autor: Kevin A. Restrepo Tobón                          **
 **        Samuel Duran Bustamante                          **
 **        Juan C. Gallego Bedoya                           **
 ** Institución: Universidad de Antioquia                   **
 ** Curso: Laboratorio avanzado 3  2025-1                   **
 *************************************************************/

/* RBMK Reactor Simulation
  Esta simulación está altamente inspirada por y copia las decisiones de diseño 
  de la explicación visual de Higgsion Physics: https://www.youtube.com/watch?v=P3oKNE72EzU

  repositorio: https://gitlab.com/KevinRestrepo/rbmksim
*/

const FPS = 60;
let dt = 1 / FPS;
let text_size;
//algunos assets
let clickSound;
let alertimg;

let mousePressPos = null;
// constantes del canvas
let canvas;
// Grid dimensions
const gridRows = 21;
const gridCols = 40;
const totalCells = gridRows * gridCols;
let grid = []; // 2D array: grid[i][j] contiene [uranium, water] objetos
let cellWidth, cellHeight;
let mediumCellWidth, mediumCellHeight;
//neutrones
let goal = 40; // Meta de reactividad por defecto
let neutronlist = [];
//Control rods
//control rods son varas verticales negras que absorben neutrones
let controlRodsList = [];
let controlRodMap = {};
//moderator rods son varas verticales blancas que moderan neutrones rápidos
let moderatorRodsList = [];
let moderatorRodMap = {};

//constantes del dibujo
let RODS_WIDTH;
const ROD_SPACING = 4; //spaciado de las varas en número de columnas
//Dimensiones de las partículas
let NEUTRON_DIAMETER;
let FAST_NEUTRON_DIAMETER;
let NUCLEI_DIAMETER;
let COLLISION_DISTANCE;

//Parámetros de la simulación
let THERMAL_VELOCITY;
let FAST_VELOCITY;
const ACTIVE_PROPORTION = 1 / 2; //proporción inicial de nucleos activos
const XENON_PROPORTION = 1 / 4; //qué tanto de esos nucleos activos son Xe-135

let cooling_speed = 0.5; //velocidad por defecto de bombeo de agua
const HEATING_FACTOR = 0.01; // cuánto se calianta el agua con cada interacción con un neutrón

//HTML strings para leyendas y tootip.
let waterLegend = `<p> El paso de los neutrones calienta el agua hasta
                  evaporarla, esta puede enfriarse y la velocidad de enfriamiento es proporcional
                  al bombeo de agua. </p>
                  <p> El agua tiene una probabilidad de absorber neutrones sólo si no es vapor.</p>
                   <center><img src = "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/NuclearReactor/assets/water.gif" style = "width: 50px;"></center>`;
let neutronLegend = `<p>Sólo los neutrones térmicos tienen la velocidad lo suficientemente baja como para interactuar con los nucleos.</p>`;
let fastneutronLegend = `<p>Fision y emisión espontánea emiten neutrones rápidos que no interactuan con los nucleos.</p>`;
let uraniumLegend = `<p>Este es el combustible de la reacción nuclear; cuando un neutrón termal
                    choca con él sucede fisión y se emiten de 2 a 3 neutrones rápidos.</p>
                    <p>U-235 es reingresado en el reactor constantemente para mantener viva la reacción en cadena.</p>
                    <center><img src = "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/NuclearReactor/assets/fission.gif" style = "width: 50px;"></center>`;
let xenonLegend = `<p>Luego de la fisión, U-235 tiene una probabilidad de dejar como
                  remanente Xe-135, el cual tiene la propiedad de absorber neutrones térmicos.</p>
                  <p>Xe sólo puede ser eliminado mediante esta absorción.</p>
                  <center><img src = "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/NuclearReactor/assets/xenon.gif" style = "width: 50px;"></center>`;
let inactiveLegend = `<p>Uno de los posibles fragmentos de fisión de U-235, no
                      interactúa con nada pero tiene una probabilidad de emitir neutrones rápidos
                      espontáneamente.</p>
                      <center><img src = "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/NuclearReactor/assets/spontaneuos_radiation.gif" style = "width: 50px;"></center>`;
let controlLegend = `<p>Absorben neutrones y así controlan la reacción en cadena, su
                    estado puede ser controlado desde el panel de control.</p>
                    <center><img src = "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/NuclearReactor/assets/controlrods.gif" style = "width: 50px;"></center>`;
let moderatorLegend = `<p>Varas de grafito que absorben energía cinética de los
                      neutrones rápidos, volviéndolos térmicos. Hay uno en la punta de cada vara de
                      control.</p>
                      <center> <img src = "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/NuclearReactor/assets/moderator.gif" style = "width: 50px;"></center>`;
let infoBoxHTML = ` <h3><center>RBMK Reactor</center></h3>
                    <p style = "font-size: 12px; text-align: right;color: gray;">Pase el mouse sobre la leyenda para obtener más detalle de los elementos del reactor.</p>
                    <p>Hola camarada, a continuación tendrá los conceptos básicos para un exitoso control de este reactor.</p>
                    <p>Los neutrones son el principal factor en la fisión y por lo tanto, en la producción de energía.
                    No dejes que se acaben pero tampoco permitas que la reacción en cadena se torne fuera de control. El control automático está hecho para ayudar con esto; la computadora insertará o extraerá cada dos varas de control para intentar mantener constante el número de neutrones que se le ingrese en el panel de control.</p>
                    <p>Pero la computadora no puede hacer todo por ella misma, las demás varas de control se pueden subir o insertar manualmente dependiendo de si se quiere más o menos reactividad. Debido a que los neutrones rápidos son inútiles para la reacción, se instalan moderadores entre cada vara de control y adicionalmente en las puntas de cada una.</p>
                    <p>Otro mecanismo de control lo ofrece el agua, esta tiene una baja probabilidad de absorber neutrones, pero si se encuentra en forma de vapor, estos pueden viajar libremente. Controla la velocidad a la que se enfría el agua con el deslizador de Bombeo de Agua en el panel de control. Esto permitirá que más celdas de vapor (o vacíos) se formen, aumentando la reactividad.</p>
                    <center><img src ="https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/NuclearReactor/assets/fullCollision.gif" style="width: 150px;"></center>
                    <p>Por último, mantenga un ojo a los indicadores de coeficiente de vacío y acumulación de Xenón abajo en la derecha, estos indican qué proporción de vapor y Xe-135 hay acumulado en el reactor. Un alto coeficiente de vacío implica alta reactividad debido a que los neutrones no están siendo absorbidos por el agua, una alta acumulación de Xenón, en cambio, disminuye la reactividad por su propiedad absorbente, la única forma de deshacerse del Xenón es generando más neutrones de lo normal para que puedan ser absorbidos, esto se conoce como quemar el Xenón.</p>
                    <p>Mantener una producción de neutrones constante requiere de un fino control de estos parámetros, no es deseable una reactividad muy baja que mate la reacción en cadena, pero tampoco es deseable la creación de una bomba nuclear. En el peor de este último caso, tienes a la disposición el botón SCRAM, el cual acabará con cualquier reacción en cadena mediante la rápida inserción de todas las varas de control, solo asegúrese de no pulsarlo demasiado tarde.</p>
                    <div style="text-align: center;"><button id="closeBtn">Cerrar</button></div>
                  `;

let infoBox, legendBox;

function preload() {
  //Precargado de los assets
  clickSound = loadSound(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/NuclearReactor/assets/geigerClick.mp3"
  ); //geiger click sound
  clickSound.setVolume(0.4);
  alertimg = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/NuclearReactor/assets/kitty.png"
  ); //alerta cuando no hay bombeo de agua
  infoimg = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/NuclearReactor/assets/information-button.png"
  ); //tooltip icono
}

function setup() {
  frameRate(FPS);
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  //estilo global para todos los objetos DOM
  createElement(
    "style",
    `
    * {
      font-family: Arial, Helvetica, sans-serif !important;
    }
  `
  );

  //infoBox se refiere a la caja de información (tooltip)
  infoBox = createDiv(infoBoxHTML);
  infoBox.style(`
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255,255,255,0.95);
    border: 2px solid #333;
    border-radius: 12px;
    padding: 20px;
    width: 500px;
    height: 400px;
    overflow-y: auto;
    display: none;
    box-shadow: 0 8px 16px rgba(0,0,0,0.25);
    z-index: 1000;
  `);

  // botón de cerrar el tooltip
  infoBox.child(select("#closeBtn")).mousePressed(() => {
    infoBox.hide();
  });

  //legendBox se refiere a las cajas de leyenda al pasar el mouse sobre la leyenda
  legendBox = createDiv("");
  legendBox.style(`
    position: absolute;
    background: rgba(255,255,255,0.95);
    border: 2px solid #333;
    padding: 8px;
    border-radius: 12px;
    width: 200px;
    display: none;
    font-size: 14px;
  `);

  //Todo este setup es para que las dimensiones del dibujo se adapten al tamaño de la pantalla
  cellWidth = width / gridCols;
  cellHeight = height / gridRows;
  //por razones de optimización guardamos las mitades de estos valores
  mediumCellHeight = cellHeight / 2;
  mediumCellWidth = cellWidth / 2;
  const cellSize = min(cellWidth, cellHeight);

  //escala la velocidad de los neutrones en función del tamaño de la celda para evitar tunneling
  THERMAL_VELOCITY = cellSize * 4; // 4 cells per second
  FAST_VELOCITY = cellSize * 6.5; // 6.5 cells per second
  //escala el tamaño del texto en función del tamaño de la celda
  text_size = cellSize * 0.4; // 40%

  // cellHeight = cellWidth; // Hacer las celdas cuadradas

  NUCLEI_DIAMETER = min(cellWidth, cellHeight) * 0.6; // 60% de la celda
  NEUTRON_DIAMETER = NUCLEI_DIAMETER * 0.3; // 30% de lal nucleo
  FAST_NEUTRON_DIAMETER = NEUTRON_DIAMETER * 1.3; // los neutrones rápidos son un poco más grande para mejor visualización
  COLLISION_DISTANCE = (NEUTRON_DIAMETER + NUCLEI_DIAMETER) / 2;

  RODS_WIDTH = cellWidth * 0.13; // grosor de las varas, 13% del ancho de celda

  // empieza la simulación con 30 neutrones térmicos distribuidos aleatoriamente
  for (let i = 0; i < 30; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let angle = random(0, 2 * PI); // Random angle
    let newNeutron = new Neutron(x, y, true, angle); // Thermal neutron
    neutronlist.push(newNeutron);
  }

  fillGrid(); //inicializa la cuadrícula
  fillControlRodsList(2); //inicializa las varas de control
  fillModeratorRodsList(0); //inicializa las varas de moderación

  //**********************UI***********************
  reactivityGoal = createInput("40", "number"); //cuántos neutrones el control automático debe mantener, 40 por defecto
  //varas de control
  automaticControl = createCheckbox("Control automático |", true); //control automático
  controlRadio = createRadio();
  controlRadio.option("insert", "Insertar varas de control");
  controlRadio.option("pullUp", "Retirar varas de control");
  controlRadio.option("None", "STOP");
  controlRadio.selected("None"); // Default selection
  //bombeo de agua
  waterPumpingSlider = createSlider(0, 1, cooling_speed, 0);
  //SCRAM
  //scram container
  scramContainer = createDiv();

  scramLabel = createP("SCRAM");
  scramLabel.parent(scramContainer);
  scram = createCheckbox("", false);
  scram.parent(scramContainer);

  //botón de información
  infobutton = createImg(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/NuclearReactor/assets/information-button.png",
    "clickable button"
  );
  infobutton.style("width", nf(cellSize, 1, 1) * 0.9 + "px");
  infobutton.style("cursor", "pointer");
  infobutton.position(width * 0.957, 0);
  infobutton.mousePressed(openTooltip);

  //**************LEYENDA *****************/
  //Agua
  let pg = createGraphics(cellWidth * 0.4, cellWidth * 0.4); //esto crea un mini canvas para dibujar y permite convertirlo en elementos HTML
  pg.background(179, 235, 242);
  let dataURL = pg.canvas.toDataURL();
  let imgButton = createImg(dataURL, "button");
  imgButton.mouseOver(() => {
    legendBox.html(waterLegend);
    legendBox.position(width * 0.01 + 10, height * 0.945 - 280);
    legendBox.style("display", "block");
  });
  imgButton.mouseOut(() => {
    legendBox.style("display", "none");
  });
  imgButton.position(width * 0.01, height * 0.939);

  pg.clear();
  ///Neutron
  pg.fill(0);
  pg.circle(pg.width / 2, pg.height / 2, NEUTRON_DIAMETER * 0.4);
  dataURL = pg.canvas.toDataURL();
  imgButton = createImg(dataURL, "button");
  imgButton.mouseOver(() => {
    legendBox.html(neutronLegend);
    legendBox.position(width * 0.07 + 10, height * 0.94 - 130);
    legendBox.style("display", "block");
  });
  imgButton.mouseOut(() => {
    legendBox.style("display", "none");
  });

  imgButton.position(width * 0.07, height * 0.94);

  pg.clear();
  //fast neutron
  pg.fill("white");
  pg.stroke("black");
  pg.circle(pg.width / 2, pg.height / 2, NEUTRON_DIAMETER * 0.6);
  dataURL = pg.canvas.toDataURL();
  imgButton = createImg(dataURL, "button");
  imgButton.mouseOver(() => {
    legendBox.html(fastneutronLegend);
    legendBox.position(width * 0.18 + 10, height * 0.94 - 110);
    legendBox.style("display", "block");
  });
  imgButton.mouseOut(() => {
    legendBox.style("display", "none");
  });
  imgButton.position(width * 0.18, height * 0.94);

  pg.clear();
  ///Uranium
  pg.fill(31, 186, 255, 255);
  pg.stroke(20, 126, 172, 255);
  pg.circle(pg.width / 2, pg.height / 2, NUCLEI_DIAMETER * 0.4);
  dataURL = pg.canvas.toDataURL();
  imgButton = createImg(dataURL, "button");
  imgButton.mouseOver(() => {
    legendBox.html(uraniumLegend);
    legendBox.position(width * 0.3 + 10, height * 0.94 - 280);
    legendBox.style("display", "block");
  });
  imgButton.mouseOut(() => {
    legendBox.style("display", "none");
  });
  imgButton.position(width * 0.3, height * 0.94);

  pg.clear();
  ///Poison nuclei
  pg.fill(54, 69, 79);
  pg.stroke("black");
  pg.circle(pg.width / 2, pg.height / 2, NUCLEI_DIAMETER * 0.4);
  dataURL = pg.canvas.toDataURL();
  imgButton = createImg(dataURL, "button");
  imgButton.mouseOver(() => {
    legendBox.html(xenonLegend);
    legendBox.position(width * 0.365 + 10, height * 0.94 - 240);
    legendBox.style("display", "block");
  });
  imgButton.mouseOut(() => {
    legendBox.style("display", "none");
  });
  imgButton.position(width * 0.365, height * 0.94);

  pg.clear();
  ///Inactive nuclei
  pg.fill(178, 190, 181, 50);
  pg.stroke("gray");
  pg.circle(pg.width / 2, pg.height / 2, NUCLEI_DIAMETER * 0.4);
  dataURL = pg.canvas.toDataURL();
  imgButton = createImg(dataURL, "button");
  imgButton.mouseOver(() => {
    legendBox.html(inactiveLegend);
    legendBox.position(width * 0.425 + 10, height * 0.94 - 210);
    legendBox.style("display", "block");
  });
  imgButton.mouseOut(() => {
    legendBox.style("display", "none");
  });
  imgButton.position(width * 0.425, height * 0.94);

  pg.clear();
  ///Control Rods
  pg.fill(54, 69, 79);
  pg.stroke("black");
  pg.rect(pg.width / 2, 0, RODS_WIDTH * 0.4, cellHeight * 0.28);
  dataURL = pg.canvas.toDataURL();
  imgButton = createImg(dataURL, "button");
  imgButton.mouseOver(() => {
    legendBox.html(controlLegend);
    legendBox.position(width * 0.54 + 10, height * 0.94 - 200);
    legendBox.style("display", "block");
  });
  imgButton.mouseOut(() => {
    legendBox.style("display", "none");
  });
  imgButton.position(width * 0.54, height * 0.945);

  pg.clear();
  ///Moderator Rods
  pg.fill("white");
  pg.stroke(0);
  pg.rect(pg.width / 2, 0, RODS_WIDTH * 0.4, cellHeight * 0.28);
  dataURL = pg.canvas.toDataURL();
  imgButton = createImg(dataURL, "button");
  imgButton.mouseOver(() => {
    legendBox.html(moderatorLegend);
    legendBox.position(width * 0.64 + 10, height * 0.94 - 200);
    legendBox.style("display", "block");
  });
  imgButton.mouseOut(() => {
    legendBox.style("display", "none");
  });
  imgButton.position(width * 0.64, height * 0.945);

  pg.remove();
}

function draw() {
  background("white");

  push();
  scale(0.97, 0.89); //has espacio para la leyenda y panel de control
  translate(width * 0.007, height * 0.05);
  //dibuja los nucleos y el agua
  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      let u = grid[i][j][0];
      let w = grid[i][j][1];
      u.show();
      if (!u.active) {
        u.spontaneousRadiation();
      }
      w.show();
      w.cool();
    }
  }
  //dibuja las varas de control
  for (let rod of controlRodsList) {
    rod.show();
  }
  //dibuja los moderadores
  for (let rod of moderatorRodsList) {
    rod.show();
  }

  //dibuja los neutrones
  for (let i = 0; i < neutronlist.length; i++) {
    let n = neutronlist[i];
    n.show();
    n.update();
  }
  pop();

  // Remueve los neutrones marcados para eliminación
  neutronlist = neutronlist.filter((n) => !n.toRemove);

  //*******************************UI*********************/
  //************Funcionalidad del panel de control ************/
  //Control Rods UI
  if (automaticControl.checked()) {
    autoControlRods(goal);
  }

  if (controlRadio.value() == "insert") {
    //Controlamos las varas que no son automáticas
    for (let i = 0; i < controlRodsList.length; i += 2) {
      let rod = controlRodsList[i + 1];
      rod.insert();
    }
  } else if (controlRadio.value() == "pullUp") {
    for (let i = 0; i < controlRodsList.length; i += 2) {
      let rod = controlRodsList[i + 1];
      rod.withdraw();
    }
  }
  if (scram.checked()) {
    automaticControl.checked(false); //desactiva el control automático para bajar todas las varas a la misma velocidad
    SCRAM();
  }

  //***************texto y labels de la interfaz***** */ ALERTA: desordenado
  //Mostrar contador
  fill(0);
  textSize(text_size);
  text("Neutrones: " + neutronlist.length, width * 0.01, height * 0.032);

  //Coeficiente de vacío y Xe
  let steamCount = 0;
  let poisonCount = 0;
  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      let water = grid[i][j][1];
      let uranium = grid[i][j][0];
      if (water.hotness >= 1) {
        steamCount++;
      }
      if (uranium.isPoison) {
        poisonCount++;
      }
    }
  }
  //coeficiente de vacío
  let steamPercent = (steamCount / totalCells) * 100;
  fill(0);
  textSize(text_size * 0.9);
  text(
    "Coeficiente de \nvacío: " + nf(steamPercent, 1, 1) + "%",
    width * 0.76,
    height * 0.95
  );
  //acumulación de Xe
  let poisonPercent = (poisonCount / totalCells) * 100;
  text(
    "Acumulación de \nXe: " + nf(poisonPercent, 1, 1) + "%",
    width * 0.85,
    height * 0.95
  );

  //Meta
  text("Meta: ", width * 0.1, height * 0.032);
  reactivityGoal.position(width * 0.13, height * 0.01);
  reactivityGoal.style("width", nf(width * 0.05, 1, 1) + "px");
  reactivityGoal.style("font-size", nf(text_size, 1, 1) + "px");
  //establece el valor de la meta
  goal = parseInt(reactivityGoal.value());
  if (isNaN(goal) || goal < 0) {
    goal = 40; // valor por defecto si la entrada es inválida
  }

  //Posición y texto del control de las varas de control
  text("Varas de Control: ", width * 0.2, height * 0.032);
  automaticControl.position(width * 0.27, height * 0.01);
  automaticControl.style("font-size", nf(text_size, 1, 1) + "px");

  controlRadio.position(width * 0.37, height * 0.01);
  controlRadio.style("font-size", nf(text_size, 1, 1) + "px");

  //SCRAM
  scramContainer.position(width * 0.655, height * 0.005); // Posición del contenedor
  scramContainer.style("display", "flex");
  scramContainer.style("flex-direction", "column"); // Stack vertically
  scramContainer.style("align-items", "center"); // Center contents horizontally
  scramContainer.style("background", "black");
  scramContainer.style("border-radius", "10px"); // 🔘 Rounded corners
  scramLabel.style("margin: 0");
  scramLabel.style("font-size", nf(text_size, 1, 1) * 0.9 + "px");
  scramLabel.style("color", "white");

  scram.style("accent-color", "red"); // El diseño gráfico es mi pasión

  //Bombeo de agua slider
  waterPumpingSlider.position(width * 0.7, height * 0.01);
  waterPumpingSlider.style("width", nf(width * 0.1, 1, 1) + "px");
  cooling_speed = waterPumpingSlider.value(); // Actualiza la velocidad de enfriamiento
  if (cooling_speed == 0) {
    image(alertimg, width * 0.92, height * 0.001, cellWidth, cellHeight); //Es muy peligroso no bombear agua!!
  }
  //label del deslizador
  fill(0);
  textSize(text_size);
  text(
    "Bombeo de agua: " + nf(cooling_speed * 100, 1, 1) + "%",
    width * 0.81,
    height * 0.032
  );

  //Texto de la leyenda
  text("Agua", width * 0.04, height * 0.964);
  text("Neutrones térmicos", width * 0.09, height * 0.964);
  text("Neutrones rápidos", width * 0.21, height * 0.964);
  text("U-235", width * 0.33, height * 0.964);
  text("Xe-135", width * 0.39, height * 0.964);
  text("Elemento ignorable", width * 0.45, height * 0.964);
  text("Varas de control", width * 0.56, height * 0.964);
  text("Moderadores", width * 0.66, height * 0.964);
}

function openTooltip() {
  //abre el cuadro de información
  if (infoBox.style("display") == "none") {
    infoBox.show();
  } else {
    infoBox.hide();
  }
}

function mousePressed() {
  //evita que registre clicks cuando se clickea en elementos del panel de control
  if (event.target != canvas.elt) return;
  mousePressPos = createVector(mouseX, mouseY);
}

function mouseReleased() {
  // click y sostener para crear neutrones en la dirección del movimiento del mouse, como una resortera
  // Nadie sabe que esto se puede hacer pero es divertido.
  if (!mousePressPos) return;

  // Calculate direction from press to release
  let releasePos = createVector(mouseX, mouseY);
  let dir = p5.Vector.sub(releasePos, mousePressPos);

  // Create the neutron at the press position
  let neutron;
  // SHIFT+ click para crear un neutrón rápido.
  if (keyIsDown(SHIFT)) {
    neutron = new Neutron(
      mousePressPos.x,
      mousePressPos.y,
      false,
      dir.heading() - PI
    ); // fast neutron
  } else {
    neutron = new Neutron(
      mousePressPos.x,
      mousePressPos.y,
      true,
      dir.heading() - PI
    ); // thermal neutron
  }
  neutronlist.push(neutron);

  // Reset press position
  mousePressPos = null;
}

function refuel() {
  // Recarga el combustible activando un nucleo aleatorio de la cuadrícula
  let inactiveUraniums = [];
  // Itera y encuentra todos los núcleos inactivos
  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      let u = grid[i][j][0];
      if (!u.active) {
        inactiveUraniums.push(u);
      }
    }
  }
  // Si hay nucleos inactivos, activa uno al azar
  if (inactiveUraniums.length > 0) {
    let chosen = random(inactiveUraniums);
    chosen.active = true;
    chosen.isPoison = false; // resetea su estado de envenenamiento
    chosen.cooldown = random(0, 500); // resetea su enfriamiento de radiación espontánea
  }
}

function autoControlRods(goal) {
  // Automática ajusta la mitad de las varas de control en base del número de neutrones
  // Si el número de neutrones está por debajo de un umbral, retira cada 2 varas de control
  // Si el número de neutrones está por encima del umbral, inserta cada 2 varas de control
  // Este es un mecanismo de retroalimentación simple para controlar la tasa de reacción
  if (neutronlist.length < goal) {
    for (let i = 0; i < controlRodsList.length; i += 2) {
      let rod = controlRodsList[i];
      rod.withdraw();
    }
  } else {
    for (let i = 0; i < controlRodsList.length; i += 2) {
      let rod = controlRodsList[i];
      rod.insert();
    }
  }
}

function SCRAM() {
  //baja todas las varas lo más rápido que pueda
  for (let rod of controlRodsList) {
    rod.insert(0.004);
  }
}

function fillGrid() {
  // función de setup para llenar grid con objetos de nucleo y agua
  // Inicializa grid
  grid = Array.from({ length: gridCols }, () =>
    Array.from({ length: gridRows }, () => [])
  );

  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      let x = (i + 0.5) * cellWidth;
      let y = (j + 0.5) * cellHeight;
      let u = new NUCLEI(x, y);
      let w = new Water(i, j);
      u.active = random() < ACTIVE_PROPORTION; //sigue la proporción dada
      if (u.active) {
        u.isPoison = random() < XENON_PROPORTION;
      }
      //cada elemento de la matriz grid es una lista con dos objetos: [nuclei,water]
      grid[i][j].push(u);
      grid[i][j].push(w);
    }
  }
}

function fillControlRodsList(firstColumnIndex) {
  //Función de setup para llenar la lista de controlRods con objetos ControlRod
  //firstColumnIndex: en qué índice empezar a colocar las varas de control.
  let _ROD_NUMBER =
    Math.floor(
      (width - firstColumnIndex * cellWidth) / (ROD_SPACING * cellWidth)
    ) + 1;
  for (let i = 0; i < _ROD_NUMBER; i++) {
    let j = firstColumnIndex + i * ROD_SPACING;
    let c = new ControlRod(j);
    controlRodsList.push(c);
    controlRodMap[j] = c;
  }
}

function fillModeratorRodsList(firstColumnIndex) {
  //Función de setup para llenar la lista de moderatorRods con objetos ControlRod de tipo moderador
  //firstColumnIndex: en qué índice empezar a colocar los moderadores
  let _ROD_NUMBER =
    Math.floor(
      (width - firstColumnIndex * cellWidth) / (ROD_SPACING * cellWidth)
    ) + 1;

  for (let i = 0; i < _ROD_NUMBER; i++) {
    let j = firstColumnIndex + i * ROD_SPACING;
    let c = new ControlRod(j, "moderator");
    moderatorRodsList.push(c);
    moderatorRodMap[j] = c;
  }
  //cada vara de contról tiene un moderador en la punta
  for (let i = 0; i < controlRodsList.length; i++) {
    let j = controlRodsList[i].j;
    let c = new ControlRod(j, "attached_moderator");
    moderatorRodsList.push(c);
    moderatorRodMap[j] = c;
  }
}

class ControlRod {
  // ControlRod representa una vara vertica que absorbe neutrones
  // para controlar el ratio de la reacción en el reactor
  // j: índice de la columna del reactor (usamos "j" e "i" indistinguiblemente para referirnos a columnas y es bastante confuso)
  // insertDepth: 1.0 significa insertado totalmente, 0.0 significa retraido
  constructor(j, type = "control") {
    this.j = j;
    if (type != "attached_moderator") {
      //las varas empiezan abajo
      this.insertDepth = 1.0; // 1. completamentemente insertada, 0: retirada
    } else {
      //las varas en las puntas de moderación empiezan en las puntas
      this.insertDepth = 0.53;
    }
    this.type = type; // tipo de vara, puede ser "control","moderator"  o "attached_moderator"
    this.h0 = 0; //y inicial de la vara, sólo importa para las attached_moderator
    this.x = j * cellWidth;
  }
  insert(speed = 0.002) {
    //speed está en unidades de pixel por segundo
    this.insertDepth = constrain(this.insertDepth + speed, 0, 1);
  }

  withdraw(speed = 0.002) {
    this.insertDepth = constrain(this.insertDepth - speed, 0, 1);
  }

  show() {
    let h = height * this.insertDepth;

    if (this.type == "control") {
      fill(54, 69, 79);
    } else if (this.type == "moderator") {
      fill("white");
    } else {
      //attached_moderator lógica especial (debe moverse con la vara de control)
      let rodTipY = controlRodMap[this.j].insertDepth * height;
      this.h0 = rodTipY + 5 * cellHeight;
      strokeWeight(2);
      line(this.x + RODS_WIDTH / 2, rodTipY, this.x + RODS_WIDTH, h + this.h0);
      strokeWeight(1);
      fill("white");
    }
    stroke(0);
    rect(this.x, this.h0, RODS_WIDTH, h);
  }

  blocks(x, y) {
    //booleano que determina si la vara bloquea un objeto en la posición (x,y)
    if (this.insertDepth <= 0) return false; // totalmente retirada
    let rodY = height * this.insertDepth + this.h0;
    return x >= this.x && x <= this.x + RODS_WIDTH && y <= rodY && y >= this.h0;
  }
}

class NUCLEI {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.active = true; // para cambio de estado al hacer fisión
    this.cooldown = random(0, 500); // enfriamiento de radiación espontánea (para cuando está inactivo)
    this.isPoison = false; // para el estado de Xe-135
  }

  show() {
    if (this.active) {
      if (!this.isPoison) {
        //es uranio
        fill(31, 186, 255, 255);
        stroke(20, 126, 172, 255);
      } else {
        //es Xe
        fill(54, 69, 79); // charcoil color
        stroke("black");
      }
    } else {
      //es elemento inactivo
      fill(178, 190, 181, 50);
      stroke("gray");
    }
    circle(this.x, this.y, NUCLEI_DIAMETER);
  }

  fission() {
    //Emite entre 2 y 3 neutrones rápidos
    let neutroncount = random([2, 3]);

    for (let i = 0; i < neutroncount; i++) {
      let theta = random(0, 2 * PI);

      let newNeutron = new Neutron(this.x, this.y, false, theta);
      neutronlist.push(newNeutron);
    }
    //Luego de la fisión, hay una probabilidad de convertirse en Xe-135 (envenenamiento de Uranio)
    //Refuel cada que se pierda Uranio para mantener el número constante
    if (random() < 0.3) {
      this.isPoison = true;
      refuel();
      return;
    }
    this.active = false; // desactiva el núcleo
    refuel();
  }

  spontaneousRadiation() {
    // Para nucleos inactivos, emite un neutrón con baja probabilidad y cada cierto tiempo (cooldown)
    //El enfriamiento es para que el mismo nucleo no emita dos veces seguidas
    if (this.cooldown > 0) {
      this.cooldown--;
      return;
    }
    if (random() < 0.0001) {
      // esto corre cada frame, por lo que la probabilidad debe ser pequeña
      let theta = random(0, 2 * PI);
      let newNeutron = new Neutron(this.x, this.y, false, theta); //emite neutrones rápidos
      neutronlist.push(newNeutron);

      this.cooldown = random(0, 500);
    }
  }
}

class Water {
  //El agua es un mecanismo de control
  constructor(i, j) {
    this.i = i; // column index in the grid
    this.j = j; // row index in the grid
    this.x = (i + 0.5) * cellWidth;
    this.y = (j + 0.5) * cellHeight;
    this.hotness = 0; // el agua empieza fría
  }
  show() {
    //texto con hotness para debugging
    // fill(0);
    // textSize(10);
    // text(nf(this.hotness, 2, 2), this.x-4, this.y - 30);
    stroke("white");
    let coldColor = color(179, 235, 242); // Blue color for cold water
    let hotColor = color(255, 116, 108); // Red color for hot water
    let vaporColor = color("white"); // White color for vapor
    let col;

    if (this.hotness < 1) {
      // Interpolate between blue and red
      let t = this.hotness / 1; // Normalize to [0,1]
      col = lerpColor(coldColor, hotColor, t);
    } else {
      col = vaporColor;
    }
    col.setAlpha(100); // Set transparency
    fill(col);
    rect(
      this.x - mediumCellWidth,
      this.y - mediumCellHeight,
      cellWidth,
      cellHeight
    );
  }

  interact(neutron) {
    this.hotness += HEATING_FACTOR; // Incrementa hotness por cada interacción
    this.hotness = constrain(this.hotness, 0, 2); // Limita hotness entre 0 y 2 (para que el estado de vapor dure más tiempo)
    if (this.hotness < 1) {
      //sólo absorbe neutrones si no es vapor
      //pequeña probabilidad de absorción proporcional al tiempo que ha viajado el neutrón
      let probability = 0.002 * neutron.timeTravelled;
      if (random() < probability) {
        neutron.toRemove = true; // Absorb the neutron
      }
    }
  }

  cool() {
    //enfría la celda cada frame
    if (this.hotness > 0 && this.hotness < 1) {
      this.hotness -= 0.12 * cooling_speed * dt; // enfría el agua no evaporada
    } else if (this.hotness >= 1) {
      this.hotness -= 0.12 * cooling_speed * dt * 0.8; // enfría el agua evaporada más lento
    }
  }
}

class Neutron {
  constructor(x, y, isThermal, angle) {
    this.x = x;
    this.y = y;
    this.isThermal = isThermal; // true para neutrones térmicos, falso para neutrones rápidos
    this.angle = angle;
    this.timeTravelled = 0; // Tiempo viajado desde creación
  }
  get velocity() {
    //la velocidad es binaria
    return this.isThermal ? THERMAL_VELOCITY : FAST_VELOCITY;
  }
  show() {
    stroke(0);
    let diameter;
    if (this.isThermal) {
      fill(0);
      diameter = NEUTRON_DIAMETER; // Smaller diameter for thermal neutrons
    } else {
      fill("white");
      diameter = FAST_NEUTRON_DIAMETER; // Larger diameter for fast neutrons
    }
    circle(this.x, this.y, diameter);
    // this.update()
  }
  update() {
    this.x += dt * this.velocity * cos(this.angle);
    this.y += dt * this.velocity * sin(this.angle);
    // Si el neutron sale del canvas, se le considera perdido
    if (this.x >= width * 1.01 || this.x <= 0) {
      //width +10% para que los neutrones interactuan con el moderador más a la derecha
      this.toRemove = true; // Mark neutron for removal
      return; // Exit update to avoid further processing
    }
    if (this.y >= height || this.y <= 0) {
      this.toRemove = true; // Mark neutron for removal
      return; // Exit update to avoid further processing
    }

    this.checkCollision();
    this.timeTravelled += dt; // Increment time traveled
  }

  checkCollision() {
    // chequea interacciónes con el grid y las varas de control
    // Solo se chequea los elementos del grid en el que esté el neutrón (en lugar de chequear todos los elementos del grid)
    // esto es para optimizar el rendimiento
    let gridI = Math.floor(this.x / cellWidth); //determina la columna en la que está el neutrón
    gridI = constrain(gridI, 0, gridCols);
    let gridJ = Math.floor(this.y / cellHeight); //determina la fila en al que está el neutrón
    gridJ = constrain(gridJ, 0, gridRows);

    //chequea absorción de neutrones por las varas de control
    let rod = controlRodMap[gridI]; //esta es la razón de ser de controlRodMap
    if (rod && rod.blocks(this.x, this.y)) {
      // Si hay una rod con ese índice y bloquea el neutrón, remover.
      this.toRemove = true;
      return;
    }
    //chequea colisión con moderadores
    let moderator = moderatorRodMap[gridI];
    if (moderator && moderator.blocks(this.x, this.y) && !this.isThermal) {
      // Si el neutrón no es térmico y hay un moderador que lo bloquea, refleja y cambia su estado a térmico
      this.isThermal = true;
      //bounce back the neutron
      this.angle = PI - this.angle;
    }

    //Nos aseguramos que un índice válido del grid es accedido
    if (gridI >= 0 && gridI < gridCols && gridJ >= 0 && gridJ < gridRows) {
      //check uranium collision
      let u = grid[gridI][gridJ][0];
      if (
        u.active &&
        this.isThermal &&
        dist(this.x, this.y, u.x, u.y) < COLLISION_DISTANCE
      ) {
        if (!u.isPoison) {
          // Si el núcleo es activo, no es Xe y el neutrón es térmico, hay fisión
          clickSound.play();
          u.fission(); // Trigger fission
          this.toRemove = true; // Marca el neutrón para eliminación
          return; // Exit after collision to avoid further processing
        } else {
          // Xe-135 absorbe el neutrón térmico
          this.toRemove = true; // Marca el neutrón para eliminación
          u.active = false; // Desactiva el núcleo
          return; // Exit after collision to avoid further processing
        }
      }
      //Calentamiento del agua, ambos tipos de neutrones calientan el agua por igual, esto podría modificarse
      let w = grid[gridI][gridJ][1];
      w.interact(this);
    }
  }
}
