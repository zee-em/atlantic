//fix motion along y for anchor word DONE
//fix x wrap for words DONE
//divide zones properly

//how can we swap and save out?

//then view the new text

//add flocking?
//add noise to motion? wiggle

// A list of vehicles aka words
var vehcs = [];

//a list of zones
var zones = [];
// attractor object
var att;

//variables to hold string input
var partsList;
var rawText;
var allParts;
var partsData = [];
var hookedWords = [];
var pointWordPosVar;

//intial yMin and yMax for the test
var yMin = 200;
var yMax = 500;
//intial attractor x and y for the text 
var attX = 700;
var attY = 0;

//variable for text zone
var zone;

//variable to keep track of currentMaxScroll and currentMinScroll so we know where the frame is
var currentMaxScroll;
var currentMinScroll;
var scrollVal = 4;

function preload() {
  rawText = loadStrings("assets/words.txt");
  allParts = loadStrings("assets/parts.txt");
  partsList = loadStrings("assets/partslookup.txt");
}

function setup() {
  frameRate(30);
  //print("HELP COMPUTER!!!")
  textSize(18);
  createCanvas(640, 480);
  currentMaxScroll = height;
  currentMinScroll = 0;
  loadZoneDataPts();
  makeWords();
  for (var h = 0; h < zones.length; h++) {
  }
}

function draw() {
  //print(frameRate());
  background(50);
  for (var h = 0; h < zones.length; h++) {
    var checkDisplay = zones[h].testToDisplay();
    if (checkDisplay === true) 
    {
      for(var i = 0; i < zones[h].vehicles.length; i++ )
      {
       if (zones[h].vehicles[i].isHooked === false)
       {
          //if not hooked, seek local attractor
          zones[h].vehicles[i].applyBehaviors(zones[h].vehicles, zones[h].attractor.getWaveX(), zones[h].attractor.getWaveY());
          //update and maintain zone borders
          zones[h].vehicles[i].update();
          zones[h].vehicles[i].borders();
          zones[h].vehicles[i].show();
       }
      }
      zones[h].attractor.wave();
      //FYI if we show wave w/o calling wave, marker will not be drawn with y offset 
      zones[h].attractor.showWave();
      zones[h].showZone();
    } 
    for (var i = 0; i < zones[h].vehicles.length; i++)
    {
      //check if an object is hooked
      if (zones[h].vehicles[i].isHooked) 
      {
        setAllHookedTargets(pointWordPosVar);
        //if hooked, seek target
        zones[h].vehicles[i].applyBehaviors(zones[h].vehicles, zones[h].vehicles[i].getHookedTargetX(), zones[h].vehicles[i].getHookedTargetY());
        zones[h].vehicles[i].update();
        zones[h].vehicles[i].bordersXOnly();//update, but don't check borders along Y
        zones[h].vehicles[i].show();
      }
    }  
  }
}

function mouseClicked() {
  for (var h = 0; h < zones.length; h++) {
    //check to see if the zone and mouse intersect
    var checkDisplay = zones[h].testToDisplay();
    if (checkDisplay === true)
    {
      if (zones[h].checkZoneAndMouse()) {
        for (var i = 0; i < zones[h].vehicles.length; i++) {
          //check to see if the word and mouse intersect, if so, it's hooked!
          if (zones[h].vehicles[i].checkHook()) {
            //make this word the point word
            zones[h].vehicles[i].makePointWord();
            print(zones[h].vehicles[i].isPointWord)
            //hook the other words
            pointWordPosVar = zones[h].vehicles[i].getPosref();
            hookTheFullLine(zones[h].vehicles[i].getLineref(), zones[h].vehicles[i].getPosref());
          }
        }
      }
    }  
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    for (var h = 0; h < zones.length; h++) {
      //scroll up, and bring up the zone, attractor, and each object
      //update current max and min scroll 
      zones[h].setYUp(scrollVal);
      zones[h].attractor.setYUp(scrollVal);
      for (var i = 0; i < zones[h].vehicles.length; i++) {
        zones[h].vehicles[i].setYUp(scrollVal);
      }
      //update current max and min scroll 
      currentMaxScroll -= scrollVal;
      currentMinScroll -= scrollVal;
    }
  } else if (keyCode === UP_ARROW) {
    for (var h = 0; h < zones.length; h++) {
      //scroll down, and bring down the zone, attractor, and each object
      zones[h].setYDown(scrollVal);
      zones[h].attractor.setYDown(scrollVal);
      for (var i = 0; i < zones[h].vehicles.length; i++) {
        zones[h].vehicles[i].setYDown(scrollVal);
      }
      //update current max and min scroll 
      currentMaxScroll += scrollVal;
      currentMinScroll += scrollVal;
    }
  } else if (keyCode === ENTER) {
    for (var h = 0; h < zones.length; h++) {
      //this will release the vehicles
      for (var i = 0; i < zones[h].vehicles.length; i++) {
        if (zones[h].vehicles[i].isHooked) {
          zones[h].vehicles[i].unHook();
        }
      }
    }
  }

  // print("cMax " + currentMaxScroll);
  // print("cMin " + currentMinScroll);
  return false;
}

//here you save the position of each word in whatever zone array it lives in, so you can access it later 
function hookTheFullLine(lineref, pointWordPos) {
  for (var i = 0; i < zones.length; i++) {
    for (var j = 0; j < zones[i].vehicles.length; j++) {
      if (zones[i].vehicles[j].lineref === lineref) {
        zones[i].vehicles[j].hook();
        var temploc = new Location(i, j);
        //the location of the hooked word in the zone array
        //add this location to the hookedWords array so you can get the object later
        hookedWords[zones[i].vehicles[j].posref] = temploc;
      }
    }
  }
  setAllHookedTargets(pointWordPos);
}

//need to see how point word y is updating here
function setAllHookedTargets(pointWordPos) {
  //print(pointWordPos + "is point word position");
  //go through each item in the hookedWords array and check to see if it's the point word
   for (var i = 0; i < hookedWords.length; i++)
   {
     
     zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].setMaxspeed(random(2,5));
     zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].setMaxforce(random(.05,1));
     if(zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].isPointWord)
     {
       //set the point word to mx, my
       zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].setHookedTarget(mouseX, mouseY);
     }
   }
  var currentX = mouseX;
  if (pointWordPos > 0)
  {
    for (var i = pointWordPos; i > 0; i--) {
      //start with the position of the word you grabbed, and set the seek positions of the others before it
      //word should arrange around the point word 
      var currentWidth = zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].getWordWidth();
      var currentSize = zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].getWordSize();
      //update the x position for the target
      currentX -= currentWidth + currentSize;
      //print("and now current x is " + currentX);
      zones[hookedWords[i - 1].ipos].vehicles[hookedWords[i - 1].jpos].setHookedTarget(currentX, mouseY + random(.5, 25));

    }
  }
  //reset currentX
  currentX = mouseX;
  for (var i = pointWordPos; i < hookedWords.length - 1; i++) {
    //start with the position of the word you grabbed, and set the seek positions of the others after it
    //word should arrange around the point word 
    var currentWidth = zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].getWordWidth();
    var currentSize = zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].getWordSize();
    currentX += currentWidth + currentSize;
    zones[hookedWords[i + 1].ipos].vehicles[hookedWords[i + 1].jpos].setHookedTarget(currentX, mouseY + random(.5, 25));
  }
}

//make parts objects and zone objects according to the list of parts of speech
function loadZoneDataPts() {
  //use the list of parts to make parts objects
  for (var i = 0; i < partsList.length; i++) {
    var partName = trim(partsList[i]);
    //colorMode(HSB, 360, 100, 100, 1);
    //waveX, waveY, yOffset, theta, thetaMod, amp
    var offset = 300;
    var att = new Attractor(width + 10, offset, offset + (i * 100)+ 50, 0, .02, 30);
    var cl = color(210, 100, (i * 2.6 - 100) * -1);
    var inhabitantsArray = [];
    //parts parameters: name, ymin, ymax, size, maxspeed, maxforce, cl
    var thisPart = new Part(partsList[i], i * 100 +offset, offset + (i * 100) + 100, 12, random(.05, 2), .05, cl);
    //zone parameters: name, yMin, yMax, attractor, vehicles
    var thisZone = new Zone(partsList[i], i * 100 +offset, offset + (i * 100) + 100, inhabitantsArray, att);
    //assign this part to the array using key-value pairing
    partsData[partsList[i]] = thisPart;
    //add the zone into the zone aray
    append(zones, thisZone);
    // this var is the max we can scroll, given the number and width of the zones
    // lowEnd = (i * 100 - 25) + 100;
  }

}


function makeWords() {
  //print(rawText.length + " " + allParts.length);
  //loop on the outside to get each line in the program
  for (var i = 0; i < rawText.length; i++) {
    //split arrays into lines or sentences, work by line to make particles
    var tempWords = split(trim(rawText[i]), " ");
    var tempParts = split(trim(allParts[i]), " ");
    //loop to create words using input text
    for (var j = 0; j < tempWords.length; j++) {
      //We are now making  vehicles and storing them in an array
      //use the current part of speech to ID the parts data
      //print(partsData[tempParts[j]]);
      w = new Vehicle(
        //x, y
        random(width), random(partsData[tempParts[j]].yMin, partsData[tempParts[j]].yMax),
        //ymin, ymax, 
        partsData[tempParts[j]].yMin, partsData[tempParts[j]].yMax,
        //r, maxspeed, maxforce,
        partsData[tempParts[j]].size, partsData[tempParts[j]].maxspeed, partsData[tempParts[j]].maxforce,
        //word,lineref, posref
        tempWords[j], i, j);
      // print(w.word + " is the word");
      for (var k = 0; k < zones.length; k++) {
        if (tempParts[j] === zones[k].name) {
          append(zones[k].vehicles, w);
          //print(zones[k].vehicles);
        }
      }
    }
  }
  
//new dynamic approach for zones and words
  
function dynamicZonesAndWords()
{
//bring in words,  for each word, check if a corresponding zone exists
//zones need a zone name and an identifier (if they are a second version of a zone)

// if it does, and the zone is not full,
// make the word, and  add the word to the zone array

// if the zone does not exist, 
// make a new zone
// make the word, and  add the word to the zone array

// if the zone does exist but is full, 
// make a new zone
// make the word, and  add the word to the zone array
}

}