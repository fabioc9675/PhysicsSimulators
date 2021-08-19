
let dt = 1/10;
let phi=70; //porcentaje de elasticidad 
//choque completamente elastico phi=100, choque completamente inelastico phi=0


function setup() {
//canvas = createCanvas(windowWidth, windowHeight);
canvas = createCanvas(500,250);
frameRate(100);
ball_1 = new ball(1,10,createVector(0,50),createVector(0,70));
ball_2= new ball(2,20,createVector(0,-50),createVector(0,-70));

borde = new border();
}

function draw() {
  translate(250,125);
  background(128,64,0);
  borde.mostrar();


  ball_1.movimiento();
  ball_2.movimiento();

  ball_1.mostrar(); 
  ball_2.mostrar();
  
  ball_1.collision();
  ball_2.collision();
  

  let d=dist(ball_1.pos.x,ball_1.pos.y,ball_2.pos.x,ball_2.pos.y);
  if(d<=ball_1.radio+ball_2.radio){
  inelasticballscollision();
  }
}

let ball = function(_mass, _rad, _pos, _vel){
  this.mass = _mass;
  this.radio = _rad;
  this.pos = _pos;
  this.vel = _vel;

  this.mostrar = function() {
    noStroke(); //elimina el borde negro
    fill(229,190,1);
    ellipse(this.pos.x, this.pos.y, 2*this.radio, 2*this.radio); //en realidad ellipse toma el ancho y alto total de la elipse, en este caso sería el diametro
    stroke(25);
  }

  this.movimiento = function(){
    this.pos.x += this.vel.x*dt;
    this.pos.y += this.vel.y*dt;
  }

  this.collision=function(){
if ((this.pos.x<-240+this.radio) || (this.pos.x>240-this.radio)){
this.vel.x*=-1;
}
if ((this.pos.y<-115+this.radio) || (this.pos.y>115-this.radio)){
  this.vel.y*=-1;
  }

  }

}




inelasticballscollision=function(){

  


let d=dist(ball_1.pos.x,ball_1.pos.y,ball_2.pos.x,ball_2.pos.y);
let u= createVector((ball_1.pos.x-ball_2.pos.x)/(d),(ball_1.pos.y-ball_2.pos.y)/(d));
let s= createVector((ball_1.vel.x-ball_2.vel.x)/(dist(ball_1.vel.x,ball_1.vel.y,ball_2.vel.x,ball_2.vel.y)),(ball_1.vel.y-ball_2.vel.y)/(dist(ball_1.vel.x,ball_1.vel.y,ball_2.vel.x,ball_2.vel.y)));
let kmin=sqrt(1-sq((s.x*u.x)+(s.y*u.y)));
let k=(phi/100)+((1-(phi/100))*kmin);
let A= sq((ball_1.mass+ball_2.mass)/(ball_1.mass*ball_2.mass));
let B=2*((ball_1.mass+ball_2.mass)/(ball_1.mass*ball_2.mass))*(((ball_1.vel.x-ball_2.vel.x)*u.x)+((ball_1.vel.y-ball_2.vel.y)*u.y));
let C=(1-sq(k))*sq(dist(ball_1.vel.x,ball_1.vel.y,ball_2.vel.x,ball_2.vel.y));
let D=sq(B)-4*A*C;
if(D<0){
  
  ball_1.vel.x=0;
  ball_1.vel.y=0;
  ball_2.vel.x=0;
  ball_2.vel.y=0;

}else{
let a1=(-B+sqrt(sq(B)-4*A*C))/(2*A);
let a2=(-B-sqrt(sq(B)-4*A*C))/(2*A); 
let a=max(a1,a2);
 
  
    ball_1.vel.x+=(a/ball_1.mass)*u.x;
    ball_1.vel.y+=(a/ball_1.mass)*u.y;
    ball_2.vel.x-=(a/ball_2.mass)*u.x;
    ball_2.vel.y-=(a/ball_2.mass)*u.y;
  
}
}



let border = function(){
  this.mostrar = function() {
    //noStroke(); //elimina el borde negro
    fill(0,143,57);
    rect(-240,-115,480,230);
    //stroke(100);

  }
}
  
