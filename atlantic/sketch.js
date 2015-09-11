
//make randomly accessed passages
//minimize swapping function
//add flocking?

// A list of vehicles aka words
var vehcs = [];

//a list of zones
var zones = [];
// attractor object
var att;

var textArray = ["Ch23.txt", "Ch26.txt", "Ch28.txt", "Ch3.txt", "Ch33.txt", "Ch6.txt", 
"Ch1.txt", "Ch14.txt", "Ch42.txt", "Ch47.txt", "Ch11.txt", "Ch73.txt", "Ch74.txt", 
"Ch79.txt", "Ch81.txt", "Ch84.txt", "Ch87.txt", "Ch91.txt","Ch98.txt", "Ch110.txt", 
"Ch118.txt", "Ch130.txt", "Ch135.txt"];
var partsArray = ["Ch23P.txt", "Ch26P.txt", "Ch28P.txt", "Ch3P.txt", "Ch33P.txt", "Ch6P.txt", 
"Ch1P.txt", "Ch14P.txt", "Ch42P.txt", "Ch47P.txt", "Ch11P.txt", "Ch73P.txt", "Ch74P.txt", 
"Ch79P.txt", "Ch81P.txt", "Ch84P.txt", "Ch87P.txt", "Ch91P.txt","Ch98P.txt", "Ch110P.txt", 
"Ch118P.txt", "Ch130P.txt", "Ch135P.txt"];
var titleArray = ["Chapter Twenty-Three, The Lee Shore",
"Chapter Twenty-Six, Knights And Squires",
"Chapter Twenty-Eight, Ahab",
"Chapter Three, The Spouter-Inn",
"Chapter Thirty-Three, The Specksnyder",
"Chapter Six, The Street",
"Chapter One, Loomings",
"Chapter Fourteen, Nantucket",
"Chapter Forty-Two, The Whiteness of the Whale",
"Chapter Forty-Seven, The Mat-Maker",
"Chapter Eleven, The Nightgown",
"Chapter Seventy-Three, Stubb and Flask Kill a Right Whale; and Then Have a Talk Over Him",
"Chapter Seventy-Four, The Sperm Whale's Head - Contrasted View",
"Chapter Seventy-Nine, The Prairie",
"Chapter Eighty-One, The Pequod Meets The Virgin",
"Chapter Eighty-Four, Pitchpoling",
"Chapter Eighty-Seven, The Grand Armada",
"Chapter Ninety-One, The Pequod Meets The Rose-Bud",
"Chapter Ninety-Eight, Stowing Down And Clearing Up",
"Chapter One Hundred And Ten, Queequeg in His Coffin",
"Chapter One Hundred And Eighteen, The Quadrant",
"Chapter One Hundred And Thirty, The Hat",
"Chapter One Hundred And Thirty-Five, The Chase - The Third Day"];

//REMOVE 79
//variables to hold string input
//just use mf to 
var mf;
var partsList;
var rawText;
var slawText;
var allParts;
var partsData = [];
var hookedWords = [];
var pointWordPosVar;
var counter = 0;
var arrivedColor;
var concordance;
var partsCount= {};
var lastYMax;
var newParts = [];
var newWords = [];
var citation;
var topTitle;
var instructions;
var chapterName;


//intial yMin and yMax for the test
var yMin = 200;
var yMax = 500;
//intial attractor x and y for the text 
var attX = 700;
var attY = 0;
var myFont;

//variable for text zone
var zone;
var fileChooser

//variable to keep track of currentMaxScroll and currentMinScroll so we know where the frame is
var currentMaxScroll;
var currentMinScroll;
var scrollVal = 4;

function preload() {
  fileChooser = Math.round(random(0, textArray.length));
  rawText = loadStrings("assets/"+textArray[fileChooser]);
  allParts = loadStrings("assets/"+partsArray[fileChooser]);
  // rawText = loadStrings("assets/"+textArray[22]);
  // allParts = loadStrings("assets/"+partsArray[22]);
  partsList = loadStrings("assets/partslookup.txt");
  
}

function setup() {

  frameRate(30);
  textSize(21);
  textFont("Georgia");
  concordance = new Concordance();
  citation = new Title("From " + titleArray[fileChooser], 50,50,16)
  topTitle = new Title("in Moby Dick, by Herman Melville", 50,70,12);
  instructions = new Title("(Use up and down arrows to dive or surface; click a word to hook a line and press return to release your catch.)", 50, 90, 11);
  checkWordCounts(allParts);
  createCanvas(800, 480);
  currentMaxScroll = height;
  currentMinScroll = 0;
  //arrivedColor = color(255,0,0);
  loadZoneDataPts();
  makeWords();
  for (var h = 0; h < zones.length; h++) {
  }
}

function draw() {
  //print(frameRate());
  colorMode(HSB, 360, 100, 100, 1);
  //use scroll position to change background color
  var currentlight = map(-currentMaxScroll,0,3000,50,0);
  background(223, 70, currentlight);
  //background(50);
  topTitle.show();
  citation.show();
  fill(38,100,100);
  instructions.show();
  for (var h = 0; h < zones.length; h++) {
    var checkDisplay = zones[h].testToDisplay();
    if (checkDisplay === true) 
    {
      if(zones[h].name === "xx")
      {
        for(var i = 0; i < zones[h].vehicles.length/1.75; i++ )
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
      }
      else
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
    }
    zones[h].attractor.wave();
    //FYI if we show wave w/o calling wave, marker will not be drawn with y offset 
    //zones[h].attractor.showWave();
    //zones[h].showZone();
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
  for (var h = 0; h < zones.length; h++) 
  {     //this will release any vehicles currently hooked
      for (var i = 0; i < zones[h].vehicles.length; i++) 
      {
        if (zones[h].vehicles[i].isHooked) {
          //swapOutWords(zones[h].vehicles[i]);
          zones[h].vehicles[i].unHook();
      }
    }
  }
  hookedWords = [];
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
  if (keyCode === DOWN_ARROW && currentMinScroll >-lastYMax) {
    for (var h = 0; h < zones.length; h++) {
      //scroll up, and bring up the zone, attractor, and each object
      //update current max and min scroll 
      zones[h].setYUp(scrollVal);
      zones[h].attractor.setYUp(scrollVal);
      for (var i = 0; i < zones[h].vehicles.length; i++) 
      {
        zones[h].vehicles[i].setYUp(scrollVal);
      }
      //update current max and min scroll 
    }
    topTitle.setYUp(scrollVal);
    citation.setYUp(scrollVal);
    instructions.setYUp(scrollVal);
    currentMaxScroll -= scrollVal;
    currentMinScroll -= scrollVal;
  } else if (keyCode === UP_ARROW && currentMinScroll <0) {
    for (var h = 0; h < zones.length; h++) {
      //scroll down, and bring down the zone, attractor, and each object
      zones[h].setYDown(scrollVal);
      zones[h].attractor.setYDown(scrollVal);
      for (var i = 0; i < zones[h].vehicles.length; i++) {
        zones[h].vehicles[i].setYDown(scrollVal);
}
  //update current max and min scroll 
}
    currentMaxScroll += scrollVal;
    currentMinScroll += scrollVal;
    topTitle.setYDown(scrollVal);
    citation.setYDown(scrollVal);
    instructions.setYDown(scrollVal);
  } else if (keyCode === ENTER) {
    for (var h = 0; h < zones.length; h++) {
      //this will release the vehicles
      for (var i = 0; i < zones[h].vehicles.length; i++) {
        if (zones[h].vehicles[i].isHooked) {
          zones[h].vehicles[i].unHook();
      }
    }
  }
  

  //LET'S SWAP OUT FEWER WORDS HERE-- select some number at random!
  var howManyToSwap = Math.round(random(0, hookedWords.length-1));
  print(howManyToSwap + " is how many to swap");
  for(var i = 0; i< howManyToSwap; i++)
  {
    //the location in a zone and vehicle array of each word
    var swapWordChooser = Math.round(random(0, hookedWords.length-1));
    print(swapWordChooser + " this is the chooser");
    swapOutWords(zones[hookedWords[swapWordChooser].ipos],
    zones[hookedWords[swapWordChooser].ipos].vehicles[hookedWords[swapWordChooser].jpos]);
  }
  hookedWords = [];
} else if(keyCode === TAB){
  print("hit tab!");
  saveOutNewText();
}
  //print("cMax: " + currentMaxScroll + " cMin: " + currentMinScroll);
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


function setAllHookedTargets(pointWordPos) {
  //print(pointWordPos + "is point word position");
  //go through each item in the hookedWords array and check to see if it's the point word
   for (var i = 0; i < hookedWords.length; i++)
   {
     //this is the current location of the zone, and the vehicle
     zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].setMaxspeed(random(4,7));
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

function swapOutWords(zone, vehicle)
{
  //print(zone);
  //print(vehicle);
  lineref = vehicle.getLineref();
  posref = vehicle.getPosref();
 
  chooser = Math.round(random(0, zone.vehicles.length-1));
  //choose another randomly selected word from its zone
  
  newLineref = zone.vehicles[chooser].getLineref();
  newPosref =  zone.vehicles[chooser].getPosref();
  //swap them out
  zone.vehicles[chooser].setLineref(lineref);
  zone.vehicles[chooser].setPosref(posref);
  vehicle.setLineref(newLineref);
  vehicle.setPosref(newPosref);
  // print("the Vehicle's NEW lineref " + vehicle.getLineref());
  // print("the Vehicles NEW posref " + vehicle.getPosref());
}


//make parts objects and zone objects according to the list of parts of speech
function loadZoneDataPts() {
  var offset = 300; //this is the distance of the first zone from the top of the screen
  //use the list of parts to make parts objects
  for (var i = 0; i < partsList.length; i++) {
    var partName = trim(partsList[i]);
    //print(partsCount[partName] + ": " + partName);
    if(partsCount[partName] !== undefined) //if we have parts, let's make parts objects and zones for them
    {
      population = partsCount[partName];
      var thisPart;
      var thisZone;
      thisPart = makePart(partName, offset, population);
      //add to parts data array
      partsData[partsList[i]] = thisPart;
      thisZone = makeZone(thisPart);
      //thisZone = makeZone(partName, offset, thisPart.yMax);
      //add the zone into the zone array
      append(zones, thisZone);
          //***update offset before you go!!****
          //want the punctuation to overlap a bit
      if(thisPart.name === "xx")
      {
         offset = thisPart.yMax-30;
      }
      else
      {
        offset = thisPart.yMax;
      }
      //print('this is the name ' + partName + " this is yMax "+ offset
    }
  }
  lastYMax = offset-200;
  //print("lastYMax is" + lastYMax);
  
}

function makePart(name, offset, population)
{
      //print("in make part and the population is" + population);
      //use the current offset and info about the population to determine the max y value
      var ymax;
      var zoneHeight;
      var speed;
      //print(name + " is name in makePart!");
      //print(offset + " is intial  offset in makePart!");
      if(name === "xx" )
      {
        //make zone height smaller for the punctuation because they're so tiny
         zoneHeight = (population *.5)-20;
         ymax = offset+ zoneHeight;
         speed = 5;
      }
      else
      {
        zoneHeight = (population *2)+ 100;
        // zoneHeight = (population *2)+ 40;
        ymax = offset + zoneHeight;
        speed = random(1.75,6);
      }
      
      //colorMode(HSB, 360, 100, 100, 1);
      var cl = color(210, 100, offset * -1);
      //parts parameters: name, ymin, ymax, size, maxspeed, maxforce, cl
      //offset becomes yYmin
      var thisPart = new Part(name, offset, ymax, random(10,13), speed, .35, cl, population, zoneHeight);
      //var thisPart = new Part(name, offset, ymax, 10, random(.05, 5), random(.05, .5), cl);
      return thisPart;
}

function makeZone(thePart)
{
  //THIS IS JUST FOR THE ATTRACTOR
  if(thePart.name === "xx")
  {
    //print("in attractor definition area");
    attrY = thePart.yMax;
  }
  else
  {
    attrY = thePart.yMax-(thePart.population+15);
    // var offScreenLeft = 10-20;
  }
  var offScreenRight = width +40;
  var offScreenLeft = 10-40;
  var chooser = Math.round(random(0,1));
  var xOffVal = [offScreenLeft, offScreenRight];
  //print("what we get for chooser " + xOffVal[chooser]);
  //attractor parameters: waveX, waveY, yOffset, theta, thetaMod, amp
  var att = new Attractor(xOffVal[chooser], 0, attrY, 0, random(.02,.04),random(40,60));
  //THIS IS FOR THE ZONES
  //zone parameters: name, yMin, yMax, attractor, vehicles
  var inhabitantsArray = [];
  var thisZone = new Zone(thePart.name, thePart.yMin, thePart.yMax, inhabitantsArray, att);
  return thisZone;
}

function makeWords() {
  //loop on the outside to get each line in the program
  for (var i = 0; i < rawText.length; i++) {
    //split arrays into lines or sentences, work by line to make particles
    var tempWords = split(trim(rawText[i]), " ");
    var tempParts = split(trim(allParts[i]), " ");
    //loop to create words using input text
    for (var j = 0; j < tempWords.length; j++) {
      //if has extra && is full
      //We are now making  vehicles and storing them in an array
      //use the current part of speech to ID the parts data
      // print(partsData[tempParts[j]]);
      // print(tempWords[j]);
      // print(tempParts[j]);
      //check in partsData
      w = new Vehicle(
        //x, y
        random(0,width), random(partsData[tempParts[j]].yMin, partsData[tempParts[j]].yMax),
        //ymin, ymax, 
        partsData[tempParts[j]].yMin, partsData[tempParts[j]].yMax,
        //r, maxspeed, maxforce,
        partsData[tempParts[j]].size, partsData[tempParts[j]].maxspeed, partsData[tempParts[j]].maxforce,
        //word,lineref, posref
        tempWords[j], i, j, partsData[tempParts[j]].name);
      // print(w.word + " is the word");
      //step through the array of zones
      for (var k = 0; k < zones.length; k++) {
        if (tempParts[j] === zones[k].name ) { 
        // "call"  vb    vb
        //do these match, if so you found your name
        //if zones[k].vehicles.length < 200, then add
          append(zones[k].vehicles, w);
          //print(zones[k].vehicles);
        //else
        //concatenate name 
        //
        }
      }
    }
    newWords[i] = tempWords;
    newParts[i] = tempParts;
  }
}  

function checkWordCounts(data)
{
  var text;
  // Did we get an array from loadStrings()
  // or just some raw text
  if (data instanceof Array) {
    text = data.join(' ');
  } else {
    text = data;
  }
  // Process this data
  concordance.process(text);
  // Sort
  concordance.sortByCount();
  var keys = concordance.getKeys();
  partsCount = concordance.getHash();
  //print(partsCount);
}

this.getCount = function(word) 
{
    return this.hash[word];
}
