/*************************************************************
 ******** SIMULACIÓN EFECTO TUNEL ****************************
 *************************************************************
 ** Autor: Juan Felipe Castello Arango                      **
 ** Institución: Universidad de Antioquia                   **
 ** Curso: Laboratorio avanzado 3                           **
 *************************************************************/

//Propiedades de la simulación:
let wi = window.innerWidth;
let he = window.innerHeight;
let rate = 60;
let dt = 1 / rate;
let r = 4; // Radio puntos
let N = 50; // Número de puntos
let tiempo = 0; // Variable para llevar un seguimiento del tiempo actual
let simulationRunning = true; // Estado de la simulación
let pauseTime = 0; //variable para saber en que t se presiono pausa

//escalas
let s_h = 5; //Horizontal scaler
let s_v = 20; //Vertical scaler

let Y_Rexaxis = (he + 50 + s_v) / 2; //posición del eje real
let Y_Imxaxis = he - 20 - s_v; //posición del eje imaginario

//Parametros de energía iniciales
let E_0 = 0.5;
let Subdivisiones = 10;
let V_0 = Subdivisiones * E_0;

function setup() {
    canvas = createCanvas(wi, he);
    frameRate(rate);

    //Slider Ancho barrera
    Slider_Ancho_Barrera = createSlider(0, 7, 5);
    Slider_Ancho_Barrera.position(0.01 * wi, 0.1 * he);

    //Slider Alto barrera
    Slider_Alto_Energia = createSlider(1, Subdivisiones - 1, 1);
    Slider_Alto_Energia.position(0.25 * wi, 0.1 * he);

    //Botón Iniciar
    iniciarButton = createButton("Detener Simulación");
    iniciarButton.position(0.85 * wi, 0.07 * he);
    iniciarButton.size(80, 40);
    iniciarButton.mousePressed(toggleSimulation);
    textSize(20);
}

function draw() {
    // Borrar el lienzo
    background(255);

    // Rectangulo Verde
    stroke(0);
    fill("#8dc63f");
    rect(0, 0, wi, 0.2 * he);

    //labels
    fill("#026937");
    text("Parte Real", 0.75 * wi, 0.25 * he);
    text("Parte Imaginaria", 0.75 * wi, 0.67 * he);

    push();
    stroke(0);
    textFont("Courier");
    textSize(12);

    // Círculo y texto para la función de onda total
    fill("#026937");
    ellipse(0.5 * wi, 0.05 * he, r);
    fill(0); // Texto en negro
    text("Función de onda total", 0.52 * wi, 0.06 * he);

    // Círculo y texto para la onda incidente (primer círculo)
    fill("#70205b"); // Color del círculo
    ellipse(0.5 * wi, 0.08 * he, r); // Dibuja el círculo
    fill(0); // Texto en negro
    text("Onda Incidente", 0.52 * wi, 0.09 * he);

    // Círculo y texto para la onda incidente (segundo círculo)
    fill("#ef434d"); // Color del círculo
    ellipse(0.5 * wi, 0.11 * he, r); // Dibuja el círculo
    fill(0); // Texto en negro
    text("Onda Reflejada", 0.52 * wi, 0.12 * he);
    pop(); // Restaura el estado de estilo anterior

    let n_e = Slider_Alto_Energia.value();
    fill(0);
    text("E/V_0 = " + round(n_e * (E_0 / V_0), 2), 0.25 * wi, 0.1 * he);
    // Obtener el valor actual del slider
    let n_l = Slider_Ancho_Barrera.value();
    fill(0);
    text("L= " + n_l + "/(2*m*V_0)^{1/2}", 0.01 * wi, 0.1 * he);

    //Parametros del efecto tunel
    let E = n_e * E_0;
    let m = 1;
    let k1 = sqrt(2 * m * E);
    let k2 = sqrt(2 * m * (V_0 - E));
    let Init_len_val = 1 / sqrt(2 * m * V_0);
    let L_cal = n_l * Init_len_val;

    //Fronteras de graficación en el lienzo
    let L_graf = n_l * s_h;
    let Left = 0; //- L_graf
    let Right = wi + L_graf;

    let Y_Re = Y_Rexaxis - s_v * E; //Posicion eje de energia real
    let Y_Im = Y_Imxaxis - s_v * E; //Posicion eje de energia imaginario

    //Intervalos de graficación funciones de onda
    let Psi_1_Left = -2 * PI - 0;
    let Psi_1_Right = 0;

    let Psi_2_Left = 0;
    let Psi_2_Right = L_cal;

    let Psi_3_Left = L_cal;
    let Psi_3_Right = L_cal + 2 * PI;

    //Posicion de la barrera
    let d = 2 * L_graf;
    let Left_Pixel_Barrier = (2 * wi) / 4;
    let Barrier_width = d;

    //Calculo de las constantes:
    let T = Transmision(E, V_0, k2, L_cal);
    let A_r = 30;
    let A_i = 0;
    let A = new Complex(A_r, A_i);

    //Calculate F:
    let F1 = new Complex(1, 0);
    let F2_r = 1;
    let F2_i = k1 / k2;
    let F2 = new Complex(F2_r, F2_i);
    let F2_Conj = F2.conjugate();
    let Factor = Complex.divide(F2, F2_Conj);
    let Factor_Squared = Complex.multiply(Factor, Factor);
    let F3 = new Complex(exp(k2 * L_cal), 0);
    let F4 = new Complex(exp(-k2 * L_cal), 0);
    let F5 = new Complex(cos(k1 * L_cal), -sin(k1 * L_cal));
    let Fone = new Complex(1, 0);
    let Fden = Complex.subtract(F3, Complex.multiply(Factor_Squared, F4));
    let Fnum = Complex.multiply(
        A,
        Complex.multiply(Complex.subtract(Fone, Factor_Squared), F5)
    );
    let F = Complex.divide(Fnum, Fden);
    let F_r = F.real;
    let F_i = F.imag;

    //Calculo de B
    let B1_r = 1;
    let B1_i = k1 / k2;
    let B1 = new Complex(B1_r, B1_i);
    let B2_r = 1;
    let B2_i = -k1 / k2;
    let B2 = new Complex(B2_r, B2_i);
    let B3_r = cos(k1 * L_cal);
    let B3_i = sin(k1 * L_cal);
    let B3 = new Complex(B3_r, B3_i);
    let B4_r = exp(-k2 * L_cal);
    let B4_i = 0;
    let B4 = new Complex(B4_r, B4_i);
    let BCOEF1 = Complex.divide(B1, B2);
    let BCOEF2 = Complex.subtract(
        Complex.multiply(Complex.multiply(F, B3), B4),
        A
    );
    let B = Complex.multiply(BCOEF1, BCOEF2);
    let B_r = B.real;
    let B_i = B.imag;

    //Calculo de C
    let Onehalf = new Complex(1 / 2, 0);
    let C_term1 = Complex.add(A, B);
    let C_term2 = Complex.multiply(
        new Complex(0, k1 / k2),
        Complex.subtract(A, B)
    );
    let C = Complex.multiply(Onehalf, Complex.add(C_term1, C_term2));
    let C_r = C.real;
    let C_i = C.imag;

    //Calculo de D
    let D_term1 = Complex.add(A, B);
    let D_term2 = Complex.multiply(
        new Complex(0, k1 / k2),
        Complex.subtract(A, B)
    );
    let D = Complex.multiply(Onehalf, Complex.subtract(D_term1, D_term2));
    let D_r = D.real;
    let D_i = D.imag;

    //Funciones de Onda----------------------------------------------------------------------------------------------------------------
    function Psi_in_Real(x, t) {
        //Parte real onda incidente
        let exp1 = new Complex(cos(k1 * x), sin(k1 * x));
        let exp2 = new Complex(cos(E * t), sin(-E * t));
        return Complex.multiply(A, Complex.multiply(exp1, exp2)).real;
    }
    function Psi_in_Imaginaria(x, t) {
        //Parte imaginaria onda incidente
        let exp1 = new Complex(cos(k1 * x), sin(k1 * x));
        let exp2 = new Complex(cos(E * t), sin(-E * t));
        return Complex.multiply(A, Complex.multiply(exp1, exp2)).imag;
    }

    function Psi_ref_Real(x, t) {
        //Parte real onda reflejada
        let exp1 = new Complex(cos(k1 * x), -sin(k1 * x));
        let exp2 = new Complex(cos(E * t), sin(-E * t));
        return Complex.multiply(B, Complex.multiply(exp1, exp2)).real;
    }
    function Psi_ref_Imaginaria(x, t) {
        //Parte imaginaria onda reflejada
        let exp1 = new Complex(cos(k1 * x), -sin(k1 * x));
        let exp2 = new Complex(cos(E * t), sin(-E * t));
        return Complex.multiply(B, Complex.multiply(exp1, exp2)).imag;
    }

    function Psi_1_tot_Real(x, t) {
        //Parte real Incidente + Reflejada
        return Psi_in_Real(x, t) + Psi_ref_Real(x, t);
    }
    function Psi_1_tot_Imaginaria(x, t) {
        // Parte imaginaria Incidente + Reflejada
        return Psi_in_Imaginaria(x, t) + Psi_ref_Imaginaria(x, t);
    }

    function Psi_2_Real(x, t) {
        let exp1 = new Complex(exp(k2 * x), 0);
        let exp2 = new Complex(exp(-k2 * x), 0);
        let Temp = new Complex(cos(E * t), -sin(E * t));
        let term1 = Complex.multiply(C, Complex.multiply(exp1, Temp));
        let term2 = Complex.multiply(D, Complex.multiply(exp2, Temp));
        return Complex.add(term1, term2).real;
    }
    function Psi_2_Imaginaria(x, t) {
        let exp1 = new Complex(exp(k2 * x), 0);
        let exp2 = new Complex(exp(-k2 * x), 0);
        let Temp = new Complex(cos(E * t), -sin(E * t));
        let term1 = Complex.multiply(C, Complex.multiply(exp1, Temp));
        let term2 = Complex.multiply(D, Complex.multiply(exp2, Temp));
        return Complex.add(term1, term2).imag;
    }

    function Psi_3_Real(x, t) {
        //Parte real onda transmitida
        let exp1 = new Complex(cos(k1 * x), sin(k1 * x));
        let exp2 = new Complex(cos(E * t), sin(-E * t));
        return Complex.multiply(F, Complex.multiply(exp1, exp2)).real;
    }
    function Psi_3_Imaginaria(x, t) {
        //Parte imaginaria onda transmitida
        let exp1 = new Complex(cos(k1 * x), sin(k1 * x));
        let exp2 = new Complex(cos(E * t), sin(-E * t));
        return Complex.multiply(F, Complex.multiply(exp1, exp2)).imag;
    }

    //Iniciación de las graficas----------------------------------------------------------------------------------------------------
    Psi_In_Re = new Graficador(
        Left,
        Left_Pixel_Barrier,
        Y_Re,
        Psi_1_Left,
        Psi_1_Right,
        color(0),
        color("#70205b")
    ); //Parte real Incidente
    Psi_In_Im = new Graficador(
        Left,
        Left_Pixel_Barrier,
        Y_Im,
        Psi_1_Left,
        Psi_1_Right,
        color(0),
        color("#70205b")
    ); //Parte imaginaria Reflejada

    Psi_Ref_Re = new Graficador(
        Left,
        Left_Pixel_Barrier,
        Y_Re,
        Psi_1_Left,
        Psi_1_Right,
        color(0),
        color("#ef434d")
    ); //Parte real Reflejada
    Psi_Ref_Im = new Graficador(
        Left,
        Left_Pixel_Barrier,
        Y_Im,
        Psi_1_Left,
        Psi_1_Right,
        color(0),
        color("#ef434d")
    ); //Parte imaginaria Reflejada

    Psi_1_Re = new Graficador(
        Left,
        Left_Pixel_Barrier,
        Y_Re,
        Psi_1_Left,
        Psi_1_Right,
        color(0),
        color("#026937")
    ); //Parte real Incidente + Reflejada
    Psi_1_Im = new Graficador(
        Left,
        Left_Pixel_Barrier,
        Y_Im,
        Psi_1_Left,
        Psi_1_Right,
        color(0),
        color("#026937")
    ); //Parte imaginaria Incidente + Reflejada

    Psi_2_Re = new Graficador(
        Left_Pixel_Barrier,
        Left_Pixel_Barrier + d,
        Y_Re,
        Psi_2_Left,
        Psi_2_Right,
        color(0),
        color("#026937")
    ); //Parte real onda en la barrera
    Psi_2_Im = new Graficador(
        Left_Pixel_Barrier,
        Left_Pixel_Barrier + d,
        Y_Im,
        Psi_2_Left,
        Psi_2_Right,
        color(0),
        color("#026937")
    ); //Parte imaginaria onda en la barrera

    Psi_3_Re = new Graficador(
        Left_Pixel_Barrier + d,
        Right,
        Y_Re,
        Psi_3_Left,
        Psi_3_Right,
        color(0),
        color("#026937")
    ); //  Parte real Transmitida
    Psi_3_Im = new Graficador(
        Left_Pixel_Barrier + d,
        Right,
        Y_Im,
        Psi_3_Left,
        Psi_3_Right,
        color(0),
        color("#026937")
    ); //Parte imaginaria Transmitida

    //Dibujar T:
    text(
        "Probabilidad de Tunelamiento: " + round(100 * T, 4) + "%",
        0.01 * wi,
        0.25 * he
    );

    //Dibujar barrera de potencial
    let color_barrier = color("#3ebdac");
    color_barrier.setAlpha(155);
    fill(color_barrier);
    rect(Left_Pixel_Barrier, Y_Rexaxis, Barrier_width, -s_v * V_0);
    fill(color_barrier);
    rect(Left_Pixel_Barrier, Y_Imxaxis, Barrier_width, -s_v * V_0);

    //dibujar ejes
    stroke("#137598");
    line(0, Y_Re, wi, Y_Re); //Eje de energia real
    line(0, Y_Im, wi, Y_Im); //Eje de energia complejo

    push();
    stroke(0);
    strokeWeight(2);
    line(0, Y_Rexaxis, wi, Y_Rexaxis); //Eje x real
    line(0, Y_Imxaxis, wi, Y_Imxaxis); //Eje x imagnario
    pop();

    // Animar la simulación

    Psi_In_Re.Draw(Psi_in_Real, tiempo);
    Psi_In_Im.Draw(Psi_in_Imaginaria, tiempo);

    Psi_Ref_Re.Draw(Psi_ref_Real, tiempo);
    Psi_Ref_Im.Draw(Psi_ref_Imaginaria, tiempo);

    Psi_1_Re.Draw(Psi_1_tot_Real, tiempo);
    Psi_1_Im.Draw(Psi_1_tot_Imaginaria, tiempo);

    Psi_2_Re.Draw(Psi_2_Real, tiempo);
    Psi_2_Im.Draw(Psi_2_Imaginaria, tiempo);

    Psi_3_Re.Draw(Psi_3_Real, tiempo);
    Psi_3_Im.Draw(Psi_3_Imaginaria, tiempo);

    if (simulationRunning) {
        tiempo += dt;
    }
}

// Clases -----------------------------------------------------------------------------------

//graficador
class Graficador {
    constructor(_X_i, _X_f, _Y_0, _x_i, _x_f, _lineColor, _circleColor) {
        this.X_i = _X_i;
        this.X_f = _X_f;
        this.Y_0 = _Y_0;
        this.x_i = _x_i;
        this.x_f = _x_f;
        this.lineColor = _lineColor;
        this.circleColor = _circleColor;
    }

    Draw(func, t) {
        let d_x_real = (this.x_f - this.x_i) / (N - 1); // Distancia entre puntos en el intervalo de graficación
        for (let i = 0; i < N - 1; i++) {
            let x_i = this.x_i + d_x_real * i;
            let y_i = func(x_i, t) + this.Y_0;
            let x_next = this.x_i + d_x_real * (i + 1);
            let y_next = func(x_next, t) + this.Y_0;
            // Mapear las coordenadas x desde el intervalo de graficación a las coordenadas del lienzo
            let canvas_x_i = map(x_i, this.x_i, this.x_f, this.X_i, this.X_f);
            let canvas_x_next = map(
                x_next,
                this.x_i,
                this.x_f,
                this.X_i,
                this.X_f
            );

            stroke(this.lineColor); // Set line color
            line(canvas_x_i, y_i, canvas_x_next, y_next); // Dibujar línea entre puntos consecutivos

            fill(this.circleColor); // Set circle fill color
            stroke(this.circleColor); // Set circle stroke color
            circle(canvas_x_i, y_i, r); // Dibujar el punto actual
        }
    }
}

//Clase Numero complejos:
class Complex {
    constructor(real, imag) {
        this.real = real || 0;
        this.imag = imag || 0;
    }

    // Addition of two complex numbers
    add(other) {
        return new Complex(this.real + other.real, this.imag + other.imag);
    }

    // Subtraction of two complex numbers
    subtract(other) {
        return new Complex(this.real - other.real, this.imag - other.imag);
    }

    // Multiplication of two complex numbers
    multiply(other) {
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real
        );
    }

    // Division of two complex numbers
    divide(other) {
        const denominator = other.real * other.real + other.imag * other.imag;
        return new Complex(
            (this.real * other.real + this.imag * other.imag) / denominator,
            (this.imag * other.real - this.real * other.imag) / denominator
        );
    }

    // Get the magnitude of the complex number
    magnitude() {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }

    // Get the phase (angle) of the complex number in radians
    phase() {
        return Math.atan2(this.imag, this.real);
    }

    // Get the complex conjugate of the number
    conjugate() {
        return new Complex(this.real, -this.imag);
    }

    // Operator overloading for addition
    static add(a, b) {
        return a.add(b);
    }

    // Operator overloading for subtraction
    static subtract(a, b) {
        return a.subtract(b);
    }

    // Operator overloading for multiplication
    static multiply(a, b) {
        return a.multiply(b);
    }

    // Operator overloading for division
    static divide(a, b) {
        return a.divide(b);
    }
}

// Funciones----------------------------------------------------
// Funcion para calcular coeficiente de transmision
function Transmision(E, V_0, k2, L_cal) {
    let Seno_Hiper = (exp(k2 * L_cal) - exp(-k2 * L_cal)) / 2;
    let coef = (V_0 * V_0) / (4 * E * (V_0 - E));
    return (1 + coef * Seno_Hiper ** 2) ** -1;
}

// Funcion asociada a pausar la simulacion
function toggleSimulation() {
    if (simulationRunning) {
        // Detener la simulación
        simulationRunning = false;
        iniciarButton.html("Continuar Simulación");
    } else {
        // Iniciar la simulación
        simulationRunning = true;
        iniciarButton.html("Detener Simulación");
    }
}
