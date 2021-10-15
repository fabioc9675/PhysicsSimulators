

/* ************************************************************
 * ******* SIMULACION LABORATORIO AVANZADO 3 ******************
 * ************************************************************
 * * Autores:Valentina Bedoya                                 *
 * *          Maryi Alejandra Carvajal                        *
 * * Institución: Universidad de Antioquia                    *
 * ***********************************************************/



//Se definen las variables a utilizar en el código
let TSlider; 
let input;
let button;

let zoom_1, zoom_2;

let button0,button1,button2,button3,button4,button5,button6;
let button7,button8,button9,button10,button11,button12;

let texto,texto0,texto1,texto2 ,texto3, texto4,texto5,texto6,texto7;
let texto8,texto9,texto10,texto11,texto12,texto13,texto14;

let img,img2;


let y_Val = 220;

let h = 6.626e-34; //Constante de planck
let c = 3.0e+8; // Velocidad de la luz
let k = 1.38e-23; // Constante de boltzmann 

let button_espectro, button_simul,v_inicio;

let b_sol, b_bombilla, b_Sirius_A, b_Spica;
let b_reset;
let T_val;

let pag = 1;

function setup() {
  createCanvas(1000, 600);

  
  noStroke();

  // Slider
  TSlider = createSlider(500,30000,5000); // Se crea una barra deslizante
  TSlider.position(540,295); //Posición del slider


  TSlider.style('width', '300px'); //Tamaño del slider
  TSlider.style('transform','rotate(-90deg)'); //Se rota el slider
  TSlider.mouseMoved(bar_val); //Cuando el mouse
 

  //Se crea una casilla para que el usuario ingrese su entrada de temperatura
  input = createInput(); //Se crea la casilla de entrada
  input.position(690,510); //Se pone la casilla en una posición 
  input.style('width', '80px'); // Tamaño de la casilla



  //Se crea un boton para ingresar los valores de temperatura
  button = createButton('Ajustar');
  button.position(740,510); //Posición para el botón
  
  button.mousePressed(Slider_change); //Si el botón se apreta se llama a la función Slider change

  zoom_1 =  createButton('+'); //Se crea botón para aumentar el eje de y
  zoom_2 = createButton('-'); //Se crea botón para disminuir el eje de y

  
  //Se crean los botones para los valores de referencia en la simulación de cuerpo negro
  b_sol = createButton('Sol');
  b_Sirius_A = createButton('Sirius A');
  b_Spica = createButton('Spica');
  b_bombilla = createButton('Bombilla'); 

  //Se crea un botón para reiniciar los valores por defecto
  b_reset = createButton('Reiniciar');


 
  //Se crean los botones que iran en la pantalla de bienvenida
  button_espectro = createButton('Espectro electromagnético');
  button_simul = createButton('Simulación cuerpo negro');

  //Se crean los botones que iran en la explicación del espectro electromagnético
  button0 = createButton('i');
  button0.mouseClicked(moveButton0);
  button0.size(40,45);
  button0.position(20, 20);
  button0.style('font-family', 'Bodoni');
  let r=color(255, 210, 210); //rojo
  button0.style('font-size', '30px');
  button0.style('background-color', r);

  //creacion del boton1
  button1 = createButton('i');
  button1.mouseClicked(moveButton1);
  button1.size(25,30);
  button1.position(width/3.5, height/12);
  button1.style('font-family', 'Bodoni');
  button1.style('font-size', '22px');
  let c=color(255, 204, 0); //amarillo
  button1.style('background-color', c);

  //creacion boton 2
  button2 = createButton('i');
  button2.mouseClicked(moveButton2);
  button2.size(25,30);
  button2.position(width/1.1,height/12);
  button2.style('font-family', 'Bodoni');
  button2.style('font-size', '22px');
  button2.style('background-color', c);

  //creacion boton 3
  button3 = createButton('i');
  button3.mouseClicked(moveButton3);
  button3.size(25,30);
  button3.position(width/(1.04),height/3.5);
  button3.style('font-family', 'Bodoni');
  button3.style('font-size', '22px');
  button3.style('background-color', c);
  
  //creacion boton 4
  button4 = createButton('i');
  button4.mouseClicked(moveButton4);
  button4.size(25,30);
  button4.position(width/3.5,height/3.5);
  button4.style('font-family', 'Bodoni');
  button4.style('font-size', '22px');
  button4.style('background-color', c);

  //creacion boton 5 long onda frec energia
  button5 = createButton('i');
  button5.mouseClicked(moveButton5);
  button5.size(25,30);
  button5.position(25,height-230);
  button5.style('font-family', 'Bodoni');
  button5.style('font-size', '22px');
  button5.style('background-color', c);

  //creacion boton 6 rayos cosmicos
  button6 = createButton('i');
  button6.mouseClicked(moveButton6);
  button6.size(25,30);
  button6.position(width/5+10,height/2.3);
  button6.style('font-family', 'Bodoni');
  button6.style('font-size', '22px');
  button6.style('background-color', c);

  //creacion boton 7 rayos gamma
  button7 = createButton('i');
  button7.mouseClicked(moveButton7);
  button7.size(25,30);
  button7.position(width/3.4,height/2.3);
  button7.style('font-family', 'Bodoni');
  button7.style('font-size', '22px');
  button7.style('background-color', c);

  //creacion boton 8 rayos X
  button8 = createButton('i');
  button8.mouseClicked(moveButton8);
  button8.size(25,30);
  button8.position(width/2.5,(height/2.3));
  button8.style('font-family', 'Bodoni');
  button8.style('font-size', '22px');
  button8.style('background-color', c);

  //creacion boton 9 UV
  button9 = createButton('i');
  button9.mouseClicked(moveButton9);
  button9.size(25,30);
  button9.position(width/2+5,(height/2.3));
  button9.style('font-family', 'Bodoni');
  button9.style('font-size', '22px');
  button9.style('background-color', c);

  //creacion boton 10 IR
  button10 = createButton('i');
  button10.mouseClicked(moveButton10);
  button10.size(25,30);
  button10.position(width/1.6,(height/2.3));
  button10.style('font-family', 'Bodoni');
  button10.style('font-size', '22px');
  button10.style('background-color', c);

  //creacion boton 11 microondas
  button11 = createButton('i');
  button11.mouseClicked(moveButton11);
  button11.size(25,30);
  button11.position(width/1.35,(height/2.3));
  button11.style('font-family', 'Bodoni');
  button11.style('font-size', '22px');
  button11.style('background-color', c);

  //creacion boton 12 Radio
  button12 = createButton('i');
  button12.mouseClicked(moveButton12);
  button12.size(25,30);
  button12.position(width/1.1,(height/2.3));
  button12.style('font-family', 'Bodoni');
  button12.style('font-size', '22px');
  button12.style('background-color', c);
  
  

  //Se crea un botón de acceso rápido al inicio
  v_inicio = createButton('Inicio');
  v_inicio.position(width-100,30);
  v_inicio.mousePressed(go_back);



}
function draw(){
  
  if (pag === 1){
    inicio();
    button_espectro.mousePressed(des_espec);
    button_simul.mousePressed(simul_bb);
    
  }
  else if (pag===2){
    espectro_simul();
    
  }
  else if (pag===3){
    Simul_BB();
  }
}

//Esta función predetermina lo que aparecerá en la página 2

function inicio(){
  clear();

  v_inicio.hide(); //Esconde el botón para volver a la página de inicio
  hide_button_page2(); //Se esconden los botones de la pagina 2
  hide_button_page3(); //Se esconden los botones de la pagina 3
  
  show_button_pag1(); //Se muestran los botones de la pagina 1



  background(280);  //fondo blanco

  //Se agrega el texto de bienvenida
  stroke(1); 
  fill(1);
  textSize(30);
  textAlign(CENTER, TOP);
  text('¡Bienvenidos!', 0, 100, width);

  textSize(20);
  text('En esta simulación se estudia el espectro electromagnético',0,175, width);
  text('y la radiación de cuerpo negro.',0,200, width);


  //Se agregan las posiciones de los botones que estan en el inicio
  button_espectro.position(width/2-200,500);
  button_simul.position(width/2+50,500);

}

//Esta función predetermina lo que aparecerá en la página 2
function espectro_simul() {
  hide_button_page1(); //Se esconden los botones de la pagina 1
  hide_button_page3();//Se esconden los botones de la pagina 3
  show_button_page2();//Se muestran los botones de la pagina 2

  clear(); //Se limpia la pantalla de configuraciones anteriores
  background(255); //Fondo blanco
  //Cargan las imagenes que iran de fondo.
  image(img, width/3.5, 0, img.width / 3, height/2);
  image(img2, width/18, height*(1.2/3), width, height/1);

}

//Esta función predetermina lo que aparecerá en la página 3
function Simul_BB(){
  hide_button_page1();

  hide_button_page2(); //Esconde los botones que le corresponden a la descripción del espectro
  
  

  clear(); //borra todo lo que estaba en la pantalla
  show_button_page3();

  textSize(15); //Tamaño del texto
  background(280); // Fondo blanco 
  translate(20, height - 50); //Se traslada el centro de coordenado
  
  button.position(width-75,height/2+112); //Posición del botón ajustar
  input.position(width-125,height/2+112); //Posición de la entrada de texto del usuario
  TSlider.position(width-225,height/2-50); //Poscición del slider

  //Posición y función de los botones de referencia
  b_bombilla.position(width-146,height/2+70);
  b_bombilla.mousePressed(f_bombilla);
  b_sol.position(width-115,height/2+35);
  b_sol.mousePressed(f_sol);
  b_Sirius_A.position(width-140,height/2);
  b_Sirius_A.mousePressed(f_sirius_A);
  b_Spica.position(width-130,height/2-145);
  b_Spica.mousePressed(f_spica);

  //Posición y función del botón de reset 
  b_reset.position(width-105,height/2+135);
  b_reset.mousePressed(reset);
  
  drawGrid();//Se crea un grid 

  //Se crean botonos para zoom
  noStroke(1);
  fill(1);
  zoom_1.position(width-100,80); //Posición del botón
  zoom_1.mousePressed(disminuye_y);  //Se llama a la función para disminuir el eje de y 
  
  zoom_2.position(width-70,80); //Posición del botón
  zoom_2.mousePressed(aumenta_y); //Se llama a la función para aumentar el eje de y 
  
  



  draw_visible(); //Función que dibuja el espectro visible
//Se agregan los labels de la parte superior de la simulación
  fill(1);
  stroke(1);
  labels();

  //Se define los textos que iran en los labels
  fill(1);
  text('Temperatura (K)',width-230,-height/2+165); //Label de temperatura



  T_val = input.value(); //Se toma la temperatura que se ingresa por el botón input
  
  //Se muestran los valores en pantalla de la función de distribución según la posición del cursor
  let xValue = map(mouseX, 0, width, 0, 3000);
  let yValue = black_body(xValue*1e-9,T_val);
  let y = map(yValue, 0, y_Val, 0, height-50);
  let legend =  nf(yValue, 1, 4);
  let legend2 = nf(xValue, 1, 4);
  
  fill(1);
  text(legend, mouseX-50, -y-12);
  text(legend2, mouseX, -y+30);
  //Se crean las barras que ayudan a visualizar los valores en la pantalla
  stroke(1);
  line(mouseX, -y, mouseX, height); 
  line(0, -y, mouseX, -y);
  //Se crea un circulo en la distribución mostrada en la simulación
  fill(1255,165,0);
  noStroke();
  ellipse(mouseX, -y, 10, 10);

  //Se crea la gráfica de la función de distribución 
  noFill();
  stroke(	255,165,0);
  beginShape();
  //Notese que la gráfica va desde una longitud de onda de 0 hasta 3000(nm) 
  for (let x = 0; x < width; x++) {
    xValue = map(x, 0, width, 0, 3000);
    yValue = black_body(xValue*1e-9,T_val);
    y = map(yValue, 0, y_Val, 0, height-50); 
    vertex(x, -y); //Se va construyendo la gráfica en cada secuencia
  }

  endShape();



}


//Funciones que permiten el cambio entre páginas
function des_espec(){pag = 2;}
function simul_bb(){pag = 3;}
function go_back(){pag = 1;}



//Función que muestra los botones de la página 1
function show_button_pag1(){
  button_espectro.show();
  button_simul.show();
}

//Función que muestra los botones de la página 2
function show_button_page2(){
  button0.show();
  button1.show();
  button2.show();
  button3.show();
  button4.show();
  button5.show();
  button6.show();
  button7.show();
  button8.show();
  button9.show();
  button10.show();
  button11.show();
  button12.show();
  v_inicio.show();
}

//Función que muestra los botones de la página 3
function show_button_page3(){
  button.show();
  TSlider.show();
  input.show();
  zoom_1.show();
  zoom_2.show();
  v_inicio.show();
  b_Sirius_A.show();
  b_bombilla.show();
  b_sol.show();
  b_reset.show();
  b_Spica.show();

}
  

//Se crea el grid para la simulación 
function drawGrid() {
	stroke(1);
	fill(1);
  //Se muestran los valores en pantalla del eje x 
	for (var x=0; x <= width; x+=150) {
    let xValue = map(x,0, width, 0, 3000);
    let a = map(1,0,width,0,3000);
		text(round(xValue,1), x-5, 5);
	}
  //Se muestran los valores en pantalla del eje y
	for (var y=0;  y< height; y+=100) {
    let yValue = map(y,0, height-50, 0, y_Val);
    if (y===0){
    }
    else{
    text(nf(yValue,1,3), 26, -y-10);
    }
	}

 
	  
    
	//Se muestran los nombres de los ejes 
  stroke(1);
  line(0, 0, 0, -height);
  line(0,0,width,0);

  text('Longitud de onda (nm)',width/2,25); //Nombre del eje de X
  
  push();
  rotate( -HALF_PI); //Se rota el texto para que quede vertical en el eje de y 
  text('Radianza espectral ( kW sr⁻¹m⁻²nm⁻¹)',height/2 -50,-15);//Nombre del eje de y
  pop();


} 


//Función que cálcula la distribución de cuerpo negro
function black_body(wav, T){
  let a = 2*h*pow(c,2);
  let b = h*c/(wav*k*T);
  let c2 = (exp(b) - 1.0);
  let intensity = a/ ( (pow(wav,5)) * c2);
  return intensity*1e-12;
}

//FUnción que permite dibujar el espectro visible 
function draw_visible(){
  
  let wav = map(1, 0, width, 0, 3000);

  //Crea cuadro con el color morado 
  noStroke();
  fill(138,43,226,190);
  rect(380/wav, 0, 55/wav , -height);

  
  //Crea cuadro con el color azul 
  noStroke();
  fill(0,0,255,190);
  rect(427/wav, 0, 48/wav, -height);


  //Crea cuadro con el color cyan
  noStroke();
  fill(0,255,255,190);
  rect(475/wav, 0, 22/wav, -height);

  //Crea cuadro con el color verde
  noStroke();
  fill(0,255,0,190);
  rect(497/wav, 0, 73/wav, -height);

  //Crea cuadro con el color amarillo
  noStroke();
  fill(255,255,0,190);
  rect(570/wav, 0, 11/wav, -height);

  //Crea cuadro con el color naranjado
  noStroke();
  fill(255,69,0,190);
  rect(581/wav, 0, 37/wav, -height);

  //Crea cuadro con el color rojo
  noStroke();
  fill(255,0,0,190);
  rect(618/wav, 0, 160/wav, -height);
}

//Función que esconde los botones de la página 1
function hide_button_page1(){
  button_espectro.hide();
  button_simul.hide();
}

//Función que esconde los botones de la página 2
function hide_button_page2(){
  button0.hide();
  button1.hide();
  button2.hide();
  button3.hide();
  button4.hide();
  button5.hide();
  button6.hide();
  button7.hide();
  button8.hide();
  button9.hide();
  button10.hide();
  button11.hide();
  button12.hide();
}
//Función que esconde los botones de la página 3
function hide_button_page3(){
  TSlider.hide();
  button.hide();
  input.hide();
  zoom_1.hide();
  zoom_2.hide();
  b_Sirius_A.hide();
  b_bombilla.hide();
  b_sol.hide();
  b_reset.hide();
  b_Spica.hide();

}



//Se cambia el valor del slider según el valor ingresado manualmente por el usuario
function Slider_change(){
  TSlider.value(input.value());
}
//Se cambia  el valor ingresado manualmente por el usuario según el valor del slider
function bar_val(){
  input.value(TSlider.value());
}

//Funciones para el zoom
function aumenta_y(){ y_Val = y_Val*1.5;}
function disminuye_y(){y_Val = y_Val/1.5;}

//Función para el botón de referencia de la bombilla
function f_bombilla(){
  T_val = 3000; //Temperatura de la bombilla 
  TSlider.value(T_val);
  input.value(T_val);
  y_Val = 1.1; //Escala el eje de y
}
//Función para el botón de referencia del sol
function f_sol(){
  T_val = 5778; //Temperatura del sol 
  TSlider.value(T_val);
  input.value(T_val);
  y_Val = 29; //Escala el eje de y
}
//Función para el botón de referencia de la estrella sirius A
function f_sirius_A(){
  T_val = 10000; //Temperatura de sirius A
  TSlider.value(T_val);
  input.value(T_val);
  y_Val = 450; //Escala el eje de y
}
//Función para el botón de referencia de la estrella Spica
function f_spica(){
  T_val = 25000; //Temperatura de Spica
  TSlider.value(T_val);
  input.value(T_val);
  y_Val = 50000; //Escala el eje de y
}

//Esta función vuelve a los valores por defecto de la simulación 
function reset(){
  y_Val = 200;
  T_val = 5000;
  input.value(T_val);
}
//Se crean los labels superiores
function labels(){
  text('Infrarrojo',width/2,-height+50);
  text('Visible',width/5,-height+50);
  text('Ultravioleta',width/14,-height+50);
}




//Se cargan las imágenes que iran en el background 
function preload() {
  img = loadImage('https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2021_1/BlackBody/espectro_sim.png'); // Cargar la imagen
  img2 = loadImage('https://raw.githubusercontent.com/fabioc9675/PhysicsSimulators/devFabian/PhysicsProjects/2021_1/BlackBody/espectro_the.png');
}



//La funcion movebutton se encarga de abrir el cuadro de texto
function moveButton0() {
  //texto 0 
  texto0 = createButton(' El espectro de un objeto es la distribución característica de la radiación electromagnética de ese objeto, por lo tanto actúa como una huella dactilar en su caracterización. Así, el espectro electromagnético es el rango de todas las radiaciones electromagnéticas posibles, es interminable, pero se divide en algunos grupos, cada uno de ellos con diferentes peculiaridades, entre estos están: radio, microondas, infrarrojo, visible, ultravioleta, rayos X, rayos gamma y los rayos cósmicos. Para conocer más sobre cada uno pulsa el botón de información más cercano a ellos.');
  texto0.size(300,230);
  texto0.position(25,30);
  texto0.mouseClicked(hidebutton0);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto0.style('background-color', c_box);
}
function moveButton1() {
  //texto 1
  texto1 = createButton('Aunque creemos que nuestros ojos pueden ver todos las longitudes de onda que se emiten en el universo, en realidad la luz visible a nuestros ojos corresponde al 0.00000000004% del espectro electromagnético. ¡Increíble!');
  texto1.size(255,100);
  texto1.position(width/9,height/20);
  texto1.mouseClicked(hidebutton1);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto1.style('background-color', c_box);
}
function moveButton2() {
  //texto 2
  texto2 = createButton(' La radiación electromagnética con una longitud de onda entre 380 nm y 760 nm es detectada por el ojo humano y se percibe como luz visible. Precisamente en este rango el Sol emite con mayor fuerza, ¿Será una coincidencia?');
  texto2.size(255,100);
  texto2.position(width*(3/4),height/20);
  texto2.mouseClicked(hidebutton2);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto2.style('background-color', c_box);
}

function moveButton3() {
  //texto 3
  texto3 = createButton('En el espectro visible el color rojo corresponde a la longitud de onda mayor, contrario a lo que creemos es el color menos energético. Así, la llama de una vela que es azul tiene mayor temperatura que las amarillas o rojizas.');
  texto3.size(255,100);
  texto3.position(width*(3.1/4),height/3.5);
  texto3.mouseClicked(hidebutton3);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto3.style('background-color', c_box);
}

function moveButton4() {
  //texto 4
  texto4 = createButton('En la medida que a la longitud de onda disminuye aumentan tanto la frecuencia como la energía. Ocurrirá lo contrario en el caso en que la longitud de onda disminuya.');
  texto4.size(255,100);
  texto4.position(width/9,height/3.5);
  texto4.mouseClicked(hidebutton4);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto4.style('background-color', c_box);
}

function moveButton5() {
  //texto 5 6 7
  texto5 = createButton('En una onda periódica la longitud de onda es la distancia entre dos puntos a partir de los cuales la onda se repite. La longitud de onda es como una huella dactilar, nos permite identificar el tipo de radiación de forma única.');
  texto5.size(255,100);
  texto5.position(width/30,height/2.5);
  texto5.mouseClicked(hidebutton5);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto5.style('background-color', c_box);
  
  texto6 = createButton('La frecuencia es el número de ciclos o repeticiones de la onda por unidad de tiempo. La frecuencia es inversa a la longitud de onda, a mayor frecuencia menor longitud de onda y viceversa. Entonces también podemos caracterizar la radiación EM por su frecuencia.');
  texto6.size(255,115);
  texto6.position(width/30,height/1.75);
  texto6.mouseClicked(hidebutton6);
  texto6.style('background-color', c_box);

  texto7 = createButton('¿Habías escuchado sobre los Electronvoltios? Son una unidad de energía muuuuy pequeña, un ev corresponde a 6,242e+18 Julios, ¡Muchísimos!');
  texto7.size(255,100);
  texto7.position(width/30,height/1.3);
  texto7.mouseClicked(hidebutton7);
  let c=color(255, 204, 0);
  texto7.style('background-color', c_box);

}

function moveButton6() {
  //texto 8 rayos cosmicos
  texto8 = createButton('Los rayos cósmicos ultraenergéticos viajan a una velocidad cercana a la de la luz y tienen cientos de millones de veces más energía que las partículas producidas en el acelerador más potente construido por el ser humano.');
  texto8.size(255,100);
  texto8.position(width/5,height/2.3);
  texto8.mouseClicked(hidebutton8);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto8.style('background-color', c_box);
}

function moveButton7() {
  //texto 9 rayos gamma
  texto9 = createButton('Podemos observar fuentes naturales de rayos gamma tanto en la desintegración de los radionucleidos como en las interacciones de los rayos cósmicos con la atmósfera. Se encuentran entre la radiación más peligrosa para los seres humanos, son ondas de alta energía capaces de dañar irreparablemente las moléculas que componen las células, haciendolas desarrollar mutaciones genéticas o incluso la muerte.');
  texto9.size(255,200);
  texto9.position(width/4,height/2.3);
  texto9.mouseClicked(hidebutton9);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto9.style('background-color', c_box);
}

function moveButton8() {
  //texto 10 rayos x
  texto10 = createButton('Los rayos X  pueden pasar a través de la mayoría de los objetos, incluyendo el cuerpo. En medicina se utilizan para generar imágenes de los tejidos y las estructuras dentro del cuerpo. Si los rayos X que viajan a través del cuerpo también pasan a través de un detector de rayos X al otro lado del paciente, se formará una imagen que representa las “sombras” formadas por los objetos dentro del cuerpo.');
  texto10.size(255,200);
  texto10.position(width/3,(height/2.3));
  texto10.mouseClicked(hidebutton10);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto10.style('background-color', c_box);
}

function moveButton9() {
  //texto 11 UV
  texto11 = createButton('Los rayos UV son producidos por cuerpos muy calientes, como lo es el Sol. Esta radiación suele producir quemaduras e incluso puede producir cáncer de piel en exposiciones prolongadas. Afortunadamente la atmósfera filtra la mayoría de la radiación proveniente del sol.');
  texto11.size(255,150);
  texto11.position(width/2.5,height/2.3);
  texto11.mouseClicked(hidebutton11);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto11.style('background-color', c_box);
}

function moveButton10() {
  //texto 12 infrarrojo
  texto12 = createButton('La radiación infrarroja brinda una información especial: la temperatura de un objeto. Esta es emitida por cualquier cuerpo cuya temperatura sea mayor que el cero absoluto 0°K, es decir, −273.15 °C. Los equipos de visión nocturna la utilizan cuando la cantidad de luz visible es insuficiente, la radiación se recibe y después se refleja en una pantalla, así los objetos más calientes se convierten en los más luminosos. Algunos tipos de ranas, víboras, murciélagos e incluso peces pueden detectar esta radiación, ¿sabías?.');
  texto12.size(255,230);
  texto12.position(width/2,height/2.3);
  texto12.mouseClicked(hidebutton12);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto12.style('background-color', c_box);
}

function moveButton11() {
  //texto 13 microondas
  texto13 = createButton('Las microondas pueden ser generadas de varias maneras, clasificadas en dos categorías: dispositivos de estado sólido y dispositivos basados en tubos de vacío. Pertenecen a la categoría de radiaciones no ionizantes, por lo cual no cuentan con la energía suficiente para ionizar la materia. Entre las aplicaciones más conocidas está el horno de microondas, sus ondas hacen vibrar o rotar las moléculas de agua, lo cual genera calor. La mayor parte de los alimentos contienen un importante porcentaje de agua, por eso pueden ser fácilmente cocinados.');
  texto13.size(255,235);
  texto13.position(width/1.6,height/2.3);
  texto13.mouseClicked(hidebutton13);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto13.style('background-color', c_box);
}

function moveButton12() {
  //texto 14 radio
  texto14 = createButton('Las ondas de radio pueden ser generadas de manera artificial por antenas y son utilizadas para comunicaciones radio fija y móvil. Además pueden ser creadas de manera natural por fenómenos naturales como relámpagos u objetos astronómicos. Esta radiación tampoco pertenece a la radiación ionizante, el efecto más considerable en la absorción de las ondas de radio por los materiales es calentarlos, tal como las ondas infrarrojas irradiadas por fuentes de calor como un calentador de espacio o fuego de leña.');
  texto14.size(255,235);
  texto14.position(width/1.4,height/2.3);
  texto14.mouseClicked(hidebutton14);
  let c_box=color('hsla(160, 100%, 50%, 0.85)');
  texto14.style('background-color', c_box);
}

//funciones para cerrar la ventana al presionarla
function hidebutton0(){texto0.hide();}
function hidebutton1(){texto1.hide();}
function hidebutton2(){texto2.hide();}
function hidebutton3(){texto3.hide();}
function hidebutton4(){texto4.hide();}
function hidebutton5(){texto5.hide();}
function hidebutton6(){texto6.hide();}
function hidebutton7(){texto7.hide();}
function hidebutton8(){texto8.hide();}
function hidebutton9(){texto9.hide();}
function hidebutton10(){texto10.hide();}
function hidebutton11(){texto11.hide();}
function hidebutton12(){texto12.hide();}
function hidebutton13(){texto13.hide();}
function hidebutton14(){texto14.hide();}

