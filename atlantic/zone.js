function Zone(yMin, yMax, attractor, vehicles)
{
  this.yMin = yMin;
  this.yMax = yMax;
  this.attractor = attractor;
  this.vehicles = vehicles;
  
  this.showZone = function()
  {
    stroke(255,0,0);
    line(0,this.yMin,width,this.yMin);
    line(0,this.yMax,width,this.yMax);
  }
  
  this.setYDown = function(val)
  {
   //print("here!");
   this.yMax+=val;
   this.yMin+=val;
  }

 this.setYUp = function(val)
  {
   this.yMax-=val;
   this.yMin-=val;
  }
  
 this.getYMin = function()
 {
   return this.yMin;
 }
 
 this.getYMax = function()
 {
   return this.yMax;
 }
  
 this.checkZoneAndMouse = function()
  {
    if(mouseY > this.yMin && mouseY < this.yMax)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}