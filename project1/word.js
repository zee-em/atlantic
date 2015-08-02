function Word(x,y, size, xsp, ysp, thecolor, ymin, ymax, word, lineref, wordpos)
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
  this.lineref = lineref;
  this.wordpos = wordpos;
  this.isHooked;
  isHooked = false;
  
  this.show = function()
  {
    fill(thecolor);
    //textSize(size);
    text(word,x,y);
  }
  
  // move the circle, keep in bounds
  this.move = function()
  {
    if(isHooked === true)
    {
      x=getMouseX();
      y=getMouseY();
    }
    else
    {
     y+=ysp;
     x+=xsp;
     if(y>ymax || y<ymin)
     {
      ysp= ysp*-1;
      }
    
      if(x>width+10)
      {
        x = -10;
        x+=xsp;
      } 
     
     if(x<-10)
      {
       x = width+10;
      }
    }
  }
  
  //update scroll and move 
  this.upScroll = function()
  {
     y+=scrollspeed;
     ymax+=scrollspeed;
     ymin+=scrollspeed;
  }
  
  this.downScroll = function()
  {
     y-=scrollspeed;
     ymax-=scrollspeed;
     ymin-=scrollspeed;
  }
  
  //check to see if we've hooked a word
  this.checkHook = function()
  {
    if (mouseX >= x && mouseX <= x+textWidth(word) && mouseY >= y && mouseY <= y+textH) 
    {
      thecolor = color(255,0,0);
      isHooked = true;
      word = "HOOKED"
    }
  }
}