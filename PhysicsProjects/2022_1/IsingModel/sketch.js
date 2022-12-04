/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Sergio Duque Mejía                             *
 * *          Daniela Andrea Torres Gómez                    *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

/**
 * ----------********-----------
 * ------ MODELO DE ISING ------
 * ----------********-----------
 */

// ----------------------
// ---- VARIABLES -------
// ----------------------
let temperatura;
let avmagn;
let magn;
let magtx;
let apagar;
let encender;

let tabla;
let añadir;

var numParticulas = 30;
var magCampo = 0;
var J = 1;

//dimensiones = 50;
WIDTH = 1200;
HEIGHT = 600;

// ---------------------------------------------
// ----- INICIALIZACIÓN DE LA SIMULACIÓN -------
// ---------------------------------------------
function setup() {
    // Aquí se inicializan los parámetros

    frameRate(3);
    createCanvas(WIDTH, HEIGHT);

    // número de paticulas

    temperatura = 0.1;

    // Se crea el primer estado
    estado = new estadoDelSistema(numParticulas);

    // Se sibuja el primer estado
    estado.dibujar();

    // Grafico
    plot = new GPlot(this, 600, 0, 580, 500);
    plot.setTitleText("Promedio de la magnetizacion vs temperatura");
    plot.getXAxis().setAxisLabelText("Temperatura [K]");
    plot.getYAxis().setAxisLabelText("Magnetizacion promedio [A/m]");
    plot.getYAxis().setNTicks(2);
    plot.setXLim(0, 20);
    plot.setYLim(0, 2.0);
    plot.setGridLineWidth(2);
    plot.setGridLineColor(210);
    plot.setLineColor(120);
    plot.setLineWidth(1);

    // Ingresar la cantidad de partículas
    input = createInput(nfc(numParticulas));
    input.size(50);
    input.position(HEIGHT + 70, 483);
    button = createButton("Enviar");
    button.position(HEIGHT + 127, 483);

    input2 = createInput(nfc(magCampo));
    input2.size(50);
    input2.position(HEIGHT + 70, 520);
    button2 = createButton("Enviar");
    button2.position(HEIGHT + 127, 520);

    input3 = createInput(nfc(J));
    input3.size(50);
    input3.position(HEIGHT + 70, 560);
    button3 = createButton("Enviar");
    button3.position(HEIGHT + 127, 560);

    // Si se presiona se establece el numero de
    // partículas ingresadas en el input y refresca
    button.mousePressed(() => {
        numParticulas = input.value();
        setup();
    });

    button2.mousePressed(() => {
        magCampo = input2.value();
        setup();
    });

    button3.mousePressed(() => {
        J = input3.value();
        setup();
    });

    tabla = new p5.Table();

    tabla.addColumn("Temperatura");
    tabla.addColumn("Magnetizacion_promedio");
}

// ------------------------------------
// --- DIBUJAR CONTINUAMENTE (LOOP) ---
// ------------------------------------
function draw() {
    background(220);
    textSize(20);

    /**
     * Se evoluciona el primer estado,
     * y cada que entra al loop, el
     * estado evoluciona
     */
    estado.evolucionar(J, temperatura, magCampo);
    avmagn = estado.actualizar();
    magtx = estado.magtext();
    estado.dibujar();

    fill(0);
    graph(temperatura, avmagn);

    /**
     * Botones para continuar, pausar y reiniciar
     */
    info();
    textSize(20);

    temperatura += 0.1;
    botonesConf();

    text("L = ", HEIGHT + 30, 500);
    text("H = ", HEIGHT + 27, 537);
    text("J = ", HEIGHT + 27, 577);

    if (temperatura > 20) {
        noLoop();
    }

    añadir = tabla.addRow();
    añadir.setNum("Temperatura", temperatura);
    añadir.setNum("Magnetizacion_promedio", avmagn);
}

// ------------------------------------
// ------- ESTADO DEL SISTEMA ---------
// ------------------------------------
class estadoDelSistema {
    matrizDeEstado = [];

    // -------------------------------
    // --- Constructor de la clase ---
    // -------------------------------
    constructor(numParticulas) {
        this.n = numParticulas;

        /**
         * Este recorrerá la retícula y asignará un valor
         * de 1 ó -1 a cada partícula
         */
        for (let i = 0; i < this.n; i++) {
            var filas = [];
            for (let j = 0; j < this.n; j++) {
                // Agrega -1 o 1, aleatoriamente
                filas.push(random([-1, 1]));
            }
            // Agrega una fila a la matriz en cada iteración
            this.matrizDeEstado.push(filas);
        }
    }

    // -------------------------------
    // ---- Funciones de la clase ----
    // -------------------------------

    evolucionar = function (J, T, B) {
        // Guarda el resultado de la función Montecarlo
        this.matrizDeEstado = MonteCarlo(this.matrizDeEstado, J, 1 / T, B);
    };

    actualizar = function () {
        this.magnetizacion = 0;
        this.magabs = 0;

        this.promedioMagnetizacion = 0;

        for (var i = 0; i < numParticulas; i++) {
            for (var j = 0; j < numParticulas; j++) {
                this.magnetizacion += this.matrizDeEstado[i][j];
            }
        }
        this.magtxt = this.magnetizacion;
        if (this.magnetizacion < 0) {
            this.magabs = this.magnetizacion * -1;
        } else {
            this.magabs = this.magnetizacion;
        }

        this.promedioMagnetizacion +=
            this.magabs / (numParticulas * numParticulas);

        return this.promedioMagnetizacion;
    };

    magtext = function () {
        this.magtxt = 0;
        this.magtxt += this.magnetizacion;
        return this.magtxt;
    };

    dibujar = function () {
        /**
         * Esta función dibuja cada partícula
         * en la retícula
         */
        var arreglo = [];

        // [0]: Posiciones de las partículas [1]: sus dimensiones
        var centro_masa = centroMasa(this.n);

        // Arrelgo con las posiciones
        var cm = centro_masa[0];

        // Dimensiones de cada "partícula" en la retícula
        var dim = centro_masa[1];

        // Recorre la matriz para dibujar cada partícula en la retícula
        for (var i = 0; i < this.n; i++) {
            for (var j = 0; j < this.n; j++) {
                var estadoTemporal;

                if (this.matrizDeEstado[i][j] == 1) {
                    estadoTemporal = true;
                } else {
                    estadoTemporal = false;
                }

                // Se agerga al arreglo, un dibujo con sus dimensiones y estado (color)
                arreglo.push(new cuadrado(cm[j], cm[i], estadoTemporal, dim));
            }
        }
        return arreglo;
    };
}

// ----------------------------------
// --------- MONTE CARLO ------------
// ----------------------------------
function MonteCarlo(configuracion, J, beta, campo) {
    var L = configuracion.length;
    nuevaConfig = [...configuracion]; // Copia de la configuracion

    for (let i = 0; i < L; i++) {
        for (let j = 0; j < L; j++) {
            var conf_i = configuracion[i][j];

            var config1 = configuracion[mod(i + 1, L)][j];
            var config2 = configuracion[i][mod(j + 1, L)];
            var config3 = configuracion[mod(i - 1, L)][j];
            var config4 = configuracion[i][mod(j - 1, L)];
            var conf_j = config1 + config2 + config3 + config4;

            var E_i = -J * conf_i * conf_j - conf_i * campo; /// campo
            var conf_ip = -1 * conf_i;
            var E_f = -J * conf_ip * conf_j - conf_ip * campo; /// campo

            var del_E = E_f - E_i;

            if (del_E <= 0) {
                conf_i = conf_ip;
            } else if (Math.random() < Math.exp(-del_E * beta)) {
                conf_i = conf_ip;
            }

            nuevaConfig[i][j] = conf_i;
        }
    }

    return nuevaConfig;
}

// -------------------------------------
// ------ CALCULA EL CENTRO DE MASA ----
// -------------------------------------
function centroMasa(n) {
    /**
     * Esta fucción calcula la posición de cada una
     * de las partículas en la retícula
     */
    var posiciones = [];

    // Establece la distancia de la reticula con el canvas
    let borde = 50;

    // La reticula tiene dimensiones de la altura
    // del canvas menos el borde
    let dimReticula = HEIGHT - borde;

    // Se divide el tamaño de la reticula por el número de partículas
    var dimParticula = dimReticula / numParticulas;

    // Se crea el vector de posiciones
    for (var i = 0; i < n; i++) {
        posiciones[i] = i * dimParticula + borde;
    }

    return [posiciones, dimParticula];
}

// -----------------------------------------
// --- CALCULA EL MÓDULO ENTRE 2 NUMEROS ---
// -----------------------------------------
function mod(n, m) {
    return ((n % m) + m) % m;
}
function reset() {
    numParticulas = 30;
    magCampo = 50;
    setup();
}

function info() {
    textSize(15);
    text(
        "Caja de tamaño L = " +
            nfc(numParticulas) +
            " que contiene N = " +
            nfc(numParticulas ** 2) +
            " particulas.\nContenido en un Campo magnetico externo H = " +
            nfc(magCampo),
        45,
        25
    );
}

function guardar() {
    //se guardan los elementos de la tabla en un archivo scv
    noLoop();
    saveTable(tabla, "datos.csv");
}

function graph(temp, mag) {
    plot.addPoint(temperatura, avmagn);
    plot.beginDraw();

    plot.drawBox();
    plot.drawXAxis();
    plot.drawYAxis();
    plot.drawTitle();
    plot.drawGridLines(GPlot.BOTH);
    plot.drawLines();
    plot.drawPoints();
    plot.endDraw();

    fill(150);
    rect(HEIGHT + 330, 60, 195, 60);
    fill(255);
    text("Temperatura: " + nfc(temperatura, 2), HEIGHT + 340, 80);
    text("Magnetizacion: " + nfc(magtx), HEIGHT + 335, 110);
    fill(0);
}

function botonesConf() {
    fill(150);
    rect(820, 500, 305, 55);
    //square(840, 500, 100);
    fill(255);
    encender = createButton("Continuar");
    encender.position(830, 530);
    encender.mousePressed(loop);

    apagar = createButton("Pausar");
    apagar.position(910, 530);
    apagar.mousePressed(noLoop);

    reiniciar = createButton("Reiniciar");
    reiniciar.position(975, 530);
    reiniciar.mousePressed(reset);

    Guardar = createButton("Guardar");
    Guardar.position(1050, 530);
    Guardar.mousePressed(guardar);

    text("Botones de configuracion:", HEIGHT + 250, 520);
    fill(0);
}
// -----------------------------------------
// ------------ DIBUJA PARTÍCULAS ----------
// -----------------------------------------
function cuadrado(x, y, estado, dimensiones) {
    // Si el estado es true, pinta la partícula blanco
    if (estado === true) {
        fill(255, 255, 255);
    }
    // Si no, pinta la partícula naranja
    else {
        fill(200, 0, 0);
    }

    // Cuadrados en posicion (x,y) y el 80% de la dimensión
    noStroke();
    square(x, y, dimensiones * 0.8);
}
