/*************************************************************
 ******** ONDAS Y TIMBRES MUSICALES **************************
 *************************************************************
 ** Autor: Emmanuel Botero Osorio                           **
 **        Camilo Londoño Vera                              **
 ** Institución: Universidad de Antioquia                   **
 ** Curso: Laboratorio avanzado 3  2025-1                   **
 *************************************************************/

let sliders = [],
  presets,
  playing = false,
  button,
  oscs = [],
  logo,
  calamardo = "🪈 Clarinete",
  fondo;
let imagenesInstrumentos = {};
let ultimaForma = Array(8).fill(0); // armónicos del último preset
let fundamental = 220;
let fft;
let modoDidactico;

function preload() {
  // logo = loadImage("img/https://upload.wikimedia.org/wikipedia/commons/f/fb/Escudo-UdeA.svg");
  imagenesInstrumentos["🎺 Trompeta"] = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/SoundFourier/assets/Trompeta.png"
  );
  imagenesInstrumentos["🪈 Clarinete"] = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/SoundFourier/assets/Clarinete.png"
  );
  imagenesInstrumentos["🎹 Piano"] = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/SoundFourier/assets/Piano.png"
  );
  imagenesInstrumentos["🎻 Violín"] = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/SoundFourier/assets/Violin.png"
  );
  imagenesInstrumentos["Puro"] = loadImage(
    "https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2025_1/SoundFourier/assets/Mayonesa.png"
  );
}

function setup() {
  createCanvas(800, 450);
  colorMode(HSB);
  textSize(16);
  for (let i = 0; i < 8; i++) {
    let s = createSlider(0, 1, i === 0 ? 1 : 0, 0.01);
    s.position(10, 50 + i * 40);

    // Add input event listener for real-time audio feedback
    s.input(() => {
      if (playing) {
        oscs[i].gain.amp(s.value() * 0.3, 0.05);
      }
    });

    sliders.push(s);

    let osc = new p5.Oscillator("sine");
    let gain = new p5.Gain();
    osc.disconnect();
    osc.connect(gain);
    gain.connect();
    gain.amp(0);
    osc.start();
    oscs.push({ osc: osc, gain: gain });
  }

  presets = {
    Puro: [1, 0, 0, 0, 0, 0, 0, 0],
    "🎹 Piano": [1, 0.6, 0.3, 0.2, 0.1, 0.05, 0.03, 0.01],
    "🎻 Violín": [1, 0.7, 0.5, 0.3, 0.2, 0.15, 0.1, 0.05],
    "🎺 Trompeta": [1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.05, 0.02],
    "🪈 Clarinete": [0.9, 0, 0.6, 0, 0.3, 0, 0.1, 0],
  };

  let x = 150;
  for (let name in presets) {
    let btn = createButton(name);
    btn.position(x, 405);
    btn.mousePressed(() => applyPreset(name));
    btn.style(
      "background",
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    );
    btn.style("color", "white");
    btn.style("border", "none");
    btn.style("border-radius", "15px");
    btn.style("padding", "5px 8px");
    btn.style("font-size", "11px");
    btn.style("font-weight", "bold");
    btn.style("cursor", "pointer");
    btn.style("box-shadow", "0 4px 8px rgba(0,0,0,0.2)");
    btn.style("transition", "all 0.3s ease");
    btn.style("margin-right", "5px");
    btn.mouseOver(() => {
      btn.style("transform", "translateY(-2px)");
      btn.style("box-shadow", "0 6px 12px rgba(0,0,0,0.3)");
    });
    btn.mouseOut(() => {
      btn.style("transform", "translateY(0px)");
      btn.style("box-shadow", "0 4px 8px rgba(0,0,0,0.2)");
    });

    // Dynamic spacing based on button text length
    if (name == "Puro") {
      x += 65;
    } else if (name == "🎹 Piano") {
      x += 80;
    } else if (name == "🎻 Violín") {
      x += 75;
    } else if (name == "🎺 Trompeta") {
      x += 95;
    } else if (name == "🪈 Clarinete") {
      x += 85;
    }
  }

  play = createButton("⏯ Play /   Stop");
  play.position(520, 40);
  play.size(80, 50);
  play.mousePressed(toggleSound);
  play.style("background", "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)");
  play.style("color", "white");
  play.style("border", "none");
  play.style("border-radius", "20px");
  play.style("font-size", "12px");
  play.style("font-weight", "bold");
  play.style("cursor", "pointer");
  play.style("box-shadow", "0 4px 8px rgba(0,0,0,0.2)");
  play.style("transition", "all 0.3s ease");
  play.mouseOver(() => {
    play.style("transform", "translateY(-2px)");
    play.style("box-shadow", "0 6px 12px rgba(0,0,0,0.3)");
  });
  play.mouseOut(() => {
    play.style("transform", "translateY(0px)");
    play.style("box-shadow", "0 4px 8px rgba(0,0,0,0.2)");
  });

  fft = new p5.FFT(0.8, 2 ** 10); // Crear objeto FFT
  fondo = loadImage("img/fondo.jpg");

  let notaSelector;
  let notas = {
    "La3 (220 Hz)": 220,
    "Do4 (261.63 Hz)": 261.63,
    "Mi4 (329.63 Hz)": 329.63,
    "Sol4 (392 Hz)": 392,
    "La4 (440 Hz)": 440,
  };

  notaSelector = createSelect();
  notaSelector.position(520, 130);
  notaSelector.style(
    "background",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  );
  notaSelector.style("color", "#333");
  notaSelector.style("border", "none");
  notaSelector.style("border-radius", "10px");
  notaSelector.style("padding", "5px 10px");
  notaSelector.style("font-size", "14px");
  notaSelector.style("cursor", "pointer");
  notaSelector.style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)");
  for (let nota in notas) {
    notaSelector.option(nota);
  }
  notaSelector.changed(() => {
    fundamental = notas[notaSelector.value()];
    updateFrequencies();
  });
  modoDidactico = createCheckbox("Modo didáctico", false);
  modoDidactico.position(520, 200);
  modoDidactico.style("color", "white");
  modoDidactico.style("font-size", "16px");
  modoDidactico.style("font-weight", "bold");

  // Botón para descargar CSV
  let downloadBtn = createButton("💾 Descargar espectro");
  downloadBtn.position(680, 40);
  downloadBtn.style(
    "background",
    "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)"
  );
  downloadBtn.style("color", "white");
  downloadBtn.style("border", "none");
  downloadBtn.style("border-radius", "10px");
  downloadBtn.style("padding", "8px 8px");
  downloadBtn.style("font-size", "13px");
  downloadBtn.style("font-weight", "bold");
  downloadBtn.style("cursor", "pointer");
  downloadBtn.style("box-shadow", "0 2px 6px rgba(0,0,0,0.15)");
  downloadBtn.style("width", "100px");
  downloadBtn.style("height", "50px");
  downloadBtn.mousePressed(descargarCSV);

  // Initialize frequencies
  updateFrequencies();
  // Descarga el espectro actual (sliders) como CSV
  function descargarCSV() {
    let csv = "Armónico,Frecuencia (Hz),Amplitud\n";
    for (let i = 0; i < sliders.length; i++) {
      let freq = fundamental * (i + 1);
      let amp = sliders[i].value();
      csv += `${i + 1},${freq},${amp}\n`;
    }
    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = createA(url, "espectro.csv");
    a.attribute("download", "espectro.csv");
    a.hide();
    a.elt.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 100);
  }
}

function updateFrequencies() {
  for (let i = 0; i < 8; i++) {
    oscs[i].osc.freq(fundamental * (i + 1));
  }
}

function draw() {
  background(0);
  background(fondo, 100);
  fill(255);
  textFont("Verdana");
  textSize(20);
  text("Ajuste de armónicos:", 10, 25);
  textSize(16);
  for (let i = 0; i < sliders.length; i++) {
    let v = sliders[i].value();
    fill((i * 50) % 360, 100, 255);
    text(`Armónico ${i + 1}: ${nf(v, 1, 2)}`, 20, 50 + i * 40);
  }
  fill(255);
  text(`🎼 Nota:`, 520, 120);
  push();
  translate(180, (height * 3) / 4);

  // Dibuja la forma de onda guardada en gris
  stroke(50); // gris
  strokeWeight(1);
  noFill();
  beginShape();
  for (let x = 0; x < width / 3 + 33.2; x++) {
    let y = 0;
    for (let i = 0; i < 8; i++) {
      y += ultimaForma[i] * sin((TWO_PI * (i + 1) * x) / 100);
    }
    vertex(x, -y * 20);
  }
  endShape();

  stroke(255);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let x = 0; x < width / 3 + 33.2; x++) {
    let y = 0;
    for (let i = 0; i < 8; i++) {
      y += sliders[i].value() * sin((TWO_PI * (i + 1) * x) / 100);
    }
    vertex(x, -y * 20);
  }
  endShape();

  pop();

  // image(logo, width-120, 5, 120, 160);

  image(imagenesInstrumentos[calamardo], 520, 180, 280, 280);

  // Continuously update harmonics when playing
  if (playing) {
    playHarmonics();
  }

  // Dibujar espectro
  let spectrum = fft.analyze();
  noStroke();
  fill(0, 180, 255);
  let specWidth = 280,
    specHeight = 180;
  push();
  translate(width / 3 - 50, 50);
  // Ejes
  stroke(200);
  strokeWeight(1);
  line(0, 0, 0, specHeight); // Eje Y (amplitud)
  line(0, specHeight, specWidth, specHeight); // Eje X (frecuencia)

  // Etiquetas eje Y (amplitud)
  noStroke();
  fill(255);
  textSize(9);
  textAlign(RIGHT, CENTER);
  for (let i = 0; i <= 4; i++) {
    let y = map(i, 0, 4, specHeight, 0);
    let amp = int(i * 64); // 0, 64, ..., 255
    text(amp, -5, y);
  }

  // Etiqueta general del eje Y
  push();
  translate(-30, specHeight / 2); // posición al lado del eje Y
  rotate(-HALF_PI); // rotar texto verticalmente
  textAlign(CENTER, CENTER);
  text("Amplitud", 0, 0);
  pop();

  // Etiquetas eje X (frecuencia)
  textAlign(CENTER, TOP);
  // text("HZ" , x + 20);
  for (let i = 1; i <= 8; i += 1) {
    let x = (i * specWidth) / 8;
    let freq = int(fundamental * i); // Frecuencias basadas en la nota fundamental
    text(freq, x, specHeight + 4);
  }

  // Etiqueta general del eje X
  textSize(10);
  text("Frecuencia (Hz)", specWidth / 2, specHeight + 20);

  rectMode(CORNER);
  // Mostrar solo los primeros armónicos relevantes
  let maxFreqIndex = min(
    spectrum.length,
    int((fundamental * 8 * spectrum.length) / 22050)
  );
  fill("rgb(0,255,0)");
  for (let i = 0; i < maxFreqIndex; i++) {
    let x = map(i, 0, maxFreqIndex, 0, specWidth);
    let h = map(spectrum[i], 0, 255, specHeight, 0);
    rect(x, h, specWidth / maxFreqIndex, specHeight - h);
  }
  pop();
  // Señal de éxito si la forma coincide suficientemente
  if (modoDidactico.checked() && ultimaForma.some((val) => val > 0.0001)) {
    let err = compararFormas();
    if (abs(err) < 0.08) {
      fill("rgb(0,255,0)");
      textSize(24);
      text("¡Muy bien! Las formas coinciden 🎯", 180, height - 50);
      textSize(16);
    }
  }
}

function applyPreset(name) {
  // Siempre actualiza la forma de onda de referencia (gris)
  ultimaForma = presets[name].slice();
  calamardo = name;
  presets[name].forEach((v, i) => sliders[i].value(0));

  // Si NO estamos en modo didáctico, aplica también a sliders
  if (!modoDidactico.checked()) {
    presets[name].forEach((v, i) => sliders[i].value(v));
  }
}

function toggleSound() {
  playing = !playing;
  if (!playing) {
    oscs.forEach((o) => o.gain.amp(0, 0.2));
  } else {
    fft.setInput(); // analiza todo el audio
  }

  if (playing) {
    play.style(
      "background",
      "linear-gradient(135deg, #10ac84 0%, #06a085 100%)"
    );
  } else {
    play.style(
      "background",
      "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
    );
  }
}

function playHarmonics() {
  oscs.forEach((oscObj, i) => {
    oscObj.osc.freq(fundamental * (i + 1));
    // Better volume control - don't fade out if slider is being actively adjusted
    let targetAmp = playing ? sliders[i].value() * 0.3 : 0;
    oscObj.gain.amp(targetAmp, 0.05);
  });
}

function compararFormas() {
  let error = 0;
  let muestras = 200;

  for (let x = 0; x < muestras; x++) {
    let t = x / 100; // tiempo normalizado
    let yRef = 0;
    let yAct = 0;
    for (let i = 0; i < 8; i++) {
      let armonico = sin(TWO_PI * (i + 1) * t);
      yRef += ultimaForma[i] * armonico;
      yAct += sliders[i].value() * armonico;
    }
    error += sq(yRef - yAct);
  }

  error = sqrt(error / muestras); // RMS
  return error;
}

// ok
