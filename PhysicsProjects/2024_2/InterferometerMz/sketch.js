/* ***********************************************************
 * ******* SIMULACIÓN LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Fernanda Mora Rey                              *
 * *          Yennifer Yuliana Guerrero Uchima               *
 * *          Dayana Andrea Henao Arbeláez                   *
 * * Institución: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado III                         *
 * ***********************************************************/

// --------------------------DECLARATION OF VARIABLES--------------------------------------
//===========================================================================================
let fotones = [];
let speed = 5; // Velocity of photons
let contadorD1 = 0; // Counter for detector 1
let contadorD2 = 0; // Counter for detector 2
let i = 0;
let interval = 50;
let botonPresionado = false;
let bomba;
let spotBomb;
let checkbox1, checkbox2;
let numR;
let pass = false;

//----------------------------CONFIGURATION--------------------------------------------------
//===========================================================================================

function setup() {
  createCanvas(1000, 550);
  bomba = new Bomb(50, 50);
  spotBomb = new SpotBomb(width / 2 - 20, 450 / 2 + 35, 40, 45);
  checkbox1 = new Checkbox(355, 480);
  checkbox2 = new Checkbox(555, 480);
  numR = random(1);
}

//-------------------------DRAW-------------------------------------------------------------
//===========================================================================================

function draw() {
  background(220);

  // Components-----------------------------------------------------------
  components();
  spotBomb.dibujar();
  bomba.dibujar();
  bomba.arrastrar();
  console.log(bomba.work, numR);

  // Bomb functions-----------------------------------------------------------------
  if (bomba.x > width || bomba.y > height) {
    bomba = new Bomb(50, 50);
    numR = random(1);
  }

  if (bomba.x >= 480 && bomba.x <= 520 && bomba.y >= 270 && bomba.y <= 300) {
    if (bomba.work) {
      spotBomb.estado = true;
      if (numR > 0.5) {
        spotBomb.estado = false;
      }
    }
  } else {
    spotBomb.estado = false;
  }

  if (bomba.x >= 320 && bomba.x <= 430 && bomba.y >= 450) {
    contadorD1 = 0;

    checkbox1.state = !bomba.work;
    checkbox1.display();

    i++;
    if (i >= interval) {
      bomba = new Bomb(50, 50);
      numR = random(1);
      contadorD2 = 0;
      contadorD1 = 0;
      i = 0;
    }
  }

  if (bomba.x >= 520 && bomba.x <= 630 && bomba.y >= 450) {
    contadorD1 = 0;

    checkbox2.state = bomba.work;
    checkbox2.display();

    i++;
    if (i >= interval) {
      bomba = new Bomb(50, 50);
      numR = random(1);
      contadorD2 = 0;
      contadorD1 = 0;
      i = 0;
    }
  }

  // Photon movement---------------------------------------------------------------------
  for (let j = fotones.length - 1; j >= 0; j--) {
    if (
      bomba.work &&
      numR > 0.5 &&
      bomba.x >= 480 &&
      bomba.x <= 520 &&
      bomba.y >= 270 &&
      bomba.y <= 300
    ) {
      pass = true;
    } else {
      pass = false;
    }

    fotones[j].dibujar();
    fotones[j].mover(pass);

    if (fotones[j].x >= width / 2 - 20 && spotBomb.getEstado()) {
      fotones.splice(j, 1);
      if (j === 0) {
        bomba = new Bomb(50, 50);
        contadorD1 = 0;
        contadorD2 = 0;
      }
      break;
    }

    if (fotones[j].terminado()) {
      if (fotones[j].y <= 100) {
        contadorD1 += 0.5;
      } else if (fotones[j].y >= 300) {
        contadorD2 += 0.5;
      }
      fotones.splice(j, 1);
    }
  }

  // Draw histogram----------------------------------------------------------------------
  dibujarHistograma();

  // Draw button-----------------------------------------------------------
  dibujarBoton();
}

//===================================FUNCIONES Y CLASES===================================
//===========================================================================================

// Definir la clase Boton
class Boton {
  constructor(x, y, w, h, textoBoton, mensaje) {
    this.x = x; // Posición X del botón
    this.y = y; // Posición Y del botón
    this.w = w; // Ancho del botón
    this.h = h; // Alto del botón
    this.textoBoton = textoBoton; // Texto que se mostrará en el botón
    this.mensaje = mensaje; // Mensaje que se mostrará al presionar el botón
    this.mensajeVisible = false; // Controla si el mensaje es visible
  }

  // Dibuja el botón y su mensaje
  dibujar() {
    // Dibuja el botón
    fill(0, 120, 255); // Color del botón
    rect(this.x, this.y, this.w, this.h, 10); // Botón con bordes redondeados

    // Dibuja el texto dentro del botón
    fill(255); // Color blanco para el texto
    textSize(16);
    textAlign(CENTER, CENTER);
    text(this.textoBoton, this.x + this.w / 2, this.y + this.h / 2);

    // Si el mensaje es visible, dibuja el cuadro con el mensaje
    if (this.mensajeVisible) {
      fill(0, 0, 0, 150); // Fondo del cuadro (transparente)
      rect(100, 250, 200, 80, 10); // Cuadro con bordes redondeados

      // Dibuja el mensaje
      fill(255); // Color del texto
      textSize(18);
      textAlign(CENTER, CENTER);
      text(this.mensaje, 200, 290); // Mensaje dentro del cuadro
    }
  }

  // Detecta si el botón ha sido presionado
  estaPresionado() {
    // Verifica si el clic fue dentro del área del botón
    if (
      mouseX >= this.x &&
      mouseX <= this.x + this.w &&
      mouseY >= this.y &&
      mouseY <= this.y + this.h
    ) {
      this.mensajeVisible = !this.mensajeVisible; // Cambia el estado del mensaje
    }
  }
}

// Detecta el clic en el lienzo y llama al método para cada botón
function mousePressed() {
  for (let i = 0; i < botones.length; i++) {
    botones[i].estaPresionado();
  }
}

function enviarFoton() {
  fotones.push(new Foton(1));
  fotones.push(new Foton(2));
  numR = random(1);
}

/* Modela el comportamiento de un fotón en el interferómetro, simulando su movimiento por diferentes trayectorias posibles dependiendo de su estado y las interacciones */
// Photon class------------------------------------------------------------------------------
class Foton {
  constructor(tipo) {
    this.x = 20; // Posición inicial en el eje X
    this.y = 305; // Posición inicial en el eje Y
    this.path = tipo; // Trayectoria del fotón (1 o 2)
    this.step = 0; // Etapa inicial del recorrido
    this.speed = 5.0; // Velocidad del fotón
  }

  // Método para dibujar el fotón en la simulación
  dibujar() {
    fill(230, 141, 35, 170); // Color del fotón (naranja semitransparente)
    noStroke(); // Sin bordes para el círculo
    circle(this.x, this.y, 30); // Dibuja el fotón como un círculo de radio 30
  }

  // Metodo que Simula el movimiento del fotón en el interferómetro en pasos (step)
  mover(pass) {
    //Movimiento hacia el primer divisor
    if (this.step === 0) {
      this.x += this.speed;
      this.y += ((210 - 305) / (105 - 30)) * this.speed;
      if (this.x >= 105) this.step = 1; //Transición al siguiente paso si x es mayor que 105

      //Movimiento al siguiente punto, condicionado por path
    } else if (this.step === 1) {
      if (this.path === 1) {
        // fotón sube
        this.x += this.speed;
        this.y += ((80 - 210) / (367.5 - 105)) * this.speed;
        if (this.x >= 367.5) this.step = 2; //Transición al siguiente paso
      } else if (this.path === 2) {
        // fotón baja
        this.x += this.speed;
        this.y += ((350 - 210) / (367.5 - 105)) * this.speed;
        if (this.x >= 367.5) this.step = 2; //Transición al siguiente paso
      }
    } else if (this.step === 2) {
      //  Cambio probabilístico de trayectoria
      if (this.path === 1) {
        // Si el fotón está en la trayectoria 1
        this.x += this.speed;
        this.y += ((210 - 80) / (632.5 - 367.5)) * this.speed; // Movimiento hacia el siguiente punto
        if (this.x >= 632.5) {
          this.path = random(1) < 0.5 ? 1 : 2; // Cambio de trayectoria con probabilidad 50%
          this.step = 3; // Avanza al siguiente paso
        }
      } else if (this.path === 2) {
        // Si el fotón está en la trayectoria 2
        this.x += this.speed;
        this.y += ((210 - 350) / (632.5 - 367.5)) * this.speed; // Movimiento hacia el siguiente punto
        if (this.x >= 632.5) {
          this.path = random(1) < 0.5 ? 1 : 2; // Cambio de trayectoria con probabilidad 50%
          this.step = 3; // Avanza al siguiente paso
        }
      }
    } else if (this.step === 3 && !pass) {
      // Cuarta etapa: Sin interacción con la bomba
      this.x += this.speed;
      this.y += ((200 - 350) / (632.5 - 367.5)) * this.speed; // Movimiento hacia el detector 1 sin bomba
      if (this.x >= 870) this.step = 4; // Finaliza el recorrido
    } else if (this.step === 3 && pass) {
      // Cuarta etapa: Con interacción con la bomba
      this.x += this.speed;
      this.y += ((350 - 210) / (870 - 632.5)) * this.speed; // Movimiento hacia el detector 2 tras pasar la bomba
      if (this.x >= 870) this.step = 4; // Finaliza el recorrido
    }
  }

  // Método para verificar si el fotón ha completado su recorrido
  terminado() {
    return this.step >= 4; // Retorna verdadero si el fotón ha pasado por todas las etapas
  }
}

// Bomb class-------------------------------------------------------------------------------
class Bomb {
  constructor(x, y) {
    this.x = x; // Posición inicial en el eje X
    this.y = y; // Posición inicial en el eje Y
    this.size = 45; // Tamaño de la bomba (diámetro del círculo)
    this.arrastrando = false; // Estado inicial: la bomba no se está arrastrando
    this.bombaColor = color(0, 0, 0); // Color de la bomba (negro por defecto)
    this.work = random(1) > 0.5; // Estado funcional de la bomba (50% de probabilidad de que funcione)
  }

  // Método para dibujar la bomba en la simulación
  dibujar() {
    fill(this.bombaColor); // Establece el color de la bomba
    noStroke(); // Sin borde para el círculo
    ellipse(this.x, this.y, this.size, this.size); // Dibuja la bomba como un círculo
  }

  // Método para verificar si la bomba fue clickeada
  verificarClick(mx, my) {
    if (dist(mx, my, this.x, this.y) < this.size / 2) {
      // Comprueba si el clic está dentro del círculo
      this.arrastrando = true; // Activa el modo de arrastre
    }
  }

  // Método para arrastrar la bomba con el cursor
  arrastrar() {
    if (this.arrastrando) {
      // Solo si está en modo de arrastre
      this.x = mouseX; // Actualiza la posición X al cursor
      this.y = mouseY; // Actualiza la posición Y al cursor
    }
  }

  // Método para soltar la bomba
  soltar() {
    this.arrastrando = false; // Desactiva el modo de arrastre
  }
}

//-----------------------------------SOPORTE DE LA BOMBA------------------------------------

/* La clase representa un área rectangular en la simulación que puede alternar entre dos estados visuales: activo e inactivo. Según el estado, la clase dibuja el rectángulo con un gradiente de color diferente:

Estado activo: Gradiente de púrpura a negro.
Estado inactivo: Gradiente de cian a negro.
Además, la clase incluye métodos para:

Cambiar el estado: Alterna entre los dos estados disponibles.
Obtener el estado: Devuelve si el rectángulo está activo o inactivo.
Dibujar el área: Representa visualmente el rectángulo con el gradiente correspondiente y un contorno negro.*/
class SpotBomb {
  constructor(x, y, w, h) {
    this.x = x; // Posición X inicial del rectángulo
    this.y = y; // Posición Y inicial del rectángulo
    this.w = w; // Ancho del rectángulo
    this.h = h; // Altura del rectángulo
    this.estado = false; // Estado inicial (apagado o inactivo)
  }
  // Cambia el estado del SpotBomb (activo/inactivo)
  cambiarEstado() {
    this.estado = !this.estado; // Alterna entre true y false
  }

  // Devuelve el estado actual del SpotBomb
  getEstado() {
    return this.estado; // Retorna el valor booleano de estado
  }

  // Dibuja el SpotBomb en la simulación
  dibujar() {
    noStroke(); // Sin borde para los colores internos
    noFill(); // Sin relleno (transparente)
    noStroke(); // Sin borde

    if (this.estado) {
      // Si el estado es activo
      for (let i = 0; i <= this.h; i++) {
        // Itera sobre la altura del rectángulo
        let inter = map(i, 0, this.h, 0, 1); // Calcula un gradiente de color
        //fill(255 * inter, 0, 255 * (1 - inter)); // Gradiente de púrpura a negro
        rect(this.x, this.y + i, this.w, 1); // Dibuja una línea del gradiente
      }
    } else {
      // Si el estado es inactivo
      for (let i = 0; i <= this.h; i++) {
        // Itera sobre la altura del rectángulo
        let inter = map(i, 0, this.h, 0, 1); // Calcula un gradiente de color
        //fill(0, 255 * inter, 255 * (1 - inter)); // Gradiente de cian a negro
        rect(this.x, this.y + i, this.w, 1); // Dibuja una línea del gradiente
      }
    }

    //noStroke(0); // Dibuja un borde negro para el rectángulo
    noFill(); // Evita rellenar el rectángulo con color sólido
    rect(this.x, this.y, this.w, this.h); // Dibuja el contorno del rectángulo
  }
}

//----------------------------------------------------------------------------------------

//Función para dibujar el botón en la pantalla
function dibujarBoton() {
  fill(botonPresionado ? color(180) : color(200));
  rect(30, 400, 150, 40, 10);
  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Enviar fotón", 30 + 75, 400 + 20);
}

//----------------------------------------------------------------------------------------
// Función que se activa cuando se presiona el mouse
function mousePressed() {
  if (mouseX > 30 && mouseX < 180 && mouseY > 400 && mouseY < 440) {
    botonPresionado = true;
    enviarFoton();
  }
  // Verifica si se hizo clic sobre una bomba para iniciar su arrastre
  bomba.verificarClick(mouseX, mouseY);
  //checkbox.update(mouseX, mouseY);
}

//---------------------------------------------------------------------------------------
// Función que se activa cuando se suelta el mouse
function mouseReleased() {
  botonPresionado = false; // Restaura el estado del botón a no presionado
  bomba.soltar(); // Detiene el arrastre de la bomba si estaba siendo movida
}

//-------------LINEAS------------------------------------------------
function dibujarLineaPunteada(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let d = dist(x1, y1, x2, y2);
  let dashLength = 5;
  let spaceLength = 5;
  let drawDash = true;

  for (let i = 0; i < d; i += dashLength + spaceLength) {
    let x = x1 + (dx / d) * i;
    let y = y1 + (dy / d) * i;
    if (drawDash) {
      line(x, y, x + (dx / d) * dashLength, y + (dy / d) * dashLength);
    }
    drawDash = !drawDash;
  }
}

//----------------------------HISTOGRAMA------------------------------------------------
function dibujarHistograma() {
  fill(100, 150, 255);
  rect(800, 20, contadorD1 * 10, 30);
  fill(0);
  text("Detector 1: " + contadorD1, 700, 40);

  fill(255, 150, 100);
  rect(800, 390, contadorD2 * 10, 30);
  fill(0);
  text("Detector 2: " + contadorD2, 700, 410);
}

//--------------------------------COMPONENTES--------------------------------------------
function components() {
  fill(100, 150, 255);
  rect(80, 190, 50, 40);
  fill(0);
  text("Divisor 1", 80, 240);

  fill(100, 150, 255);
  rect(620, 190, 50, 40);
  fill(0);
  text("Divisor 2", 620, 240);

  fill(150, 255, 100);
  rect(340, 70, 70, 10);
  fill(0);
  text("Espejo 1", 340, 90);

  fill(150, 255, 100);
  rect(340, 350, 70, 10);
  fill(0);
  text("Espejo 2", 340, 370);

  fill(0);
  arc(870, 80, 50, 50, -PI, PI - HALF_PI);
  text("Detector 1", 870, 110);

  arc(870, 350, 50, 50, -HALF_PI, PI);
  text("Detector 2", 870, 380);

  // Contenedor 1
  fill(150, 200, 255);
  rect(300, 450, 150, 80);
  fill(0);
  text("Reciclaje", 355, 440);

  // Contenedor 2
  fill(150, 200, 255);
  rect(500, 450, 150, 80);
  fill(0);
  text("Funcional", 555, 440);

  // Base de las bombas
  fill(150, 200, 255);
  rect(0, 0, 100, 100);
  fill(0);
  text("Funcional", 555, 440);

  //Circulo del soporte de la bomba

  // Base de las bombas
  fill(150, 200, 255);
  ellipse(500, 282, 50, 50);
  fill(0);
  text("Soporte", 500, 315);

  // Líneas punteadas que conectan los componentes
  stroke(5);
  dibujarLineaPunteada(30, 295, 105, 210); // Inicio -> Divisor de haz 1
  dibujarLineaPunteada(105, 210, 367.5, 80); // Divisor de haz 1 -> Espejo 1 (camino superior)
  dibujarLineaPunteada(367.5, 80, 400, 80); // Espejo 1 (centro -> borde)
  dibujarLineaPunteada(105, 210, 367.5, 350); // Divisor de haz 1 -> Espejo 2 (camino inferior)
  dibujarLineaPunteada(367.5, 350, 400, 350); // Espejo 2 (centro -> borde)
  dibujarLineaPunteada(367.5, 80, 632.5, 210); // Espejo 1 -> Divisor de haz 2
  dibujarLineaPunteada(367.5, 350, 632.5, 210); // Espejo 2 -> Divisor de haz 2
  dibujarLineaPunteada(645, 210, 870, 80); // Divisor de haz 2 -> Detector 1
  dibujarLineaPunteada(645, 210, 870, 350); // Divisor de haz 2 -> Detector 2
}

//-----------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------

/*La clase Checkbox representa una casilla de verificación que el usuario puede interactuar con el mouse. 
Su estado puede alternar entre marcado (check) y desmarcado (cross), 
ofreciendo una representación visual clara de cada estado.*/

class Checkbox {
  constructor(x, y) {
    // Coordenadas de la esquina superior izquierda de la casilla
    this.x = x;
    this.y = y;
    // Estado inicial de la casilla (desmarcado)
    this.state = false;
  }

  // Dibuja la casilla en la pantalla
  display() {
    stroke(0); // Color del borde
    fill(255); // Relleno blanco
    rect(this.x, this.y, 20, 20); // Dibuja el rectángulo de la casilla

    // Dibuja un check o una cruz según el estado actual
    if (this.state) {
      this.drawCheck(); // Estado marcado (check)
    } else {
      this.drawCross(); // Estado desmarcado (cross)
    }
  }

  // Cambia el estado si se detecta un clic dentro de la casilla
  update(mx, my) {
    // Comprueba si las coordenadas del mouse están dentro de la casilla
    if (mx > this.x && mx < this.x + 20 && my > this.y && my < this.y + 20) {
      this.state = !this.state; // Alterna el estado
    }
  }

  // Dibuja una marca de verificación (check) en la casilla
  drawCheck() {
    stroke(0, 255, 0); // Color verde
    strokeWeight(3); // Grosor de la línea
    // Dibuja las dos líneas que forman el check
    line(this.x + 4, this.y + 10, this.x + 10, this.y + 16);
    line(this.x + 10, this.y + 16, this.x + 16, this.y + 4);
  }

  // Dibuja una cruz (cross) en la casilla
  drawCross() {
    stroke(255, 0, 0); // Color rojo
    strokeWeight(3); // Grosor de la línea
    // Dibuja las dos líneas que forman la cruz
    line(this.x + 4, this.y + 4, this.x + 16, this.y + 16);
    line(this.x + 16, this.y + 4, this.x + 4, this.y + 16);
  }
}
