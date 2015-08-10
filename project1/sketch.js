//NEXT STEPS
//parts of speech determine zones; create key value pairs DONE
//integrate words, text of full chapter parts of speech determining zones DONE
//automate object creation and storage DONE
//fix scrolling DONE


//implement vectors DONE
//fine tune motions and get 
//create springs thing with hooked words
//implement word mixing (random?)

//add defined data fields for parts (size, color, etc) DO THIS LATER


//improve swimmming behavior
//fix text processing problems
//design page 

var pointWordPos;
var hookedWords = [];
var hookedVal = false;
var isOver = false;
var yval = 200;
var count = 250;
var scrollspeed = 5;
var zones = [];
var textH = 14;
var partsData = [];
var partsList = [];
var rawText = [];
var allParts = [];
var lowEnd;
var scrollPos = 0; // compare against top / bottom to start or stop scroll (starts at top)
var bgColor;
var onScroll = false;
var mouse;

function preload() {
  rawText = loadStrings("assets/words.txt");
  allParts = loadStrings("assets/parts.txt");
  partsList = loadStrings("assets/partslookup.txt");

}


function setup() {
  createCanvas(800, 600);
  noStroke();
  textSize(textH);
  loadZoneDataPts();
  makeWords();

}

function draw() {
  colorMode(HSB, 360, 100, 100, 1);
  var currentlight = map(scrollPos,0,3675,100,0);
  background(221, 100, currentlight);
  mouse = createVector(mouseX, mouseY);
  displayZones();
  fill(255);
  //these are the scroll buttons
  ellipse(100, 100, 25, 25);
  ellipse(100, 300, 25, 25);
  if (mouseIsPressed) 
  {
    onScroll = updateScroll();
  }
  if(hookedWords.length > 0)
  {
    displayHookedWords();
  }
}

function mouseClicked() {
  //only check for words if we weren't pressing to scroll 
  if (onScroll === false && hookedWords.length === 0) {
    checkOverWord();
    print("checking!");
  }
}

function checkOverWord() {
  for (var i = 0; i < zones.length; i++) {
    //find out if zone is even on screen, if not don't bother
    var checkDisplay = zones[i].testToDisplay();
    if (checkDisplay === true) {
      //if the zone is on screen, check if the mouse is in that zone
      var intersectZone = zones[i].checkZoneAndMouse();
      //print("zone intersect " + intersectZone)
      if (intersectZone === true) {
        //then check for a intersection with this set of objects
        for (var j = 0; j < zones[i].inhabitants.length; j++) 
        {
          if (zones[i].inhabitants[j].checkHook() === true) 
          {
            //release the currently hookedLine
            releaseHookedWords();
            print("we did it!!!");
            //reset the array
            print("reset the array it's now " + hookedWords.length);
            //hook the rest of them, but send along the wordpos so we have a decent base
            pointWordPos = zones[i].inhabitants[j].getWordPos();
            hookTheFullLine(zones[i].inhabitants[j].lineref);
            print("we saved this pos " + pointWordPos);
          }
        }
      }
    }
  }
}

function updateScroll() {
  //if we are using the scroll button
  if (overCircle(100, 300, 25) === true && mouseIsPressed && scrollPos < lowEnd) {
    //do something: add to the Y pos of every object to shift down
    for (var i = 0; i < zones.length; i++)
    {
      zones[i].attractor.downScroll();
  
      for (var j = 0; j < zones[i].inhabitants.length; j++) {
        zones[i].inhabitants[j].downScroll();
      }
      //now update the zone y max and min
      zones[i].downZone();
    }
    //we did it!
    scrollPos += scrollspeed;
    //print("scroll: " + scrollPos);
    return true;
  }

  //if we are using the scroll button
  if (overCircle(100, 100, 25) === true && mouseIsPressed && scrollPos > 0) {
    //do something: subtract from the Y pos of every object to shift up
    for (var i = 0; i < zones.length; i++) 
    {
      zones[i].attractor.upScroll();
      
      for (var j = 0; j < zones[i].inhabitants.length; j++) {
        zones[i].inhabitants[j].upScroll();
      }
      //now update the zone y max and min
      zones[i].upZone();
    }
    //we did it! :)
    scrollPos -= scrollspeed;
    //print("scroll: " + scrollPos);
    return true;
  }
  //not on scroll button
  return false;
}

function overCircle(x, y, diameter) {
  disX = x - mouseX;
  disY = y - mouseY;
  if (sqrt(sq(disX) + sq(disY)) < diameter / 2) {
    return true;
  } else {
    return false;
  }
}

function keyPressed()
{
  if(keyCode === RETURN)
  {
    releaseHookedWords();
  }
  return false;
}

function displayHookedWords() 
{
  var currentX = mouseX;
  var newVec = createVector(currentX, mouseY);
  zones[hookedWords[pointWordPos].ipos].inhabitants[hookedWords[pointWordPos].jpos].updateSeekTarget(newVec);
  zones[hookedWords[pointWordPos].ipos].inhabitants[hookedWords[pointWordPos].jpos].checkEdges();
  zones[hookedWords[pointWordPos].ipos].inhabitants[hookedWords[pointWordPos].jpos].show();
  if(pointWordPos > 0)
  {
    for (var i = pointWordPos; i> 0; i--)
    {
      //start with the position of the word you grabbed, and set the seek positions of the others before it
      //word should arrange around the point word 
      currentWidth = zones[hookedWords[i].ipos].inhabitants[hookedWords[i].jpos].getWordWidth();
      currentSize = zones[hookedWords[i].ipos].inhabitants[hookedWords[i].jpos].getWordSize();
      currentX -= currentWidth+currentSize;
      newVec = createVector(currentX, mouseY);
      zones[hookedWords[i-1].ipos].inhabitants[hookedWords[i-1].jpos].updateSeekTarget(newVec);
      zones[hookedWords[i-1].ipos].inhabitants[hookedWords[i-1].jpos].checkEdges();
      zones[hookedWords[i-1].ipos].inhabitants[hookedWords[i-1].jpos].show();
      
    }
  }
  //reset currentX
  currentX = mouseX;
  for (var i = pointWordPos; i< hookedWords.length-1; i++)
  {
      //start with the position of the word you grabbed, and set the seek positions of the others before it
      //word should arrange around the point word 
      currentWidth = zones[hookedWords[i].ipos].inhabitants[hookedWords[i].jpos].getWordWidth();
      currentSize = zones[hookedWords[i].ipos].inhabitants[hookedWords[i].jpos].getWordSize();
      currentX += currentWidth+currentSize;
      newVec = createVector(currentX, mouseY+random(.5,10));
      zones[hookedWords[i+1].ipos].inhabitants[hookedWords[i+1].jpos].updateSeekTarget(newVec);
      zones[hookedWords[i+1].ipos].inhabitants[hookedWords[i+1].jpos].checkEdges();
      zones[hookedWords[i+1].ipos].inhabitants[hookedWords[i+1].jpos].show();
  }
}

function releaseHookedWords()
{
  for (var i = 0; i < hookedWords.length; i++) 
  {
    
    zones[hookedWords[i].ipos].inhabitants[hookedWords[i].jpos].updateHooked();
    zones[hookedWords[i].ipos].inhabitants[hookedWords[i].jpos].changeColor();
  }
  hookedWords = [];
}

function displayZones() {
  for (var i = 0; i < zones.length; i++) 
  {
    //only display objects if the zones are onscreen
    var checkDisplay = zones[i].testToDisplay();
    if (checkDisplay === true) 
    {
      //the zone is on screen so display and move attractor
       zones[i].attractor.wave();
      
      //and move inhabitants
      for (var j = 0; j < zones[i].inhabitants.length; j++) 
      {
        // print("vector " + zones[i].attractor.getTargetVector());
        // print("sepForce " + zones[i].attractor.getSepForceM());
        // print("seekForce " + zones[i].attractor.getSeekForceM());
        // print("sepVal " + zones[i].attractor.getSepVal());
        
        //wordzone, vector, sepForceM, seekForceM, sepForce
        //calling applyBehaviors which is a seaWord function
        // passes in a bunch of parameter
        // zones[i].inhabitants[j].applyBehaviors
        // (
        //   //pass in the zone's array of inhabitants
        //   zones[i].inhabitants, 
        //   //pass in the target vector
        //   zones[i].attractor.getTargetVector(), 
        //   //pass in the multiplier for the separating force
        //   zones[i].attractor.getSepForceM(), 
        //   //pass in the multiplier for the seeking force
        //   zones[i].attractor.getSeekForceM(), 
        //   //passes in the desired seperation value
        //   zones[i].attractor.getSepVal()
        // );
        
        zones[i].inhabitants[j].update();
        zones[i].inhabitants[j].checkEdges();
        zones[i].inhabitants[j].show();
      }
    }
  }
}

function loadZoneDataPts() {
  //use the list of parts to make parts objects
  for (var i = 0; i < partsList.length; i++) {
    var partName = trim(partsList[i]);
    //colorMode(HSB, 360, 100, 100, 1);
    var cl = color(210, 100, (i * 2.6 - 100) * -1);
    colorMode(RGB, 255);
    var cl = color(255, 255, 255);
    
    var attractY = (i * 100) + ((i * 100) +100) / 2; // sets attractor to middle of each zone
    //waveX, waveY, theta, thetaVel, amp, yOffset, seekForceM, sepForceM, sepVal
    var att = new Attractor(width/2, 0, 0, 0.02, 100, attractY, 1, 1, 140);
    var inhabitantsArray = [];
    //use preexisting input here for speeds, etc
    //name, ymin, ymax, size, minspeed, maxspeed,cl
    var thisPart = new Part(partsList[i], i * 100, (i * 100) + 100, i + 10, 5, 5, cl);
    var thisZone = new Zone(partsList[i], i * 100, (i * 100) + 100, inhabitantsArray, att);
    partsData[partsList[i]] = thisPart;
    //partsData["xx"] = obj;
    append(zones, thisZone);
    //this var is the max we can scroll, given the number and width of the zones
    lowEnd = (i * 100 - 25) + 100;
  }
}

function getMouseX() {
  return mouseX;
}

function getMouseY() {
  return mouseY;
}

function hookTheFullLine(lineref) 
{
  for (var i = 0; i < zones.length; i++) {
    for (var j = 0; j < zones[i].inhabitants.length; j++) {
      if (zones[i].inhabitants[j].lineref === lineref) {
        zones[i].inhabitants[j].updateHooked();
        zones[i].inhabitants[j].changeColor();
        //print(i + " is the i value ");
        //print(j + " is the j value ");
        var temploc = new Location(i, j); 
        //the location of the hooked word in the zone array
        //add this location to the hookedWords array so you can get the object later
        hookedWords[zones[i].inhabitants[j].wordpos] = temploc;
        //print(hookedWords.length + "is the length");
      }
    }
  }

  print('Hooked length: ' + hookedWords.length)
}


function makeWords() {
  //print(rawText.length + " " + allParts.length);
  //loop on the outside to get each line in the program
  for (var i = 0; i < rawText.length; i++) {
    //split arrays into lines or sentences, work by line to make particles
    var tempWords = split(trim(rawText[i]), " ");
    var tempParts = split(trim(allParts[i]), " ");
    // print("do the lengths match?")
    // print(tempWords.length);
    //print(tempParts.length);
    //loop to create words using input text
    for (var j = 0; j < tempWords.length; j++) {
      //print(tempParts[j]);
      //print(partsData[tempParts[j]].name);
      var position = createVector(random(1, width), random(partsData[tempParts[j]].ymin, partsData[tempParts[j]].ymax));
      //var vel = createVector(random(partsData[tempParts[j]].minspeed, partsData[tempParts[j]].maxspeed), random(0, 1));
      var vel = createVector(0,0);
      //var acc = p5.Vector.random2D();
      var acc = createVector(0,0);
      //location, size, xsp, ysp, thecolor, ymin, ymax, word
      var w = new seaWord(
        //x,y
        position,
        //speed 
        vel,
        //acceleration
        acc,
        //topspeed
        random(partsData[tempParts[j]].minspeed,partsData[tempParts[j]].maxspeed),
        //size
        partsData[tempParts[j]].size,
        partsData[tempParts[j]].cl,
        //y bounds
        partsData[tempParts[j]].ymin, partsData[tempParts[j]].ymax,
        //word,  lineref, wordpos
        tempWords[j], i, j,
        hookedVal); //end constructor
      //add obj to the appropriate zone array
      for (var k = 0; k < zones.length; k++) {
        //print("is zones name " +zones[k].name);
        //print("is the current part " +tempParts[j]);
        if (tempParts[j] === zones[k].name) {
          append(zones[k].inhabitants, w);
          //print("got one!")
        }
      }

    }
  }
}