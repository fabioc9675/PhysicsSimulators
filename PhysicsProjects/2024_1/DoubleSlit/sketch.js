/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Santiago Moreno Gonzalez                       *
 * *          Alejandra Echeverry                            *
 * *          Juan Esteban Ospina Holguin                    *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let radio = 165; //Radio de la primera circunferencia
let radio2 = 110; //Raio de la sefunda circunferencia
let radio3 = 55; //Radio de la tercera circunferencia
let radio4 = 0; //Radio de la cuarta circunferencia
let ycenter1 = 20; // Posición en y de la primera circunferencia
let expansionRate = 0.5; // Tasa de expansión de la circunferencia
let d_slit_slider; // Slider para el ancho de la rendija
let wavelength_slider; // Slider para la longitud de onda
let sliderTitle; // Título del slider
let PatternTitle; // Título de patrón
let detectorActive = false; // Estado del detector
let detectorButton; // Botones para activar/desactivar los detectores
let y = ycenter1; // Posición inicial en y
let n = 1; // Variable para controlar el movimiento de la pelota
let n2 = 1; // Variable para controlar el movimiento de la pelota
let interferenceData = []; // Arreglo para almacenar los valores de intensidad del patrón de interferencia
let downloadButton; // Botón para descargar los datos

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0, 191, 255);

    // Crear el deslizador para el ancho de la rendija
    d_slit_slider = createSlider(10, 30, 25); // Valor inicial: 25
    d_slit_slider.position(10, 40);
    d_slit_slider.style("width", "80px");

    // Crear el valor del deslizador para el ancho de la rendija
    d_slit_value = createP(d_slit_slider.value());
    d_slit_value.position(
        d_slit_slider.x + d_slit_slider.width + 10,
        d_slit_slider.y
    );

    // Crear el deslizador para la longitud de onda
    wavelength_slider = createSlider(5, 30, 10); // Valor inicial: 10
    wavelength_slider.position(10, 100);
    wavelength_slider.style("width", "80px");

    // Crear el valor del deslizador para la longitud de onda
    wavelength_value = createP(wavelength_slider.value());
    wavelength_value.position(
        wavelength_slider.x + wavelength_slider.width + 10,
        wavelength_slider.y
    );

    // Crear el título del slider para la longitud de onda
    let wavelengthTitle = createElement("h5", "Longitud de onda");
    wavelengthTitle.position(10, 65);

    // Crear el título del slider para el ancho de la rendija
    sliderTitle = createElement("h5", "Ancho de la rendija");
    sliderTitle.position(10, 5);

    // Crear el título del patrón
    PatternTitle = createElement("h5", "Pantalla");
    PatternTitle.position(135, 390);

    // Crear botones para activar/desactivar los detectores
    detectorButton = createButton("Activar Detector");
    detectorButton.position(10, 150);
    detectorButton.mousePressed(toggleDetector);

    // Crear el botón de descarga
    downloadButton = createButton("Descargar Datos");
    downloadButton.position(10, 450);
    downloadButton.mousePressed(downloadData);

    // Inicializar la posición de las pelotas
    x = windowWidth / 2;
    x2 = windowWidth / 2 + d_slit_slider.value();
    y2 = windowHeight / 2;
}

function draw() {
    background("a05d00"); // Limpiar el lienzo en cada frame
    fill(255, 255, 0); // Amarillo
    ellipse(
        windowWidth / 2,
        ycenter1,
        d_slit_slider.value() / 2,
        d_slit_slider.value() / 2
    ); // Círculo en la parte superior central

    drawLines(height / 2, 2); // Dibujar líneas de referencia

    //Actualizar el valor del deslizador
    d_slit_value.html(d_slit_slider.value());
    wavelength_value.html(wavelength_slider.value());

    // Verificar si se alcanzó el punto intermedio

    if (!detectorActive) {
        drawCircles(windowWidth / 2, ycenter1, expansionRate, height / 2); // Dibujar círculos expandibles
        drawCircles(
            width / 2 - 3 * d_slit_slider.value(),
            height / 2,
            expansionRate,
            height
        ); // Dibujar círculos expandibles
        drawCircles(
            width / 2 + 3 * d_slit_slider.value(),
            height / 2,
            expansionRate,
            height
        ); // Dibujar círculos expandibles
    } else {
        if (y2 > windowHeight - 50) {
            n *= -1;
        }
        if (y > windowHeight / 2 - 20) {
            n2 *= -1;
        }
        moveBall(
            windowWidth / 2,
            ycenter1,
            width / 2 - n2 * d_slit_slider.value(),
            height / 2,
            4
        );
        moveBall2(
            windowWidth / 2 + n * d_slit_slider.value(),
            height / 2,
            windowWidth / 2 + n * d_slit_slider.value(),
            height,
            4
        );
    }

    drawInterferencePattern(); // Dibujar patrón de interferencia en la pantalla
}

function toggleDetector() {
    detectorActive = !detectorActive;
    if (detectorActive) {
        detectorButton.html("Desactivar Detector");
    } else {
        detectorButton.html("Activar Detector");
    }
}

function moveBall(startX, startY, targetX, targetY, speed) {
    fill(255, 0, 0);
    ellipse(x, y, 10, 10);
    let dx = targetX - startX;
    let dy = targetY - startY;
    let distance = sqrt(dx * dx + dy * dy);
    let steps = distance / speed;
    let stepX = dx / steps;
    let stepY = dy / steps;
    x += stepX;
    y += stepY;
    if (y >= height / 2) {
        x = startX;
        y = startY;
    }
}

function moveBall2(startX, startY, targetX, targetY, speed) {
    fill(0, 255, 0);
    ellipse(x2, y2, 10, 10);
    let dx = targetX - startX;
    let dy = targetY - startY;
    let distance = sqrt(dx * dx + dy * dy);
    let steps = distance / speed;
    let stepX = dx / steps;
    let stepY = dy / steps;
    x2 += stepX;
    y2 += stepY;
    if (y2 >= height) {
        x2 = startX;
        y2 = startY;
    }
}

function drawInterferencePattern() {
    let d_slit = d_slit_slider.value(); // Obtener el valor del deslizador para el ancho de la rendija
    let wavelength = wavelength_slider.value(); // Obtener el valor del deslizador para la longitud de onda
    let L = 100; // Distancia de las rendijas a la pantalla
    let intensityMax = 255; // Intensidad máxima

    noFill();

    if (!detectorActive) {
        // Si ambos detectores están inactivos, dibujar el patrón de interferencia
        stroke(255, 0, 0); // Color rojo
        for (let x = 40; x < width - 40; x++) {
            // Ajustar el rango de x para centrarlo más
            let x_from_center = abs(x - width / 2); // Distancia desde el centro
            let theta = atan(x_from_center / L); // Ángulo
            let interference =
                intensityMax *
                pow(cos((PI * d_slit * sin(theta)) / wavelength), 2);
            interferenceData.push([x, interference]); // Guardar el valor de intensidad en el arreglo
            strokeWeight(8); // Grosor de la línea
            stroke(interference);
            line(x, height - 20, x, height); // Dibujar una línea vertical en cada punto de la pantalla
        }
    } else {
        // Si el detector está activo, dibujar patron clásico
        let slitWidth = d_slit_slider.value(); // Ancho de la rendija
        let startX = width / 2 - slitWidth; // Coordenada x de inicio de las líneas
        let endX = width / 2 + slitWidth; // Coordenada x de fin de las líneas
        stroke(0); // Color rojo
        strokeWeight(8); // Grosor de la línea
        line(startX, height - 20, startX, height); // Línea izquierda
        line(endX, height - 20, endX, height); // Línea derecha
    }
}

function drawLines(lineHeight, numSlides) {
    let d_slit = d_slit_slider.value(); // Obtener el valor del deslizador para el ancho de la rendija

    if (numSlides == 1) {
        // Líneas horizontales
        stroke(0); // Color negro
        strokeWeight(4); // Grosor de la línea
        line(0, lineHeight, width / 2 - d_slit / 2, lineHeight); // Línea izquierda
        line(width / 2 + d_slit / 2, lineHeight, width, lineHeight); // Línea derecha
    }

    if (numSlides == 2) {
        // Líneas horizontales
        stroke(0); // Color negro
        strokeWeight(4); // Grosor de la línea
        line(0, lineHeight, width / 2 - (3 * d_slit) / 2, lineHeight); // Línea izquierda
        line(
            width / 2 - d_slit / 2,
            lineHeight,
            width / 2 + d_slit / 2,
            lineHeight
        ); // Línea central
        line(width / 2 + (3 * d_slit) / 2, lineHeight, width, lineHeight); // Línea derecha
    }
}

function drawCircles(xcenter, ycenter, expansionRate, limit) {
    // Circunferencia que se expande y se disipa
    noFill(); // Sin relleno
    stroke(255, 50, 10); // Color rojo
    strokeWeight(2.5); // Grosor de la línea

    // Dibujar las semicircunferencias
    arc(xcenter, ycenter, radio * 2, radio * 2, 0, PI); // Semicircunferencia 1
    arc(xcenter, ycenter, radio2 * 2, radio2 * 2, 0, PI); // Semicircunferencia 2
    arc(xcenter, ycenter, radio3 * 2, radio3 * 2, 0, PI); // Semicircunferencia 3
    arc(xcenter, ycenter, radio4 * 2, radio4 * 2, 0, PI); // Semicircunferencia 4

    // Incrementar los radios para el siguiente frame
    radio += expansionRate;
    radio2 += expansionRate;
    radio3 += expansionRate;
    radio4 += expansionRate;

    // Reiniciar los radios si alcanzan el límite
    if (radio >= limit - ycenter) {
        radio = 0;
    }
    if (radio2 >= limit - ycenter) {
        radio2 = 0;
    }
    if (radio3 >= limit - ycenter) {
        radio3 = 0;
    }
    if (radio4 >= limit - ycenter) {
        radio4 = 0;
    }
}

function downloadData() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Ángulo,Intensidad\r\n"; // Encabezados de las columnas

    interferenceData.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "interference_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "interference_data.csv".
}
