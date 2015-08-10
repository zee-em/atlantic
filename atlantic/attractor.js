function Attractor(waveX, waveY, yOffset, theta, thetaMod, amp)
{

  this.waveX = waveX;
  this.waveY = waveY;
  this.yOffset = yOffset;
  this.theta = theta; // angular velocity
  this.thetaMod = thetaMod; //val to add to theta
  this.amp = amp; // wave height
  //this.waveOn = true; // show wave
  
  
  this.wave = function()
  {
    // this updates the Y and adds offset to center it in screen
    this.theta += this.thetaMod;
    this.waveY = sin(this.theta) * this.amp;
    this.waveY = this.waveY + this.yOffset;
  }
  
  this.showWave = function()
  {
      // this turns off / on the marker of attraction
      fill(255);
      noStroke();
      ellipse(this.waveX, this.waveY, 10, 10); // "current" test marker
      //ellipse(this.waveX, this.waveY+this.yOffset, 10, 10); // "current" test marker
  }
  
  this.getWaveX = function()
  {
    return this.waveX;
  }
  
  
  this.getWaveY = function()
  {
    return this.waveY;
  }
  
  this.setYDown = function(val)
 {
   this.waveY+=val;
   this.yOffset+=val;
 }

 this.setYUp = function(val)
 {
   this.waveY-=val;
   this.yOffset-=val;
 }
}