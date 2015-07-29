function Circle(x,y, size, xsp, ysp, thecolor, ymin, ymax)
{
  this.x = x;
  this.y = y;
  this.size;
  this.xsp = xsp;
  this.ysp = xsp;
  this.thecolor = thecolor;
  this.ymin = ymin;
  this.ymax = ymax;
  
  // Override the display method
  this.show = function()
  {
    fill(thecolor);
    text("herp",x,y);
  }
  
  this.move = function()
  {
    y+=ysp;
    x+=xsp;
    
    if(y>ymax || y<ymin)
    {
      ysp= ysp*-1;
    }
    
    if(x>width || x<0)
    {
      xsp= xsp*-1;
    } 
  }
  
  this.upScroll = function()
  {
     y+=scrollspeed;
     ymax+=scrollspeed;
     ymin+=scrollspeed;
     this.move();
    // print("hello up");
  }
  
  this.downScroll = function()
  {
     y-=scrollspeed;
     ymax-=scrollspeed;
     ymin-=scrollspeed;
     this.move();
     //print("hello down");
  }
}