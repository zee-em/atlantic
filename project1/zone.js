function Zone(name, yminZone, ymaxZone, inhabitants)
{
  this.name = name;
  this.yminZone = yminZone;
  this.ymaxZone = ymaxZone;
  this.inhabitants = inhabitants;
  
  //checks to see if mouseY is in zone
  this.checkZoneAndMouse = function()
  {
    if(mouseY>yminZone && mouseY<ymaxZone)
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
    if(yminZone>height || ymaxZone <0)
    {
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
     ymaxZone+=scrollspeed;
     //print(ymaxZone);
     yminZone+=scrollspeed;
     //print(yminZone);
     //print("hello up");
  }
  
  //shifts zone down when scrolling
  this.downZone = function()
  {
     ymaxZone-=scrollspeed;
     yminZone-=scrollspeed;
     //print("hello down");
  }
}