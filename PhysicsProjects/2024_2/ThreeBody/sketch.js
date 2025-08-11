/* ***********************************************************
 * ******* SIMULACIÓN LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Camilo Gómez Zapata                            *
 * * Institución: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado III                         *
 * ***********************************************************/

// Constantes y configuraciones
const MAX_GRAPH_POINTS = 200;

// Constantes astronómicas reales (unidades SI)
const ASTRONOMICAL_UNIT = 1.496e11; // Unidad Astronómica en metros
const EARTH_MASS = 5.972e24; // Masa de la Tierra en kg
const SUN_MASS = 1.989e30; // Masa del Sol en kg
const MARS_MASS = 6.39e23; // Masa de Marte en kg
const MOON_MASS = 7.34767309e22; // Masa de la Luna en kg
const EARTH_RADIUS = 6.371e6; // Radio de la Tierra en metros
const SUN_RADIUS = 6.957e8; // Radio del Sol en metros
const MARS_RADIUS = 3.389e6; // Radio de Marte en metros
const MOON_RADIUS = 1.737e6; // Radio de la Luna en metros
const MERCURY_MASS = 3.285e23; // Masa de Mercurio en kg
const VENUS_MASS = 4.867e24; // Masa de Venus en kg
const JUPITER_MASS = 1.898e27; // Masa de Júpiter en kg
const SATURN_MASS = 5.683e26; // Masa de Saturno en kg
const URANUS_MASS = 8.681e25; // Masa de Urano en kg
const NEPTUNE_MASS = 1.024e26; // Masa de Neptuno en kg

// Definición de los sistemas planetarios disponibles para simulación
const SYSTEMS = {
  // Sistema Solar completo
  solar: {
    name: "Sistema Solar",
    pxToMeters: 7e8, // Escala de píxeles a metros
    daysPerSecond: 60, // Velocidad de simulación
    graphHorizontalDays: 200, // Días mostrados en las gráficas
    gridSize: 5e10, // Tamaño de la cuadrícula
    bodies: [
      {
        name: "Sol (1.99×10^30 kg)",
        mass: SUN_MASS,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 35,
        color: [255, 255, 0],
      },
      {
        name: "Mercurio (3.29×10^23 kg)",
        mass: MERCURY_MASS,
        x: 0.387 * ASTRONOMICAL_UNIT,
        y: 0,
        vx: 0,
        vy: 47.36e3,
        size: 12,
        color: [169, 169, 169],
      },
      {
        name: "Venus (4.87×10^24 kg)",
        mass: VENUS_MASS,
        x: 0.723 * ASTRONOMICAL_UNIT,
        y: 0,
        vx: 0,
        vy: 35.02e3,
        size: 18,
        color: [255, 198, 73],
      },
      {
        name: "Tierra (5.97×10^24 kg)",
        mass: EARTH_MASS,
        x: ASTRONOMICAL_UNIT,
        y: 0,
        vx: 0,
        vy: 29.78e3,
        size: 19,
        color: [100, 100, 255],
      },
      {
        name: "Marte (6.39×10^23 kg)",
        mass: MARS_MASS,
        x: 1.524 * ASTRONOMICAL_UNIT,
        y: 0,
        vx: 0,
        vy: 24.077e3,
        size: 16,
        color: [255, 100, 100],
      },
    ],
  },
  // Sistema Tierra-Luna con satélite artificial
  earthMoon: {
    name: "Sistema Tierra-Luna",
    pxToMeters: 1.3e6,
    daysPerSecond: 2,
    graphHorizontalDays: 7,
    gridSize: 100e6,
    bodies: [
      {
        name: "Tierra (5.97×10^24 kg)",
        mass: EARTH_MASS,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 30,
        color: [100, 100, 255],
      },
      {
        name: "Luna (7.35×10^22 kg)",
        mass: MOON_MASS,
        x: 384400e3,
        y: 0,
        vx: 0,
        vy: 1.022e3,
        size: 15,
        color: [200, 200, 200],
      },
      {
        name: "Satélite (1000 kg)",
        mass: 1000,
        x: 42164e3,
        y: 0,
        vx: 0,
        vy: 3.075e3,
        size: 10,
        color: [255, 150, 0],
      },
    ],
  },
  // Sistema para demostrar el punto de Lagrange L4
  lagrangeL4: {
    name: "Lagrange L4",
    pxToMeters: 5e8,
    daysPerSecond: 30,
    graphHorizontalDays: 100,
    gridSize: 2e10,
    bodies: [
      {
        name: "Primario (2x10^30 kg)",
        mass: 2e30,
        x: 0,
        y: 0,
        vx: 0,
        vy: -0.4e3,
        size: 35,
        color: [255, 220, 0],
      },
      {
        name: "Secundario (2x10^29 kg)",
        mass: 2e29,
        x: ASTRONOMICAL_UNIT,
        y: 0,
        vx: 0,
        vy: 29.4e3,
        size: 25,
        color: [100, 150, 255],
      },
      {
        name: "Troyano (10^23 kg)",
        mass: 1e23,
        x: ASTRONOMICAL_UNIT / 2,
        y: (ASTRONOMICAL_UNIT * Math.sqrt(3)) / 2,
        vx: -25.5e3,
        vy: 14.7e3,
        size: 12,
        color: [200, 150, 100],
      },
    ],
  },
};

// Clase para representar cuerpos celestes
class Body {
  constructor(config) {
    Object.assign(this, config);
    this.ax = 0; // Aceleración en x
    this.ay = 0; // Aceleración en y

    // Extraer solo el nombre sin la masa para mostrar en la simulación
    this.displayName = this.name.split(" (")[0];
  }

  // Actualiza la posición y velocidad del cuerpo
  update(dt) {
    this.vx += this.ax * dt;
    this.vy += this.ay * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  // Dibuja el cuerpo en la pantalla
  draw(bodyScreenX, bodyScreenY) {
    fill(...this.color);
    noStroke();
    circle(bodyScreenX, bodyScreenY, this.size);

    fill(255); // Texto blanco para mejor visibilidad
    textAlign(CENTER);
    textSize(12); // Tamaño de texto consistente
    text(this.displayName, bodyScreenX, bodyScreenY + this.size + 5);
  }
}

// Clase principal para manejar la simulación física
class Simulation {
  constructor(systemConfig) {
    this.bodies = systemConfig.bodies.map((config) => new Body(config));
    this.daysPerSecond = systemConfig.daysPerSecond;
    this.dt = (1 / 60) * this.daysPerSecond * 24 * 3600; // Delta tiempo en segundos
    this.G = 6.6743e-11; // Constante gravitacional
    this.pxToMeters = systemConfig.pxToMeters;
    this.scale = 1;
    this.viewportWidth = windowWidth - gui.width;
    this.graphHorizontalDays = systemConfig.graphHorizontalDays;
    this.gridSize = systemConfig.gridSize;

    // Inicializa el historial de posiciones
    let com = this.getCenterOfMass();
    this.positionHistory = this.bodies.map((body) => ({
      x: Array(200).fill(body.x - com.x),
      y: Array(200).fill(-(body.y - com.y)),
      times: Array(200).fill(0),
    }));
    this.elapsedDays = 0;

    // Añade almacenamiento de trayectorias
    this.trajectories = this.bodies.map(() => []);
    this.showTrajectories = false;
    this.trajectoryStartTime = 0; // Añade esto para rastrear cuándo comenzaron las trayectorias
  }

  // Actualiza la física del sistema
  update() {
    if (!isPlaying) return;

    // Calcula las aceleraciones
    for (let body of this.bodies) {
      body.ax = 0;
      body.ay = 0;

      for (let other of this.bodies) {
        if (body === other) continue;

        let dx = other.x - body.x;
        let dy = other.y - body.y;
        let dist = sqrt(dx * dx + dy * dy);
        let force = (this.G * body.mass * other.mass) / (dist * dist);

        body.ax += (force * dx) / (dist * body.mass);
        body.ay += (force * dy) / (dist * body.mass);
      }
    }

    // Actualiza posiciones y velocidades
    for (let body of this.bodies) {
      body.update(this.dt);
    }

    this.updatePositionHistory();
    this.elapsedDays += this.dt / (24 * 3600);
  }

  // Actualiza el historial de posiciones para las gráficas
  updatePositionHistory() {
    let com = this.getCenterOfMass();

    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i];
      const history = this.positionHistory[i];

      history.x.shift();
      history.y.shift();
      history.times.shift();

      history.x.push(body.x - com.x);
      history.y.push(-(body.y - com.y));
      history.times.push(this.elapsedDays);
    }

    // Siempre almacena puntos de trayectoria, independientemente de la visibilidad
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i];
      this.trajectories[i].push({
        x: body.x - com.x,
        y: body.y - com.y,
        time: this.elapsedDays,
      });
      // Limita la longitud de la trayectoria para prevenir problemas de memoria
      if (this.trajectories[i].length > 1000) {
        this.trajectories[i].shift();
      }
    }
  }

  // Calcula el centro de masa del sistema
  getCenterOfMass() {
    let totalMass = 0;
    let comX = 0;
    let comY = 0;

    for (let body of this.bodies) {
      totalMass += body.mass;
      comX += body.x * body.mass;
      comY += body.y * body.mass;
    }

    return {
      x: comX / totalMass,
      y: comY / totalMass,
    };
  }

  // Obtiene el centro de la vista
  getCenterOfView() {
    return {
      x: this.viewportWidth / 2,
      y: height / 2,
    };
  }

  // Dibuja el sistema
  draw() {
    let com = this.getCenterOfMass();
    let cov = this.getCenterOfView();

    push();
    translate(0, 0);

    // Dibuja información de la simulación
    fill(200);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    text(`1 segundo real = ${this.daysPerSecond} días simulados`, 10, 10);

    // Dibuja la cuadrícula
    stroke(60);
    strokeWeight(1);

    const gridSpacingPx = this.gridSize / this.pxToMeters;
    const startX = cov.x - Math.floor(this.viewportWidth / 2);
    const startY = cov.y - Math.floor(height / 2);
    const offsetX = (com.x / this.pxToMeters) % gridSpacingPx;
    const offsetY = (com.y / this.pxToMeters) % gridSpacingPx;

    const firstX = startX - (startX % gridSpacingPx) - offsetX;
    for (let x = firstX; x < startX + this.viewportWidth; x += gridSpacingPx) {
      if (x >= 0 && x <= this.viewportWidth) {
        line(x, 0, x, height);
      }
    }

    const firstY = startY - (startY % gridSpacingPx) - offsetY;
    for (let y = firstY; y < startY + height; y += gridSpacingPx) {
      if (y >= 0 && y <= height) {
        line(0, y, this.viewportWidth, y);
      }
    }

    // Dibuja los cuerpos
    for (let body of this.bodies) {
      let bodyXtoCM = body.x - com.x;
      let bodyYtoCM = body.y - com.y;
      let bodyScreenX = cov.x + bodyXtoCM / this.pxToMeters;
      let bodyScreenY = cov.y + bodyYtoCM / this.pxToMeters;
      body.draw(bodyScreenX, bodyScreenY);
    }

    // Dibuja el marcador del centro de masa
    stroke(255, 0, 0);
    strokeWeight(2);
    const markerSize = 8;
    const cmX = cov.x;
    const cmY = cov.y;
    line(
      cmX - markerSize / 2,
      cmY - markerSize / 2,
      cmX + markerSize / 2,
      cmY + markerSize / 2
    );
    line(
      cmX - markerSize / 2,
      cmY + markerSize / 2,
      cmX + markerSize / 2,
      cmY - markerSize / 2
    );

    fill(255, 0, 0);
    noStroke();
    textAlign(LEFT);
    textSize(14);
    text("CM", cmX + markerSize, cmY - markerSize / 2);

    // Actualiza la sección de dibujo de trayectorias
    if (this.showTrajectories) {
      for (let i = 0; i < this.bodies.length; i++) {
        const body = this.bodies[i];
        const trajectory = this.trajectories[i];

        stroke(...body.color, 100);
        strokeWeight(1);
        noFill();

        beginShape();
        for (const point of trajectory) {
          // Solo dibuja puntos recolectados después de habilitar las trayectorias
          if (point.time >= this.trajectoryStartTime) {
            const screenX = cov.x + point.x / this.pxToMeters;
            const screenY = cov.y + point.y / this.pxToMeters;
            vertex(screenX, screenY);
          }
        }
        endShape();
      }
    }

    pop();
  }

  // Añade método para limpiar trayectorias
  clearTrajectories() {
    this.trajectories = this.bodies.map(() => []);
    this.trajectoryStartTime = this.elapsedDays; // Establece el tiempo de inicio al tiempo actual
  }

  // Añade este método a la clase Simulation:
  generateCSV() {
    // Crea fila de encabezado con unidad de días
    let headers = ["Tiempo [Días]"];
    this.bodies.forEach((body) => {
      headers.push(`${body.name}_x [m]`, `${body.name}_y [m]`);
    });

    // Obtiene la longitud más corta de trayectoria para asegurar que todos los datos se alineen
    const minLength = Math.min(...this.trajectories.map((t) => t.length));

    // Crea filas de datos, convirtiendo tiempo a días
    let rows = [];
    for (let i = 0; i < minLength; i++) {
      let row = [this.trajectories[0][i].time.toFixed(2)]; // Formatea días a 2 decimales
      for (let bodyIdx = 0; bodyIdx < this.bodies.length; bodyIdx++) {
        row.push(
          this.trajectories[bodyIdx][i].x,
          this.trajectories[bodyIdx][i].y
        );
      }
      rows.push(row);
    }

    // Combina todas las filas con encabezados
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    return csvContent;
  }
}

// Clase para manejar la interfaz gráfica de usuario
class GUI {
  constructor() {
    this.width = 250;
    this.padding = 10;

    // Inicializa botón de reproducir/pausar
    this.playButton = createButton("Pausar");
    this.updatePlayButtonPosition();
    this.playButton.size(85, 30);
    this.playButton.style("z-index", "1");
    this.playButton.mousePressed(() => {
      isPlaying = !isPlaying;
      this.playButton.html(isPlaying ? "Pausar" : "Reproducir");
    });

    // Inicializa botón de reinicio
    this.restartButton = createButton("Reiniciar");
    this.updateRestartButtonPosition();
    this.restartButton.size(80, 30);
    this.restartButton.style("z-index", "1");
    this.restartButton.mousePressed(() => {
      const wasShowingTrajectories = simulation.showTrajectories; // Almacena el estado actual
      simulation = new Simulation(SYSTEMS[selectedSystem]);
      simulation.showTrajectories = wasShowingTrajectories; // Restaura el estado
      if (wasShowingTrajectories) {
        simulation.trajectoryStartTime = simulation.elapsedDays; // Establece el tiempo de inicio si las trayectorias están habilitadas
      }
      selectedBody = simulation.bodies[0];
      this.updateBodyList();
    });

    // Inicializa selector de sistema
    this.systemSelect = createSelect();
    this.updateSystemSelectPosition();
    this.systemSelect.size(this.width - 2 * this.padding, 30);
    this.systemSelect.style("z-index", "1");

    for (let key in SYSTEMS) {
      this.systemSelect.option(SYSTEMS[key].name, key);
    }
    this.systemSelect.selected(selectedSystem);

    // Inicializa lista de cuerpos
    this.bodyListHeader = createDiv("Cuerpos:");
    this.bodyListHeader.style("color", "#505050");
    this.bodyListHeader.style("margin-bottom", "10px");
    this.bodyListHeader.style("position", "absolute");
    this.bodyListHeader.style("z-index", "1");
    this.updateBodyListHeaderPosition();

    this.bodyListContainer = createDiv();
    this.bodyListContainer.style("background-color", "#ffffff");
    this.bodyListContainer.style("padding", "12px");
    this.bodyListContainer.style("border-radius", "8px");
    this.bodyListContainer.style("position", "absolute");
    this.bodyListContainer.style("width", this.width - 2 * this.padding + "px");
    this.bodyListContainer.style("z-index", "1");
    this.bodyListContainer.style("box-sizing", "border-box");
    this.bodyListContainer.style("overflow-y", "auto");

    this.bodyListContainer.style("::-webkit-scrollbar", "width: 8px");
    this.bodyListContainer.style(
      "::-webkit-scrollbar-track",
      "background: #f1f1f1; border-radius: 4px"
    );
    this.bodyListContainer.style(
      "::-webkit-scrollbar-thumb",
      "background: #c1c1c1; border-radius: 4px"
    );
    this.bodyListContainer.style(
      "::-webkit-scrollbar-thumb:hover",
      "background: #a8a8a8"
    );

    this.updateBodyListPosition();

    const maxHeight = height / 2 + 50 - 160 - 70;
    this.bodyListContainer.style("max-height", maxHeight + "px");

    this.systemSelect.changed(() => {
      selectedSystem = this.systemSelect.value();
      simulation = new Simulation(SYSTEMS[selectedSystem]);
      // Transfiere la configuración actual de visibilidad de trayectorias a la nueva simulación
      simulation.showTrajectories = this.trajectoryCheckbox.checked();
      selectedBody = simulation.bodies[0];
      this.updateBodyList();
    });

    // Añade casilla de verificación de trayectorias
    this.trajectoryCheckbox = createCheckbox("Mostrar trayectorias", false);
    this.updateTrajectoryCheckboxPosition();
    this.trajectoryCheckbox.style("z-index", "1");
    this.trajectoryCheckbox.style("font-size", "14px");
    this.trajectoryCheckbox.changed(() => {
      simulation.showTrajectories = this.trajectoryCheckbox.checked();
      if (this.trajectoryCheckbox.checked()) {
        // Al habilitar, establece el tiempo de inicio al tiempo actual
        simulation.trajectoryStartTime = simulation.elapsedDays;
      } else {
        simulation.clearTrajectories();
      }
    });

    // Añade botón de descarga CSV
    this.downloadButton = createButton("⬇ CSV");
    this.downloadButton.size(85, 30);
    this.downloadButton.style("z-index", "1");
    this.updateDownloadButtonPosition();

    this.downloadButton.mousePressed(() => {
      const csvContent = simulation.generateCSV();
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `trajectories_${selectedSystem}_${new Date()
          .toLocaleString("sv")
          .replace(/[-: ]/g, "")
          .slice(0, 12)}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    // Actualiza estilos de texto para todos los elementos de la GUI
    const textStyle = "font-family: Arial;";

    this.playButton.style(textStyle);
    this.restartButton.style(textStyle);
    this.systemSelect.style(textStyle);
    this.bodyListHeader.style(textStyle);
    this.trajectoryCheckbox.style(textStyle);
    this.downloadButton.style(textStyle);

    this.bodyListHeader.style("font-size", "14px");
  }

  // Actualiza posición del botón de reproducir/pausar
  updatePlayButtonPosition() {
    const rect = document.querySelector("canvas").getBoundingClientRect();
    this.playButton.position(
      rect.left + width - this.width + this.padding,
      rect.top + this.padding
    );
  }

  // Actualiza posición del botón de reinicio
  updateRestartButtonPosition() {
    const rect = document.querySelector("canvas").getBoundingClientRect();
    this.restartButton.position(
      rect.left + width - this.width + this.padding + 95,
      rect.top + this.padding
    );
  }

  // Actualiza posición del selector de sistema
  updateSystemSelectPosition() {
    const rect = document.querySelector("canvas").getBoundingClientRect();
    this.systemSelect.position(
      rect.left + width - this.width + this.padding,
      rect.top + 95
    );
  }

  // Actualiza posición del encabezado de la lista de cuerpos
  updateBodyListHeaderPosition() {
    const rect = document.querySelector("canvas").getBoundingClientRect();
    this.bodyListHeader.position(
      rect.left + width - this.width + this.padding,
      rect.top + 135
    );
  }

  // Actualiza posición de la lista de cuerpos
  updateBodyListPosition() {
    const rect = document.querySelector("canvas").getBoundingClientRect();
    this.bodyListContainer.position(
      rect.left + width - this.width + this.padding,
      rect.top + 155
    );
  }

  // Actualiza la lista de cuerpos
  updateBodyList() {
    const scrollPos = this.bodyListContainer.elt.scrollTop;

    while (this.bodyListContainer.child().length > 0) {
      this.bodyListContainer.child()[0].remove();
    }

    for (let body of simulation.bodies) {
      let bodyDiv = createDiv();
      bodyDiv.style("padding", "8px");
      bodyDiv.style("margin", "4px 0");
      bodyDiv.style("cursor", "pointer");
      bodyDiv.style("border-radius", "4px");
      bodyDiv.style("display", "flex");
      bodyDiv.style("justify-content", "space-between");
      bodyDiv.style("align-items", "center");
      bodyDiv.style(
        "background-color",
        body === selectedBody ? "#e0e0e0" : "#ffffff"
      );
      bodyDiv.style("color", "#303030");
      bodyDiv.style("border", "1px solid #e0e0e0");

      bodyDiv.mouseOver(() => {
        if (body !== selectedBody) {
          bodyDiv.style("background-color", "#f5f5f5");
        }
      });
      bodyDiv.mouseOut(() => {
        if (body !== selectedBody) {
          bodyDiv.style("background-color", "#ffffff");
        }
      });

      let nameSpan = createSpan(body.name);
      nameSpan.style("flex-grow", "1");
      bodyDiv.child(nameSpan);

      bodyDiv.mousePressed(() => {
        selectedBody = body;
        this.updateBodyList();
      });

      this.bodyListContainer.child(bodyDiv);
    }

    this.bodyListContainer.elt.scrollTop = scrollPos;
  }

  // Añade método para actualizar posición de la casilla de verificación
  updateTrajectoryCheckboxPosition() {
    const rect = document.querySelector("canvas").getBoundingClientRect();
    this.trajectoryCheckbox.position(
      rect.left + width - this.width + this.padding,
      rect.top + 50
    );
  }

  // Añade este método a la clase GUI:
  updateDownloadButtonPosition() {
    const rect = document.querySelector("canvas").getBoundingClientRect();
    this.downloadButton.position(
      rect.left + width - this.width + this.padding,
      rect.top + height / 2 - 10 // Justo encima de la primera gráfica
    );
  }

  // Dibuja la interfaz gráfica
  draw(simulation) {
    push();
    this.drawBackground();
    this.drawGraphs(simulation.graphHorizontalDays);

    this.updatePlayButtonPosition();
    this.updateRestartButtonPosition();
    this.updateSystemSelectPosition();
    this.updateBodyListHeaderPosition();
    this.updateBodyListPosition();
    this.updateTrajectoryCheckboxPosition();
    this.updateDownloadButtonPosition();
    pop();
  }

  // Dibuja el fondo de la interfaz
  drawBackground() {
    fill(240);
    noStroke();
    rect(width - this.width, 0, this.width, height);

    fill(80);
    textAlign(LEFT, CENTER);
    textFont("Arial");
    textSize(14);
    text("Sistema:", width - this.width + this.padding, 85);
  }

  // Dibuja las gráficas de posición
  drawGraphs(graphHorizontalDays) {
    if (!selectedBody) return;

    const bodyIndex = simulation.bodies.indexOf(selectedBody);
    const history = simulation.positionHistory[bodyIndex];

    this.drawPositionGraph(
      history.x,
      history.times,
      height / 2 + 45,
      `${selectedBody.name} - Posición X respecto al CM (m)`,
      [220, 100, 100],
      graphHorizontalDays
    );

    this.drawPositionGraph(
      history.y,
      history.times,
      height / 2 + 180,
      `${selectedBody.name} - Posición Y respecto al CM (m)`,
      [100, 100, 220],
      graphHorizontalDays
    );
  }

  // Dibuja una gráfica de posición individual
  drawPositionGraph(data, times, yPosition, label, color, graphHorizontalDays) {
    const graphHeight = 100;
    const graphWidth = this.width - 2 * this.padding;
    const graphX = width - this.width + this.padding;

    fill(240);
    stroke(180);
    rect(graphX, yPosition, graphWidth, graphHeight);

    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal;

    if (range > 0) {
      stroke(120);
      fill(80);
      textAlign(RIGHT, CENTER);
      textSize(12);

      const currentDay = times[times.length - 1];

      for (
        let daysAgo = 0;
        daysAgo <= 0.75 * graphHorizontalDays;
        daysAgo += 0.25 * graphHorizontalDays
      ) {
        const x = map(
          currentDay - daysAgo,
          currentDay - graphHorizontalDays,
          currentDay,
          graphX,
          graphX + graphWidth
        );
        if (x >= graphX && x <= graphX + graphWidth) {
          line(x, yPosition + graphHeight - 5, x, yPosition + graphHeight);
          text(-daysAgo + "d", x, yPosition + graphHeight + 10);
        }
      }

      noFill();
      stroke(...color);
      beginShape();
      for (let i = 0; i < data.length; i++) {
        const x = map(
          times[i],
          times[times.length - 1] - graphHorizontalDays,
          times[times.length - 1],
          graphX,
          graphX + graphWidth
        );
        const y = map(
          data[i],
          minVal,
          maxVal,
          yPosition + graphHeight - 5,
          yPosition + 5
        );
        vertex(x, y);
      }
      endShape();

      fill(80);
      noStroke();
      textAlign(LEFT, CENTER);
      text(label, graphX, yPosition - 10);
      textAlign(RIGHT, CENTER);
      text(maxVal.toExponential(1) + "m", graphX + graphWidth, yPosition + 10);
      text(
        minVal.toExponential(1) + "m",
        graphX + graphWidth,
        yPosition + graphHeight - 10
      );
    } else {
      fill(120);
      noStroke();
      textAlign(CENTER, CENTER);
      text(
        "Sin variación de posición",
        graphX + graphWidth / 2,
        yPosition + graphHeight / 2
      );
    }
  }
}

// Variables globales
let simulation; // Objeto principal de simulación
let gui; // Objeto de interfaz gráfica
let isPlaying = true; // Estado de reproducción
let selectedSystem = "solar"; // Sistema seleccionado
let selectedBody = null; // Cuerpo seleccionado

// Configuración inicial
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial"); // Set default font for all text
  gui = new GUI();
  simulation = new Simulation(SYSTEMS.solar);
  selectedBody = simulation.bodies.find((b) => b.displayName === "Tierra");
  gui.updateBodyList();
}

// Ciclo principal de dibujo
function draw() {
  background(20);

  stroke(80);
  line(width - gui.width, 0, width - gui.width, height);

  simulation.update();
  simulation.draw();
  gui.draw(simulation);
}

// Manejo de redimensionamiento de ventana
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (simulation) {
    simulation.viewportWidth = windowWidth - gui.width;
  }
}
