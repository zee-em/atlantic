function seaWord(position, velocity, acceleration, topspeed, size, thecolor, ymin, ymax, word, lineref, wordpos, isHooked)
 {
  
  this.position = position;
  this.size = size;
  this.velocity = velocity;
  this.acceleration = acceleration;
  this.topspeed = topspeed;
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
  
  

  this.move = function() {
    position.add(velocity);
    velocity.add(acceleration);
    velocity.limit(topspeed);
    print("moving!");
  }

 this.show = function()
  {
    fill(thecolor);
    //textSize(size);
    text(word,position.x,position.y);
  }
  


  this.checkEdges = function() 
  {

    if (position.x > width+10) 
    {
      position.x = -10;
    } 
    else if (position.x < -10) 
    {
      position.x = width+10;
    }

    if (position.y > ymax) 
    {
      velocity.y *= -1;
      print("we are switching the y velocity " + velocity.y);
    } 
    else if (position.y < ymin)
    {
      velocity.y *= -1;
      print("we are switching the y velocity " + velocity.y);
    }
  }
  
  //these functions update the bounds 
  this.upScroll = function()
  {
     position.y+=scrollspeed;
     ymax+=scrollspeed;
     ymin+=scrollspeed;
  }
  
  this.downScroll = function()
  {
     position.y-=scrollspeed;
     ymax-=scrollspeed;
     ymin-=scrollspeed;
  }
  
  //check to see if we've hooked a word
  this.checkHook = function()
  {
    if (mouseX >= position.x && mouseX <= position.x+textWidth(word) && mouseY >= position.y && mouseY <= position.y && isHooked === false) 
    {
      thecolor = color(0,255,0);
      isHooked = true;
      return true;
      // print("isHooked " + isHooked + " for " + word);
      // word = "HOOKED";
    }
  }
}
