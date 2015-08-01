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
  
  // Override the display method
  this.show = function()
  {
    fill(thecolor);
    text(word,x,y);
  }
  
  // move the circle, keep in bounds
  this.move = function()
  {
    if(isHooked)
    {
      //do something different for this word
      
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
  
  //update scroll and move everybody
  this.upScroll = function()
  {
     y+=scrollspeed;
     ymax+=scrollspeed;
     ymin+=scrollspeed;
     //this.move();
    // print("sup up");
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
      //isHooked = true;
      theColor = color(255,0,0);
      return true;
    }
    else 
    {
      return false;
    }
    
  }
}