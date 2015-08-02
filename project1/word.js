function Word(x,y, size, xsp, ysp, thecolor, ymin, ymax, word, lineref, wordpos, isHooked)
{
  
  this.x = x;
  this.y = y;
  this.size;
  //x and y spped
  this.xsp = xsp;
  this.ysp = xsp;
  //color
  this.thecolor = thecolor;
  //zone limits
  this.ymin = ymin;
  this.ymax = ymax;
  //word
  this.word = word;
  //line reference
  this.lineref = lineref;
  //location in line
  this.wordpos = wordpos;
  this.isHooked = isHooked;
  
  this.show = function()
  {
    fill(thecolor);
    //textSize(size);
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
      return true;
      
      // isHooked = true;
      // print("isHooked " + isHooked + " for " + word);
      // word = "HOOKED";
    }
  }
}