/* ***********************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 *****************
 * ***********************************************************
 * * Autor: Juan Sebastian Sanchez Guarnizo                  *
 * * Co-Autores: Daniel Valle Jaramillo                      *
 * *             Jamir Moreno Salazar                        *
 * * Institucion: Universidad de Antioquia                   *
 * * Curso: Laboratorio avanzado 3                           *
 * ***********************************************************/

let particle;
let velocity;
//let B = 0.5; // Campo magnético en la dirección Z
//let q = -1; // Carga de la partícula (valor arbitrario)
//let m = 1; // Masa de la partícula (valor arbitrario)
//let v0= -20
let dt = 0.05; // Paso de tiempo para mayor precisión
//let trail = []; // Almacena la trayectoria de la partícula
//let E0 = 100; // Amplitud del campo eléctrico en la región de aceleración
let B, q, m, v0, E0;
let omega; // Frecuencia del ciclotrón
let R_cyclotron; // Radio del ciclotrón inicial
let R_c4 = 0,
  R_c6 = 0; // Radios en el 4to y 6to cruce
let accelerationRegion = { y1: 0, y2: 0 }; // Región de aceleración en Y
let lastSign = 1; // Control de fase del campo eléctrico
//let crossings = 0; // Contador de cruces por la región de aceleración
let maxCrossings = 6; // Número de cruces antes de apagar el campo magnético
let velocity_temp, particle_temp; // Copias para la simulación inicial

// Sliders
let B_slider, E0_slider, q_slider, m_slider, v0_slider;

function setup() {
  createCanvas(870, 600);
  background(0);
  //particle = createVector(width / 2, height / 2);
  //velocity = createVector(0, v0); // Velocidad inicial solo en Y por defecto con (0,-20)

  //// Frecuencia del ciclotrón: ω = |q|B/m
  //omega = abs(q * B) / m;

  //// Calcular el radio del ciclotrón inicial: R = v / ω
  //R_cyclotron = velocity.mag() / omega;

  //// Definir la región de aceleración como 1/4 del radio inicial del ciclotrón
  //accelerationRegion.y1 = height / 2 - R_cyclotron / 4;
  //accelerationRegion.y2 = height / 2 + R_cyclotron / 4;

  //// Crear copias para la simulación inicial
  //velocity_temp = velocity.copy();
  //particle_temp = particle.copy();

  // Crear sliders con eventos que solo reinician cuando el usuario suelta el mouse
  // 🔹 Definir la posición de los sliders en la esquina inferior izquierda
  // 🔹 Ajuste de posición para que todos los sliders sean visibles
  // 🔹 Ajuste de posición más alto para que todos los sliders sean visibles
  let sliderX = 10; // Margen desde la izquierda
  let sliderY = height - 220; // 🔥 Subimos otros 40 píxeles

  let spacing = 25; // Espaciado uniforme entre sliders

  B_slider = createSlider(0.2, 0.7, 0.5, 0.01);
  B_slider.position(sliderX, sliderY);
  B_slider.changed(resetSimulation);

  E0_slider = createSlider(0, 240, 100, 1); //createSlider(50, 240, 100, 1);
  E0_slider.position(sliderX, sliderY + spacing);
  E0_slider.changed(resetSimulation);

  q_slider = createSlider(-1.35, -0.5, -1, 0.01);
  q_slider.position(sliderX, sliderY + 2 * spacing);
  q_slider.changed(resetSimulation);

  m_slider = createSlider(0.74, 2, 1, 0.01);
  m_slider.position(sliderX, sliderY + 3 * spacing);
  m_slider.changed(resetSimulation);

  v0_slider = createSlider(-40, -9, -20, 1);
  v0_slider.position(sliderX, sliderY + 4 * spacing);
  v0_slider.changed(resetSimulation);

  resetSimulation(); // ✅ Se llama al inicio para configurar la simulación
}

function resetSimulation() {
  // Obtener valores de sliders
  B = B_slider.value();
  E0 = E0_slider.value();
  q = q_slider.value();
  m = m_slider.value();
  v0 = v0_slider.value();

  // Inicializar partícula
  particle = createVector(width / 2, height / 2);
  velocity = createVector(0, v0);

  // Cálculo de frecuencia del ciclotrón y radio
  omega = abs(q * B) / m;
  R_cyclotron = velocity.mag() / omega;

  // Definir región de aceleración
  accelerationRegion.y1 = height / 2 - R_cyclotron / 4;
  accelerationRegion.y2 = height / 2 + R_cyclotron / 4;

  // Reiniciar trayectoria y cruces
  trail = [];
  crossings = 0;

  // 🔹 REINICIAR radios del 4to y 6to cruce
  R_c4 = 0;
  R_c6 = 0;

  // 🔹 REINICIAR copias para la simulación inicial
  velocity_temp = velocity.copy();
  particle_temp = particle.copy();

  frameCount = 0; // 🔹 Reiniciar el tiempo de simulación
}

function draw() {
  background(0);

  // Posición base para los nombres de los sliders
  let labelX = 10; // Margen desde la izquierda
  let valueX = 150; // Posición del valor a la derecha
  let labelY = height - 210; // Ajustar altura
  let spacing = 25; // Espaciado uniforme

  fill(255);
  textSize(14);
  text(`B = -${B_slider.value().toFixed(2)}`, valueX, labelY); //toca poner un menos, porque recuerde que aca todo esta invertido y por eso se usa un campo positivo, pues aca -x equivale a +x pero usualmente se usariauno negativo.

  text(`E0 = ${E0_slider.value().toFixed(0)}`, valueX, labelY + spacing);

  text(`q = ${q_slider.value().toFixed(2)}`, valueX, labelY + 2 * spacing);

  text(`m = ${m_slider.value().toFixed(2)}`, valueX, labelY + 3 * spacing);

  text(`v0 = ${-v0_slider.value().toFixed(0)}`, valueX, labelY + 4 * spacing); //el menos que se pone aca es por el mismo motivoque se puso en B, una velocidad en -y en la simulacion equivalea ir pa arriba, pero en la vida real no xD

  let simTime = frameCount * dt; // ✅ Se cambió "time" a "simTime"

  // 🟡 Fase 1: Estimar R_c4 y R_c6 sin graficar nada
  if (R_c4 === 0 || R_c6 === 0) {
    let temp_crossings = 0;
    let temp_particle = particle_temp.copy();
    let temp_velocity = velocity_temp.copy();

    while (temp_crossings < maxCrossings) {
      let E = createVector(0, 0);
      if (
        temp_particle.y > accelerationRegion.y1 &&
        temp_particle.y < accelerationRegion.y2
      ) {
        let currentSign = sin(omega * simTime + PI / 2) > 0 ? 1 : -1;
        E = createVector(0, currentSign * E0);
        temp_crossings++;

        // Calcular radios usando R = v / omega
        if (temp_crossings === 4)
          R_c4 = (temp_velocity.mag() / omega) * (1 + 0.25);
        if (temp_crossings === 6)
          R_c6 = (temp_velocity.mag() / omega) * (1 + 0.1);
      }

      let v_minus = temp_velocity
        .copy()
        .add(p5.Vector.mult(E, (q * dt) / (2 * m)));
      let t = p5.Vector.mult(createVector(0, 0, B), (q * dt) / (2 * m));
      let v_prime = v_minus.copy().add(p5.Vector.cross(v_minus, t));
      let s = p5.Vector.mult(t, 2 / (1 + t.magSq()));
      let v_plus = v_minus.copy().add(p5.Vector.cross(v_prime, s));
      temp_velocity = v_plus.copy().add(p5.Vector.mult(E, (q * dt) / (2 * m)));

      temp_particle.add(p5.Vector.mult(temp_velocity, dt));
    }
  }
  // 🟢 Fase 2: Simulación normal con dibujo
  else {
    let E = createVector(0, 0);
    let Bvec = createVector(0, 0, B);

    if (
      particle.y > accelerationRegion.y1 &&
      particle.y < accelerationRegion.y2
    ) {
      let currentSign = sin(omega * simTime + PI / 2) > 0 ? 1 : -1;
      if (currentSign !== lastSign) {
        E = createVector(0, currentSign * E0);
        lastSign = currentSign;
        crossings++;
      }
    }

    if (crossings >= maxCrossings) {
      Bvec = createVector(0, 0, 0);
    }

    let v_minus = velocity.copy().add(p5.Vector.mult(E, (q * dt) / (2 * m)));
    let t = p5.Vector.mult(Bvec, (q * dt) / (2 * m));
    let v_prime = v_minus.copy().add(p5.Vector.cross(v_minus, t));
    let s = p5.Vector.mult(t, 2 / (1 + t.magSq()));
    let v_plus = v_minus.copy().add(p5.Vector.cross(v_prime, s));
    velocity = v_plus.copy().add(p5.Vector.mult(E, (q * dt) / (2 * m)));

    particle.add(p5.Vector.mult(velocity, dt));

    trail.push(particle.copy());

    // 🔹 Dibujar la trayectoria
    stroke(255, 100);
    noFill();
    beginShape();
    for (let p of trail) {
      vertex(p.x, p.y);
    }
    endShape();

    // 🔹 Dibujar la partícula
    fill(255);
    noStroke();
    ellipse(particle.x, particle.y, 5, 5);

    //// 🔹 Dibujar la región de aceleración (horizontal)
    //stroke(255, 0, 0);
    //line(0, accelerationRegion.y1, width, accelerationRegion.y1);
    //line(0, accelerationRegion.y2, width, accelerationRegion.y2);

    // 🔵 Dibujar las D's (como semicírculos corregidos y sin "paticas")
    stroke(0, 255, 0);
    noFill();

    // 📌 Cálculo de ángulos corregidos
    let angulo_arriba = asin(R_cyclotron / (4 * R_c4));
    let angulo_abajo = asin(R_cyclotron / (4 * R_c6));

    // 📌 Control de posición en X
    let xD_arriba = width / 2 + R_cyclotron; // D superior (movida a la derecha)
    let xD_abajo = width / 2 + R_cyclotron - (R_c6 - R_c4); // D inferior (ajustada)

    // D pequeña (arriba) - Semicírculo superior (movido y ajustado)
    arc(xD_arriba, height / 2, 2 * R_c4, 2 * R_c4, PI + angulo_arriba, 0);

    // D grande (abajo) - Semicírculo inferior (movido y ajustado)
    arc(xD_abajo, height / 2, 2 * R_c6, 2 * R_c6, 0, PI + angulo_abajo);

    // 🔵 Dibujar los "palitos" en los bordes de las D’s
    //stroke(255, 165, 0); // Color naranja (o elige el que prefieras)
    stroke(0, 255, 0);
    strokeWeight(2); // Grosor de la línea

    // 📌 Coordenadas de los extremos izquierdos de cada D
    let xPalitoArriba = xD_arriba - R_c4;
    let xPalitoAbajo = xD_abajo - R_c6;

    // 📌 Dibujar los palitos
    line(
      xPalitoArriba,
      height / 2 - R_cyclotron / 4,
      0.98 * xPalitoArriba,
      height / 2 - R_c4 * 0.77
    ); // Palito arriba
    line(
      xPalitoAbajo,
      height / 2 - R_cyclotron / 4,
      0.98 * xPalitoAbajo,
      height / 2 - R_c4 * 0.77
    ); // Palito abajo

    // 🔹 Dibujar la región de aceleración (acotada al ciclotrón)
    stroke(255, 0, 0);
    strokeWeight(2); // Ajuste para que se vean bien

    // 📌 Límites de las líneas rojas (máximo en X: -R_c4 a +R_c4)
    let xLineaIzquierda = xD_arriba - R_c4;
    let xLineaDerecha = xD_arriba + R_c4;

    // 📌 Dibujar las líneas dentro del ciclotrón (modificado)
    line(
      xLineaIzquierda,
      accelerationRegion.y1,
      xLineaDerecha,
      accelerationRegion.y1
    );
    line(
      xLineaIzquierda,
      accelerationRegion.y2,
      xLineaDerecha,
      accelerationRegion.y2
    );

    // 🔹 Dibujar la línea punteada en la parte inferior (cubriendo todo de -R_c6 a +R_c6)
    //stroke(255, 0, 0); // Color rojo
    stroke(255, 0, 0, 100); // 🔥 Último valor (100) controla la transparencia
    strokeWeight(2);
    let dashLength = 3; // Longitud de cada segmento de la línea punteada
    let gapLength = 5; // Espacio entre segmentos

    // 📌 Dibujar segmentos en toda la base
    let x = xD_abajo - R_c6 * 0.95; // Inicia en -R_c6
    while (x <= xD_abajo + R_c6) {
      // 🔥 Se extiende hasta +R_c6
      line(
        x,
        accelerationRegion.y2,
        min(x + dashLength, xD_abajo + R_c6),
        accelerationRegion.y2
      );
      x += dashLength + gapLength; // Avanza con el patrón punteado
    }

    // 🔵 Dibujar flechas oscilantes del campo eléctrico
    stroke(255);
    strokeWeight(2);
    let E_direction = sin(omega * simTime + PI / 2) > 0 ? 1 : -1;
    let E_magnitude = abs(sin(omega * simTime + PI / 2));

    for (let x = xLineaIzquierda * 1.05; x <= xLineaDerecha; x += 20) {
      let arrowY1 = accelerationRegion.y2 + 2 * E_magnitude;
      let arrowY2 = accelerationRegion.y1 - 2 * E_magnitude;

      // 🔥 Si el campo es negativo, invertir la dirección de la flecha
      if (E_direction < 0) {
        [arrowY1, arrowY2] = [arrowY2, arrowY1];
      }

      // Dibujar la línea principal de la flecha
      line(x, arrowY1, x, arrowY2);

      // Dibujar las puntas de la flecha
      let arrowSize = 3;
      line(x - arrowSize, arrowY1 - E_direction * arrowSize, x, arrowY1);
      line(x + arrowSize, arrowY1 - E_direction * arrowSize, x, arrowY1);

      //// Dibujar los signos "-" y "+"
      //textSize(16);
      //textAlign(CENTER, CENTER);
      //fill(255, 255, 0);
      //text("+", x, arrowY1 - 10); // 🔥 "+" en la punta de la flecha
      //fill(0, 0, 255);
      //text("-", x, arrowY2 + 10); // 🔥 "-" en la base de la flecha

      // Dibujar los signos "+" y "-" con ajuste de dirección
      textSize(16);
      textAlign(CENTER, CENTER);

      if (E_direction > 0) {
        // Campo apuntando hacia arriba: "-" en la punta, "+" en la base
        fill(255, 255, 0);
        text("+", x, arrowY2 - 10);
        fill(0, 0, 255);
        text("-", x, arrowY1 + 10);
        //fill(255, 255, 0);
        //text("+", x, arrowY1 - 10);
        //fill(0, 0, 255);
        //text("-", x, arrowY2 + 10);
      } else {
        // Campo apuntando hacia abajo: "-" en la punta, "+" en la base
        fill(0, 0, 255);
        text("-", x, arrowY1 - 10);
        fill(255, 255, 0);
        text("+", x, arrowY2 + 10);
        //fill(0, 0, 255);
        //text("-", x, arrowY2 - 10);
        //fill(255, 255, 0);
        //text("+", x, arrowY1 + 10);
      }
    }

    // Etiquetas
    fill(255);
    stroke(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Simulación del Ciclotrón", width / 2, 30);

    fill(220); // Un blanco menos brillante
    stroke(0);
    textSize(18);
    textAlign(LEFT, CENTER);
    // Campo eléctrico
    text(
      `E = -E₀ sin(ωc t + π/2) = ${(
        -E0 * sin(omega * simTime + PI / 2)
      ).toFixed(2)} V/m`,
      20,
      80
    );
    // Velocidad particula
    text(
      `Velc partc, v(${simTime.toFixed(1)} s) = ${velocity
        .mag()
        .toFixed(2)} m/s`,
      20,
      110
    );
    // Frecuencia ciclotrón
    text(`ωc = |q|B / m = ${omega.toFixed(2)} rad/s`, 20, 140);
    // Radio ciclotrón
    text(`Rc = v / ωc = ${(velocity.mag() / omega).toFixed(2)} m`, 20, 170);
    // Número de cruces en la región de aceleración
    text(`Número de cruces: ${crossings}`, 20, 200);
  }
}
