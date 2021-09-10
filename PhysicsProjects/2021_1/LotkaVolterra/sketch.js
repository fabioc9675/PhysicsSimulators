// Parametros globales del problema
let k1,  k2,  k3,  k4;

// Condiciones de poblacion inicial
let p0 = 500,  d0 = 100;

// Crea las listas en las que se guardaran los datos
let presas = [];
let depredadores = [];
let tiempo = [0]; // Lista que guarda el paso del tiempo
let dt = 0.01; // paso temporal
let diag_fase = [];
let presasVStiempo = [];
let depredadoresVStiempo = [];
let NumPresas=p0;
let NumDepredadores=d0;
let contador = 0;
let Presas=[];
let Depredadores=[]
let iniciar = 0;


// Define variables para crear los botones
let boton_graph;

let botonPar1;
let inputPar1;

let botonPar2;
let inputPar2;

let botonPar3;
let inputPar3;

let botonPar4;
let inputPar4;

function setup() {
  createCanvas(1200, 800);
  
  frameRate(10);
  for(let i=0;i<10*NumPresas;i++){
    Presas.push(new particle());
  }
  for(let i=0;i<10*NumDepredadores;i++){
    Depredadores.push(new particle());
  }
  
  boton_graph = createButton('Graficar');
  boton_graph.position(windowWidth / 2 - 200, windowHeight / 2 + 300);
  boton_graph.mousePressed(mostrar);
  boton_graph.size(100, 20);
  
    
  botonPar1 = createButton('k1');
  botonPar1.position(windowWidth / 2 - 230, windowHeight / 2 + 180);
  botonPar1.mousePressed(entrarPar1);

  inputPar1 = createInput('');
  inputPar1.position(windowWidth / 2 - 200, windowHeight / 2 + 180);
  inputPar1.size(120);
  
  botonPar2 = createButton('k2');
  botonPar2.position(windowWidth / 2 - 230, windowHeight / 2 + 210);
  botonPar2.mousePressed(entrarPar2);

  inputPar2 = createInput('');
  inputPar2.position(windowWidth / 2 - 200, windowHeight / 2 + 210);
  inputPar2.size(120);
  
  botonPar3 = createButton('k3');
  botonPar3.position(windowWidth / 2 - 230, windowHeight / 2 + 240);
  botonPar3.mousePressed(entrarPar3);

  inputPar3 = createInput('');
  inputPar3.position(windowWidth / 2 - 200, windowHeight / 2 + 240);
  inputPar3.size(120);

  botonPar4 = createButton('k4');
  botonPar4.position(windowWidth / 2 - 230, windowHeight / 2 + 270);
  botonPar4.mousePressed(entrarPar4);

  inputPar4 = createInput('');
  inputPar4.position(windowWidth / 2 - 200, windowHeight / 2 + 270);
  inputPar4.size(120);
    
  iniciarCalculo();
    
}


function draw() {
   background(220);
  
  if(iniciar == 1){
  
    if(contador < 700){
      calcular(contador); // Llama el algoritmo
      NumPresas = presas[contador];
      NumDepredadores = depredadores[contador];
      contador = contador +1;
    }  

    plot.defaultDraw();
    plot2.defaultDraw();
    plot3.defaultDraw();



    for(let i=0;i<NumPresas;i++){
        Presas[i].movep();
        Presas[i].displayp();
        Presas[i].checkEdgep();
    }
       for(let i=0;i<NumDepredadores;i++){
        Depredadores[i].moved();
        Depredadores[i].displayd();
        Depredadores[i].checkEdged();
    }
  }
  
}



function iniciarCalculo(){
  //Borra la lista para crear una nueva grafica al cambiar los parametros 
 // presas.splice(0); 
 // depredadores.splice(0);
  
//Agrega las condiciones iniciales de la poblacion
  append(presas,p0);
  append(depredadores,d0);
}
 

// La funcion calcular soluciona la ecuacion diferencial con el algoritmo RK4
function calcular(i){
  

    
// Aplicamos el metodo de RungeKutta de orden 4
    let KU1P = rata_presa(presas[i],depredadores[i]);
    let KU2P = rata_presa(presas[i]+0.5*dt,depredadores[i]+0.5*KU1P*dt);
    let KU3P = rata_presa(presas[i]+0.5*dt,depredadores[i]+0.5*KU2P*dt);
    let KU4P = rata_presa(presas[i]+dt,depredadores[i]+KU3P*dt);
    
    let KU1D = rata_depredador(presas[i],depredadores[i]);
    let KU2D = rata_depredador(presas[i]+0.5*dt,depredadores[i]+0.5*KU1D*dt);
    let KU3D = rata_depredador(presas[i]+0.5*dt,depredadores[i]+0.5*KU2D*dt);
    let KU4D = rata_depredador(presas[i]+dt,depredadores[i]+KU3D*dt);
    
    let p = presas[i] + (1/6)*dt*(KU1P+2*KU2P+2*KU3P+KU4P);
    let d = depredadores[i] +(1/6)*dt*(KU1D+2*KU2D+2*KU3D+KU4D);
    
    let t = tiempo[i] + dt;
    diag_fase[i] = new GPoint(p,d);
    presasVStiempo[i] = new GPoint(t, p);
    depredadoresVStiempo[i] = new GPoint(t, d);
    
// Agrega la evolucion encontrada a las listas
    append(presas, p);
    append(depredadores, d);
    append(tiempo, t);    
  
  
// Creamos la grafica 1
  
  plot = new GPlot(this); // Creamos la grafica
  plot.setPos(0, 0);      // Posicion de la grafica
  plot.setOuterDim(400, height/2); // Dimension de la grafica
  
   // Add the points
  plot.setPoints(diag_fase); // Puntos a graficar 
  
// Etiquetas de la grafica
  plot.setTitleText("Diagrama de fase");
  plot.getXAxis().setAxisLabelText("Presas");
  plot.getYAxis().setAxisLabelText("Depredadores");

// Creamos la grafica 2
  plot2 = new GPlot(this); // Creamos la grafica
  plot2.setPos(400, 0);    // Posicion de la grafica
  plot2.setOuterDim(400, height/2); // Dimension de la grafica

  plot2.setPoints(presasVStiempo); // Puntos a graficar 

// Etiquetas de la grafica
  plot2.setTitleText("Población Presa");
  plot2.getXAxis().setAxisLabelText("Tiempo");
  plot2.getYAxis().setAxisLabelText("Presas");

// Creamos la grafica 3
  plot3 = new GPlot(this);// Creamos la grafica
  plot3.setPos(800, 0);// Posicion de la grafica
  plot3.setOuterDim(400, height/2);// Dimension de la grafica

  plot3.setPoints(depredadoresVStiempo);// Puntos a graficar

// Etiquetas de la grafica
  plot3.setTitleText("Población depredador");
  plot3.getXAxis().setAxisLabelText("Tiempo");
  plot3.getYAxis().setAxisLabelText("Depredadores");

 
}
// Funcion que llama la funcion calular y muestra las graficas
function mostrar() {
  iniciar = 1;
}

// Funciones que piden ingresar los valores de los paramtetros
function entrarPar1() {
  k1 = float(inputPar1.value());
}

function entrarPar2() {
   k2 = float(inputPar2.value());
}

function entrarPar3() {
   k3 = float(inputPar3.value());
}

function entrarPar4() {
  k4 = float(inputPar4.value());
}

//Funciones que modelan el sistema dinamico
//Tasa de cambio de las presas
function rata_presa(x1, x2) {
  return -k2 * x1 * x2 + k1 * x1;
}
//Tasa de cambio de los depredadores
function rata_depredador(x1, x2) {
  return k3 * x1 * x2 - k4 * x2;
  //return k3 * x1 * x2 - k4 * x2-0.005*x2*x2;
}


class particle{
  constructor(){
    this.xPos=width/2 + random(width/2);
    this.yPos=height/2 + random(height/2);
    this.speed=createVector(random(-2,2),random(-2,2));
    //this.sizep=random(0,10);
    //this.sized=random(0,10);
    this.sizep=5;
    this.sized=10;
  
  }
  movep(){// Le da moviviento a las presas
    this.xPos=this.xPos+this.speed.x;
    this.yPos=this.yPos+this.speed.y;
  }
  moved(){// Le da movimiento a los depredadores
    this.xPos=this.xPos+this.speed.x;
    this.yPos=this.yPos+this.speed.y;
  }
  displayp(){// Grafica circulos purpuras presas
    fill('purple');
    circle(this.xPos,this.yPos,this.sizep);
    
  }
  displayd(){// Grafica circulos rojos depredadores
    fill('red');
    circle()
    circle(this.xPos,this.yPos,this.sized);
    
  }
  checkEdgep(){ //Chequea los bordes presas
    if(this.xPos>width || this.xPos<width/2){
      this.speed.x=-1*this.speed.x
    }
    if(this.yPos>height||this.yPos<height/2){
      this.speed.y=-1*this.speed.y
    }
  }
    checkEdged(){//Chequea los bordes depredadores
    if(this.xPos>width || this.xPos<width/2){
      this.speed.x=-1*this.speed.x
    }
    if(this.yPos>height||this.yPos<height/2){
      this.speed.y=-1*this.speed.y
    }
  }
  
}