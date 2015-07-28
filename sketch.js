// Atlantic 
// using particle system and Toxiclibs physics library to 
// animate text in an ocean-like way

//get particles to move depending on their part of speech
//certain particles only move in certain areas of the screen
//particles have different weights
//bring in a lot more particles (file i/O) (DONE)
//make 2d array to show all particles, bring in text line by line (or sentence by sentence?)(DONE)
//put more space between particles
//make fishing!!

//IDEA: cute splash page
//IDEA: always have the whole text appear as ocean. animate on-screen sections only.
//IDEA: words wiggle on string
//IDEA: at end, spiral sucks all words into void
//IDEA: viewer for re-written text
//IDEA: different sizes for different words

// Reference to physics world
var physics;
//array to store particle-words
var words =[];
var typesize =14;
var allWords = [];


//updated x and ys for vector
var currentX = 20;
var currentY = 20;

//dictionary look-up for parts of speech and vectors or x,y constraints 
var weightDict={};
weightDict["vb"] = .5;
weightDict["n"] = 2;
weightDict["np"] = 3;
var rawText;
var allparts;
var noSpacer = false;
var target = "xx";

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
  for(var i = 0; i<allWords.length; i++)
  {
    for(var j= 0; j<allWords[i].length; j++)
    {
      allWords[i][j].display();
      //print(allWords[i][j].word)
    }
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


function rectTest()
{

  var rect1 =  new Rect(10, 200, 200, 100);
  var rectCon = new RectConstraint(rect1);
  print(rectCon);
  rectCon.setBox(rect1);
  VerletPhysics2D.addConstraintToAll(rectCon, physics.particles);
}

 function keyPressed()
  {
    // if(keyCode === RETURN)
    // {
    //   for(i = 0; i<words.length; i++)
    //   {
    //   words[i].returnHome();
    //   words[i].lock();
    //   }
    // }
    rectTest();
  }



function makeWords()
{
  //loop on the outside to get each line in the program
  for(var i = 0; i<rawText.length; i++)
  {
    //split arrays into lines or sentences, work by line to make particles
    var tempWords = split(trim(rawText[i])," ");
    var tempParts = split(trim(rawText[i])," ");
    print("do the lengths match?")
    print(tempWords.length);
    print(tempParts.length);
    //loop to create particle-words using input text
    for(var j = 0; j<tempWords.length; j++)
    {
      var nextItem;
      //check to see if the next item is punctuation, set boolean to use for spacing
      if(j<tempParts.length-1)//don't go out of bounds with the checking of next thing
      {
        var checker = match(tempParts[j+1],target);
        //print("matching " +tempParts[j+1]);
        //print(target);
        if(checker !== null)//check for punctuation using the part of speech
        //if statment returns match
        {
          noSpacer = true; //we won't put a space after this word
        }
      }  
      // Make a particle
      //print(weightDict[tempParts[i]]);
     var w = new Particle(new Vec2D(currentX,currentY), 5, tempWords[j],tempParts[j]);
      //add particle-word to array so we can get them out later to display
      //lock word in place
      w.lock();
      //add to world
      physics.addParticle(w);
      //update x and y as needed (use boolean here later)
      if(noSpacer===true)
      {
        currentX+=textWidth(tempWords[j]);
      }
      else
      {
        currentX+=textWidth(tempWords[j])+12;
      }
      if(currentX>=width-50)
      {
        //update the x and y postions
        currentX = 20;
        currentY += typesize*1.5
      }
      append(words, w);
    }
    
    // //debug stuff
    // print("LENGTH OF ARRAY NEW ARRAY" + words.length);
    // for(var g= 0; g<words.length; g++)
    // {
    //   print(words[g].word)
    // }
    //add the array to the 2d array
   // print("append the new array, OUTER ARRAY IS");
    append(allWords, words);
   // print(allWords.length)
    
  }
  

}
