let Charge=function(_rad,_pos){
  this.rad=_rad;
  this.pos=_pos;
  this.trayectoria=[];
 
  this.mostrar=function(){
    noStroke();
    fill(40);
    image(img,this.pos.x,this.pos.y,20,20);
    imageMode(CENTER);
    //ellipse(this.pos.x,this.pos.y,this.rad,this.rad);
   
    stroke(40);
    strokeWeight(3);
    for(let i=0;i<this.trayectoria.length-2;i++){                   line(this.trayectoria[i].x,this.trayectoria[i].y,this.trayectoria[i+1].x,this.trayectoria[i+1].y);
  }
  }
 
  this.movimientoXY=function(){
   
    r_123=createVector(r0.x+v_123_0.x*t+(q/(2*m))*E_123.x*t*t,r0.y+(E_123.y/BB)*t-(m/(q*BB))*((E_123.y/BB)+v_123_0.z)*cos((q/m)*BB*t)+(m/(q*BB))*(v_123_0.z-(E_123.y/BB))+(m/(q*BB))*(v_123_0.y-(E_123.z/BB))*sin((q/m)*BB*t),r0.z-(E_123.y/BB)*t+(m/(q*BB))*(v_123_0.z+(E_123.y/BB))*sin((q/m)*BB*t)-(m/(q*BB))*(v_123_0.y-(E_123.z/BB))+(m/(q*BB))*(v_123_0.y-(E_123.z/BB))*cos((q/m)*BB*t));
    r=createVector(r_123.x*costheta-r_123.y*n3*sintheta+r_123.z*n2*sintheta,r_123.x*n3*sintheta+r_123.y*costheta+r_123.y*n2*n2*(1-costheta)+r_123.z*n2*n3*(1-costheta),-r_123.x*n2*sintheta+r_123.y*n2*n3*(1-costheta)+r_123.z*costheta+r_123.z*n3*n3*(1-costheta));
    this.pos.x=r.x;
    this.pos.y=r.y;
    this.trayectoria.push(this.pos.copy());
    if(this.trayectoria.length>200){
      this.trayectoria.splice(0,1);
    }
    t+=dt;
  }
 
  this.movimientoXZ=function(){
   
    r_123=createVector(r0.x+v_123_0.x*t+(q/(2*m))*E_123.x*t*t,r0.y+(E_123.y/BB)*t-(m/(q*BB))*((E_123.y/BB)+v_123_0.z)*cos((q/m)*BB*t)+(m/(q*BB))*(v_123_0.z-(E_123.y/BB))+(m/(q*BB))*(v_123_0.y-(E_123.z/BB))*sin((q/m)*BB*t),r0.z-(E_123.y/BB)*t+(m/(q*BB))*(v_123_0.z+(E_123.y/BB))*sin((q/m)*BB*t)-(m/(q*BB))*(v_123_0.y-(E_123.z/BB))+(m/(q*BB))*(v_123_0.y-(E_123.z/BB))*cos((q/m)*BB*t));
    r=createVector(r_123.x*costheta-r_123.y*n3*sintheta+r_123.z*n2*sintheta,r_123.x*n3*sintheta+r_123.y*costheta+r_123.y*n2*n2*(1-costheta)+r_123.z*n2*n3*(1-costheta),-r_123.x*n2*sintheta+r_123.y*n2*n3*(1-costheta)+r_123.z*costheta+r_123.z*n3*n3*(1-costheta));
    this.pos.x=r.x;
    this.pos.y=r.z;
    this.trayectoria.push(this.pos.copy());
    if(this.trayectoria.length>200){
      this.trayectoria.splice(0,1);
    }
    t+=dt;
  }
 
  this.movimientoYZ=function(){
   
    r_123=createVector(r0.x+v_123_0.x*t+(q/(2*m))*E_123.x*t*t,r0.y+(E_123.y/BB)*t-(m/(q*BB))*((E_123.y/BB)+v_123_0.z)*cos((q/m)*BB*t)+(m/(q*BB))*(v_123_0.z-(E_123.y/BB))+(m/(q*BB))*(v_123_0.y-(E_123.z/BB))*sin((q/m)*BB*t),r0.z-(E_123.y/BB)*t+(m/(q*BB))*(v_123_0.z+(E_123.y/BB))*sin((q/m)*BB*t)-(m/(q*BB))*(v_123_0.y-(E_123.z/BB))+(m/(q*BB))*(v_123_0.y-(E_123.z/BB))*cos((q/m)*BB*t));
    r=createVector(r_123.x*costheta-r_123.y*n3*sintheta+r_123.z*n2*sintheta,r_123.x*n3*sintheta+r_123.y*costheta+r_123.y*n2*n2*(1-costheta)+r_123.z*n2*n3*(1-costheta),-r_123.x*n2*sintheta+r_123.y*n2*n3*(1-costheta)+r_123.z*costheta+r_123.z*n3*n3*(1-costheta));
    this.pos.x=r.y;
    this.pos.y=r.z;
    this.trayectoria.push(this.pos.copy());
    if(this.trayectoria.length>200){
      this.trayectoria.splice(0,1);
    }
    t+=dt;
  }
 
}