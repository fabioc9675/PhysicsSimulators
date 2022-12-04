/* ************************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 ******************
 * ************************************************************
 * * Autores:Juan Andrés González                             *
 *           Cristian Serna                                   *
 * * Institución: Universidad de Antioquia                    *
 * ***********************************************************/

// inicializacion y valores por defecto
let chart1;
let chart2;
// Listas para obtener los nombres de las variables y colores
colors = ["#ff0000", "#5649ff", "#000000"];
lineLabels1 = ["Omega1", "Omega2", "Omega3"];
lineLabels2 = ["Alpha1", "Alpha2", "Alpha3"];

let numPts = 800;

let R = 1; //Radio

let fr = 30; //FrameRate
let dt = 1 / fr; // paso temporal

let phi = 0;
let theta;
let psi;

// Crea las listas en las que se guardarán los datos
let Omega1 = [];
let Omega2 = [];
let Omega3 = [];

let Alpha1 = [];
let Alpha2 = [];
let Alpha3 = [];

// Listas para guardar los datos de las gráficas
let dataOmega = [[], [], []];
let dataAlpha = [[], [], []];

let tiempo = [0]; // Lista que guarda el paso del tiempo

let contador = 0;
let iniciar = 0;

let M;

let n = 0; // Variable para tener en cuenta las discontinuidades de las funciones trigonométricas

// Variables para el tamaño de la ventana
let w = window.innerWidth; //ancho
let h = window.innerHeight; //altura

let table;
let registrar = true;

let boton1;
let boton2;
let boton3;
let boton4;
let boton5;

let sliderA;
let sliderB;
let sliderC;

let sliderOmega1;
let sliderOmega2;
let sliderOmega3;

let inputI1;
let inputI2;
let inputI3;

//La simulación de objetos rotando requiere un canvas de estilo WEBGl, mientras que el resto de elementos requiere un canvas normal.
// Definimos múltiples canvas por separado.
var s1 = function (sketch) {
  sketch.setup = function () {
    // Canvas para la sección de control
    let canvas1 = sketch.createCanvas((11 * w) / 20, h / 2);
    canvas1.position(0, 0);
    sketch.background(255);

    // Cada botón tiene asociado la posición en la página, el tamño y la función que se ejecuta al pulsarlo

    //Botón para iniciar la simulación
    boton1 = sketch.createButton("Iniciar\nsimulación");
    boton1.position(w / 5, (h * 23) / 60);
    boton1.size(w / 10, 45);
    boton1.mousePressed(sketch.Iniciar);

    //Botón para pausar la simulación
    boton2 = sketch.createButton("Pausar");
    boton2.position(w / 5, (h * 23) / 60);
    boton2.size(w / 10, (h * 1) / 16);
    boton2.mousePressed(sketch.Pausar);
    boton2.hide();

    //Botón para guardar los datos en la gráfica en un .csv
    boton3 = sketch.createButton("Guardar\ndatos");
    boton3.position((w * 7) / 20, (h * 23) / 60);
    boton3.size(w / 10, 45);
    boton3.mousePressed(sketch.Guardar);
    boton3.hide();

    //Botón para finalizar la simulación
    boton4 = sketch.createButton("Reanudar");
    boton4.position(w / 5, (h * 23) / 60);
    boton4.size(w / 10, (h * 1) / 16);
    boton4.mousePressed(sketch.Iniciar);
    boton4.hide();

    // Textos etiqueta de los elementos

    sketch.textSize(18);
    sketch.text("Eje 1", w / 50, (h * 15) / 60);
    sketch.text("Eje 2", w / 50, (h * 18) / 60);
    sketch.text("Eje 3", w / 50, (h * 21) / 60);

    sketch.text("Factor\nde escala", w / 10, (h * 10) / 60);
    sketch.text("Velocidad\nangular", (2.45 * w) / 10, (h * 10) / 60);
    sketch.textAlign(sketch.LEFT);
    sketch.text("Momento\nde inercia", (4.18 * w) / 10, (h * 10) / 60);

    sketch.text("Forma del objeto", (3 * w) / 20, (h * 2) / 65);

    //Sliders de las dimensiones en los tres ejes, solo funcionan cuando la simulación esta pausada. Predeterminadas = (40, 80, 160)
    sliderA = sketch.createSlider(4, 200, 40, 4);
    sliderA.position((2 * w) / 20, (h * 13) / 60);
    sliderA.size(w / 10);

    sliderB = sketch.createSlider(4, 200, 80, 4);
    sliderB.position((2 * w) / 20, (h * 16) / 60);
    sliderB.size(w / 10);

    sliderC = sketch.createSlider(4, 200, 160, 4);
    sliderC.position((2 * w) / 20, (h * 19) / 60);
    sliderC.size(w / 10);

    //Sliders de las velocidades angulares en los tres ejes, solo funcionan cuando la simulación esta pausada. Predeterminadas = (0, 1, 0.1)
    sliderOmega1 = sketch.createSlider(0, 1, 0, 0.1);
    sliderOmega1.position((5 * w) / 20, (h * 13) / 60);
    sliderOmega1.size(w / 10);

    sliderOmega2 = sketch.createSlider(0, 1, 1, 0.1);
    sliderOmega2.position((5 * w) / 20, (h * 16) / 60);
    sliderOmega2.size(w / 10);

    sliderOmega3 = sketch.createSlider(0, 1, 0.1, 0.1);
    sliderOmega3.position((5 * w) / 20, (h * 19) / 60);
    sliderOmega3.size(w / 10);

    //Menú desplegable para seleccionar figura
    menu_figura = sketch.createSelect();
    menu_figura.option("Elipsoide");
    menu_figura.option("Cilindro");
    menu_figura.option("Cono");
    menu_figura.option("Bloque");
    menu_figura.option("Dona");
    menu_figura.position((3 * w) / 20, (h * 2) / 50);
    menu_figura.size(w / 5, h / 20);
  };

  // Funciones correspondientes a los botones

  sketch.Iniciar = function () {
    iniciar = 1;
    boton1.hide();
    boton2.show();
    boton3.hide();
    boton4.hide();
    boton5.hide();
  };
  sketch.Pausar = function () {
    iniciar = 2;
    boton1.hide();
    boton2.hide();
    boton3.show();
    boton4.show();
    boton5.show();
  };
  sketch.Guardar = function () {
    omeg1 = Omega1[0];
    omeg2 = Omega2[1];
    omeg3 = Omega3[2];

    Momento1 = I[0];
    Momento2 = I[1];
    Momento3 = I[2];

    datos = new p5.Table();
    datos.addColumn("t");
    datos.addColumn("omega1");
    datos.addColumn("omega2");
    datos.addColumn("omega3");
    datos.addColumn("alpha1");
    datos.addColumn("alpha2");
    datos.addColumn("alpha3");
    for (counter_datos = 0; counter_datos < contador; counter_datos++) {
      fila = datos.addRow();
      fila.set("t", tiempo[counter_datos]);
      fila.set("omega1", Omega1[counter_datos]);
      fila.set("omega2", Omega2[counter_datos]);
      fila.set("omega3", Omega3[counter_datos]);
      fila.set("alpha1", Alpha1[counter_datos]);
      fila.set("alpha2", Alpha2[counter_datos]);
      fila.set("alpha3", Alpha3[counter_datos]);
    }
    fila = datos.addRow();
    fila.set(
      "t",
      "Momento de inercia = " +
        sketch.str(I[0]) +
        ", " +
        sketch.str(I[1]) +
        ", " +
        sketch.str(I[2])
    );

    sketch.save(datos, "Datos_rotacion.csv");
  };
};

var s2 = function (sketch) {
  //canvas para mostrar la simulación
  sketch.setup = function () {
    let canvas2 = sketch.createCanvas((9 * w) / 20, h / 2, sketch.WEBGL);
    canvas2.position((11 * w) / 20, 0);
    sketch.frameRate(fr);
  };

  sketch.draw = function () {
    sketch.background("#4996B6");
    sketch.orbitControl();
    sketch.drawGrid();
    if (iniciar == 0) {
      //Configurando los parámetros
      // Calcula y establece los parámetros iniciales y los momentos de inercia
      sketch.Configuracion();
      sketch.AngulosIniciales(contador);

      // Muestra los momentos de inercia
      inputI1 = sketch.createInput(sketch.str(sketch.round(I[0], 3)));
      inputI1.position((4.2 * w) / 10, (h * 13) / 60);
      inputI1.size(w / 15);

      inputI2 = sketch.createInput(sketch.str(sketch.round(I[1], 3)));
      inputI2.position((4.2 * w) / 10, (h * 16) / 60);
      inputI2.size(w / 15);

      inputI3 = sketch.createInput(sketch.str(sketch.round(I[2], 3)));
      inputI3.position((4.2 * w) / 10, (h * 19) / 60);
      inputI3.size(w / 15);
    }
    if (iniciar == 1) {
      //Simulación Activa
      menu_figura.attribute("disabled", true);
      sliderA.hide();
      sliderB.hide();
      sliderC.hide();
      sliderOmega1.hide();
      sliderOmega2.hide();
      sliderOmega3.hide();
      sketch.Calcular(contador);
      contador += 1;
    }
    if (iniciar == 2) {
      //Estado de pausa
    }
    if (iniciar == 3) {
      //Reinicio: Borra todos los datos y regresa al estado de configuración de parámetros
      sliderA.show();
      sliderB.show();
      sliderC.show();
      sliderOmega1.show();
      sliderOmega2.show();
      sliderOmega3.show();
      menu_figura.removeAttribute("disabled");

      contador = 0;
      boton1.show();
      boton3.hide();
      boton4.hide();
      boton5.hide();

      Omega1 = [];
      Omega2 = [];
      Omega3 = [];
      Alpha1 = [];
      Alpha2 = [];
      Alpha3 = [];

      dataOmega = [[], [], []];
      dataAlpha = [[], [], []];
      iniciar = 0;
    }
    sketch.fill("#B66949");
    sketch.DibujarFigura(fig);
  };

  sketch.drawGrid = function () {
    sketch.stroke(200);
    sketch.fill(120);
    for (var x = -1 * sketch.width; x < sketch.width; x += sketch.width / 20) {
      sketch.stroke(255);
      sketch.line(x, -sketch.height, x, sketch.height);
    }
    for (var y = -sketch.height; y < sketch.height; y += sketch.height / 20) {
      sketch.stroke(255);
      sketch.line(-1 * sketch.width, y, sketch.width, y);
    }
  };

  sketch.Configuracion = function () {
    // Establece los momentos de inercia correspondientes
    sketch.ImplementarFigura(menu_figura.value());

    // Obtiene los valores de los sliders (Velocidad angular y factores de escala)
    sketch.a = sliderA.value();
    sketch.b = sliderB.value();
    sketch.c = sliderC.value();

    Omega1[0] = sliderOmega1.value();
    Omega2[0] = sliderOmega2.value();
    Omega3[0] = sliderOmega3.value();

    // Reescala los momentos de inercia de acuerdo a la forma de la figura
    Ixyz[0] *= sketch.a ** 2;
    Ixyz[1] *= sketch.b ** 2;
    Ixyz[2] *= sketch.c ** 2;

    I = [Ixyz[1] + Ixyz[2], Ixyz[0] + Ixyz[2], Ixyz[0] + Ixyz[1]]; //Momento de inercia de cada eje

    M = sketch.sqrt(
      (I[0] * Omega1[0]) ** 2 +
        (I[1] * Omega2[0]) ** 2 +
        (I[2] * Omega3[0]) ** 2
    ); //Momento angular del sistema
  };

  // Función para establecer los momentos de inercia a partir de la figura seleccionada
  // Cada momento de inercia está calculado previamente.
  sketch.ImplementarFigura = function (i) {
    if (i == "Cono") {
      Ixyz = [(3 * R ** 2) / 20, (3 * R ** 2) / 80, (3 * R ** 2) / 20];
    }
    if (i == "Elipsoide") {
      Ixyz = [R ** 2 / 5, R ** 2 / 5, R ** 2 / 5];
    }
    if (i == "Cilindro") {
      Ixyz = [R ** 2 / 4, R ** 2 / 12, R ** 2 / 4];
    }
    if (i == "Bloque") {
      Ixyz = [R ** 2 / 12, R ** 2 / 12, R ** 2 / 12];
    }
    if (i == "Dona") {
      Ixyz = [
        R ** 2 / 2 + (3 * R ** 2) / 32,
        R ** 2 / 2 + (3 * R ** 2) / 32,
        R ** 2 / 4,
      ];
    }
    fig = i;
  };

  sketch.DibujarFigura = function (i) {
    //sketch.rotateY(sketch.PI/2);
    sketch.rotateZ(phi);
    sketch.rotateY(-theta);
    sketch.rotateZ(psi - n * sketch.PI);
    sketch.scale(sketch.a, sketch.b, sketch.c);
    if (i == "Elipsoide") {
      sketch.sphere(R);
    }
    if (i == "Cilindro") {
      sketch.cylinder(R, R);
    }
    if (i == "Cono") {
      sketch.translate(0, R / 4, 0);
      sketch.cone(R, R);
    }
    if (i == "Bloque") {
      sketch.box(R, R, R);
    }
    if (i == "Dona") {
      sketch.torus(R, R / 2);
    }
  };

  sketch.AngulosIniciales = function (i) {
    if (Omega1[i] == 0 && Omega2[i] == 0) {
      //Este caso se trata aparte para evitar situaciones de 0/0. Además tiene GimbalLock
      theta0 = sketch.acos(1);

      if (Omega3[i] == 0) {
        //Objeto quieto
        psi0 = sketch.atan(I[0] / I[1]);
      } else {
        psi0 = sketch.atan(I[0] / I[1]);
      }
    } else {
      theta0 = sketch.acos((I[2] * Omega3[i]) / M);
      psi0 = sketch.atan((I[0] * Omega1[i]) / (I[1] * Omega2[i]));
    }
    theta = theta0;
    psi = psi0;
  };

  //Ecuaciones de Euler
  sketch.d_Omega1 = function (f_omega1, f_omega2, f_omega3) {
    return (-(I[2] - I[1]) / I[0]) * f_omega3 * f_omega2;
  };
  sketch.d_Omega2 = function (f_omega1, f_omega2, f_omega3) {
    return (-(I[0] - I[2]) / I[1]) * f_omega1 * f_omega3;
  };
  sketch.d_Omega3 = function (f_omega1, f_omega2, f_omega3) {
    return (-(I[1] - I[0]) / I[2]) * f_omega2 * f_omega1;
  };

  sketch.d_Phi = function (f_omega1, f_omega2, f_omega3) {
    return (
      ((I[0] * f_omega1 ** 2 + I[1] * f_omega2 ** 2) * M) /
      ((I[0] * f_omega1) ** 2 + (I[1] * f_omega2) ** 2)
    );
  };

  sketch.Calcular = function (i) {
    //Calcula el valor de las futuras velocidades

    //Este caso se trata aparte para evitar divisiones de 0/0. Además causa Gimbal Lock, por suerte, una vez se tiene GimbalLock solo hay que rotar en los movimientos que se permiten.
    if (Omega1[i] == 0 && Omega2[i] == 0) {
      d_phi = 0;
      d_psi = 0;
      d_theta = 0;

      Omega1[i + 1] = Omega1[i];
      Omega2[i + 1] = Omega2[i];
      Omega3[i + 1] = Omega3[i];

      if (Omega3[i] == 0) {
        //Objeto quieto
      } else {
        d_phi = 0;
        d_theta = 0;
        d_psi = Omega3[0]; //En este caso la derivada es solo una constante, por lo que dará lo mismo con Euler que con RK4
      }
      phi += d_phi * dt;
      theta += d_theta * dt;
      psi += d_psi * dt;
    } else {
      // Solución general por RK4
      let k1_1 = sketch.d_Omega1(Omega1[i], Omega2[i], Omega3[i]);
      let k1_2 = sketch.d_Omega2(Omega1[i], Omega2[i], Omega3[i]);
      let k1_3 = sketch.d_Omega3(Omega1[i], Omega2[i], Omega3[i]);

      let k2_1 = sketch.d_Omega1(
        Omega1[i] + 0.5 * dt * k1_1,
        Omega2[i] + 0.5 * dt * k1_2,
        Omega3[i] + 0.5 * dt * k1_3
      );
      let k2_2 = sketch.d_Omega2(
        Omega1[i] + 0.5 * dt * k1_1,
        Omega2[i] + 0.5 * dt * k1_2,
        Omega3[i] + 0.5 * dt * k1_3
      );
      let k2_3 = sketch.d_Omega3(
        Omega1[i] + 0.5 * dt * k1_1,
        Omega2[i] + 0.5 * dt * k1_2,
        Omega3[i] + 0.5 * dt * k1_3
      );

      let k3_1 = sketch.d_Omega1(
        Omega1[i] + 0.5 * dt * k2_1,
        Omega2[i] + 0.5 * dt * k2_2,
        Omega3[i] + 0.5 * dt * k2_3
      );
      let k3_2 = sketch.d_Omega2(
        Omega1[i] + 0.5 * dt * k2_1,
        Omega2[i] + 0.5 * dt * k2_2,
        Omega3[i] + 0.5 * dt * k2_3
      );
      let k3_3 = sketch.d_Omega3(
        Omega1[i] + 0.5 * dt * k2_1,
        Omega2[i] + 0.5 * dt * k2_2,
        Omega3[i] + 0.5 * dt * k2_3
      );

      let k4_1 = sketch.d_Omega1(
        Omega1[i] + dt * k3_1,
        Omega2[i] + dt * k3_2,
        Omega3[i] + dt * k3_3
      );
      let k4_2 = sketch.d_Omega2(
        Omega1[i] + dt * k3_1,
        Omega2[i] + dt * k3_2,
        Omega3[i] + dt * k3_3
      );
      let k4_3 = sketch.d_Omega3(
        Omega1[i] + dt * k3_1,
        Omega2[i] + dt * k3_2,
        Omega3[i] + dt * k3_3
      );

      let k1 = sketch.d_Phi(Omega1[i], Omega2[i], Omega3[i]);
      let k2 = sketch.d_Phi(
        Omega1[i] + 0.5 * dt * k1_1,
        Omega2[i] + 0.5 * dt * k1_2,
        Omega3[i] + 0.5 * dt * k1_3
      );
      let k3 = sketch.d_Phi(
        Omega1[i] + 0.5 * dt * k1_1,
        Omega2[i] + 0.5 * dt * k1_2,
        Omega3[i] + 0.5 * dt * k2_3
      );
      let k4 = sketch.d_Phi(
        Omega1[i] + dt * k3_1,
        Omega2[i] + dt * k3_2,
        Omega3[i] + dt * k3_3
      );

      Omega1[i + 1] =
        Omega1[i] + ((dt * 1) / 6) * (k1_1 + 2 * k2_1 + 2 * k3_1 + k4_1);
      Omega2[i + 1] =
        Omega2[i] + ((dt * 1) / 6) * (k1_2 + 2 * k2_2 + 2 * k3_2 + k4_2);
      Omega3[i + 1] =
        Omega3[i] + ((dt * 1) / 6) * (k1_3 + 2 * k2_3 + 2 * k3_3 + k4_3);
      phi += ((dt * 1) / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      theta = sketch.acos((I[2] * Omega3[i]) / M);
      psi = sketch.atan((I[0] * Omega1[i]) / (I[1] * Omega2[i]));
    }
    tiempo[i + 1] = tiempo[i] + dt;

    Alpha1[i] = sketch.d_Omega1(Omega1[i], Omega2[i], Omega3[i]);
    Alpha2[i] = sketch.d_Omega2(Omega1[i], Omega2[i], Omega3[i]);
    Alpha3[i] = sketch.d_Omega3(Omega1[i], Omega2[i], Omega3[i]);

    // Esta parte es para tener en cuenta las discontinuidades de las funciones trigonométricas
    if (i > 0) {
      if (Omega2[i - 1] < 0 && Omega2[i] > 0) {
        n -= 1;
      }
      if (Omega2[i - 1] > 0 && Omega2[i] < 0) {
        n += 1;
      }
    }
  };
};

// Sección de visualización de datos
var s3 = function (sketch) {
  sketch.setup = function () {
    let canvas1 = sketch.createCanvas(w, h / 2);

    canvas1.position(0, h / 2);
    sketch.background(255);

    //Botón para finalizar la simulación
    boton5 = sketch.createButton("Reiniciar");
    boton5.position(w / 20, (h * 23) / 60);
    boton5.size(w / 10, (h * 1) / 16);
    boton5.mousePressed(sketch.Reset);
    boton5.hide();
  };
  sketch.draw = function () {
    if (iniciar == 1) {
      if (contador < numPts) {
        newOmega = [[Omega1[contador], Omega2[contador], Omega3[contador]]];
        newAlpha = [
          [Alpha1[contador - 1], Alpha2[contador - 1], Alpha3[contador - 1]],
        ];

        for (let i = 0; i < newOmega.length; i++) {
          for (let j = 0; j < newOmega[i].length; j++) {
            dataOmega[j].push(
              sketch.createVector(tiempo[contador], newOmega[i][j])
            );
            dataAlpha[j].push(
              sketch.createVector(tiempo[contador], newAlpha[i][j])
            );
          }
        }

        chart1 = new sketch.LineChart(
          dataOmega,
          colors,
          lineLabels1,
          (2.5 * w) / 5,
          h / 2 - 10,
          5,
          5,
          [0, numPts / fr],
          [-1.5, 1.5],
          "Tiempo (s)",
          "Velocidad angular (1/s)"
        );
        chart2 = new sketch.LineChart(
          dataAlpha,
          colors,
          lineLabels2,
          (2.5 * w) / 5 - 10,
          h / 2 - 10,
          w / 2 + 5,
          5,
          [0, numPts / fr],
          [-1.5, 1.5],
          "Tiempo (s)",
          "Aceleración angular (1/s²)"
        );
        chart1.show();
        chart2.show();
      }
    }
  };

  sketch.Reset = function () {
    iniciar = 3;
    sketch.background(255);
  };

  // Función para graficar
  // No es posible usarlo como librería debido a que la página consta de 3 secciones con distintos canvas
  sketch.LineChart = function (
    data,
    colors,
    lineLabels,
    w,
    h,
    x,
    y,
    xRange,
    yRange,
    xlabel,
    ylabel
  ) {
    this.paddingx = 60;
    this.paddingy = 60;
    this.data = data; // [[]]
    this.colors = colors;
    this.lineLabels = lineLabels;
    this.w = w;
    this.h = h;
    this.chartW = w - this.paddingx;
    this.chartH = h - this.paddingy;
    this.x = x;
    this.y = y;
    this.chartX = this.paddingx;
    this.chartY = this.paddingy;
    this.xRange = xRange; // [min, max]
    this.yRange = yRange; // [min, max]
    this.hAxisLabelCount = 6;
    this.vAxisLabelCount = 5;
    this.xLine = sketch.map(
      yRange[0],
      yRange[0],
      yRange[1],
      this.chartH,
      this.chartY
    );
    this.yLine = sketch.map(
      xRange[0],
      xRange[0],
      xRange[1],
      this.chartX,
      this.chartW
    );
    this.labelx = xlabel;
    this.labely = ylabel;

    this.show = () => {
      sketch.rectMode(sketch.CORNER);
      sketch.fill(255);
      sketch.push();
      sketch.translate(x, y);
      sketch.rect(0, 0, w, h);

      sketch.fill(0);
      sketch.stroke(0);
      sketch.strokeWeight(2);
      sketch.line(this.chartX, this.xLine, this.chartW, this.xLine);
      sketch.line(this.yLine, this.chartY, this.yLine, this.chartH);

      for (let i = 0; i < data.length; i++) {
        let prev = null;
        for (let j = 0; j < data[i].length; j++) {
          let x = sketch.map(
            data[i][j].x,
            this.xRange[0],
            this.xRange[1],
            this.chartX,
            this.chartX + this.chartW - this.paddingx
          );
          let y =
            this.chartY +
            this.chartH -
            sketch.map(
              data[i][j].y,
              this.yRange[0],
              this.yRange[1],
              this.chartY,
              this.chartY + this.chartH - this.paddingy
            );

          if (prev == null) {
            prev = sketch.createVector(x, y);
          } else {
            sketch.stroke(this.colors[i]);
            sketch.line(prev.x, prev.y, x, y);
            sketch.fill(0);
            sketch.stroke(0);
            prev = sketch.createVector(x, y);
          }

          sketch.fill(0);
          sketch.stroke(0);
        }
      }

      // Draw the x axis labels
      sketch.push();
      sketch.textSize(12);
      sketch.strokeWeight(0);
      sketch.translate(this.chartW / 2, this.chartH + (this.chartY * 2) / 3);
      sketch.text(this.labelx, 0, 0);
      sketch.pop();
      for (let i = 0; i < this.hAxisLabelCount; i++) {
        let label = sketch.map(
          i,
          0,
          this.hAxisLabelCount - 1,
          this.xRange[0],
          this.xRange[1]
        );
        sketch.strokeWeight(0);
        sketch.textAlign(sketch.CENTER);
        sketch.textSize(10);
        sketch.fill(0);
        let x = sketch.map(
          label,
          this.xRange[0],
          this.xRange[1],
          this.chartX,
          this.chartX + this.chartW - this.paddingx
        );
        sketch.text(
          sketch.round(label) + "",
          x,
          this.xLine + this.paddingy * 0.3
        );
        sketch.strokeWeight(2);
        sketch.line(x, this.xLine + 3, x, this.xLine - 3);
      }

      // Draw the y axis labels
      sketch.push();
      sketch.textSize(12);
      sketch.strokeWeight(0);
      sketch.translate(this.chartX / 3, (this.chartH + this.chartY) / 2);
      sketch.rotate(-sketch.PI / 2);
      sketch.text(this.labely, 0, 0);
      sketch.pop();

      for (let i = 0; i < this.vAxisLabelCount; i++) {
        let label = sketch.map(
          i,
          0,
          this.vAxisLabelCount - 1,
          this.yRange[0],
          this.yRange[1]
        );
        sketch.strokeWeight(0);
        sketch.textAlign(sketch.RIGHT, sketch.CENTER);
        sketch.textSize(10);
        sketch.fill(0);
        let y =
          this.chartY +
          this.chartH -
          sketch.map(
            label,
            this.yRange[0],
            this.yRange[1],
            this.chartY,
            this.chartY + this.chartH - this.paddingy
          );
        sketch.text(
          sketch.round(label, 1) + "",
          this.yLine - this.paddingy * 0.25,
          y
        );
        sketch.strokeWeight(2);
        sketch.line(this.yLine + 3, y, this.yLine - 3, y);
      }

      sketch.strokeWeight(0);
      sketch.textAlign(sketch.LEFT, sketch.BOTTOM);
      sketch.textSize(12);

      let totalWidth = 0;

      let textPadding = 10;

      for (let i = 0; i < this.lineLabels.length; i++) {
        totalWidth += sketch.textWidth(this.lineLabels[i]) + textPadding;

        if (i + 1 == this.lineLabels.length) {
          totalWidth -= textPadding;
        }
      }

      let startX = this.chartX + (this.chartW - this.paddingx - totalWidth) / 2;

      let startTracker = 0;

      // Draw the line labels
      for (let i = 0; i < this.lineLabels.length; i++) {
        sketch.fill(this.colors[i]);
        sketch.text(
          this.lineLabels[i],
          startX * 1.5 + startTracker,
          this.chartY - 3
        );
        startTracker += sketch.textWidth(this.lineLabels[i]) + textPadding;
      }
      sketch.pop();
    };
  };
};

new p5(s1);
new p5(s2);
new p5(s3);
