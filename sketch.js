// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Reference to physics world
var physics;
//array to store particle-words
var words =[];
var typesize =18;


//updated x and ys for vector
var currentX = 20;
var currentY = 20;

//array holding the input text to add to particle-words
var inputText = ["call", "me", "ishmael"];
var parts = ["vb", "n", "np"];


function setup() {
  createCanvas(840,560);
  textSize(typesize);
  noStroke();
  // Initialize the physics
  physics=new VerletPhysics2D();
  physics.addBehavior(new GravityBehavior(new Vec2D(0,0.5)));

  // Set the world's bounding box
  physics.setWorldBounds(new Rect(0,0,width,height));
  
  //loop to create particle-words using input text
  for(var i = 0; i<inputText.length; i++)
  {
  // Make a particle
  words[i] = new Particle(new Vec2D(currentX,currentY),inputText[i]);
  words[i].lock();
  physics.addParticle(words[i]);
  //add particle-word to array so we can get them out later to display

  //update the x and y postions
  currentX+=textWidth(inputText[i])+typesize;
  //currentY=
  }

}

function draw() {

  // Update the physics world
  physics.update();
  background(110,207,246);

  //step through the array to get the particles out for display
  for(var i = 0; i<words.length; i++)
  {
    words[i].display();
  }

  if(mouseIsPressed)
  {
   for(i = 0; i<words.length; i++)
    {
       words[i].unlock();
    }
  }    
}




