function Zone(name, yMin, yMax, vehicles, attractor)
{
  this.name = name;
  this.yMin = yMin;
  this.yMax = yMax;
  this.vehicles = vehicles;
  this.attractor = attractor;
  
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
  
this.testToDisplay = function()
  {
    if(this.yMin > height || this.yMax < 0)
    {
      //print(this.name + " off screen, won't display and yMin is" + yminZone);
      
      return false;
    }
    else
    {
      return true;
    }    
  }
}