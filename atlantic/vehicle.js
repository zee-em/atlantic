// Based on Shiffman's vehicle examples http://natureofcode.com
// Vehicle object AKA word object

//add parameters: lineref, posref
//added parameters; r, maxspeed, maxforce

function Vehicle(x, y, yMin, yMax, r, maxspeed, maxforce, word,lineref, posref) {
  // All the usual stuff
  this.position = createVector(x, y);
  this.r = r;
  this.maxspeed = maxspeed;    // Maximum speed
  this.maxforce = maxforce;  // Maximum steering force
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, 0);
  this.yMin = yMin;
  this.yMax = yMax;
  this.word = word;
  this.isHooked = false;
  this.lineref = lineref;
  this.posref = posref;
  this.hookedTargetX;
  this.hookedTargetY;
  this.isPointWord = false;
  this.origSpeed = maxspeed;
  this.origForce = maxforce;
  this.arrived = false;

  this.applyBehaviors = function(vehicles, x, y) {
     
     var separateForce = this.separate(vehicles);
     var seekForce = this.seek(createVector(x, y));
     
     separateForce.mult(1);
     seekForce.mult(1);
     
     this.applyForce(separateForce);
     this.applyForce(seekForce); 
  }

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // Separation
  // Method checks for nearby vehicles and steers away
  this.separate = function(vehicles) {
    var desiredseparation = 150;
    var sum = createVector();
    var count = 0;
    // For every vehicle in the system, check if it's too close
    for (var i = 0; i < vehicles.length; i++) {
      var d = p5.Vector.dist(this.position, vehicles[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.position, vehicles[i].position);
        diff.normalize();
        diff.div(d);        // Weight by distance
        sum.add(diff);
        count++;            // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      sum.div(count);
      // Our desired vector is the average scaled to maximum speed
      sum.normalize();
      sum.mult(this.maxspeed);
      // Implement Reynolds: Steering = Desired - Velocity
      sum.sub(this.velocity);
      sum.limit(this.maxforce);
    }
    return sum;
  }

      // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
  this.seek = function(target) {
    var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
    
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force    
    return steer;
  }

  // Method to update location
  this.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  this.show = function() {
    //a variable that shows the distance
    noStroke();
    if(this.isHooked)
    {
       fill(0,255,0);
    }
    else
    {
       fill(255);
    }
    var distMouse = dist(mouseX, mouseY, mouseX,this.position.y);
    //if the vehicle is hooked and not near the mouse, we can rotate it towards the mouse
    if(this.isHooked === true && distMouse > 100)
    {
      this.arrived = true;
      var theta = this.velocity.heading();
      //print("angle is " +theta);
      push();
      translate(this.position.x,this.position.y);
      rotate(theta) + radians(90);
      textSize(r);
      text(word,0,0);
      pop();
    }
    else
    {
      textSize(r);
      text(word,this.position.x,this.position.y);
    }
  }

  // Wraparound
  this.borders = function() 
  {
    
    //this resets obj to wrap, and makes sure that it appears offscreen
    //if x is less than 0 minus the size of the object, then set x to be the width plus the obj size 
    if (this.position.x < -this.r) this.position.x = width+this.r;
    // if x is greater than the width plus obj size, set x to be 0 minus the obj size
    if (this.position.x >  width+this.r) this.position.x = -this.r;
    
    //same as above, but using variables now
    if (this.position.y < this.yMin-this.r) this.position.y = this.getYMax()+this.r;
    if (this.position.y > this.yMax+this.r) this.position.y = this.getYMin()-this.r;
    
  }

 this.bordersXOnly = function() 
  {
    
    //this resets obj to wrap, and makes sure that it appears offscreen
    //if x is less than 0 minus the size of the object, then set x to be the width plus the obj size 
    if (this.position.x < -this.r) this.position.x = width+this.r;
    // if x is greater than the width plus obj size, set x to be 0 minus the obj size
    if (this.position.x >  width+this.r) this.position.x = -this.r;
  }
  
 this.getYMin = function()
 {
   return this.yMin;
 }
 
 this.getYMax = function()
 {
   return this.yMax;
 }
 
  this.getWordWidth = function()
 {
   return textWidth(this.word);
 }
 
  this.getWordSize = function()
 {
   return this.r;
 }
 
   this.getLineref = function()
 {
   return this.lineref;
 }
 
   this.getPosref = function()
 {
   return this.posref;
 }
 
 this.getOrgiSpeed = function()
 {
   return this.origSpeed;
 }
 
 this.getOrigForce = function()
 {
   return this.origForce;
 }
 
 this.resetMaxforce = function()
  {
    this.maxforce = this.getOrigForce();
  }
  
  this.resetMaxspeed = function()
  {
    this.maxspeed = this.getOrigSpeed();
  }
      
 this.setYDown = function(val)
 {
   this.yMax+=val;
   this.yMin+=val;
   this.position.y+=val;
 }

 this.setYUp = function(val)
 {
   this.yMax-=val;
   this.yMin-=val;
   this.position.y-=val;
 }
 
 this.getArrived = function()
 {
   return this.arrived;
 }
 
  this.checkHook = function()
  {
    if (mouseX >= this.position.x && mouseX <= this.position.x+textWidth(this.word) && mouseY >= this.position.y-this.r && mouseY <= this.position.y && this.isHooked === false) 
    {
      print("hooked!");
      //word = "HOOKED";
      this.isHooked = true;
      return true;
      //print("isHooked " + isHooked + " for " + word);
      
    }
  }
  
  //unHook a word
  this.unHook = function()
  {
      this.isHooked = false;
      this.isPointWord = false;
      this.arrived = false;
      // this.resetMaxforce();
      // this.resetMaxspeed();
  }
  
  //hook a word
  this.hook = function()
  {
      this.isHooked = true;
  }
  
  //get the target vector for any hooked word
  this.getHookedTargetX = function()
  {
      return this.hookedTargetX;
  }
  
  this.getHookedTargetY = function()
  {
      return this.hookedTargetY;
  }
  
  this.setHookedTarget = function(x, y)
  {
    this.hookedTargetX = x;
    this.hookedTargetY = y;
  }
  
   this.makePointWord = function(mf)
  {
    this.isPointWord = true;
  }
  
   this.resetPointWord = function(mf)
  {
    this.isPointWord = false;
  }
  
  this.setMaxforce = function(mf)
  {
    this.maxforce = mf;
  }
  
  this.setMaxspeed = function(ms)
  {
    this.maxspeed = ms;
  }

}




