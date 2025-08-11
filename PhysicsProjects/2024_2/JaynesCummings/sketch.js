/* *********************
 * *** SIMULACION LABORATORIO AVANZADO 3 *******
 * *********************
 * * Autores: Mario José Félix Rojas  mario.felix@udea.edu.co 
 * *          Juan Pablo Montoya Rojas  juan.montoya102@udea.edu.co
 * *          Esneider Velez Peña  esneider.velezp@udea.edu.co
  *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                         *
 * *********************

La simulación permite visualizar la inversión de poblaciones W(t) en función del tiempo,
con un átomo y un fotón en resonancia, observándose oscilaciones de Rabi.*/


let Pe = [];
let Pg = [];
let timesteps = 200;
let tmax = 10;
let dt = tmax / timesteps;
let g = 0.5;
let omega_c = 1.0;
let omega_a = 1.0;
let photonCount = 1;
let sliderG, sliderOmegaC, sliderOmegaA, sliderPhotons;
let atomState = 0; // 0: base, 1: excitado
let timeIndex = 0; // Para simular la evolución en tiempo real

function setup() {
    createCanvas(900, 450);
    sliderG = createSlider(0.1, 1.0, g, 0.1);
    sliderG.position(20, 420);
    sliderOmegaC = createSlider(0.5, 2.0, omega_c, 0.1);
    sliderOmegaC.position(200, 420);
    sliderOmegaA = createSlider(0.5, 2.0, omega_a, 0.1);
    sliderOmegaA.position(380, 420);
    sliderPhotons = createSlider(1, 8, photonCount, 1);
    sliderPhotons.position(600, 420);
    calculateJaynesCummings();
}

function draw() {
    background(240);
    
    stroke(0);
    strokeWeight(1);
    line(50, 350, 550, 350); // Eje x
    line(50, 50, 50, 350); // Eje y

    push();
    textSize(15);
    text("Tiempo (t)", 280, 400);
    text("P(t)", 20, 200);
    text("W(t) Inversión de poblaciones", 250, 30);
    text("|e>", 770, 100);
    text("|g>", 770, 300);
    pop();

    // Dibujar P_e(t)
    stroke(0, 0, 255);
    noFill();
    beginShape();
    for (let i = 0; i < timesteps; i++) {
        let x = map(i, 0, timesteps, 50, 550);
        let y = map(Pe[i], 0, 1, 350, 50);
        vertex(x, y);
    }
    endShape();
    text("P_e (Excitado)", 500, 70);

    // Dibujar P_g(t)
    stroke(255, 0, 0);
    beginShape();
    for (let i = 0; i < timesteps; i++) {
        let x = map(i, 0, timesteps, 50, 550);
        let y = map(Pg[i], 0, 1, 350, 50);
        vertex(x, y);
    }
    endShape();
    
    text("P_g (Base)", 500, 320);

    // Mostrar valores actuales de los sliders
    text("g: " + g.toFixed(2), 20, 420);
    text("ω_c: " + omega_c.toFixed(2), 200, 420);
    text("ω_a: " + omega_a.toFixed(2), 380, 420);
    text("Fotones: " + photonCount, 600, 420);

    // Actualizar parámetros
    g = sliderG.value();
    omega_c = sliderOmegaC.value();
    omega_a = sliderOmegaA.value();
    photonCount = sliderPhotons.value();
    calculateJaynesCummings();

    // Dibujar el sistema
    drawCavity();
    drawAtom();
    drawLightBeams();
    
    // Dibujar marcas en el eje X
    drawXAxisTicks();

    timeIndex = (timeIndex + 1) % timesteps;
}

function calculateJaynesCummings() {
    let Omega = Math.sqrt(g * 2 * photonCount + (omega_c - omega_a) * 2);
    for (let i = 0; i < timesteps; i++) {
        let t = i * dt;
        Pe[i] = Math.cos(2 * Omega * t) ** 2;
        Pg[i] = 1 - Pe[i];
    }
}

function drawCavity() {
    stroke(0);
    strokeWeight(3);
    line(650, 50, 650, 350);
    line(750, 50, 750, 350);
}

function drawAtom() {
    let xPos = 700;
    let yPosExcited = 100;
    let yPosGround = 300;
    let probability = Pe[timeIndex];
    
    fill(255, 0, 0);
    ellipse(xPos, map(probability, 0, 1, yPosGround, yPosExcited), 20, 20);
}

function drawLightBeams() {
    let waveAmplitude = 10; // Amplitud de la onda del fotón
    let waveLength = 40; // Longitud de onda de la oscilación
    let numWaves = 6; // Número de ciclos en el rayo
    
    stroke(255, 204, 0, 180);
    noFill();

    for (let i = 0; i < photonCount; i++) {
        let yOffset = 120 + i * 30; // Espaciado entre rayos
        
        beginShape();
        for (let x = 600; x <= 750; x += 5) { // Desde fuera de la cavidad hasta la otra placa
            let y = yOffset + waveAmplitude * sin((x - 600) * TWO_PI / waveLength);
            vertex(x, y);
        }
        endShape();
    }
}

function drawXAxisTicks() {
    let Omega = Math.sqrt(g * 2 * photonCount + (omega_c - omega_a) * 2);
    let pi = Math.PI;

    for (let k = 0; k * pi / (4 * Omega) <= tmax; k++) {
        let t_k = (k * pi) / (4 * Omega);
        let xPos = map(t_k, 0, tmax, 50, 550);

        stroke(0);
        line(xPos, 350, xPos, 360); // Marcas en el eje X

        noStroke();
        fill(0);
        textSize(12);
        textAlign(CENTER);
        
        // Etiquetas de tiempo en términos de π y Ω
        if (k % 2 === 0) {
            text("${k/2}π / 2Ω$", xPos, 375);
        } else {
            text("${k}π / 4Ω$", xPos, 375);
        }
    }
}