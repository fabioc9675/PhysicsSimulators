/*************************************************************
 ******** SIMULACIÓN DISPERSIÓN DE GASES *********************
 *************************************************************
 ** Autor: Santiago Ruiz Piedrahita                         **
 ** Institución: Universidad de Antioquia                   **
 ** Curso: Laboratorio avanzado 3                           **
 *************************************************************/

// Inicialización de todas las variables de la simulación
let canvas;
let table; // caja donde están las partículas
let table1 ; // caja donde están las particulas 1
let table2 ; // caja donde están las particulas 2
let balls1 = []; // guardar las partículas
let balls2 = []; // guardar las partículas
let mass1 ; // masa de las particulas
let mass2 ; // masa de las particulas
let radio1 ; // radio de las particulas
let radio2 ; // radio de las particulas
let temperature1 ; // temperatura de la caja 1
let temperature2 ; // temperatura de la caja 2
let N1 ; // número particulas caja 1
let N2 ; // número particulas caja 2
let blueCountBox1 = 0; // contador de particulas
let magentaCountBox1 = 0; // contador de particulas
let blueCountBox2 = 0; // contador de particulas
let magentaCountBox2 = 0; // contador de particulas
let numParticlesBox1 = []; // para el gráfico
let numParticlesBox2 = []; // para el gráfico
let TableInfo; // guardado de datos
let maxNumParticles ; // El número máximo de partículas que puedes tener
let totalKineticEnergyBox1 = 0; // energía cinética   
let totalKineticEnergyBox2 = 0; // energía cinética
let Tprom1 ; // label temperatura promedio
let Tprom2 ; // label temperatura promedio
let dt = 1/30; // Tiempo paso de evolución de la simulación
let p = 0; //contador de tiempo
let interval = 60; // Intervalo en frames (60 frames/segundo)
let particlesOnDivisor = []; // particulas atrapadas
let divisor = false; // divisor 
let numDivisor = 0; // parametro para divisor
let run = false; // ¿está o no corriendo el programa?
let Width = window.innerWidth; // dimensión pestaña
let Height = window.innerHeight; // dimensión pestaña

// posicion de las cajas de las particulas
let xtable = 220 ;
let ytable = 120 ;
let wtable = 490 ;
let htable = 420 ;

// linea divisoria
let xline = 220+(490/2);
let y1line = 120;
let y2line = 540;

function setup() {
  canvas = createCanvas(Width,Height);
  
  frameRate(60);
  
  table = new Table(xtable, ytable, wtable, htable); // caja de las particulas
  table1 = new Table(xtable, ytable, wtable/2, htable); // caja de las particulas 1
  table2 = new Table(xline, ytable, wtable/2, htable); // caja de las particulas 2
  
  // botones
  
  button = createButton("Iniciar");
  button.mousePressed(changestate);
  button.position(25, 400);
  button.size(70, 20);

  button2 = createButton("Reiniciar");
  button2.mousePressed(resetSketch);
  button2.position(120,400);
  button2.size(70, 20);
  
  button3 = createButton("Divisor");
  button3.mousePressed(changedivisor);
  button3.position(25,440);
  button3.size(70, 20);
  
  button4 = createButton("Guardar");
  button4.mousePressed(saveData);
  button4.position(120,440);
  button4.size(70, 20);
  
  // columnas de la tabla
  TableInfo = new p5.Table();
  TableInfo.addColumn('Tiempo (s)');
  TableInfo.addColumn('N1');
  TableInfo.addColumn('N2');
  TableInfo.addColumn('T1 (K)');
  TableInfo.addColumn('T2 (K)');
  TableInfo.addColumn('N1Blue');
  TableInfo.addColumn('N1Magenta');
  TableInfo.addColumn('N2Blue');
  TableInfo.addColumn('N2Magenta');
  
  // Crea un gráfico de barras para la caja 1
  let x1 = 760;
  let y1 = 45;
  let w1 = 180;
  let h1 = 200;
  numParticlesBox1 = new BarChart(x1, y1, w1, h1);

  // Crea un gráfico de barras para la caja 2
  let x2 = 760;
  let y2 = 306;
  let w2 = 180;
  let h2 = 200;
  numParticlesBox2 = new BarChart(x2, y2, w2, h2);
    
  // Etiquetas y deslizadores
  
  let label = createP('Número de partículas:');
  label.position(30, 5); // posición de la etiqueta
  
  let label2 = createP('Masa (UMA):'); // unidad masa atomica
  label2.position(30, 100); // posición de la etiqueta
  
  let label3 = createP('Radio (RA):'); // radio atomico
  label3.position(30, 190); // posición de la etiqueta
  
  let label4 = createP('Temperatura inicial (K):'); // Kelvin
  label4.position(30, 280); // posición de la etiqueta
  
  let label5 = createP('Número de partículas:'); 
  label5.position(240, 10); // posición de la etiqueta
  
  let label6 = createP('Número de partículas:'); 
  label6.position(490, 10); // posición de la etiqueta
  
  let label7 = createP('Temperatura Prom (K):'); // Kelvin
  label7.position(240, 50); // posición de la etiqueta
  
  let label8 = createP('Temperatura Prom (K):'); // Kelvin
  label8.position(490, 50); // posición de la etiqueta
 
  let label9 = createP('Cronómetro (s):'); // segundos
  label9.position(30, 468); // posición de la etiqueta
  
  // Crea un deslizador para el número de partículas
  sliderN1 = createSlider(0, 100, 20); // Rango de valores: de 0 a 100, valor inicial: 20
  sliderN1.position(50, 50); // Establece la posición del deslizador    
  
  // Cambia el tamaño del deslizador
  sliderN1.style('width', '100px'); 
  sliderN1.style('height', '20px'); 

  sliderN1Value = createP(sliderN1.value()); // mostrar el valor del deslizador
  sliderN1Value.position(170, 35); // Establece la posición del valor
  
  // al cambiar los valores, se actulizan las variables
  sliderN1.changed(resetSketch);
  
    // Crea un deslizador para el número de partículas
  sliderN2 = createSlider(0, 100, 20); // Rango de valores: de 0 a 100, valor inicial: 20
  sliderN2.position(50, 77); // Establece la posición del deslizador    
  
  // Cambia el tamaño del deslizador
  sliderN2.style('width', '100px'); 
  sliderN2.style('height', '20px'); 
    
  sliderN2Value = createP(sliderN2.value()); // mostrar el valor del deslizador
  sliderN2Value.position(170, 65); // Establece la posición del valor
  
  // al cambiar los valores, se actulizan las variables
  sliderN2.changed(resetSketch);
  
  // Crea un deslizador para la masa
  sliderM1 = createSlider(1, 20,4); // Rango de valores: de 0 a 20, valor inicial: 4
  sliderM1.position(50, 142); // Establece la posición del deslizador    
  
  // Cambia el tamaño del deslizador
  sliderM1.style('width', '100px'); 
  sliderM1.style('height', '20px'); 

  sliderM1Value = createP(sliderM1.value()); // mostrar el valor del deslizador
  sliderM1Value.position(170, 128); // Establece la posición del valor
  
  // al cambiar los valores, se actulizan las variables
  sliderM1.changed(resetSketch);

  // Crea un deslizador para la masa
  sliderM2 = createSlider(1, 20, 4); // Rango de valores: de 0 a 20, valor inicial: 4
  sliderM2.position(50, 170); // Establece la posición del deslizador    
  
  // Cambia el tamaño del deslizador
  sliderM2.style('width', '100px'); 
  sliderM2.style('height', '20px'); 

  sliderM2Value = createP(sliderM2.value()); // mostrar el valor del deslizador
  sliderM2Value.position(170, 158); // Establece la posición del valor
  
  // al cambiar los valores, se actulizan las variables
  sliderM2.changed(resetSketch);  
  
    // Crea un deslizador para el radio
  sliderR1 = createSlider(1, 15,10); // Rango de valores: de 0 a 15, valor inicial: 10
  sliderR1.position(50, 230); // Establece la posición del deslizador    
  
  // Cambia el tamaño del deslizador
  sliderR1.style('width', '100px'); 
  sliderR1.style('height', '20px'); 

  sliderR1Value = createP(sliderR1.value()); //mostrar el vaalor del deslizador
  sliderR1Value.position(170, 216); // Establece la posición del valor
  
  // al cambiar los valores, se actulizan las variables
  sliderR1.changed(resetSketch);

  // Crea un deslizador para el radio
  sliderR2 = createSlider(1, 15, 10); // Rango de valores: de 0 a 15, valor inicial: 10
  sliderR2.position(50, 258); // Establece la posición del deslizador    
  
  // Cambia el tamaño del deslizador
  sliderR2.style('width', '100px'); 
  sliderR2.style('height', '20px'); 

  sliderR2Value = createP(sliderR2.value()); // mostrar el valor del deslizador
  sliderR2Value.position(170, 245); // Establece la posición del valor
  
  // al cambiar los valores, se actulizan las variables
  sliderR2.changed(resetSketch);  
  
  // Crea un deslizador para la temperatura
  sliderT1 = createSlider(10, 500, 300); // Rango de valores: de 10 a 500, valor inicial: 300
  sliderT1.position(50, 321); // Establece la posición del deslizador    
  
  // Cambia el tamaño del deslizador
  sliderT1.style('width', '100px'); 
  sliderT1.style('height', '20px'); 

  sliderT1Value = createP(sliderT1.value()); // mostrar el valor del deslizador
  sliderT1Value.position(170, 306); // Establece la posición del valor
  
  // al cambiar los valores, se actulizan las variables
  sliderT1.changed(resetSketch); 
  
  // Crea un deslizador para la temperatura
  sliderT2 = createSlider(10, 500, 300); // Rango de valores: de 10 a 500, valor inicial: 300
  sliderT2.position(50, 348); // Establece la posición del deslizador    
  
  // Cambia el tamaño del deslizador
  sliderT2.style('width', '100px'); 
  sliderT2.style('height', '20px'); 

  sliderT2Value = createP(sliderT2.value()); // mostrar el valor del deslizador
  sliderT2Value.position(170, 336); // Establece la posición del valor
  
  // al cambiar los valores, se actulizan las variables
  sliderT2.changed(resetSketch); 
  
  resetSketch();
}

// funcion para resetear los parametros al hacer algun cambio
function resetSketch() {  
 
  frameRate(60);
  
  p = 0; // contador de tiempo
  divisor = false; // divisor 
  NumDivisor = 0;
  let TableInfo; 
  
  // actualiza la etiqueta de numero de particulas
  sliderN1Value.html(sliderN1.value()); 
  N1 = sliderN1.value();  
  
  // actualiza la etiqueta de la masa
  sliderM1Value.html(sliderM1.value()); 
  mass1 = sliderM1.value();
  
  // actualiza la etiqueta de numero del radio
  sliderR1Value.html(sliderR1.value());
  radio1 = sliderR1.value(); 
  
  // actualiza la etiqueta de temperatura
  sliderT1Value.html(sliderT1.value());
  temperature1 = sliderT1.value();
  
  balls1 = [];
  
  // velocidad inicial media cuadratica, tomo KB = 1
  let initialSpeed1 = Math.sqrt((3 * temperature1) / mass1);
  
  // Creación de las particulas que son agregadas a una lista
  for(let i = 0; i<N1; i++) {
    // posiciones aleatorias donde se encuentran las particulas
    position = createVector(random(xtable+(2*radio1),xline-(2*radio1)),random(ytable+(2*radio1),ytable+htable-(2*radio1)))
    
  // velocidad aleatoria de las particulas  
  // velocity = createVector(random(-initialSpeed1,initialSpeed1), random(-initialSpeed1,initialSpeed1))
    
  // otra manera teniendo en cuenta la distribucion
  let stdDev = 0.5// desviacion estandar, arbitraria    
  let mean1 = initialSpeed1; // Media de la gaussiana

  value1 = randomGaussian(mean1, stdDev); // valor de vel aleatoria
  vector = createVector(random(-1,1), random(-1,1)); //direccion aleatoria
  Normalize = Math.sqrt(vector.magSq()); // normalizando
      
  velocity = vector.copy().mult(value1/Normalize);
    
  balls1.push(new Ball(radio1, mass1 ,position , velocity,1));

  //Condición para que las bolas no aparezcan solapadas cuando se crean
  for (let j = 0; j < i; j++) {
    let d = dist(
      balls1[i].pos.x,
      balls1[i].pos.y,
      balls1[j].pos.x,
      balls1[j].pos.y
      );
    if (d <= balls1[i].r) {
      balls1[i].pos.x += 2*balls1[i].r;
      }
    }
  }
 
  // actualiza la etiqueta de numero de particulas
  sliderN2Value.html(sliderN2.value());
  N2 = sliderN2.value(); 
  
  // actualiza la etiqueta de la masa
  sliderM2Value.html(sliderM2.value());
  mass2 = sliderM2.value();
  
  // actualiza la etiqueta de numero del radio
  sliderR2Value.html(sliderR2.value());
  radio2 = sliderR2.value();
  
    // actualiza la etiqueta de temperatura
  sliderT2Value.html(sliderT2.value());
  temperature2 = sliderT2.value();
  
  // velocidad inicial media cuadratica, tomo KB = 1
  let initialSpeed2 = Math.sqrt((3 * temperature2) / mass2);
  
  balls2 = [];
  
  // Creación de las particulas que son agregadas a una lista
  for(let i = 0; i<N2; i++) {
    // posiciones aleatorias donde se encuentran las particulas
    position = createVector(random(xline+(2*radio2),xtable+wtable-(2*radio2)),random(ytable+(2*radio2),ytable+htable-(2*radio2)))
    
    // velocidad aleatoria de las particulas
    
  // velocity = createVector(random(-initialSpeed2,initialSpeed2), random(-initialSpeed2,initialSpeed2))
    
    // otra manera teniendo en cuenta la distribucion
  let stdDev = 0.5// desviacion estandar, arbitraria    
  let mean2 = initialSpeed2; // Media de la gaussiana

  value2 = randomGaussian(mean2, stdDev); // valor de vel aleatoria
  vector = createVector(random(-1,1), random(-1,1)); //direccion aleatoria
  Normalize = Math.sqrt(vector.magSq()); // normalizando
      
  velocity = vector.copy().mult(value2/Normalize);
    
    balls2.push(new Ball(radio2, mass2 ,position , velocity,2));

    //Condición para que las bolas no aparezcan solapadas cuando se crean
    for (let j = 0; j < i; j++) {
      let d = dist(
        balls2[i].pos.x,
        balls2[i].pos.y,
        balls2[j].pos.x,
        balls2[j].pos.y
      );
      if (d <= balls2[i].r) {
        balls2[i].pos.x += 2*balls2[i].r;
      }
    }
  }  
  
  // número máximo de partículas de N1 o N2 + 10 (valor para grafica)
  maxNumParticles = max( N1, N2) +10;
}

// Funcion de guardar datos
function saveData() {
  saveTable(TableInfo, 'simulacion_datos.csv');
  changestate();
}

// función para cambiar la linea divisoria
function changedivisor() {
  divisor = !divisor;
  
  // Si se habilita el divisor, reubica las partículas en la línea divisoria
  if (divisor==false) {
    particlesOnDivisor = [];
    for (let i = 0; i < balls1.length; i++) {
      if (balls1[i].pos.x >= xline-balls1[i].r && balls1[i].pos.x <= xline+balls1[i].r) {
        particlesOnDivisor.push(balls1[i]);
        reubicarParticula(balls1[i]);
      }
    }
    for (let i = 0; i < balls2.length; i++) {
      if (balls2[i].pos.x >= xline-balls2[i].r && balls2[i].pos.x <= xline+balls2[i].r) {
        particlesOnDivisor.push(balls2[i]);
        reubicarParticula(balls2[i]);
      }
    }
  }
  
}

// Función que cambia el estado de pausa/inicio
function changestate() {
  run = !run; // Cambia el valor de pausado de true a false o viceversa

  // Cambia el texto del botón según el estado
  let boton = select('button');
  if (run) {
    boton.html('Pausar');
  } else {
    boton.html('Iniciar');
  }
}

function draw() {

  background(0);
  
  // tabla botones
  stroke(0,100,0); //bordes
  strokeWeight(4); // Grosor del trazo;
  fill(100,200,100); // color relleno
  rect(10, 10, 200, 530); 
  
  // tabla histogramas
  stroke(0,100,0); //bordes
  strokeWeight(4); // Grosor del trazo;
  fill(100,200,100); // color relleno
  rect(720, 10, 250, 530); 
  
  // tabla crono
  stroke(0,0,0); //bordes
  strokeWeight(1); // Grosor del trazo;
  fill(255,255,255); // color relleno
  rect(20, 479, 180, 30); 

  // tabla datos
  stroke(0,100,0); //bordes
  strokeWeight(4); // Grosor del trazo;
  fill(100,200,100); // color relleno
  rect(220, 10, 490, 100); //tabla datos
  
  // Dibuja una línea a trazos
  stroke(255,255,50); 
  strokeWeight(4); // Establece el grosor de la línea
  for (let cont = 14; cont < 110; cont += 10) {
    line(xline, cont, xline, cont);
  }
  
  // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(0,255,255);
  ellipse(30, 62, 10, 10); 
   
  // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(255,0,255);
  ellipse(30, 90, 10, 10); 
  
  // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(0,255,255);
  ellipse(30, 154, 10, 10); 
   
  // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(255,0,255);
  ellipse(30, 182, 10, 10);
  
  // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(0,255,255);
  ellipse(30, 242, 10, 10); 
   
  // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(255,0,255);
  ellipse(30, 270, 10, 10);

  // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(0,255,255);
  ellipse(30, 332, 10, 10); 
   
  // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(255,0,255);
  ellipse(30, 360, 10, 10);
  
    // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(0,255,255);
  ellipse(780, 260, 10, 10);
  
  // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(0,255,255);
  ellipse(780, 522, 10, 10);
  
  // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(255,0,255);
  ellipse(870, 522, 10, 10);
  
  // particulas para el panel de botones
  stroke(0,0,0);
  strokeWeight(1); // Grosor del trazo
  fill(255,0,255);
  ellipse(870, 260, 10, 10);
  
  table.show();
 
    if (run==true) { // Actualiza y muestra las partículas si run es true
      p+=1;
      // mostrar cronometro
      fill(0); // Establece el color de relleno en negro (0,0,0)
      textSize(18);
      text((p / 60).toFixed(2),140,500);
      if (divisor == false){
        
        if (NumDivisor == 0){
    // linea
    stroke(255, 255, 50); 
    strokeWeight(4); // Grosor del trazo
    line(xline, y1line, xline, y2line); 
             
    // colisión de la particula i-esima con la j-esima
    for (let i = 0; i < balls1.length; i++) {
      for (let j = i; j < balls1.length; j++) {
        if (i !== j) {
          balls1[i].collision(balls1[j]);
      }
    }
    
      // colisión de la particula i-esima con los muros
      table1.collision(balls1[i]);

      // actualiza la posición de las particulas
      balls1[i].update();
      
      balls1[i].show();
    
  }         
    
        // colisión de la particula i-esima con la j-esima
    for (let i = 0; i < balls2.length; i++) {
      for (let j = i; j < balls2.length; j++) {
        if (i !== j) {
          balls2[i].collision(balls2[j]);
      }
    }
    
      // colisión de la particula i-esima con los muros
      table2.collision(balls2[i]);

      // actualiza la posición de las particulas
      balls2[i].update();
      balls2[i].show();
    
  }                
                
  }
    else{  
      
      let ballsCombinar = concat(balls1, balls2); // uno las 2 listas
      
      // se reinicia las listas de particulas
      balls1 = []; 
      balls2 = [];
      
      // se llena las listas anteriores con las bolas que hayan en cada caja
      for (let i = 0; i < ballsCombinar.length; i++) {
        
        if (ballsCombinar[i].pos.x<=xline){
         
          balls1.push(ballsCombinar[i])
        }
        
        else{
          balls2.push(ballsCombinar[i])
        }
      }
          
      // linea
    stroke(255, 255, 50); 
    strokeWeight(4); // Grosor del trazo
    line(xline, y1line, xline, y2line); 
    
    // colisión de la particula i-esima con la j-esima
    for (let i = 0; i < balls1.length; i++) {
      for (let j = i; j < balls1.length; j++) {
        if (i !== j) {
          balls1[i].collision(balls1[j]);
      }
    }
    
      // colisión de la particula i-esima con los muros
      table1.collision(balls1[i]);

      // actualiza la posición de las particulas
      balls1[i].update();
      balls1[i].show();
    
  }
    
        // colisión de la particula i-esima con la j-esima
    for (let i = 0; i < balls2.length; i++) {
      for (let j = i; j < balls2.length; j++) {
        if (i !== j) {
          balls2[i].collision(balls2[j]);
      }
    }
    
      // colisión de la particula i-esima con los muros
      table2.collision(balls2[i]);

      // actualiza la posición de las particulas
      balls2[i].update();
      balls2[i].show();
    
      }
    }    
  }
  
  if (divisor == true){
    
   NumDivisor += 1 
  // Dibuja una línea a trazos
  stroke(255,255,50); 
  strokeWeight(4); // Establece el grosor de la línea
    
  for (let cont = y1line+4; cont < y2line; cont += 10) {
    line(xline, cont, xline, cont);
  } 
  
  let balls = concat(balls1, balls2); // uno las 2 listas

  // colisión de la particula i-esima con la j-esima
  for (let i = 0; i < balls.length; i++) {
    for (let j = i; j < balls.length; j++) {
      if (i !== j) {
        balls[i].collision(balls[j]);
      }
    }
    
    // colisión de la particula i-esima con los muros
    table.collision(balls[i]);

    // actualiza la posición de las particulas
    balls[i].update();
    balls[i].show();
    
      }
    }
  } 

  else { // Muestra las partículas sin actualizar sus posiciones si run es false
    
    // mostrar cronometro
    fill(0); // Establece el color de relleno en negro (0,0,0)
    textSize(18);
    text((p / 60).toFixed(2),140,500);   
    
    if (divisor == false) {  
      
    // linea
    stroke(255, 255, 50); 
    strokeWeight(4); // Grosor del trazo
    line(xline, y1line, xline, y2line);
      
      for (let i = 0; i < balls1.length; i++) {
        balls1[i].show();
      }
      for (let i = 0; i < balls2.length; i++) {
        balls2[i].show();
      }
    }

    if (divisor == true) {
      
      // Dibuja una línea a trazos
    stroke(255,255,50); 
    strokeWeight(4); // Establece el grosor de la línea
    for (let cont = y1line+4; cont < y2line; cont += 10) {
      line(xline, cont, xline, cont);
  } 
    let balls = concat(balls1, balls2); // uno las 2 listas  
    for (let i = 0; i < balls.length; i++) {
      balls[i].show();
      }
    }
  }
  
  // conteo de particulas
  
      let balls = concat(balls1, balls2)
      for (let i = 0; i < balls.length; i++) {
        // Conteo de partículas de cada color en el cuadro 1
        if (balls[i].box == 1){
          if (balls[i].pos.x <= xline) {
            blueCountBox1 ++;
            totalKineticEnergyBox1 += 0.5 * balls[i].mass * balls[i].vel.magSq();
          }
          else{
            blueCountBox2 ++;
            totalKineticEnergyBox2 += 0.5 * balls[i].mass * balls[i].vel.magSq();
          }
        }
        
        // Conteo de partículas de cada color en el cuadro 2
        if (balls[i].box == 2){
          if (balls[i].pos.x <= xline) {
            magentaCountBox1 ++;
            totalKineticEnergyBox1 += 0.5 * balls[i].mass * balls[i].vel.magSq();
          }
          else{
            magentaCountBox2 ++;
            totalKineticEnergyBox2 += 0.5 * balls[i].mass * balls[i].vel.magSq();
          }
        }
      }
   
  // mostrar el numero de particulas 
  fill(0); // Establece el color de relleno en negro (0,0,0)
  textSize(18);  
  text(blueCountBox1, 810,267);
  text(blueCountBox2, 810,528);
  text(magentaCountBox1, 900,267);
  text(magentaCountBox2, 900,528);
  
  // suma de particulas
  NumberPartBox1 = blueCountBox1 + magentaCountBox1;
  NumberPartBox2 = blueCountBox2 + magentaCountBox2;
  
    
  // Calcula la temperatura promedio para cada caja utilizando la ecuación de la teoría cinética de los gases.
    temperature1 = (2 * totalKineticEnergyBox1) / (3 * NumberPartBox1);
    temperature2 = (2 * totalKineticEnergyBox2) / (3 * NumberPartBox2);

  // mostrar la T prom
  fill(0,0,180); // Establece el color de relleno en negro (0,0,0)
  textSize(18);
  text(temperature1.toFixed(2), 395,83);
  text(temperature2.toFixed(2), 644,83);
  text(NumberPartBox1, 395,44);
  text(NumberPartBox2, 644,44);
  
  // Actualiza los gráficos de barras con el número de partículas en cada caja
  numParticlesBox1.update(blueCountBox1,magentaCountBox1);
  numParticlesBox2.update(blueCountBox2,magentaCountBox2);

// guardar datos, cada segundo a partir del segundo 1 
  if (p>=60 && p % interval === 0) {
    let newRow = TableInfo.addRow();
    newRow.setNum('Tiempo (s)', p/60 );
    newRow.setNum('N1', NumberPartBox1);
    newRow.setNum('N2', NumberPartBox2);
    newRow.setNum('T1 (K)', temperature1);
    newRow.setNum('T2 (K)', temperature2);
    newRow.setNum('N1Blue', blueCountBox1);
    newRow.setNum('N1Magenta', magentaCountBox1);
    newRow.setNum('N2Blue', blueCountBox2);
    newRow.setNum('N2Magenta', magentaCountBox2);
  }
  // Dibuja los gráficos de barras
  numParticlesBox1.show("Histograma Caja 1");
  numParticlesBox2.show("Histograma Caja 2");
  
// Reiniciar los contadores
  magentaCountBox2 = 0;
  magentaCountBox1 = 0;
  blueCountBox2 = 0;
  blueCountBox1 = 0;
  totalKineticEnergyBox1 = 0;
  totalKineticEnergyBox2 = 0;
  
}

// creacion de la caja de las particulas
let Table = function (_x, _y, _w, _h) {
  this.x = _x;
	this.y = _y;
	this.w = _w;
	this.h = _h;

  this.show = function () {
    stroke(255); //bordes
    strokeWeight(4); // Grosor del trazo;
    noFill();
    rect(this.x, this.y, this.w, this.h);
  }

  // función colisión una particula con la pared
  this.collision = function (child) {
    
    // colisión contra las paredes laterales
    if ((child.pos.x < this.x +child.r/2) || (child.pos.x > this.x + this.w -child.r/2) ) {
      child.pos.x -= child.vel.x * dt;
      child.vel.x *= -1;
    }
    
    // colisión contra las paredes superior e inferior
    if ((child.pos.y < this.y +child.r/2) || (child.pos.y > this.y + this.h -child.r/2) ) {
      child.pos.y -= child.vel.y * dt;
      child.vel.y *= -1;
    }
  }
}

// funcíon creación de las particulas
let Ball = function (_r,_mass, _pos, _vel,_box) {
  this.box = _box; // particulas caja 1 o 2
  this.r = _r; // radio
  this.pos = _pos; // posicion
  this.vel = _vel; // velocidad
  this.mass = _mass; // masa
  this.moment = this.mass * this.vel; // momentum
  this.energy = 0.5*this.mass*this.vel.magSq(); // energía

  // mostrar las particulas
  this.show = function() {
    
    // particulas de la caja 1
    if (this.box==1){
      noStroke();
      fill(0,255,255);
      ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
    
    // particulas de la caja 2
    if (this.box==2){
      noStroke();
      fill(255,0,255);
      ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
  }

  // actualizar la posición de las particulas y la energía
  this.update = function () {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.energy = 0.5*this.mass*this.vel.magSq();
  }

  // colisión entre particulas
  this.collision = function (child) {
    let d = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y); // distancia entre particulas
    let dv = this.pos.copy().sub(child.pos); // vector de posición
    // energía
    let en = (this.energy + child.energy) / 2;
    
    // condición para choque
    
    if (d < (this.r/2 + child.r/2 + (0.1 * child.r/2))) {
      
      let overlap = (this.r/2 + child.r/2) - d; // evitar solapación
      let newMag = sqrt((2*en)/this.mass);
      
      // colocar un limite de vel
      
      if (newMag > 50) {
      newMag = 50;
    }
      
      // actualización de velocidades
      
      this.vel.reflect(dv);
      this.vel.setMag(newMag);
      
      // actualización de velocidades  
      child.vel.reflect(dv);
      child.vel.setMag(newMag);
      
      // Factor de ajuste para separación
      let separationFactor = 1.1;
      
      // Actualización de posición de ambas partículas
      let separationVector = dv.copy().setMag(overlap * separationFactor);
      this.pos.add(separationVector);
      child.pos.sub(separationVector);
    }
  }
}

class BarChart {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.value = 0;
    this.numPartBoxBlue = 0;
    this.numPartBoxMag = 0;
  }

  update(value , value2) {
    this.numPartBoxBlue = value;
    this.numPartBoxMag = value2;
  }

  show(label) {
    // Dibuja el gráfico de barras
    fill(0,0,0); // Color de fondo de las barras
    stroke(0,100,0); //bordes
    strokeWeight(4); // Grosor del trazo;
    rect(this.x, this.y, this.w, this.h);

    // Calcula la altura de la barra en función del valor
    let barHeight = map(this.numPartBoxBlue, 0, maxNumParticles, 0, this.h);
    let barHeight2 = map(this.numPartBoxMag, 0, maxNumParticles, 0, this.h);

    // Dibuja la barra
    fill(0,255,255); // Color de la barra
    rect(this.x, this.y + this.h - barHeight, this.w/2, barHeight);
    
    // Dibuja la barra
    fill(255, 0, 255); // Color de la barra
    rect(this.x+this.w/2, this.y + this.h - barHeight2, this.w/2, barHeight2);

    fill(0,0,0); // Color del texto
    noStroke();
    textSize(16);
    // Etiqueta
    text(label, this.x  , this.y - 10);
    push(); // Guarda la configuración actual de transformación
    rotate(-1*HALF_PI); // Gira 90 grados en sentido antihorario (pi/2 radianes)
    text("# Partículas",-(this.y+150),this.x-10);
    pop(); // Restaura la configuración de transformación anterior  
  }
}

// funcion para que la particula que quede atrapada en el divisor
function reubicarParticula(particle){
  
  if (particle.pos.x<xline){
      if (particle.vel.x>=0){
        particle.pos.x=particle.pos.x+2*particle.r; 
      }
      else{
         particle.pos.x=particle.pos.x-particle.r; 
      }
  }
  
    if (particle.pos.x>=xline){
      if (particle.vel.x>=0){
        particle.pos.x=particle.pos.x+particle.r; 
      }
      else{
         particle.pos.x=particle.pos.x-2*particle.r; 
    }  
  } 
}
