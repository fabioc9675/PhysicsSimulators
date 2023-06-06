/* ***********************************************************
 * ******* SIMULACION PENDULO DOBLE **************************
 * ***********************************************************
 * * Autores: Maria José Domínguez Mesa                      *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let g = 9.81; // Aceleración debido a la gravedad
let t = 0; // Tiempo inicial
let dt = 0.02; // Incremento de tiempo
let theta1, theta2; // Ángulos de las masas
let omega1, omega2; // Velocidades angulares de las masas
let l1, l2; // Longitud de los péndulos
let m1, m2; // Masas
let theta2_arr, omega2_arr; // Array para almacenar los ángulos y velocidades angulares de la masa 2
let x1_arr, y1_arr; // Array para almacenar la posición en x y y de la masa 1
let x2_arr, y2_arr; // Array para almacenar la posición en x y y de la masa 2
let showLissajous1 = true; // Variable para controlar si se muestra la Figura de Lissajous de la masa 1
let showLissajous2 = true; // Variable para controlar si se muestra la Figura de Lissajous de la masa 2

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 100);

    // Botones para fijar los valores iniciales:
    m1Inicial = createSlider(1, 50, 20, 0.01);
    m1Inicial.position(width / 2 - 230, height / 2 + 110);
    m1Inicial.size(90, 15);

    m2Inicial = createSlider(0.1, 50, 15, 0.01);
    m2Inicial.position(width / 2 - 230, height / 2 + 160);
    m2Inicial.size(90, 15);

    l1Inicial = createSlider(0.1, 1, 1, 0.01);
    l1Inicial.position(width / 2 - 110, height / 2 + 110);
    l1Inicial.size(90, 15);

    l2Inicial = createSlider(0.1, 1, 1, 0.01);
    l2Inicial.position(width / 2 - 110, height / 2 + 160);
    l2Inicial.size(90, 15);

    theta1Inicial = createSlider(-PI / 2, PI / 2, 0, 0.01);
    theta1Inicial.size(90, 15);
    theta1Inicial.position(width / 2 + 10, height / 2 + 110);

    theta2Inicial = createSlider(-PI / 2, PI / 2, PI / 4, 0.01);
    theta2Inicial.position(width / 2 + 10, height / 2 + 160);
    theta2Inicial.size(90, 15);

    omega1Inicial = createSlider(-PI / 2, PI / 2, PI / 2, 0.01);
    omega1Inicial.position(width / 2 + 130, height / 2 + 110);
    omega1Inicial.size(90, 15);

    omega2Inicial = createSlider(-PI / 2, PI / 2, PI / 2, 0.01);
    omega2Inicial.position(width / 2 + 130, height / 2 + 160);
    omega2Inicial.size(90, 15);

    // Botón para ejecutar el código:
    button = createButton("Ejecutar");
    button.position(width / 2 - button.width / 2, height / 2 + 200);
    button.mousePressed(() => {
        theta2_arr = [];
        omega2_arr = [];
        x1_arr = [];
        y1_arr = [];
        x2_arr = [];
        y2_arr = [];

        theta1 = theta1Inicial.value();
        theta2 = theta2Inicial.value();
        omega1 = omega1Inicial.value();
        omega2 = omega2Inicial.value();
        l1 = l1Inicial.value();
        l2 = l2Inicial.value();
        m1 = m1Inicial.value();
        m2 = m2Inicial.value();
    });

    // Checkbox para mostrar las figuras de Lissajous:
    showLissajousCheckbox1 = createCheckbox("Trayectoria m1", showLissajous1);
    showLissajousCheckbox1.position(width / 2 - 190, height / 2 + 200);
    showLissajousCheckbox1.changed(updateShowLissajous1);

    showLissajousCheckbox2 = createCheckbox("Trayectoria m2", showLissajous2);
    showLissajousCheckbox2.position(width / 2 + 70, height / 2 + 200);
    showLissajousCheckbox2.changed(updateShowLissajous2);
}

// Funciones para actualizar los checkbox de las figuras de Lissajous:
function updateShowLissajous1() {
    showLissajous1 = this.checked();
}

function updateShowLissajous2() {
    showLissajous2 = this.checked();
}

function draw() {
    background(255);

    // Título:
    textSize(25);
    textAlign(CENTER);
    text("ℙ𝔼ℕ𝔻𝕌𝕃𝕆 𝔻𝕆𝔹𝕃𝔼", width / 2, height / 18);

    // Valores iniciales y etiquetas de los botones:
    textAlign(CENTER);
    textSize(12);

    value = m1Inicial.value() * 10;
    text(
        "m₁ = " + nf(value, 0, 2) + "kg",
        m1Inicial.x + m1Inicial.width / 2,
        m1Inicial.y - m1Inicial.height / 2
    );

    value = m2Inicial.value() * 10;
    text(
        "m₂ = " + nf(value, 0, 2) + "kg",
        m2Inicial.x + m2Inicial.width / 2,
        m2Inicial.y - m2Inicial.height / 2
    );

    value = l1Inicial.value() * 10;
    text(
        "l₁ = " + nf(value, 0, 2) + "m",
        l1Inicial.x + l1Inicial.width / 2,
        l1Inicial.y - l1Inicial.height / 2
    );

    value = l2Inicial.value() * 10;
    text(
        "l₂ = " + nf(value, 0, 2) + "m",
        l2Inicial.x + l2Inicial.width / 2,
        l2Inicial.y - l2Inicial.height / 2
    );

    value = theta1Inicial.value() / PI;
    text(
        "θ₁ = " + nfp(value, 0, 2) + "π",
        theta1Inicial.x + theta1Inicial.width / 2,
        theta1Inicial.y - theta1Inicial.height / 2
    );

    value = theta2Inicial.value() / PI;
    text(
        "θ₂ = " + nfp(value, 0, 2) + "π",
        theta2Inicial.x + theta2Inicial.width / 2,
        theta2Inicial.y - theta2Inicial.height / 2
    );

    value = omega1Inicial.value() / PI;
    text(
        "ω₁ = " + nfp(value, 0, 2) + "π",
        omega1Inicial.x + theta1Inicial.width / 2,
        omega1Inicial.y - omega1Inicial.height / 2
    );

    value = omega2Inicial.value() / PI;
    text(
        "ω₂ = " + nfp(value, 0, 2) + "π",
        omega2Inicial.x + omega2Inicial.width / 2,
        omega2Inicial.y - omega2Inicial.height / 2
    );

    // Si theta1 no ha sido inicializado, no dibujar nada:
    if (theta1 === undefined) {
        return;
    }

    translate(width / 4, height / 8);

    // Ecuaciones de movimiento de la masa 1:
    let n1 = -g * (2 * m1 + m2) * sin(theta1);
    let n2 = -m2 * g * sin(theta1 - 2 * theta2);
    let n3 = -2 * sin(theta1 - theta2) * m2;
    let n4 = omega2 * omega2 * l2 + omega1 * omega1 * l1 * cos(theta1 - theta2);
    let den = l1 * (2 * m1 + m2 - m2 * cos(2 * theta1 - 2 * theta2));
    let alpha1 = (n1 + n2 + n3 * n4) / den;

    // Ecuaciones de movimiento de la masa 2:
    n1 = 2 * sin(theta1 - theta2);
    n2 = omega1 * omega1 * l1 * (m1 + m2);
    n3 = g * (m1 + m2) * cos(theta1);
    n4 = omega2 * omega2 * l2 * m2 * cos(theta1 - theta2);
    den = l2 * (2 * m1 + m2 - m2 * cos(2 * theta1 - 2 * theta2));
    let alpha2 = (n1 * (n2 + n3 + n4)) / den;

    // Actualización de las velocidades angulares:
    omega1 += alpha1 * dt;
    omega2 += alpha2 * dt;

    // Actualización de los ángulos:
    theta1 += omega1 * dt;
    theta2 += omega2 * dt;

    // Almacenamiento de los ángulos y velocidades angulares:
    theta2_arr.push(theta2);
    omega2_arr.push(omega2);

    // Dibujo del espacio de fase para la masa 2:
    textSize(20);
    textAlign(CENTER);
    text("Espacio de fase (θ₂ vs ω₂)", width / 2, height / 200 - 15);

    strokeWeight(2.5);
    for (let i = 0; i < theta2_arr.length; i++) {
        let x = map(theta2_arr[i], -PI, PI, -width / 2, width / 2);
        let y = map(omega2_arr[i], -10, 10, -height / 2, height / 2);

        // Aplicar restricciones a los valores mapeados:
        x = constrain(x, -width / 2, width / 2);
        y = constrain(y, -height / 2, height / 2);

        stroke(i / 8 + 150, 200, 100); // Cambiar el color
        point(x + width / 2, y + height / 8 + 60);
    }

    // Trayectoria de los péndulos:
    let x1 = 100 * l1 * sin(theta1);
    let y1 = 100 * l1 * cos(theta1);
    let x2 = x1 + 100 * l2 * sin(theta2);
    let y2 = y1 + 100 * l2 * cos(theta2);

    // Figura de Lissajous para la masa 1:
    if (showLissajous1) {
        x1_arr.push(x1);
        y1_arr.push(y1);

        strokeWeight(1);
        for (let i = 0; i < x1_arr.length; i++) {
            stroke(0);
            point(x1_arr[i], y1_arr[i]);
        }
    }

    // Figura de Lissajous para la masa 2:
    if (showLissajous2) {
        x2_arr.push(x2);
        y2_arr.push(y2);

        strokeWeight(1);
        for (let i = 0; i < x2_arr.length; i++) {
            stroke(0);
            point(x2_arr[i], y2_arr[i]);
        }
    }

    // Base:
    strokeWeight(2);
    stroke(0);
    line(-10, 0, 10, 0);

    // Péndulo 1:
    strokeWeight(2);
    stroke(0);
    line(0, 0, x1, y1);

    // Péndulo 2:
    strokeWeight(2);
    stroke(0);
    line(x1, y1, x2, y2);

    // Masa1:
    strokeWeight(0.1);
    radialGradient(
        x1 - 1,
        y1 - m1 / 3,
        0,
        x1 - 1,
        y1 - m1 / 3,
        m1,
        color(190, 100, 100, 100),
        color(310, 100, 100, 100)
    );
    ellipse(x1, y1, m1, m1);

    // Masa 2:
    radialGradient(
        x2 - 1,
        y2 - m2 / 3,
        0,
        x2 - 1,
        y2 - m2 / 3,
        m2,
        color(190, 100, 100, 100),
        color(310, 100, 100, 100)
    );
    ellipse(x2, y2, m2, m2);
}

// Función para pintar las masas en gradiente:
function radialGradient(sX, sY, sR, eX, eY, eR, colorS, colorE) {
    let gradient = drawingContext.createRadialGradient(sX, sY, sR, eX, eY, eR);

    gradient.addColorStop(0, colorS);
    gradient.addColorStop(1, colorE);

    drawingContext.fillStyle = gradient;
}
