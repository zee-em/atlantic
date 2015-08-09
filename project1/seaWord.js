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
  this.maxforce = random(0.01,1);
  

  this.update = function() 
  { 
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    
  }
  
  this.applyBehaviors = function(wordzone, vector, sepForceM, seekForceM, sepVal) 
  {
     
     //creating a force
     var separateForce = this.separate(wordzone, sepVal);
     var seekForce = vector;
     
     separateForce.mult(sepForceM);
     seekForce.mult(seekForceM);
     
     this.applyForce(separateForce);
     this.applyForce(seekForce); 
  }
  
  
  this.updateSeekTarget = function(vector)
  {
    //topSpeed = 5;
    //print("got here in seek");
    //this.seekAndArrive(vector);
    this.velocity.add(acceleration);
    this.velocity.limit(topspeed);
    this.position.add(velocity);
    //print("moving!");
    this.acceleration.mult(0);
  }
  
  this.applyForce = function (force) 
  {
    this.acceleration.add(force);
  }

  this.separate = function(wordzone, sepVal) 
  {
    var desiredseparation = sepVal;
    var sum = createVector();
    var count = 0;
    // For every seaWord in the system, check if it's too close
    for (var i = 0; i < wordzone.length; i++) 
    {
      var d = p5.Vector.dist(this.position, wordzone[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) 
      {
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.position, wordzone[i].position);
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
 
 this.seekAndArrive = function(target) 
 {
    var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
    var d = desired.mag();
    // Scale with arbitrary damping within 100 pixels
    if (d < 80) 
    {
      var m = map(d,0,100,0,this.maxspeed);
      desired.setMag(m);
    } 
    else 
    {
      desired.setMag(this.topspeed);
    }

    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    this.applyForce(steer);
  }

  this.show = function()
  {
    fill(thecolor);
    text(word,position.x,position.y);

  }
  
  this.updateHooked = function()
  {
    if(this.isHooked === true)
    {
      this.isHooked = false;
    }
    else
    {
      this.isHooked = true;
    }
  }
  
  this.changeColor = function()
  {
    if(this.isHooked === true)
    {
      this.thecolor = color(0,255,0);
    }
    else
    {
      this.thecolor = color(255,255,255);
    }
  }
  
  this.checkEdges = function() 
  {
    if(isHooked === true) // WARNING: no "THIS" in use here!!!
    {
      if (position.x > width+10) 
      {
        position.x = -10;
      } 
      if (position.x < -10) 
      {
        
        position.x = width+10;
      }
    }
    
    else
    {
      if (this.position.x > width+10) 
      {
        this.position.x = -10;
      } 
      if (this.position.x < -10) 
      {
        this.position.x = width+10;
      }
      
      if (this.position.y >= this.ymax) 
      {
        //if we use position they wrap
        this.position.y = this.getYMin(); //this.ymin;
       // this.thecolor = color(255,0,0);
        //velocity.y = velocity.y * -1;
        //acceleration.y = acceleration.y*-1;
        //print("we are switching the y velocity " + velocity.y);
      } 
      if (this.position.y <= this.ymin)
      {
         //if we use position they wrap
        this.position.y = this.getYMax(); //this.ymax;
        //velocity.y = velocity.y * -1;
        // acceleration.y = acceleration.y*-1;
        //print("we are switching the y velocity " + velocity.y);
      }
    }  
  }
  
  //these functions update the bounds 
  this.upScroll = function()
  {
     this.position.y+=scrollspeed;
     this.ymax+=scrollspeed;
     this.ymin+=scrollspeed;
  }
  
  this.downScroll = function()
  {
     this.position.y-=scrollspeed;
     this.ymax-=scrollspeed;
     this.ymin-=scrollspeed;
  }
  
  
  //check to see if we've hooked a word
  this.checkHook = function()
  {
    if (mouseX >= this.position.x && mouseX <= this.position.x+textWidth(word) && mouseY >= this.position.y-this.size && mouseY <= this.position.y && this.isHooked === false) 
    {
      print("hooked!");
      //word = "HOOKED";
      return true;
      //print("isHooked " + isHooked + " for " + word);
      
    }
  }
  
  this.getWordPos = function()
  {
    return this.wordpos;
  }
  
  this.getWordWidth = function()
  {
    return textWidth(this.word);
  }
  
   this.getWordSize = function()
  {
    return this.size;
  }
  
  this.getYMin = function()
  {
    return this.ymin;
  }
  
  this.getYMax = function()
  {
    return this.ymax;
  }
}
