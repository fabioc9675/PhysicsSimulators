/*************************************************************
 ******** SIMULACIÓN MAQUINA PEDAGOGICA **********************
 *************************************************************
 ** Autor: German Torres Arroyave                           **
 **        Sebastian Diaz Granados Cano                     **
 ** Institución: Universidad de Antioquia                   **
 ** Curso: Laboratorio avanzado 3                           **
 *************************************************************/

//Inicialización del tiempo
let startTime;

//Lista para guardar los datos a exportar
let datosExportar = [];

let mostrarVectores = true;

let wall1 = 10,
    wall2 = 300,
    wall3 = 400,
    wall4 = 500;
let x1_0 = wall1,
    x2_0 = 50,
    x3_0 = wall2 + 5;
let y2_0 = 300,
    y3_0 = 280 - 60;
let x1 = x1_0,
    x2 = x2_0,
    x3 = x1_0 + x3_0;
let y3 = y3_0;
let g = 10;
let x_p0 = 340,
    y_p0 = 315,
    r_p = 20;
let x_p = x_p0,
    y_p = y_p0;

let inputM1, inputM2, inputM3, inputF;
let tituloM1, tituloM2, tituloM3, tituloF;
let botonInicio;
let slider;
let isSimulationRunning = false;

function setup() {
    createCanvas(1000, 500);

    // Crear los inputs y títulos
    inputM1 = createInput();
    inputM1.position(40, 10);
    inputM1.size(30, 17);

    inputM2 = createInput();
    inputM2.position(40, 40);
    inputM2.size(30, 17);

    inputM3 = createInput();
    inputM3.position(40, 70);
    inputM3.size(30, 17);

    inputF = createInput();
    inputF.position(266, 10);
    inputF.size(30, 17);
    inputF.input(inputChanged);

    tituloM1 = createP("M1:");
    tituloM1.position(10, -3);
    tituloM1.style("font-family", "Arial");
    tituloM1.style("font-size", "16px");
    tituloM1.style("font-weight", "bold"); // negrita

    tituloM2 = createP("M2:");
    tituloM2.position(10, 25);
    tituloM2.style("font-family", "Arial");
    tituloM2.style("font-size", "16px");
    tituloM2.style("font-weight", "bold"); // negrita

    tituloM3 = createP("M3:");
    tituloM3.position(10, 55);
    tituloM3.style("font-family", "Arial");
    tituloM3.style("font-size", "16px");
    tituloM3.style("font-weight", "bold"); // negrita

    tituloF = createP("Fuerza (F):");
    tituloF.position(92, -3);
    tituloF.style("font-family", "Arial");
    tituloF.style("font-size", "16px");
    tituloF.style("font-weight", "bold"); // negrita

    botonInicio = createButton("Iniciar");
    botonInicio.position(100, 42);
    botonInicio.mousePressed(startSimulation);

    let button = createButton("Reset");
    button.position(100, 70);
    button.mousePressed(resetSimulation);

    exportButton = createButton("Exportar Datos");
    exportButton.position(170, 42);
    exportButton.mousePressed(exportDataToCSV);

    let checkButton = createCheckbox("Mostrar vectores", true);
    checkButton.position(170, 70);
    checkButton.changed(toggleFigureVisibility);
    let labelElement = select("label");
    labelElement.style("font-size", "16px");
    labelElement.style("font-family", "Arial");
    labelElement.style("font-weight", "bold");

    slider = createSlider(0, 50, 5, 0.1);
    slider.position(177, 10);
    slider.size(80);
}

function draw() {
    background("#F0C44F");
    translate(0, height);
    scale(1, -1);
    fill("#98591A");
    rect(0, 0, 1000, 100);
    const a = color("#B63F2A");
    fill(a);

    //Masa 1
    beginShape();
    vertex(wall1 + x1, 50);
    vertex(wall1 + x1, 300);
    vertex(wall2 + x1, 300);
    vertex(wall2 + x1, 120);
    vertex(wall3 + x1, 120);
    vertex(wall3 + x1, 300);
    vertex(wall4 + x1, 300);
    vertex(wall4 + x1, 50);
    endShape(CLOSE);

    rect(380 + x1, 290, 20, 10);

    //Masa 2
    const d = color("#F0B14F");
    fill(d);
    rect(x2, y2_0, 90, 70);

    //Masa 3
    const c = color("#F0B14F");
    fill(c);
    rect(x3 - 5, y3, 96, 60);

    const f = color("#B63F2A");
    fill(f);

    // Mostrar Vectores
    if (mostrarVectores) {
        // Fuerza (Vector)
        drawArrow(createVector(502 + x1, 210), createVector(90, 0), "black");

        //Tensiones (Vectores)
        drawArrow(
            createVector(350 + x1, y3 + 62),
            createVector(0, 40),
            "black"
        );

        drawArrow(
            createVector(x2 + 92, y2_0 + 35),
            createVector(40, 0),
            "black"
        );
        // Gravedad M3(Vector)
        drawArrow(
            createVector(350 + x1, y3 - 2),
            createVector(0, -40),
            "black"
        );
        // Gravedad M2(Vector)
        drawArrow(
            createVector(x2 + 45, y2_0 - 2),
            createVector(0, -40),
            "black"
        );

        // Gravedad M1(Vector)
        drawArrow(createVector(x1 + 250, 48), createVector(0, -40), "black");

        push();
        fill(0);
        textFont("Arial");
        textStyle(BOLD);
        scale(1, -1);
        textSize(25);
        text("F", 530 + x1, -230);
        //Tensiones
        textSize(20);
        text("T", 362 + x1, -y3 - 80);
        text("T", x2 + 115, -y2_0 - 48);
        //Masa 1
        text("M", x1 + 270, -20);
        text("g", x1 + 294, -20);
        //Masa 2
        text("M", x2 + 60, -y2_0 + 40);
        text("g", x2 + 84, -y2_0 + 40);
        //Masa 3
        text("M", 364 + x1, -y3 + 40);
        text("g", 388 + x1, -y3 + 40);
        textSize(15);
        text("1", x1 + 286, -16);
        text("2", x2 + 76, -y2_0 + 44);
        text("3", 380 + x1, -y3 + 44);
        pop();
    }

    // Titulos para las masas
    push();
    fill(0);
    textFont("Arial");
    textStyle(BOLD);
    scale(1, -1);
    textSize(40);
    text("M1", 100 + x1, -150);
    textSize(25);
    text("M2", 30 + x2, -325);
    text("M3", 30 + x3, -20 - y3);
    pop();

    push();
    strokeWeight(3);
    circle(x_p, y_p, 2 * r_p);
    line(x_p - 30, 300, x_p, y_p);
    line(x2 + 90, y2_0 + 35, x_p, y_p + r_p);
    line(x_p + r_p, y_p, x3 + 45, y3 + 60);
    pop();

    // Lectura de los datos de entrada
    let m1 = parseFloat(inputM1.value());
    let m2 = parseFloat(inputM2.value());
    let m3 = parseFloat(inputM3.value());

    let F = slider.value();
    let F_eq = (m3 / m2) * (m1 + m2 + m3) * g;

    inputF.value(F);

    if (m1 && m2 && m3) {
        push();
        fill(0);
        textFont("Arial");
        textStyle(BOLD);
        scale(1, -1);
        textSize(16);
        textAlign(CENTER);
        text(
            "Recomendación: La fuerza necesaria \n para que  las masas  M2 y M3 \n permanezcan  en equilibrio es: " +
                F_eq.toFixed(2) +
                "N",
            490,
            -465
        );
        pop();

        slider.attribute("min", -int(F_eq));
        slider.attribute("max", 2 * int(F_eq));
        slider.value(constrain(slider.value(), -int(F_eq), 2 * int(F_eq)));

        if (isSimulationRunning) {
            let t = (millis() - startTime) / 1000;

            let alph =
                ((m2 + m3) / (m1 * m2 + m1 * m3 + 2 * m2 * m3 + m3 * m3)) *
                (F - g * ((m2 * m3) / (m2 + m3)));

            if (y3 > 120 && y3 < 230) {
                // Calculo de las posiciones
                x1 = x1_0 + 0.5 * alph * t * t;
                x2 = x2_0 + (m3 / (m2 + m3)) * 0.5 * t * t * (alph + g);
                x3 = x3_0 + x1;
                y3 =
                    y3_0 +
                    0.5 * alph * t * t * (m2 / (m2 + m3)) -
                    0.5 * g * t * t * (m3 / (m2 + m3));
                x_p = x_p0 + 0.5 * alph * t * t;

                // Calculo de las velocidades para guardar en el CSV
                let v1 = alph * t;
                let v2 = (m3 / (m2 + m3)) * t * (alph + g);
                let v3 = alph * t * (m2 / (m2 + m3)) - g * t * (m3 / (m2 + m3));

                // Aceleraciones
                let a1 = alph;
                let a2 = (m3 / (m2 + m3)) * (alph + g);
                let a3 = alph * (m2 / (m2 + m3)) - g * (m3 / (m2 + m3));

                datosExportar.push({
                    tiempo: t,
                    x1,
                    x2,
                    x3,
                    v1,
                    v2,
                    v3,
                    a1,
                    a2,
                    a3,
                });
            }
        }
    }

    if (m1 == 0 || m2 == 0 || m3 == 0) {
        push();
        fill(0);
        rect(160, 220, 400, 50);

        fill(255, 0, 0);
        textFont("Arial");
        textStyle(BOLD);

        scale(1, -1);
        textSize(16);

        text("Error: Ninguna de las masas puede ser cero", 200, -240);

        pop();
    }
}
function startSimulation() {
    isSimulationRunning = true;
    startTime = millis();
}
function resetSimulation() {
    inputF.value("");
    x1 = x1_0;
    x2 = x2_0;
    x3 = x1_0 + x3_0;
    x_p = x_p0;
    y_p = y_p0;
    y3 = y3_0;
    startTime = millis();
    alph = 0;
    isSimulationRunning = false;
}

function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(5);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 20;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    fill(100);
    pop();
}

function inputChanged() {
    // Obtener el valor del input y asegurarse de que esté dentro del rango del slider
    let m1 = parseFloat(inputM1.value());
    let m2 = parseFloat(inputM2.value());
    let m3 = parseFloat(inputM3.value());
    let F_eq = (m3 / m2) * (m1 + m2 + m3) * g;

    let inputValue = inputF.value();
    if (inputValue === "") {
        slider.value(0); // Si el input está vacío, establecer el valor del slider en 0
    } else {
        let intValue = inputValue;

        inputF.value(intValue);
        console.log(intValue);
        slider.value(intValue);
        if (isNaN(intValue) || isNaN(-F_eq) || isNaN(2 * F_eq)) {
            intValue = 0;
        } else {
            intValue = constrain(intValue, -F_eq, 2 * F_eq);
            console.log(intValue);
        }
    }
}

//Función para exportar los datos csv

function exportDataToCSV() {
    // Crear el contenido CSV
    let csvContent =
        "Tiempo,Posicion M1,Posicion M2,Posicion M3,Velocidad M1,Velocidad M2,Velocidad M3,Aceleracion M1,Aceleracion   M2,Aceleracion M3\n";
    datosExportar.forEach((dato) => {
        csvContent += `${dato.tiempo},${dato.x1},${dato.x2},${dato.x3},${dato.v1},${dato.v2},${dato.v3},${dato.a1},${dato.a2},${dato.a3}\n`;
    });

    // Crear y descargar el archivo CSV
    let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Datos_Maquina_Pedagogica.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function toggleFigureVisibility() {
    mostrarVectores = !mostrarVectores;
}
