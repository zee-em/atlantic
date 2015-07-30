function Circle(x,y, size, xsp, ysp, thecolor, ymin, ymax, word)
{
  this.x = x;
  this.y = y;
  this.size;
  this.xsp = xsp;
  this.ysp = xsp;
  this.thecolor = thecolor;
  this.ymin = ymin;
  this.ymax = ymax;
  this.word = word;
  
  // Override the display method
  this.show = function()
  {
    fill(thecolor);
    text(word,x,y);
  }
  
  // move the circle, keep in bounds
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
  
  //update scroll and move everybody
  this.upScroll = function()
  {
     y+=scrollspeed;
     ymax+=scrollspeed;
     ymin+=scrollspeed;
     //this.move();
    // print("hello up");
  }
  
  this.downScroll = function()
  {
     y-=scrollspeed;
     ymax-=scrollspeed;
     ymin-=scrollspeed;
     //this.move();
     //print("hello down");
  }
  
  //check to see if we've hooked a word
  this.checkHook = function()
  {
    if (mouseX >= x && mouseX <= x+textWidth(word) && mouseY >= y && mouseY <= y+textH) 
    {
      word = "HOOKED"
      return true;
    }
    else 
    {
      return false;
    }
    
  }
}