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
  maxforce = random(0.01,1);
  
  

  this.move = function() {
    //print(maxforce);
    velocity.add(acceleration);
    velocity.limit(topspeed);
    position.add(velocity);
    //print("moving!");
    acceleration.mult(0);
  }

  
 this.applyForce = function (force) {
    acceleration.add(force);
  }
  
 this.seek = function(target) 
 {
  var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Scale to maximum speed
  desired.setMag(this.topspeed);
  // Steering = Desired minus velocity
  var steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  this.applyForce(steer);
  }

  this.show = function()
  {
    fill(thecolor);
    // var theta = this.velocity.heading() + radians(90);
    // push();
    // translate(this.position.x,this.position.y);
    // rotate(theta);
    text(word,position.x,position.y);
    //pop();
  }
  
  this.checkEdges = function() 
  {

    if (position.x > width+10) 
    {
      position.x = -10;
    } 
    if (position.x < -10) 
    {
      position.x = width+10;
    }

    if (position.y >= ymax) 
    {
      position.y = ymax;
      //velocity.y = velocity.y * -1;
      //acceleration.y = acceleration.y*-1;
      //print("we are switching the y velocity " + velocity.y);
    } 
    if (position.y <= ymin)
    {
      position.y = ymin;
      // velocity.y = velocity.y * -1;
      // acceleration.y = acceleration.y*-1;
      //print("we are switching the y velocity " + velocity.y);
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
