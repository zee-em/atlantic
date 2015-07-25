// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Child class constructor
function Particle(position, word) {
  VerletParticle2D.call(this,position);

  this.word = word;
  // Override the display method
  this.display = function(){
    //fill(127)
    textSize(18);
    text(word, this.x,this.y);
  }
}

// Inherit from the parent class
Particle.prototype = Object.create(VerletParticle2D.prototype);
Particle.prototype.constructor = Particle;

