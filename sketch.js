// Atlantic 
// using particle system and Toxiclibs physics library to 
// animate text in an ocean-like way

//get particles to move a bit randomly, depending on their POS
//particles have random weights (DONE)
//bring in a lot more particles (file i/O)


//get words in by line

// Reference to physics world
var physics;
//array to store particle-words
var words =[];
var typesize =14;


//updated x and ys for vector
var currentX = 20;
var currentY = 20;

//array holding the input text to add to particle-words
//var inputText = ["call", "me", "ishmael"];
//var parts = ["vb", "n", "np"];
var weightDict={};
weightDict["vb"] = .5;
weightDict["n"] = 2;
weightDict["np"] = 3;
var rawText;
var allparts;
var noSpacer;

function preload() {
  rawText = loadStrings("assets/words.txt");
  allParts = loadStrings("assets/parts.txt");
}

function setup() {
  createCanvas(800,600);
  textSize(typesize);
  noStroke();
  // Initialize the physics
  physics=new VerletPhysics2D();
  physics.setDrag(0.05);
  physics.addBehavior(new GravityBehavior(new Vec2D(0,0.15)));
// Set the world's bounding box
  physics.setWorldBounds(new Rect(0,0,width,height));
  makeWords();
}

function draw() {

  // Update the physics world
  physics.update();
  background(175,206,219);

  //step through the array to get the particles out for display
  for(var i = 0; i<words.length; i++)
  {
    words[i].display();
  }


  //if mouse is pressed, make particles fall
  if(mouseIsPressed)
  {
   for(i = 0; i<words.length; i++)
    {
       words[i].unlock();
       // add a negative attraction force field around the new particle
       physics.addBehavior(new AttractionBehavior(words[i], 20, -1.2, 0.01));
    }
  } 
  
}

 function keyPressed()
  {
    if(keyCode === RETURN)
    {
      for(i = 0; i<words.length; i++)
      {
       words[i].returnHome();
       words[i].lock();
      }
    }
  }



function makeWords()
{
  //loop on the outside to get each line in the program
  for(var i = 0; i<rawText.length; i++)
  {
  //split arrays into lines or sentences, work by line to make particles
    var tempWords = split(rawText[i]," ");
    var tempParts = split(allParts[i]," ");
  //loop to create particle-words using input text
  for(var j = 0; j<tempWords.length; j++)
  {
  var nextItem;
  //check to see if the next item is punctuation, set boolean to use for spacing
  if(j<tempWords.length-1)//don't go out of bounds with the checking of next thing
  {
    var checker = match(allParts[j+1],"xx");
    if(checker !== null)//check for punctuation using the part of speech
    {
     noSpacer = true; //we won't put a space after this word
    }
  } 
 
  // Make a particle
  //print(weightDict[tempParts[i]]);
  words[j] = new Particle(new Vec2D(currentX,currentY),.75, tempWords[j],tempParts[j]);
   //add particle-word to array so we can get them out later to display
  print(words[j]);
  words[j].lock();
  physics.addParticle(words[j]);
  currentX+=textWidth(tempWords[j])+typesize/2;
  if(currentX>=width-50)
  {
    currentX = 20;
  }
  //update the x and y postions
  
  }

  }
}
