function Zone(name, yminZone, ymaxZone, inhabitants, attractor)
{
  this.name = name;
  this.yminZone = yminZone;
  this.ymaxZone = ymaxZone;
  this.inhabitants = inhabitants;
  this.attractor = attractor;
  
  //checks to see if mouseY is in zone
  this.checkZoneAndMouse = function()
  {
    if(mouseY > this.yminZone && mouseY < this.ymaxZone)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  
  //checks to see if the Zone is onscreen 
  this.testToDisplay = function()
  {
    if(this.yminZone > height || this.ymaxZone < 0)
    {
      //print(this.name + " off screen, won't display and yMin is" + yminZone);
      
      return false;
    }
    else
    {
      return true;
    }    
  }
  
  //shifts zone up when scrolling
  this.upZone = function()
  {
     this.ymaxZone+=scrollspeed;
     //print(ymaxZone);
     this.yminZone+=scrollspeed;
     //print(yminZone);
     //print("hello up");
  }
  
  //shifts zone down when scrolling
  this.downZone = function()
  {
     this.ymaxZone-=scrollspeed;
     this.yminZone-=scrollspeed;
     //print("hello down");
  }
}