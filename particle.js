// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Child class constructor
function Particle(position, word, parts) {
  VerletParticle2D.call(this,position);

  this.word = word;
  this.parts = parts;
  var origX = position.x;
  var origY = position.y;
  // Override the display method
  this.display = function()
  {
    //fill(127)
    text(word, this.x,this.y);
  }
  
  this.returnHome = function()
  {
    this.x = origX;
    this.y = origY;
  }

  
}

 


// Inherit from the parent class
Particle.prototype = Object.create(VerletParticle2D.prototype);
Particle.prototype.constructor = Particle;

