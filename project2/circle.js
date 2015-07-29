function Circle(x,y, size, xsp, ysp, thecolor)
{
  this.x = x;
  this.y = y;
  this.size;
  this.xsp = xsp;
  this.ysp = xsp;
  this.thecolor = thecolor;
  // Override the display method
  this.show = function()
  {
    fill(thecolor);
    ellipse(x,y,size,size);
  }
  
  this.move = function()
  {
    //y+=ysp;
    x+=xsp;
    
    // if(y>height-100 || y<200)
    // {
    //   ysp= ysp*-1;
    //   }
    
    if(x>width || x<0)
    {
      xsp= xsp*-1;
    } 
  }
  
  this.upScroll = function()
  {
     y+=scrollspeed;
     this.move();
     print("hello up");
  }
  
  this.downScroll = function()
  {
     y-=scrollspeed;
     this.move();
     print("hello down");
  }
}