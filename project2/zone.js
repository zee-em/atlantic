function Zone(ymin, ymax, inhabitants)
{
  this.inhabitants = inhabitants;
  this.ymin = ymin;
  this.ymax = ymax;
  
  this.testToDisplay = function()
  {
    if(ymin>height || ymax <0)
    {
      return false;
    }
    else
    {
      return true;
    }    
  }
  
  this.upZone = function()
  {
     ymax+=scrollspeed;
     ymin+=scrollspeed;
    // print("hello up");
  }
  
  this.downZone = function()
  {
     ymax-=scrollspeed;
     ymin-=scrollspeed;
     //print("hello down");
  }
}