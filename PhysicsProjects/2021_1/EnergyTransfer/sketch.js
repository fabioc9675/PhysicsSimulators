let dt = 1/10;
let balls=[]; //lista vacía que guardará información de las bolas.
let l=150; //altura para mostrar botones
let w=window.innerWidth; //ancho de la mesa de billar 
let h=(window.innerHeight-l); //altura de la mesa de billar
let fontsize = 14;
let table; //tabla para guardar datos al final de la simulación
let p=0; // necesario para llevar conteo del tiempo
let f=6000; //tiene que ver con el tiempo para guardar datos

function setup() {
canvas = createCanvas(w,h); //crea mesa de billar con ancho y altura w y h respectivamente.

//construcción de la tabla que guardará las velocidades de las diferentes bolas durante la simulación, inicialmente inicia vacía, solo con las
//etiquetas de las columnas.

table = new p5.Table();

table.addColumn('Velocidad en x Amarilla');
table.addColumn('Velocidad en y Amarilla');

table.addColumn('Velocidad en x Roja');
table.addColumn('Velocidad en y Roja');

table.addColumn('Velocidad en x Azul');
table.addColumn('Velocidad en y Azul');

table.addColumn('Velocidad en x Morada');
table.addColumn('Velocidad en y Morada');

table.addColumn('Velocidad en x Naranja');
table.addColumn('Velocidad en y Naranja');

table.addColumn('Velocidad en x Rosada');
table.addColumn('Velocidad en y Rosada');


textSize(fontsize);
textAlign(LEFT, CENTER);
//Creación de los cuatro botones que permitirán controlar el desarrollo de la simulación.
//Restaurar: Permite comenzar de nuevo la simulación con las condiciones iniciales asignadas por el usuario.
//Parar: Detiene la simulación, las bolas de billar quedan completamente quietas al oprimir este botón.
//Seguir: Las bolas continuan sus trayectorias con la misma velocidad que llevaban antes de oprimir Parar. Siempre debe oprimirse el boton
//Seguir después de oprimir Parar para continuar con el desarrollo de la simulación.
//Salvar: Una vez que en la mesa de billar aparezca el mensaje Datos Guardados, se puede oprimir este botón para guardar los datos de las
//velocidades de las diferentes bolas durante la simulación.
//Para los tamaños de los botones, los cuales se hicieron por ensayo y error hasta que estos lucieran estéticos en la pantalla.
// Cuando se oprime el boton Restaurar se ejecuta una función llamada resetSketch que se definirá mas adelante.

button=createButton('Restaurar');
button.mousePressed(resetSketch); 
button.position(w-75,h);

button2=createButton('Parar');
button2.mousePressed(Parar);
button2.position(w-50,h+20);

button3=createButton('Seguir');
button3.mousePressed(Seguir);
button3.position(w-55,h+40);

button4=createButton('Salvar');
button4.mousePressed(Salvar);
button4.position(w-54,h+60);

//En esta sección creamos las etiquetas del color de las diferentes bolas en el orden: Amarilla, Roja, Azul, Morada, Naranja y Rosada junto 
//con los sliders que controlaran la masa de dichas bolas.

p4 = createP('Masas [g]');
p4.position(60,h-5);

p11 = createP('Amarilla'); //etiqueta de color
p11.position(0,h+13); //posiciona dicha etiqueta. Los valores numéricos aquí fueron obtenidos por ensayo y error hasta lograr un ajuste bueno.
sliderR1 = createSlider(10, 200, 10, 1); //crea slider que puede variar entre 10 y 200, tomando por defecto el valor 10 y variando en pasos de una unidad.
sliderR1.position(60, h + l-121); //posiciona slider
sliderR1.style('width', '70px'); //Explorando VisualCode encontramos que aproximadamente 1360px=659--------> 150px=72.7
p21 = createP(sliderR1.value()); //Muestra en la pantalla el valor numerico seleccionado en el slider.
p21.position(60+111.6-40,h + l-136); // posiciona dicho valor numerico. 

p12 = createP('Roja');
p12.position(0,h + 13+20);
sliderR2 = createSlider(10, 200, 50, 1);
sliderR2.position(60, h + l - 101);
sliderR2.style('width', '70px');
p22 = createP(sliderR2.value());
p22.position(60+111.6-40,h + l-116);

p13 = createP('Azul');
p13.position(0,h + 13+40);
sliderR3 = createSlider(10, 200, 90, 1);
sliderR3.position(60, h + l - 81);
sliderR3.style('width', '70px');
p23 = createP(sliderR1.value());
p23.position(60+111.6-40,h + l-96);

p14 = createP('Morada');
p14.position(0,h +13+60);
sliderR4 = createSlider(10, 200, 130, 1);
sliderR4.position(60, h + l - 61);
sliderR4.style('width', '70px');
p24 = createP('R='+sliderR1.value());
p24.position(60+111.6-40,h + l-76);

p15 = createP('Naranja');
p15.position(0,h + 13+80);
sliderR5 = createSlider(10, 200, 170, 1);
sliderR5.position(60, h + l - 41);
sliderR5.style('width', '70px');
p25 = createP(sliderR1.value());
p25.position(60+111.6-40,h + l-56);

p16 = createP('Rosada');
p16.position(0,h +13+100);
sliderR6 = createSlider(10, 200, 200, 1);
sliderR6.position(60, h + l - 21);
sliderR6.style('width', '70px');
p26 = createP(sliderR1.value());
p26.position(60+111.6-40,h + l-36);

//En esta seccion sigue estructuralmente los mismos pasos que la anterior solo que esta vez construimos los sliders para las posiciones iniciales en el eje horizontal x. Por tanto aplican comentarios análogos.
p_x = createP('Posición x [cm]');
p_x.position(60+111.6-10-20,h-5);

sliderpx1 = createSlider(round(-w/2+2*12,1),round(w/2-2*12,1),-w/2+w/7, 0.1);
sliderpx1.position(60+111.6, h + l-121);
sliderpx1.style('width', '70px');
px1 = createP( sliderpx1.value());
px1.position(60+2*111.6-40,h + l-136);

sliderpx2 = createSlider(round(-w/2+2*12,1),round(w/2-2*12,1),-w/2+2*w/7, 0.1);
sliderpx2.position(60+111.6, h + l - 101);
sliderpx2.style('width', '70px');
px2 = createP(sliderpx2.value());
px2.position(60+2*111.6-40,h + l-116);

sliderpx3 = createSlider(round(-w/2+2*12,1),round(w/2-2*12,1),-w/2+3*w/7, 0.1);
sliderpx3.position(60+111.6, h + l - 81);
sliderpx3.style('width', '70px');
px3 = createP(sliderpx3.value());
px3.position(60+2*111.6-40,h + l-96);

sliderpx4 = createSlider(round(-w/2+2*12,1),round(w/2-2*12,1),-w/2+4*w/7, 0.1);
sliderpx4.position(60+111.6, h + l - 61);
sliderpx4.style('width', '70px');
px4 = createP('R='+sliderpx4.value());
px4.position(60+2*111.6-40,h + l-76);

sliderpx5 = createSlider(round(-w/2+2*12,1),round(w/2-2*12,1),-w/2+5*w/7, 0.1);
sliderpx5.position(60+111.6, h + l - 41);
sliderpx5.style('width', '70px');
px5 = createP('R='+sliderpx5.value());
px5.position(60+2*111.6-40,h + l-56);

sliderpx6 = createSlider(round(-w/2+2*12,1),round(w/2-2*12,1),-w/2+6*w/7, 0.1);
sliderpx6.position(60+111.6, h + l - 21);
sliderpx6.style('width', '70px');
px6 = createP('R='+sliderpx6.value());
px6.position(60+2*111.6-40,h + l-36);

//sliders posicion y
p_y = createP('Posición y [cm]');
p_y.position(60+2*111.6-10-20,h-5);

sliderpy1 = createSlider(round(-h/2+2*12,1),round(h/2-2*12,1),0,0.1);
sliderpy1.position(60+2*111.6, h + l-121);
sliderpy1.style('width', '70px');
py1 = createP(sliderpy1.value());
py1.position(60+3*111.6-40,h + l-136);

sliderpy2 = createSlider(round(-h/2+2*12,1),round(h/2-2*12,1),0, 0.1);
sliderpy2.position(60+2*111.6, h + l - 101);
sliderpy2.style('width', '70px');
py2 = createP('R='+sliderpy2.value());
py2.position(60+3*111.6-40,h + l-116);

sliderpy3 = createSlider(round(-h/2+2*12,1),round(h/2-2*12,1),0, 0.1);
sliderpy3.position(60+2*111.6, h + l - 81);
sliderpy3.style('width', '70px');
py3 = createP('R='+sliderpy3.value());
py3.position(60+3*111.6-40,h + l-96);

sliderpy4 = createSlider(round(-h/2+2*12,1),round(h/2-2*12,1),0, 0.1);
sliderpy4.position(60+2*111.6, h + l - 61);
sliderpy4.style('width', '70px');
py4 = createP('R='+sliderpy4.value());
py4.position(60+3*111.6-40,h + l-76);

sliderpy5 = createSlider(round(-h/2+2*12,1),round(h/2-2*12,1),0, 0.1);
sliderpy5.position(60+2*111.6, h + l - 41);
sliderpy5.style('width', '70px');
py5 = createP('R='+sliderpy5.value());
py5.position(60+3*111.6-40,h + l-56);

sliderpy6 = createSlider(round(-h/2+2*12,1),round(h/2-2*12,1),0, 0.1);
sliderpy6.position(60+2*111.6, h + l - 21);
sliderpy6.style('width', '70px');
py6 = createP(sliderpy6.value());
py6.position(60+3*111.6-40,h + l-36);

//sliders velocidad x
v_x = createP('Velocidad x [cm/s]');
v_x.position(60+3*111.6-15-20,h-5);

slidervx1 = createSlider(-30, 30, 0, 0.1);
slidervx1.position(60+3*111.6, h + l-121);
slidervx1.style('width', '70px');
vx1 = createP(slidervx1.value());
vx1.position(60+4*111.6-40,h + l-136);

slidervx2 = createSlider(-30, 30, 0, 0.1);
slidervx2.position(60+3*111.6, h + l - 101);
slidervx2.style('width', '70px');
vx2 = createP(slidervx2.value());
vx2.position(60+4*111.6-40,h + l-116);

slidervx3 = createSlider(-30, 30, 0, 0.1);
slidervx3.position(60+3*111.6, h + l - 81);
slidervx3.style('width', '70px');
vx3 = createP(slidervx3.value());
vx3.position(60+4*111.6-40,h + l-96);

slidervx4 = createSlider(-30, 30, 0, 0.1);
slidervx4.position(60+3*111.6, h + l - 61);
slidervx4.style('width', '70px');
vx4 = createP(slidervx4.value());
vx4.position(60+4*111.6-40,h + l-76);

slidervx5 = createSlider(-30, 30, 0, 0.1);
slidervx5.position(60+3*111.6, h + l - 41);
slidervx5.style('width', '70px');
vx5 = createP(slidervx5.value());
vx5.position(60+4*111.6-40,h + l-56);

slidervx6 = createSlider(-30, 30, 0, 0.1);
slidervx6.position(60+3*111.6, h + l - 21);
slidervx6.style('width', '70px');
vx6 = createP(slidervx6.value());
vx6.position(60+4*111.6-40,h + l-36);

//sliders velocidad y
v_y = createP('Velocidad y [cm/s]');
v_y.position(60+4*111.6-5-20,h-5);

slidervy1 = createSlider(-30, 30, 0, 0.1);
slidervy1.position(60+4*111.6, h + l-121);
slidervy1.style('width', '70px');
vy1 = createP(slidervy1.value());
vy1.position(60+5*111.6-40,h + l-136);

slidervy2 = createSlider(-30, 30, 0, 0.1);
slidervy2.position(60+4*111.6, h + l - 101);
slidervy2.style('width', '70px');
vy2 = createP(slidervy2.value());
vy2.position(60+5*111.6-40,h + l-116);

slidervy3 = createSlider(-30, 30, 0, 0.1);
slidervy3.position(60+4*111.6, h + l - 81);
slidervy3.style('width', '70px');
vy3 = createP(slidervy3.value());
vy3.position(60+5*111.6-40,h + l-96);

slidervy4 = createSlider(-30, 30, 0, 0.1);
slidervy4.position(60+4*111.6, h + l - 61);
slidervy4.style('width', '70px');
vy4 = createP(slidervy4.value());
vy4.position(60+5*111.6-40,h + l-76);

slidervy5 = createSlider(-30, 30, 0, 0.1);
slidervy5.position(60+4*111.6, h + l - 41);
slidervy5.style('width', '70px');
vy5 = createP(slidervy5.value());
vy5.position(60+5*111.6-40,h + l-56);

slidervy6 = createSlider(-30, 30, 0, 0.1);
slidervy6.position(60+4*111.6, h + l - 21);
slidervy6.style('width', '70px');
vy6 = createP(slidervy6.value());
vy6.position(60+5*111.6-40,h + l-36);


//barra de bolas
sliderx = createSlider(1, 6, 6); //controla numero de bolas
sliderx.position(60+5*111.6, h + l - 125); //posiciona slider
sliderx.style('width', '70px'); 
p1=createP('Número de bolas'); //crea etiqueta de Numero de bolas y muestra el valor numérico asignado por el usuario.
p1.position(60+5*111.6-15,h-5); //posiciona la etiqueta anterior.
NumeroBolas = createP(sliderx.value());
NumeroBolas.position(60+6*111.6-40+5,h + l-140);
//barra elasticidad. Sigue una estructura y comentarios analogos a la barra de bolas.
slidery = createSlider(0.1, 100, 50,0.1);
slidery.position(60+5*111.6, h + l - 80);
slidery.style('width', '70px');
p2=createP('Porcentaje de elasticidad');
p2.position(60+5*111.6-15,h+40); 
 
Elasticidad = createP(slidery.value());
Elasticidad.position(60+6*111.6-40+5,h + l-95);

//barra fricción. Sigue una estructura y comentarios analogos a la barra de bolas.
sliderz = createSlider(0, 1, 0, 0.01);
sliderz.position(60+5*111.6, h + l - 35);
sliderz.style('width', '70px');
p3 = createP('Coeficiente de fricción ');
p3.position(60+5*111.6-15,h+85);

Friccion = createP(sliderz.value());
Friccion.position(60+6*111.6-40+5,h + l-50);

//Cada vez que se modifica un slider se ejecuta la función resetSketch que se definirá mas adelante, pero tiene la función de reiniciar la
//simulación con las condiciones iniciales de los valores actualizados de los sliders.

sliderx.changed(resetSketch);
slidery.changed(resetSketch);
sliderz.changed(resetSketch);

sliderR1.changed(resetSketch);
sliderR2.changed(resetSketch);
sliderR3.changed(resetSketch);
sliderR4.changed(resetSketch);
sliderR5.changed(resetSketch);
sliderR6.changed(resetSketch);

sliderpx1.changed(resetSketch);
sliderpx2.changed(resetSketch);
sliderpx3.changed(resetSketch);
sliderpx4.changed(resetSketch);
sliderpx5.changed(resetSketch);
sliderpx6.changed(resetSketch);

sliderpy1.changed(resetSketch);
sliderpy2.changed(resetSketch);
sliderpy3.changed(resetSketch);
sliderpy4.changed(resetSketch);
sliderpy5.changed(resetSketch);
sliderpy6.changed(resetSketch);

//cuando se modifican los sliders de las velocidades, se ejecuta una funcion llamada mostrarvelocidades definida mas adelante.

slidervx1.changed(mostrarvelocidades);
slidervx2.changed(mostrarvelocidades);
slidervx3.changed(mostrarvelocidades);
slidervx4.changed(mostrarvelocidades);
slidervx5.changed(mostrarvelocidades);
slidervx6.changed(mostrarvelocidades);

slidervy1.changed(mostrarvelocidades);
slidervy2.changed(mostrarvelocidades);
slidervy3.changed(mostrarvelocidades);
slidervy4.changed(mostrarvelocidades);
slidervy5.changed(mostrarvelocidades);
slidervy6.changed(mostrarvelocidades);

resetSketch(); //esta función tiene varias funcionalidades que se definirán mas adelante.

}


function Salvar(){

  saveTable(table, 'new.html'); //funcion que permite guardar en una tabla los diferentes valores de las velocidades de las bolas de billar durante la simulación.
}                               // Se puede cambiar el formato de html por csv o tsv.


function mostrarvelocidades() { //esta funcion actualiza los valores numéricos de las etiquetas de las velocidades en los sliders y actualiza
                                //las velocidades iniciales de las diferentes bolas.

  vx1.html(slidervx1.value());
  vx2.html(slidervx2.value());
  vx3.html(slidervx3.value());
  vx4.html(slidervx4.value());
  vx5.html(slidervx5.value());
  vx6.html(slidervx6.value());

  vy1.html(slidervy1.value());
  vy2.html(slidervy2.value());
  vy3.html(slidervy3.value());
  vy4.html(slidervy4.value());
  vy5.html(slidervy5.value());
  vy6.html(slidervy6.value());

  VX=[slidervx1.value(),slidervx2.value(),slidervx3.value(),slidervx4.value(),slidervx5.value(),slidervx6.value()]; //velocidades iniciales en x
  VY=[slidervy1.value(),slidervy2.value(),slidervy3.value(),slidervy4.value(),slidervy5.value(),slidervy6.value()]; //velocidades iniciales en y


}

function resetSketch() { 
  frameRate(100);

  //Esta parte actualiza las etiquetas de los valores numéricos de los sliders de Numero de bolas, Porcentaje de elasticidad, Coeficiente de friccion
  // y posiciones en ejes horizontal y vertical de las diferentes bolas.
table.clearRows();
  NumeroBolas.html(sliderx.value());
  Elasticidad.html(slidery.value());
  Friccion.html(sliderz.value());
  
  p21.html(sliderR1.value());
  p22.html(sliderR2.value());
  p23.html(sliderR3.value());
  p24.html(sliderR4.value());
  p25.html(sliderR5.value());
  p26.html(sliderR6.value());

  px1.html(sliderpx1.value());
  px2.html(sliderpx2.value());
  px3.html(sliderpx3.value());
  px4.html(sliderpx4.value());
  px5.html(sliderpx5.value());
  px6.html(sliderpx6.value());

  py1.html(sliderpy1.value());
  py2.html(sliderpy2.value());
  py3.html(sliderpy3.value());
  py4.html(sliderpy4.value());
  py5.html(sliderpy5.value());
  py6.html(sliderpy6.value());

  balls=[]; //lista vacía que guardará información de las bolas como su masa, radio, posiciones y velocidades.
  N=sliderx.value(); //número bolas.
  phi=slidery.value(); //porcentaje elasticidad, choque completamente elastico phi=100, choque completamente inelastico phi=0.
  b=sliderz.value(); //coeficiente de fricción.
  M=[sliderR1.value(),sliderR2.value(),sliderR3.value(),sliderR4.value(),sliderR5.value(),sliderR6.value()]; //Masas de las bolas.
  PX=[sliderpx1.value(),sliderpx2.value(),sliderpx3.value(),sliderpx4.value(),sliderpx5.value(),sliderpx6.value()]; //posiciones iniciales en x.
  PY=[sliderpy1.value(),sliderpy2.value(),sliderpy3.value(),sliderpy4.value(),sliderpy5.value(),sliderpy6.value()]; //posiciones iniciales en y.
  VX=[slidervx1.value(),slidervx2.value(),slidervx3.value(),slidervx4.value(),slidervx5.value(),slidervx6.value()]; //velocidades iniciales en x.
  VY=[slidervy1.value(),slidervy2.value(),slidervy3.value(),slidervy4.value(),slidervy5.value(),slidervy6.value()]; //velocidades iniciales en y.

  //crea las bolas con las condiciones iniciales determinadas por el usuario con los sliders. Para el calculo del radio de las bolas
  //se usó una densidad para las bolas de billar de aproximadamente 6g/cm^3.
  for(let i=0; i<N;i++){ 
  balls.push(new ball(i, M[i],20*((3*M[i])/(12.56*6))**(1/3),createVector(PX[i],PY[i]), createVector(VX[i],VY[i])));
  for(let j=0; j<i;j++){
  let di= dist(balls[i].pos.x,balls[i].pos.y,balls[j].pos.x,balls[j].pos.y);
  if(di<=balls[i].radio){
  balls[i].pos.x+=2*balls[i].radio; //esta parte del código lo que hace es evitar que dos bolas se intersecten durante la construcción
                                    // inicial, desplazando alguna de ellas horizontalmente una distancia igual a su diametro.
    }
  
  }
  }
  //se crea el borde la mesa de billar.
  borde = new border(); 
}

function draw() {
  translate(w/2,h/2); //Define el centro de coordenadas en el centro de la mesa de billar
  background(128,64,0);
  borde.mostrar();
  fill(0);
  text("x", w/2-30, 15); //etiquetas de los ejes horizontal y vertical
  text("y", 15,h/2-30);

 //esta parte es un contador, que da un tiempo al usuario para establecer los parametros iniciales antes de guardar
 //los datos de las velocidades de las bolas de billar y le informa cuando los datos fueron guardados exitosamente.
if(p>f+26){
  text("Datos Guardados", w/2-130, h/2-30);
}
if(p<6026){
text(p/100 + "s", w/2-50, h/2-17); 
}
   //for recorre numero de bolas
  for(let i=0; i<N;i++){
  balls[i].movimiento(); //llama a la funcion movimiento y la aplica a cada bola
  balls[i].mostrar(); //llama a mostrar para que aparezca pantalla
  balls[i].collision(); //llama funcion colision encargada de colision de bolas
  for(let j=0;j<N;j++){
    //cambia movimiento de las bolas segun su radio
    let dis=dist(balls[i].pos.x,balls[i].pos.y,balls[j].pos.x,balls[j].pos.y);
    if(i !==j && dis<=balls[i].radio+balls[j].radio){ // condicion si dos bolas chocan
    inelasticballscollision(balls[i],balls[j]); // aplica las reglas de conservacion de momento para predecir las velocidades de las dos bolas
                                                // después del choque entre ellas.
      }
    }

}



for(let i=0; i<N; i++){

  if(balls[i].vel.x==0 && balls[i].vel.y==0){ //condicion para bola en reposo (antes de iniciar simulación por ejemplo)

    

      drawArrow(balls[i].pos,createVector(VX[i],VY[i]),'black',3); //dibuja el vector velocidad inicial que el usuario determina con los sliders.
    
    
  }else {

    drawArrow(balls[i].pos,balls[i].vel,'black',3); //dibuja el vector velocidad de las bolas, a medida que transcurre el tiempo y se
                                                    //desarrolla la simulacion.
  }

} 


drawArrow(createVector(-w/2+10,0),createVector(w-22,0),'black',2); //dibuja el eje x horizontal
drawArrow(createVector(0,-h/2+10),createVector(0,h-22),'black',2); //dibuja el eje y vertical


//esto quiere decir que el usuario tiene 1 min aprox. para ingresar datos, despues de los cuales se empezará a medir velocidades.
if(f<p && p<f+26){ //solo en este pequeño intervalo se toman los datos de las velocidades de las bolas, ya que si incrementamos el tiempo
                   //durante el cual se toman datos, la tabla no consigue guardar tal cantidad.
table.addRow();
//Proceso de guardar velocidades en la tabla, en el caso que solo una bola esté presente. Similarmente se guardan los datos en los demás casos
//cuando se cambia el numero de bolas.
if(N==1){
  table.getRow(p-f-1).setNum('Velocidad en x Amarilla', balls[0].vel.x);
  table.getRow(p-f-1).setNum('Velocidad en y Amarilla', balls[0].vel.y);
  table.getRow(p-f-1).setString('Velocidad en x Roja', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Roja', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en x Azul', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Azul', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en x Morada', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Morada', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en x Naranja', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Naranja', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en x Rosada', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Rosada', 'Ninguna');
} else if(N==2){ //Procedimento para guardar datos en el caso de dos bolas
  table.getRow(p-f-1).setNum('Velocidad en x Amarilla', balls[0].vel.x);
  table.getRow(p-f-1).setNum('Velocidad en y Amarilla', balls[0].vel.y);
  table.getRow(p-f-1).setNum('Velocidad en x Roja', balls[1].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Roja', balls[1].vel.y);
table.getRow(p-f-1).setString('Velocidad en x Azul', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Azul', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en x Morada', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Morada', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en x Naranja', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Naranja', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en x Rosada', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Rosada', 'Ninguna');
} else if(N==3){ //Procedimento para guardar datos en el caso de tres bolas
  table.getRow(p-f-1).setNum('Velocidad en x Amarilla', balls[0].vel.x);
  table.getRow(p-f-1).setNum('Velocidad en y Amarilla', balls[0].vel.y);
  table.getRow(p-f-1).setNum('Velocidad en x Roja', balls[1].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Roja', balls[1].vel.y);
table.getRow(p-f-1).setNum('Velocidad en x Azul', balls[2].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Azul', balls[2].vel.y);
table.getRow(p-f-1).setString('Velocidad en x Morada', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Morada', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en x Naranja', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Naranja', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en x Rosada', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Rosada', 'Ninguna');

} else if(N==4){//Procedimento para guardar datos en el caso de cuatro bolas
  table.getRow(p-f-1).setNum('Velocidad en x Amarilla', balls[0].vel.x);
  table.getRow(p-f-1).setNum('Velocidad en y Amarilla', balls[0].vel.y);
  table.getRow(p-f-1).setNum('Velocidad en x Roja', balls[1].vel.x);
  table.getRow(p-f-1).setNum('Velocidad en y Roja', balls[1].vel.y);
  table.getRow(p-f-1).setNum('Velocidad en x Azul', balls[2].vel.x);
  table.getRow(p-f-1).setNum('Velocidad en y Azul', balls[2].vel.y);
  table.getRow(p-f-1).setNum('Velocidad en x Morada', balls[3].vel.x);
  table.getRow(p-f-1).setNum('Velocidad en y Morada', balls[3].vel.y);
  table.getRow(p-f-1).setString('Velocidad en x Naranja', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Naranja', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en x Rosada', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Rosada', 'Ninguna');

} else if (N==5){
 //Procedimento para guardar datos en el caso de cinco bolas
  table.getRow(p-f-1).setNum('Velocidad en x Amarilla', balls[0].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Amarilla', balls[0].vel.y);
table.getRow(p-f-1).setNum('Velocidad en x Roja', balls[1].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Roja', balls[1].vel.y);
table.getRow(p-f-1).setNum('Velocidad en x Azul', balls[2].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Azul', balls[2].vel.y);
table.getRow(p-f-1).setNum('Velocidad en x Morada', balls[3].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Morada', balls[3].vel.y);
table.getRow(p-f-1).setNum('Velocidad en x Naranja', balls[4].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Naranja', balls[4].vel.y);
table.getRow(p-f-1).setString('Velocidad en x Rosada', 'Ninguna');
table.getRow(p-f-1).setString('Velocidad en y Rosada', 'Ninguna');
} else if (N==6){ //Procedimento para guardar datos en el caso de seis bolas
table.getRow(p-f-1).setNum('Velocidad en x Amarilla', balls[0].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Amarilla', balls[0].vel.y);
table.getRow(p-f-1).setNum('Velocidad en x Roja', balls[1].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Roja', balls[1].vel.y);
table.getRow(p-f-1).setNum('Velocidad en x Azul', balls[2].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Azul', balls[2].vel.y);
table.getRow(p-f-1).setNum('Velocidad en x Morada', balls[3].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Morada', balls[3].vel.y);
table.getRow(p-f-1).setNum('Velocidad en x Naranja', balls[4].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Naranja', balls[4].vel.y);
table.getRow(p-f-1).setNum('Velocidad en x Rosada', balls[5].vel.x);
table.getRow(p-f-1).setNum('Velocidad en y Rosada', balls[5].vel.y);
}

}

p+=1; // el parametro p lleva cuenta del numero de frames ejecutados, cada vez que se corre un draw, es decir un frame, el p incrementa en una unidad.

}


//llama las caracteristicas fisicas de la bola
let ball = function(i, _mass, _rad, _pos, _vel){
  this.mass = _mass;
  this.radio = _rad;
  this.pos = _pos;
  this.vel = _vel;
//switch escoge las bolas para asignar a cada una un color diferente
  this.mostrar = function() {
    noStroke(); //elimina el borde negro
    switch (i) { //para diferentes colores de las bolas
      case 0:
        fill(255, 233, 0);
        break;
      case 1:
        fill(255, 0, 0);
        break;
      case 2:
        fill(0,0,255);
        break;
      case 3:
        fill(87,35,100);
        break;
      case 4:
        fill(255,128,0);
        break;
      case 5:
        fill(255,177,187);
        break;
        //se acaba la función
    }
    circle(this.pos.x,this.pos.y, 2*this.radio);
    stroke(25);
  }
//funcion movimiento la cual cambia posicion usando ec. Cinematica x = vt
  this.movimiento = function(){
    beta = b*dt/this.mass; //fricción si b diferente de 0
    this.vel.x = (1.0 - beta)*this.vel.x; 
    this.vel.y = (1.0 - beta)*this.vel.y;
    this.pos.x += this.vel.x*dt;
    this.pos.y += this.vel.y*dt;
  }
//funcion colision que cambia velocidad
  this.collision=function(){
if ((this.pos.x<-w/2+10+this.radio) || (this.pos.x>w/2-10-this.radio)){
this.vel.x*=-1;
}
if ((this.pos.y<-h/2+10+this.radio) || (this.pos.y>h/2-10-this.radio)){
  this.vel.y*=-1;
  }
  }

}

inelasticballscollision=function(object1,object2){

//los calculos de esta funcion siguen al pie de la letra las ecuaciones deducidas en el artículo y guía de colisiones, en el pdf adjunto a este codigo.
let d=dist(object1.pos.x,object1.pos.y,object2.pos.x,object2.pos.y);
let u= createVector((object1.pos.x-object2.pos.x)/(d),(object1.pos.y-object2.pos.y)/(d));
let s= createVector((object1.vel.x-object2.vel.x)/(dist(object1.vel.x,object1.vel.y,object2.vel.x,object2.vel.y)),(object1.vel.y-object2.vel.y)/(dist(object1.vel.x,object1.vel.y,object2.vel.x,object2.vel.y)));
let kmin=sqrt(1-sq((s.x*u.x)+(s.y*u.y)));
let k=(phi/100)+((1-(phi/100))*kmin);
let A= sq((object1.mass+object2.mass)/(object1.mass*object2.mass));
let B=2*((object1.mass+object2.mass)/(object1.mass*object2.mass))*(((object1.vel.x-object2.vel.x)*u.x)+((object1.vel.y-object2.vel.y)*u.y));
let C=(1-sq(k))*sq(dist(object1.vel.x,object1.vel.y,object2.vel.x,object2.vel.y));
let D=sq(B)-4*A*C;
if(D<0){
  object1.vel.x=0;
  object1.vel.y=0;
  object2.vel.x=0;
  object2.vel.y=0;
}else{
let a1=(-B+sqrt(sq(B)-4*A*C))/(2*A);
let a2=(-B-sqrt(sq(B)-4*A*C))/(2*A); 
let a=max(a1,a2);
 
object1.vel.x+=(a/object1.mass)*u.x;
object1.vel.y+=(a/object1.mass)*u.y;
object2.vel.x-=(a/object2.mass)*u.x;
object2.vel.y-=(a/object2.mass)*u.y;
  
}
}


let border = function(){
  //funcion mostrar para aparecer el borde de la mesa de billar 
  this.mostrar = function() {
    //noStroke(); //elimina el borde negro
    fill(0,143,57);
    rect(-w/2+10,-h/2+10,2*(w/2-10),2*(h/2-10));
    //stroke(100);
  }
}



 function Parar(){

  noLoop(); // funcion Parar, detiene la ejecucion del bucle Draw y por tanto de la simulacion.

 }

 function Seguir(){

  loop(); // función Seguir, reanuda la ejecucion del bucle Draw y por tanto permite continuar la simulacion.

 }

 //Dibuja un vector con origen en base, direccion vec, color myColor y tamaño de la punta size (caracter solo estetico), basado en la referencia de p5
 function drawArrow(base, vec, myColor,size) {
  push();
  stroke(myColor);
  strokeWeight(size);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 4*size;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}



 
 
  
