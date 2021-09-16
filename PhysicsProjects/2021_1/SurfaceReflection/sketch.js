
//Primero se definen las variables
let emp,siguiente,anterior,inpai,inpn1,inpn2,n1,n2,ai,at,ac;
let tai,tat,period,dx,pl,sn,inter,d,d2,R,T,cp,cs1,xs1,ys1,air,atr;
let pag=1, xspacing = 1, amplitude = 75.0; //son variables que tienen un valor inicial

//Con la función set up se cren las condiciones inciales, es decir,
// se crean los botones y los objetos que aparecerán en el código 
function setup() {
  createCanvas(windowWidth,windowHeight); //Utiliza toda la pantalla para la simulación
  //Se crean los botones
  emp = createButton('Empezar');
  siguiente = createButton('Siguiente');
  pl = createButton('Plana');
  sn = createButton('Sinusoidal');
  //se crean los cuadros para ingresar valores
  inpai = createInput();
  inpn1 = createInput();
  inpn2 = createInput();
  //Se definen unas variables
  period =width/4 ;    //el periodo de la función coseno
  dx = (TWO_PI / period) * xspacing; //el paso con el que aumentará l coordenada x en la función coseno

  //se crean los objetos
  planoa = new planofun(width/2,height/2,width/2,5); //la interfaz plana
  planob = new planofun(width/8,height/2,width/4,5);
  sena = new sinfun(width/2 - xspacing,0); //la interfaz sinusoidal
  senb = new sinfun(width/4 - xspacing,width/8);
  incip = new rayop(); //los rayos que aparecen en la simulación
  incis1 = new rayop();
}
//Esta función permite empezar a iterar, es como un ciclo que va dibujando
function draw(){
//Creé commo si fuera un libro, entonces si estoy en la página 1,2,3.. hay conidicones diferentes
  if (pag===1){
    bienvenidos();          //ejecuta la función bienvenidos
    emp.mousePressed(sig);  //si presiono el botón se ejecuta la función sig (pasa la página)
  }
  else if (pag===2){
    elegir();
    siguiente.mousePressed(sig);
  }
  else if (pag===3){
    interfaces();
    //Aqui hice uso de la posición del mouse. Si el mouse está en la parte izquierda de la pantalla
    // se ejecuta la función fondo con unas condiciones, pero si está en la parte derecha se ejecuta con otras
    if (mouseX < width/2){                    
      fondo(0, height/4, width/2, height/2);
    }
    else{
      fondo(width/2, height/4, width/2, height/2);
    }
    //Formato del texto que aparecerá en pantalla
    textSize(30);
    textAlign(CENTER, TOP);
    fill(0);
    text('Elije una interfaz', 0, 90, width);
    
    planoa.mostrar();  //Se ejecutan las funciones propias de los objetos, son las que crean el movimiento 
    sena.calcWav();
    sena.renderWav(); 

    sn.mousePressed(sig); //otras dos funciones con botones que pasan la página
    pl.mousePressed(pla);
  }
  
  else if (pag===4){
    sinusoidal();    
    cs1=createVector(xs1,ys1+2.5); //Este es un punto elegido arbitrariamente en el que el rayo incidente llegará
    incis1.mov(cs1);
    incis1.ref(cs1);
  }

  else if (pag===5){
    plano();
    cp=createVector(width/4,height/2);
    incip.mov(cp);
    incip.ref(cp);
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funciones que dan forma a cada página

//Función de la primera página
function bienvenidos(){
  background(255);  //fondo blanco
  ////Formato del texto que aparecerá en pantalla
  textSize(30);
  textAlign(CENTER, TOP);
  text('¡Bienvenidos!', 0, 100, width);

  textSize(20);
  text('Aquí encuentras una simulación ',0,175, width);
  text('de cómo se comporta la luz al pasar ',0,200, width);
  text('de un medio a otro',0,225, width);

  emp.position(width/2 -30, height/2 + 50); //posición y estilo del botón empezar
  emp.style('background-color', color(255));
}

//Función de la segunda página
function elegir(){
  emp.hide(); //esconde el botón empezar
  clear(); //borra todo lo que estaba en la pantalla

  background(255);

  siguiente.position(width/2 -30, height - 50); //posición y estilo del botón siguiente
  siguiente.style('background-color', color(255));

  
  textSize(15);
  textAlign(CENTER, TOP);
  text('Ingresa el ángulo de incidencia (entre 0.1° y 89.9°):', 0, 100, width);

  text('θi = ',width/2 -65,135)
  inpai.size(50);                   //tamaño del cuadro para ingresar el ángulo incidente
  inpai.position(width/2 -25,130); //posición del cuadro para ingresar el ángulo incidente
  ai=PI*inpai.value()/180;         //ángulo incidente. Se pasa a radianes

  text('Ingresa el indice de refracción n del medio 1:', 0, 200, width);

  text('n1 = ',width/2 -65,235)
  inpn1.size(50);                  //cuadro para ingresar el indice de refración n del medio 1
  inpn1.position(width/2 -25,230);
  n1=inpn1.value();

  text('Ingresa el indice de refracción n del medio 2:', 0, 260, width);

  text('n2 = ',width/2 -65,295)
  inpn2.size(50);                  //cuadro para ingresar el indice de refración n del medio 2
  inpn2.position(width/2 -25,290);
  n2=inpn2.value();

  at=asin(sin(ai)*n1/n2);  //calculo el ángulo de refracción
  tai=tan(ai);
  tat=tan(at);

  if(n1>n2){
    ac=asin(n2/n1);       //calculo del ángulo crítico
  }
  else if (n1<n2){
    ac='No hay ángulo crítico';
  }
}

//Función de la tercera página
function interfaces(){
  //se limpia la pantalla y se esconden los botones
  inpai.hide();
  inpn1.hide();
  inpn2.hide();
  siguiente.hide();
  clear();   

  background(255);

  pl.position(3*width/4 -10, height/2 + 90);  //posición y estilo de los botones para escoger interfaz 
  pl.style('background-color', color(255));
  sn.position(width/4 -30, height/2 + 90);
  sn.style('background-color', color(255));
}

//Función de la cuarta página
function sinusoidal(){
  pl.hide();
  sn.hide();
  clear();

  background(255);

  senb.calcWav();   //se dibuja la interfaz sinusoidal y el punto donde incide el rayo i, con su componente normal
  senb.renderWav(); 
  senb.normal();
}

//Función de la quinta página
function plano(){
  pl.hide();
  sn.hide();
  clear();

  background(255);

  planob.mostrar(); //se dibuja la interfaz plana y el punto donde incide el rayo i, con su componente normal
  planob.normal(); 
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Ya estas funciones no son de cada página sino que tienen una funcionalidad específica

//función que pasa una página
function sig(){
  pag = pag +1; 
}
//Esta función pasa dos páginas
function pla(){
  pag = pag +2;
}

//Esta función crea el rectángulo gris que se muestra al escoger la interfaz
function fondo(px,py,ancho,alto){
  noStroke();   //sin bordes
  fill(245);    //color gris 244 (en escala de 0-negro a 255-blanco)
  rect(px,py,ancho,alto);  //dibuja rectángulo
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Estas funciones determinan los objetos y sus propiedades

//Objeto interfaz plana
let planofun =function(_x,_y,_w,_h){//let define el objeto, planofun es el objecto, la función con las variables

  this.x=_x; //this es el objecto, dentro del objeto hay una propiedad .x que recibe el valor _x
  this.y=_y;
  this.w=_w;
  this.h=_h;

  this.mostrar = function () { //esta función crea un rectángulo que hace las veces de interfaz plana
    noStroke();
    fill(0);
    rect(this.x,this.y,this.w,this.h);
  }

  this.normal = function(){   //esta función dibuja el eje normal
    ellipse(width/4,height/2 + 2.5,10,10); //el punto donde incide el rayo i

    //letras que indican cuál es la componente normal y los medios con n1 y n2
    textSize(15);
    text("n1=",width/8,height/2 -20);
    text(n1,width/8 +32,height/2 -20);
    text("n2=",width/8,height/2 +10);
    text(n2,width/8 +32,height/2 +10);
    textSize(20);
    text("N",width/4,height/4-25);

    //Constantes que sirven para dar el tamaño a la compoennte normal
    this.da2=20;
    this.a2=(height/2)/this.da2; 
    
    stroke(0);
    for (let i = 0; i < this.a2; i++) { //es un ciclo que dibuja a2 rayitas verticales que forman el eje normal
      this.xa2=width/4  //posición x de la componente normal
      this.ya2=((3*height)/4) - (i*this.da2);  //posición y donde inicia la rayita
      this.yb2=((3*height)/4) -(this.da2/2) -(i*this.da2); //posición y donde termina la rayita
      
      line(this.xa2,this.ya2,this.xa2,this.yb2); //dibuja la rayita
    }

  }
}

//Es el objeto sinusoidal
let sinfun =function(_wi,_x){
  //constantes que dan cuenta del ancho y la posición 
  this.wi=_wi
  this.yv = new Array(floor(this.wi / xspacing));

  this.calcWav = function() { //esta función calcula las posiciones y del objeto sinusoidal
    let x = _x; //este es el x inicial
    for (let i = 0; i < this.yv.length; i++) {
      this.yv[i] = cos(x) * amplitude; //y=a*cos(x)
      x += dx; //aumenta x
    }
  }
  
  this.renderWav = function() { //esta función dibuja el objeto sinusoidal
    noStroke();
    fill(0);
    for (let x = _x; x < _x+this.yv.length; x++) {
      rect(x * xspacing, height/2 + this.yv[x-_x], 5, 5); //crea muchas rayitas pegadas, entonces parece una línea continua
    }
  }

  this.normal = function(){ //dibuj el eje normal al punto donde se incide
    //punto donde incide el rayo i
    xs1=width/4 + 55;  
    ys1=height/2 +senb.yv[int(-width/8 + xs1)];

    //letras que indican cuál es la componente normal y los medios con n1 y n2
    textSize(15);
    text("n1=",width/8,height/2 +25);
    text(n1,width/8 +32,height/2 +25);
    text("n2=",width/8,height/2 +85);
    text(n2,width/8 +32,height/2 +85);
    textSize(20);
    text("N",xs1 -5,height/2 +70);
  
    stroke(0);
    fill(255);
    textSize(12);
    ellipse(xs1, ys1 +2.5,10,10); //dibuja el punto donde incide el rayo i
  
    fill(0);
    for (let i = 0; i < 20; i++) {
      line(xs1,ys1-50+(10*i),xs1,ys1-45+(10*i)); //dibuja rayitos que crean el eje normal
    }
  }
}

//Es el objeto que describe los rayos incidentes, reflejados y transmitidos o refractados
let rayop = function(){
  this.in=0; //condición que inventé e indica que el rayo i no ha llegado al punto sobre la interfaz donde va a incidir
  //las trayectorias de los tres rayos son arreglos, incialmente vacíos
  this.trayectoriai = [];
  this.trayectoriar = [];
  this.trayectoriat = [];
  //las posiciones inciales de los rayos son vectores en 0,0
  this.posi= createVector(0,0);
  this.posr= createVector(0,0);
  this.post= createVector(0,0);

  this.mov=function(_cp){ //esta función describe el movimiento del rayo incidente
    //valores para posicionar correctamente los rayos (ver documento para explicación detallada)
    d=_cp.y - _cp.x/tai; 
    d2=_cp.y - _cp.x/tat;
  
    //Intensidad de reflexión y transmisión siguiendo la fórmula de Snell y Fresnel
    R= ((n1*cos(at) - n2*cos(ai))/(n1*cos(at) + n2*cos(ai)))**2;
    T= 1-R;

    this.posi.x += 1;  //incremento de la componente x del rayo incidente i
    this.posi.y = (this.posi.x/tai) + d;  //y = x/tan(a)
    this.trayectoriai.push(this.posi.copy()); //añade a la trayectoria la posición actual

    ellipse(this.posi.x,this.posi.y,5,5); //dibuja un punto que simula el frente del rayo incidente
    text("i",this.posi.x -5,this.posi.y -20);
    text("θi",_cp.x-20,_cp.y-60);
    line(_cp.x,_cp.y,_cp.x - 30,((_cp.x - 30)/tai) + d); //línea que indica el ángulo respecto a la normal
    noFill();
    this.yci=((_cp.x - 25)/tai) + d; //posición de la componente y de dos puntos que componen la curva que indica el ángulo incidente respecto a la normal
    curve(_cp.x - 25,_cp.y + 25,_cp.x - 25,this.yci,_cp.x,this.yci - 20,_cp.x + 25,this.yci - 20); //curva que indica el ángulo incidente respecto a la normal
    fill(255);

    if (this.posi.x > _cp.x) { //condición que indica que el rayo i llegó al punto sobre la interfaz donde incide
      this.posi.x = _cp.x; // el rayo i se queda ahí
      this.in=1; //indica que el rayo i llegó al punto sobre la interfaz donde va a incidir
    }

    for(let i=0; i<this.trayectoriai.length - 2; i++){
      line(this.trayectoriai[i].x,this.trayectoriai[i].y,this.trayectoriai[i+1].x,this.trayectoriai[i+1].y); //dibuja la trayectoria del rayo i
    }

    if(this.trayectoriai.length>100){ //dice que la trayectoria tiene máximo 100 valores, entonces va borrando el último
      this.trayectoriai.splice(0,1); //borra el útlimo valor guardado
    }
  }

  this.ref=function(_cp){ //describe el movimiento del rayo reflejado y transmitido o refractado
  
    this.posr.x += 1 ; //variación de su componente x
    this.post.x += 1 ;
    this.posr.y =(2*_cp.y) - (this.posr.x/tai) - d; // y = x/tan(a) y los otros dos son valores paraposicionar correctamente el rayo
    this.post.y =(this.post.x/tat) + d2;

    if (this.in> 0){ //si el rayo i ya incidió sobre la interfaz
      this.trayectoriar.push(this.posr.copy()); //añade las posiciones de los rayos r y t a sus trayectorias
      this.trayectoriat.push(this.post.copy());

      text("θr",_cp.x+5,_cp.y-60);
      line(_cp.x,_cp.y,_cp.x+ 30,(2*_cp.y) - ((_cp.x + 30)/tai) - d) ; //líneas que indican el ángulo de reflexión y transmisión respecto a la normal
      text("θt",_cp.x +5,_cp.y +60);
      line(_cp.x,_cp.y,_cp.x + 30,((_cp.x + 30)/tat) + d2);
      
      noFill(); //al igual que en el rayo i son para las curvas que indican el ángulo de reflexión y transmisión respecto a la normal
      this.ycr=(2*_cp.y) - ((_cp.x + 25)/tai) - d;
      this.yct=((_cp.x + 25)/tat) + d2;
      curve(_cp.x + 25,_cp.y + 25,_cp.x + 25,this.ycr,_cp.x,this.ycr - 20,_cp.x - 25,this.ycr - 20);
      curve(_cp.x + 25,_cp.y - 25,_cp.x + 25,this.yct,_cp.x,this.yct + 20,_cp.x - 25,this.yct + 20);
      

      ellipse(this.posr.x,this.posr.y,5,5); //dibuja el frente de los rayos r y t
      text("r",this.posr.x + 5,this.posr.y + 5);
      ellipse(this.post.x,this.post.y,5,5);
      text("t",this.post.x + 5,this.post.y + 5);

      for(let i=0; i<this.trayectoriar.length - 2; i++){ //dibuja la trayectoria del rayo r y el t
        line(this.trayectoriar[i].x,this.trayectoriar[i].y,this.trayectoriar[i+1].x,this.trayectoriar[i+1].y);
        line(this.trayectoriat[i].x,this.trayectoriat[i].y,this.trayectoriat[i+1].x,this.trayectoriat[i+1].y);
      }

      if(this.trayectoriar.length>100){ //las trayectorias no tienen más de 100 valores
        this.trayectoriar.splice(0,1);
        this.trayectoriat.splice(0,1);
      }
    }

    if (this.posr.x > width/2) { //punto final de los rayos r y t, para que no se propaguen indefinidamente
      this.posr.x = width/2;
      this.post.x = width/2;
    }

    noStroke();
    fill(0);
    textSize(15);
    textAlign(LEFT);

    if(n1>n2){ //Condición para que exista ángulo crítico

      if(ai<ac){ //condición bajo la cual el ángulo incidente es menor que el critico, entonces hay transmisión
        text('El ángulo crítico es:',width/2 +50,400)
        text('θc =',width/2 +50,425);
        text(180*ac/PI,width/2 +85,425); //se pasa el ángulo de radianes a grados
        text('Los ángulos son (en °) : ',width/2 +50,175);
        text('Las intensidades de los rayos son (en %) : ',width/2 +300,175);
        text('θi =',width/2 +50,225);
        text(180*ai/PI,width/2 +85,225);
        text('i =',width/2 +300,225);
        text(100,width/2 +335,225);
        if (this.in> 0){ //sólo va a mostrar el texto cuando el rayo i llegué al punto sobre la interfaz en el que incide
          text('θr =',width/2 +50,250);
          text(180*ai/PI,width/2 +85,250);
          text('θt =',width/2 +50,275);
          text(180*at/PI,width/2 +85,275);
          text('r =',width/2 +300,250);
          text(R*100,width/2 +335,250);
          text('t =',width/2 +300,275);
          text(T*100,width/2 +335,275);
        }
      }
      else if((ai-0.1)>ac){ //condición bajo la cual el ángulo incidente es igual o mayor al crítico, entonces no hay transmisión
        text('Los ángulos son (en °) : ',width/2 +50,200);
        text('θi =',width/2 +50,225);
        text(180*ai/PI,width/2 +85,225);
        if (this.in> 0){
          text('θr =',width/2 +50,250);
          text(180*ai/PI,width/2 +85,250);
          text('El ángulo crítico es:',width/2 +50,325)
          text('θc =',width/2 +50,350);
          text(180*ac/PI,width/2 +85,350);

          textSize(20);
          textAlign(CENTER);
          text('Hay una reflexión total',width/2 +450,250)
          text('ya que θi >= θc',width/2 +450,280)
        }
      }

    }
    else if (n1<n2){ //condición bajo la cual no existe el ángulo crítico
      text('No hay ángulo crítico, ya que n1<n2',width/2 +50,100);

      text('Los ángulos son (en °) : ',width/2 +50,175);
      text('Las intensidades de los rayos son (en %) : ',width/2 +300,175);
      text('θi =',width/2 +50,225);
      text(180*ai/PI,width/2 +85,225);
      text('i =',width/2 +300,225);
      text(100,width/2 +335,225);
      if (this.in> 0){
        text('θr =',width/2 +50,250);
        text(180*ai/PI,width/2 +85,250);
        text('θt =',width/2 +50,275);
        text(180*at/PI,width/2 +85,275);
        text('r =',width/2 +300,250);
        text(R*100,width/2 +335,250);
        text('t =',width/2 +300,275);
        text(T*100,width/2 +335,275);
      }
    }
  }
}





