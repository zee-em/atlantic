function Attractor(waveX, waveY, theta, thetaVel, amp, yOffset, seekForceM, sepForceM, sepVal)
{
  
  this.waveX = waveX;
  this.waveY = waveY;
  this.theta = theta; //0 angular velocity
  this.thetaVel = thetaVel; // speed of wave
  this.amp = amp; //60 wave height
  //var waveOn = true; // show wave
  this.yOffset =  yOffset//180;
  this.seekForceM = seekForceM; //1
  this.sepForceM = sepForceM;  //1
  this.sepVal = sepVal; //140
  
  this.upScroll = function()
  {
     this.yOffset+=scrollspeed;
  }
  
  this.downScroll = function()
  {
     this.yOffset-=scrollspeed;
  }
  
  this.wave = function()
  {
    //this updates the Y and adds offset to center it in screen
    this.theta += this.thetaVel;
    this.waveY = sin(this.theta) * this.amp;
    this.waveY = this.waveY + this.yOffset;
    
    // this turns off / on the marker of attraction
    fill(255);
    noStroke();
    ellipse(this.waveX, this.waveY, 10, 10); // "current" test marker
  }
  
  this.getTargetVector = function()
  {
     var targetVector = createVector(this.waveX, this.waveY);
     return targetVector;
  }
  
  this.getSepForceM = function()
  {
     return this.sepForceM;
  }
  
  this.getSeekForceM = function()
  {
     return this.seekForceM;
  }
  
  this.getSepVal = function()
  {
     return this.sepVal;
  }
  
}