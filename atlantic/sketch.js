
//make randomly accessed passages
//how can we swap and save out? 
//view the new text??
//add flocking?

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
var counter = 0;
var arrivedColor;
var concordance;
var partsCount= {};
var lastYMax;
var newParts = [];
var newWords = [];

//intial yMin and yMax for the test
var yMin = 200;
var yMax = 500;
//intial attractor x and y for the text 
var attX = 700;
var attY = 0;
var myFont;

//variable for text zone
var zone;


//variable to keep track of currentMaxScroll and currentMinScroll so we know where the frame is
var currentMaxScroll;
var currentMinScroll;
var scrollVal = 4;

function preload() {
  rawText = loadStrings("assets/words.txt");
  allParts = loadStrings("assets/parts.txt");
  // rawText = loadStrings("assets/wordsLastShort.txt");
  // allParts = loadStrings("assets/partsLastShort.txt");
  //this is the ordered list of parts
  partsList = loadStrings("assets/partslookup.txt");
  //myFont = loadFont('');
}

function setup() {
  frameRate(30);
  //print("HELP COMPUTER!!!")
  textSize(18);
  textFont("Georgia");
  concordance = new Concordance();
  citation = new Title("from CHAPTER 135. The Chase.--Third Day", 50,50,16)
  topTitle = new Title("from Moby Dick, by Herman Melville", 50,70,12);
  //endTitle = new Title("THE END", width/2, 8500, 36);
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
  //what is the real maxScroll number?
  var currentlight = map(-currentMaxScroll,0,3000,50,0);
  background(223, 70, currentlight);
  //background(50);
  topTitle.show();
  citation.show();
  for (var h = 0; h < zones.length; h++) {
    var checkDisplay = zones[h].testToDisplay();
    if (checkDisplay === true) 
    {
      if(zones[h].name === "xx")
      {
        for(var i = 0; i < zones[h].vehicles.length/2.5; i++ )
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
    zones[h].attractor.showWave();
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
  //setColorForFullCatch();
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
  } else if (keyCode === ENTER) {
    for (var h = 0; h < zones.length; h++) {
      //this will release the vehicles
      for (var i = 0; i < zones[h].vehicles.length; i++) {
        if (zones[h].vehicles[i].isHooked) {
          zones[h].vehicles[i].unHook();
          //swapOutWords messes up the unhooking
          //print("this is the vehicle" + zones[h].vehicles[i]);
      }
    }
  }
  for(var i = 0; i< hookedWords.length; i++)
  {
    //the location in a zone and vehicle array of each word
   swapOutWords(zones[hookedWords[i].ipos],
   zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos]);
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

//need to see how point word y is updating here
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
  print(zone);
  print(vehicle);
  lineref = vehicle.getLineref();
  posref = vehicle.getPosref();
  //SOMETHING WRONG WITH CHOOSER!!!
  print("the Vehicle's OG lineref " + lineref);
  print("the Vehicles OG posref " + posref);
  chooser = Math.round(random(0, zone.vehicles.length-1));
  print("chooser " + chooser);
  print(zone.vehicles.length);
  print(zone.vehicles[chooser]);
  //another randomly selected word from its zone
  
  newLineref = zone.vehicles[chooser].getLineref();
  newPosref =  zone.vehicles[chooser].getPosref();
  // print("new lineref " + newLineref);
  // print("new posref " + newPosref);
  zone.vehicles[chooser].setLineref(lineref);
  zone.vehicles[chooser].setPosref(posref);
  vehicle.setLineref(newLineref);
  vehicle.setPosref(newPosref);
  print("the Vehicle's NEW lineref " + vehicle.getLineref());
  print("the Vehicles NEW posref " + vehicle.getPosref());
}

//something wrong here, with concatenating the lines...
function saveOutNewText()
{
  print("in saveOutNewText()!");
  for (var h = 0; h < zones.length; h++) 
  {
    //for all the words
      for (var i = 0; i < zones[h].vehicles.length; i++) 
      {
        //get the line 
        var theLine = zones[h].vehicles[i].getLineref();
        var thePos = zones[h].vehicles[i].getPosref();
        //add to that array
        newWords[theLine][thePos] = zones[h].vehicles[i].getWord();
        newParts[theLine][thePos] = zones[h].vehicles[i].getPart();
        // newWords[theLine][thePos] = "changed!";
        // newParts[theLine][thePos] = "all new!";
      }
  }
  //print them out to see....
  print(newWords.length);
  for (var j = 0; j < newWords.length; j++) 
  { 
    print(newWords[j]);
    // //empty strings to hold new lines
    // var newStringWords ="";
    // var newStringParts = "";
    // for (var j = 0; j < newWords[i].length; j++) 
    // {
    //   //newStringWords+= newWords[i]+ " ";
    //   //newStringWords= newStringWords.concat(" ");
      
    //   newStringParts+= newParts[i] + " ";
    //   //print(newWords[i][j]);
    //   //print(newParts[i][j]);
    // }
  }
  // print(newWords);
  // print(newParts);
  //var list =["apple", "banana", "peach", "kimchi"];
  //saveStrings(list,"newWords.txt");
  //saveStrings(newWords,"newWords.txt");
  //saveStrings(newParts,"newParts.txt");
}
//make parts objects and zone objects according to the list of parts of speech
function loadZoneDataPts() {
  var offset = 300; //this is the distance of the first zone from the top pf the screen
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
      offset = thisPart.yMax;
      //print('this is the name ' + partName + " this is yMax "+ offset
      }
  }
  lastYMax = offset;
  //print("lastYMax is" + lastYMax);
  
}

function makePart(name, offset, population)
{
      //print("in make part and the population is" + population);
      //use the current offset and info about the population to determine the max y value
      var ymax;
      var zoneHeight;
      //print(name + " is name in makePart!");
      //print(offset + " is intial  offset in makePart!");
      if(name === "xx" )
      {
        //make zone height smaller for the punctuation because they're so tiny
         zoneHeight = (population *.5)-100;
         ymax = offset+ zoneHeight;
      }
      else
      {
        zoneHeight = (population *2)+ 100;
        // zoneHeight = (population *2)+ 40;
        ymax = offset + zoneHeight;
      }
      
      //colorMode(HSB, 360, 100, 100, 1);
      var cl = color(210, 100, offset * -1);
      //parts parameters: name, ymin, ymax, size, maxspeed, maxforce, cl
      //offset becomes yYmin
      var thisPart = new Part(name, offset, ymax, random(10,13), random(1.5,5.5), .35, cl, population, zoneHeight);
      //var thisPart = new Part(name, offset, ymax, 10, random(.05, 5), random(.05, .5), cl);
      return thisPart;
}

function makeZone(thePart)
{
  //THIS IS JUST FOR THE ATTRACTOR
  if(thePart.name === "xx")
  {
    print("in attractor definition area");
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
      //print(partsData[tempParts[j]]);
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
