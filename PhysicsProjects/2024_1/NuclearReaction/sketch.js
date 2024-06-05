/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Juan Manuel Albarracin Herrera                 *
 * *          Santiago Ramirez Puentes                       *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let nucleos = [];
let neutrones = [];
let energia = []; // Array para almacenar la energía

let nucleosIniciales = 10;
let neutronesIniciales = 2;
let neutronesChocados = 0;
let colisionesTotales = 0; // Contador de colisiones totales
let velocidadNeutrones = 5; // Velocidad inicial de los neutrones

let slider; // Barra deslizadora para la velocidad de los neutrones
let velocidadText; // Elemento HTML para mostrar la velocidad de los neutrones

function setup() {
    createCanvas(600, 400);

    // Crear barra deslizadora para controlar la velocidad de los neutrones
    slider = createSlider(1, 10, velocidadNeutrones, 0.1);
    slider.position(20, height + 50);
    slider.style("width", "560px"); // Establecer el ancho de la barra deslizadora

    // Crear elemento HTML para mostrar la velocidad de los neutrones
    velocidadText = createP();
    velocidadText.position(20, height + 20);

    // Crear núcleos iniciales
    for (let i = 0; i < nucleosIniciales; i++) {
        nucleos.push(new Nucleo(random(width), random(height)));
    }

    // Crear neutrones iniciales
    for (let i = 0; i < neutronesIniciales; i++) {
        neutrones.push(
            new Neutron(random(width), random(height), velocidadNeutrones)
        );
    }
}

function draw() {
    background(255);

    // Actualizar y mostrar núcleos
    for (let nucleo of nucleos) {
        nucleo.display();
    }

    // Actualizar y mostrar neutrones
    for (let neutron of neutrones) {
        neutron.update();
        neutron.display();
    }

    // Comprobar colisiones entre neutrones y núcleos
    for (let i = neutrones.length - 1; i >= 0; i--) {
        for (let j = nucleos.length - 1; j >= 0; j--) {
            if (neutrones[i].intersects(nucleos[j])) {
                neutrones.splice(i, 1); // Eliminar neutrón
                if (nucleos[j].color.levels[0] === 255) {
                    energia.push(5); // Almacenar 5 electronvoltios si es un núcleo rojo
                }
                nucleos[j].fision(); // Realizar fisión nuclear
                neutronesChocados++;
                colisionesTotales++;
                break;
            }
        }
    }

    // Calcular y mostrar la energía total almacenada
    let energiaTotal = energia.reduce((total, current) => total + current, 0);
    textSize(16);
    fill(0);
    text(
        "Energía total almacenada: " + energiaTotal.toFixed(1) + " eV",
        20,
        20
    );

    // Actualizar la velocidad de los neutrones según la posición de la barra deslizadora
    velocidadNeutrones = slider.value();

    // Actualizar el texto de la velocidad de los neutrones
    velocidadText.html(
        "Velocidad de los neutrones: " + velocidadNeutrones.toFixed(1) + " m/s"
    );

    // Detener la simulación si todos los neutrones han chocado con todos los núcleos
    if (colisionesTotales === nucleosIniciales * neutronesIniciales) {
        noLoop();
    }
}

class Nucleo {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.radius = 20;
        this.color = color(255, 0, 0); // Rojo para representar el núcleo
    }

    display() {
        noStroke();
        fill(this.color);
        ellipse(
            this.position.x,
            this.position.y,
            this.radius * 2,
            this.radius * 2
        );
    }

    fision() {
        // Al realizar la fisión nuclear, se crean dos nuevos neutrones
        for (let i = 0; i < 2; i++) {
            neutrones.push(
                new Neutron(
                    this.position.x,
                    this.position.y,
                    velocidadNeutrones
                )
            );
        }
        // Se eliminan los núcleos antiguos
        nucleos.splice(nucleos.indexOf(this), 1);
    }
}

class Neutron {
    constructor(x, y, velocidad) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D().mult(velocidad); // Velocidad aleatoria
        this.radius = 5;
        this.color = color(0, 0, 255); // Azul para representar el neutrón
    }

    update() {
        this.position.add(this.velocity);

        // Rebotar contra los bordes del canvas
        if (this.position.x < 0 || this.position.x > width) {
            this.velocity.x *= -1;
        }
        if (this.position.y < 0 || this.position.y > height) {
            this.velocity.y *= -1;
        }
    }

    display() {
        noStroke();
        fill(this.color);
        ellipse(
            this.position.x,
            this.position.y,
            this.radius * 2,
            this.radius * 2
        );
    }

    intersects(nucleo) {
        let d = dist(
            this.position.x,
            this.position.y,
            nucleo.position.x,
            nucleo.position.y
        );
        return d < this.radius + nucleo.radius;
    }
}
