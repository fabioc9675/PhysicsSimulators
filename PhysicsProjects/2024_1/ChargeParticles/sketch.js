/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autores: Manolo Cardona Menco                           *
 * *          Dany Durango Escobar                           *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let x0, y0, angulo0, t, v0, E, m, c, a, x, y; //Se declaran las variables a utilizar
var slider;
let Start;
let trayx = [];
let trayy = [];
let landscape;
let E1;

let colision = 0;
let velx = [];
let vely = [];
let accx = [];
let accy = [];
let showVelocity = true; // Variable para controlar si se muestra el vector de velocidad o aceleración

function preload() {
    landscape = createImg("assets/blue.jpg");
    r = createImg("assets/red.jpg");
    f = createImg("assets/flecha.png"); //se necesitan estas tres iamgenes para el fondo pero nada mas.
    f2 = createImg("assets/flecha.png");
    f3 = createImg("assets/flecha.png");
    f4 = createImg("assets/flecha.png");
    f5 = createImg("assets/flecha.png");
}

// La función setup se ejecuta una sola vez
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    x0 = 10; //Posición inicial eje x
    y0 = windowHeight - 350; //Posición inicial eje y
    angulo0 = 0; //Ángulo inicial de lanzamiento
    t = 0; //Se inicia el tiempo a t = 0
    v0 = 80; //Rapidez inicial
    E = 9.8; //magnitud campo eléctrico
    m = 1; //masa del electrón
    c = 1; //carga del electrón
    a = (c * E) / m; //Aceleración de la partícula en el campo

    slider_ang = createSlider(-90, 90, 0);
    //slider.parent(buttonContainer);
    slider_ang.position(10, 10 + (1 + 1) * 30);
    sliderLabel = createP("Ángulo[°]: ");
    sliderLabel.position(10, 10 + 1 * 30);
    //sliderLabel.parent(buttonContainer);

    slider_v0 = createSlider(1, 200, 80);
    //slider.parent(buttonContainer);
    slider_v0.position(10, 50 + (1 + 1) * 30);
    sliderLabel = createP("Velocidad inicial[m/s]:");
    sliderLabel.position(10, 50 + 1 * 30);
    //sliderLabel.parent(buttonContainer);

    slider_E = createSlider(0, 50, E, 0.1);
    //slider.parent(buttonContainer);
    slider_E.position(10, 90 + (1 + 1) * 30);
    sliderLabel = createP("Campo eléctrico [V/m]: ");
    sliderLabel.position(10, 90 + 1 * 30);
    //sliderLabel.parent(buttonContainer);

    button1 = createButton("Reset");
    button1.position(10, 10);
    button1.size(80, 20);
    button1.mousePressed(Start);

    button2 = createButton("Protón");
    button2.position(300, 80);
    button2.size(80, 20);
    button2.mousePressed(negativa);

    button3 = createButton("Electrón");
    button3.position(300, 110);
    button3.size(80, 20);
    button3.mousePressed(positiva);

    button4 = createButton("Neutrón");
    button4.position(300, 140);
    button4.size(80, 20);
    button4.mousePressed(neutro);

    saveButton = createButton("Guardar datos");
    saveButton.position(100, 10);
    saveButton.mousePressed(saveData);

    function saveData() {
        let data = "x,y,t\n"; // Encabezado de columnas

        // Agregar datos de la trayectoria y tiempo
        for (let i = 0; i < trayx.length; i++) {
            data += trayx[i] + "," + trayy[i] + "," + i * 0.1 + "\n"; // Intervalo de tiempo de 0.1 segundos
        }

        // Crear un elemento <a> para descargar el archivo
        let filename = "datos_trayectoria.csv"; // Usamos extensión .csv para un archivo de valores separados por comas
        let element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(data)
        );
        element.setAttribute("download", filename);

        element.style.display = "none";
        document.body.appendChild(element);

        // Simular clic en el elemento para descargar el archivo
        element.click();

        // Remover el elemento después de la descarga
        document.body.removeChild(element);
    }

    function Start() {
        t = 0;
        trayx = [];
        trayy = [];
    }
    function positiva() {
        c = 1;
    }

    function negativa() {
        c = -1;
    }

    function neutro() {
        c = 0;
    }
}

// la función draw se repite una y otra vez
function draw() {
    background(200); //Se establece el color de fondo
    landscape.position(0, 170);
    landscape.size(windowWidth, 50); //defino campos
    r.position(0, windowHeight - 50);
    r.size(windowWidth, 50);
    f.position(-30, 220);
    f.size(windowWidth * 0.2, windowHeight - 280);
    f2.position(120, 220);
    f2.size(windowWidth * 0.2, windowHeight - 280);
    f3.position(270, 220);
    f3.size(windowWidth * 0.2, windowHeight - 280);
    f4.position(450, 220);
    f4.size(windowWidth * 0.2, windowHeight - 280);
    f5.position(620, 220);
    f5.size(windowWidth * 0.2, windowHeight - 280);

    text(slider_E.value(), 170, 90 + (1 + 1) * 30);
    text(slider_v0.value(), 160, 50 + (1 + 1) * 30);
    text(slider_ang.value(), 90, 10 + (1 + 1) * 30);

    text("x = " + x, 500, 120);
    text("y = " + y, 500, 150);

    if (colision == 0) {
        x = x0 + slider_v0.value() * cos((slider_ang.value() * PI) / 180) * t; //Se calcula posición x del proyectil
        y =
            y0 +
            slider_v0.value() * sin((slider_ang.value() * PI) / 180) * t -
            (0.5 * c * slider_E.value() * t * t) / m; //Se calcula posición y del proyectil
        trayx.push(x);
        trayy.push(height - y);
    }

    if (y < 60 || x > windowWidth - 25 || y > windowHeight - 230) {
        colision = 1;
    }

    if (t == 0) {
        colision = 0;
    }

    //-----movimiento para el electrón----
    if (c == 1) {
        stroke(0); //El proyectil se dibuja con un borde negro
        fill("#5CB2DF"); //El proyectil se rellena de color rojo
        ellipse(x, height - y, 16, 16); //El proyectil es un círculo de diámetro 16 pixeles
        //line(x,y,x+1,y+1)

        t += 0.1; //La simulación avanza cada 0.1 segundos, para más lento disminuir éste número

        if (height - y > height || x > width || x < 0) {
            t = 0;
        }
    }
    //-----movimiento para el protón----
    if (c == -1) {
        stroke(0); //El proyectil se dibuja con un borde negro
        fill("#F12C1A"); //El proyectil se rellena de color rojo
        ellipse(x, height - y, 16, 16); //El proyectil es un círculo de diámetro 16 pixeles
        //line(x,y,x+1,y+1)

        t += 0.1; //La simulación avanza cada 0.1 segundos, para más lento disminuir éste número

        if (height - y > height || x > width || x < 0) {
            t = 0;
        }
    }
    //-----movimiento para el neutrón----
    if (c == 0) {
        stroke(0); //El proyectil se dibuja con un borde negro
        fill("#ADA7A7"); //El proyectil se rellena de color rojo
        ellipse(x, height - y, 16, 16); //El proyectil es un círculo de diámetro 16 pixeles
        //line(x,y,x+1,y+1)

        t += 0.1; //La simulación avanza cada 0.1 segundos, para más lento disminuir éste número

        if (height - y > height || x > width || x < 0) {
            t = 0;
        }
    }

    // Dibujar la trayectoria
    stroke(0); // Color de la línea
    noFill(); // No rellenar
    beginShape();
    for (let i = 0; i < trayx.length; i++) {
        vertex(trayx[i], trayy[i]);
    }
    endShape();
}
