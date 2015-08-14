//hook rest of words
//

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
var hookedWords =[];

//intial yMin and yMax for the test
var yMin = 200;
var yMax = 500;
//intial attractor x and y for the text 
var attX = 700;
var attY = 0;

//variable for text zone
var zone;
var pointWordPos;

//variable to keep track of currentMaxScroll and currentMinScroll so we know where the frame is
var currentMaxScroll;
var currentMinScroll;
var scrollVal = 4;

function preload() 
{
  rawText = loadStrings("assets/words.txt");
  //rawText = loadStrings("assets/wordsLast.txt");
  allParts = loadStrings("assets/parts.txt");
  //allParts = loadStrings("assets/partsLast.txt");
  partsList = loadStrings("assets/partslookup.txt");
}

function setup() 
{
  //print("HELP COMPUTER!!!")
  textSize(18);
  createCanvas(640,640);
  currentMaxScroll = height;
  currentMinScroll = 0;
  loadZoneDataPts();
  //attractor parameters are waveX, waveY, yOffset, theta, thetaMod, amp
  //att = new Attractor(attX, attY, 400, 0, .02, 60);
  makeWords();
  //zone = new Zone(name,yMin,yMax,vehcs,att);
  //print(zone);
  //print("attractor: " + zone.attractor);
  printVehicleCountsPerZone();
}

function draw() 
{
  background(50);
  for (var h = 0; h < zones.length; h++)
  {
    var checkDisplay = zones[h].testToDisplay();
    if (checkDisplay === true) 
    {
      for (var i = 0; i < zones[h].vehicles.length; i++) 
      { 
        // //check if an object is hooked
        if(zones[h].vehicles[i].isHooked === false)
        {
  
          //if not hooked, seek local attractor
          zones[h].vehicles[i].applyBehaviors(zones[h].vehicles, zones[h].attractor.getWaveX(), zones[h].attractor.getWaveY());
          //update and maintain zone borders
          zones[h].vehicles[i].update();
          zones[h].vehicles[i].borders();
        }
        //call the function to display all the hooked words
        if(pointWordPos !== null)
        {
        displayAllHookedWords();
        }
        //show all of them 
        //print(zones[h].vehicles[i].position);
        zones[h].vehicles[i].show(); 
      }
      zones[h].attractor.wave();
      //FYI if we show wave w/o calling wave, marker will not be drawn with y offset 
      zones[h].attractor.showWave();
      zones[h].showZone();
    }
  }  
}

function mouseClicked()
{
  for (var h = 0; h < zones.length; h++)
  {
  //check to see if the zone and mouse intersect
      if(zones[h].checkZoneAndMouse())
      {
        for (var i = 0; i < zones[h].vehicles.length; i++) 
        {
          //check to see if the word and mouse intersect, if so, it's hooked!
          if(zones[h].vehicles[i].checkHook())
          {
            //print(zones[h].vehicles[i].lineref);
            //zones[h].vehicles[i].setHookedTarget(mouseX, mouseY);
            //set the point word position, use to align other words in that same line
            pointWordPos = zones[h].vehicles[i].posref 
            //hook the other words
            hookTheFullLine(zones[h].vehicles[i].lineref);
          }
        }
      }
  }    
}

function keyPressed()
{
  if(keyCode === DOWN_ARROW)
  {
    for (var h = 0; h < zones.length; h++)
    {
      //scroll up, and bring up the zone, attractor, and each object
      //update current max and min scroll 
      zones[h].setYUp(scrollVal);
      zones[h].attractor.setYUp(scrollVal);
      for (var i = 0; i < zones[h].vehicles.length; i++) 
      {
        zones[h].vehicles[i].setYUp(scrollVal); 
      }
      //update current max and min scroll 
      currentMaxScroll -= scrollVal; 
      currentMinScroll -= scrollVal;
    }
  }
  
  else if(keyCode === UP_ARROW)
  {
    for (var h = 0; h < zones.length; h++)
    {
      //scroll down, and bring down the zone, attractor, and each object
      zones[h].setYDown(scrollVal);
      zones[h].attractor.setYDown(scrollVal);
      for (var i = 0; i < zones[h].vehicles.length; i++) 
      {
        zones[h].vehicles[i].setYDown(scrollVal); 
      }
      //update current max and min scroll 
      currentMaxScroll += scrollVal;
      currentMinScroll += scrollVal;
    }  
  }
  
  else if(keyCode === ENTER)
  {
    for (var h = 0; h < zones.length; h++)
    {
      //this will release the vehicles
      for (var i = 0; i < zones[h].vehicles.length; i++) 
      {
        if(zones[h].vehicles[i].isHooked)
        {
          zones[h].vehicles[i].unHook();
          //zone.vehicles[i].resetBounds(zone.getYMin(),zone.getYMax());
        }
      }
    }  
  }
  
  // print("cMax " + currentMaxScroll);
  // print("cMin " + currentMinScroll);
  return false;
}

function hookTheFullLine(lineref) 
{
  for (var i = 0; i < zones.length; i++) 
  {
    for (var j = 0; j < zones[i].vehicles.length; j++) 
    {
      if (zones[i].vehicles[j].lineref === lineref) 
      {
        zones[i].vehicles[j].hook();
        var temploc = new Location(i, j);
        //print(temploc.ipos + " is temploc i");
        //the location of the hooked word in the zone array
        //add this location to the hookedWords array so you can get the object later
        //print("this is how we are indexing the target postion in the array " + zones[i].vehicles[j].posref)
        hookedWords[zones[i].vehicles[j].posref] = temploc;
      }
    }
  }
}

function displayAllHookedWords() 
{
  //print(pointWordPos + "is point word position");
  var currentX = mouseX;
  if(pointWordPos > 0) //here we start at the beginning of the array and work forward
  {
    for (var i = pointWordPos; i> 0; i--)
    {
      //start with the position of the word you grabbed, and set the seek positions of the others before it
      //word should arrange around the point word 
      var currentWidth = zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].getWordWidth();
      var currentSize = zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].getWordSize();
      currentX -= currentWidth+currentSize;
      //zones[hookedWords[i-1].ipos].vehicles[hookedWords[i-1].jpos].setHookedTarget(currentX, mouseY)
      zones[hookedWords[i-1].ipos].vehicles[hookedWords[i-1].jpos].applyBehaviors(
      zones[hookedWords[i-1].ipos].vehicles, random(currentX, currentX+5.00), random(mouseY,mouseY+5));
      //update, but don't check borders
      zones[hookedWords[i-1].ipos].vehicles[hookedWords[i-1].jpos].update();
    }
  }
  //reset currentX
  currentX = mouseX;
  for (var i = pointWordPos; i< hookedWords.length-1; i++)
  {
      //start with the position of the word you grabbed, and set the seek positions of the others after it
      //word should arrange around the point word 
      var currentWidth = zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].getWordWidth();
      var currentSize = zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].getWordSize();
      currentX += currentWidth+currentSize;
      //set the target
      zones[hookedWords[i+1].ipos].vehicles[hookedWords[i+1].jpos].applyBehaviors(
      zones[hookedWords[i+1].ipos].vehicles, random(currentX, currentX+5.00), random(mouseY,mouseY+5));
      //update, but don't check borders
      zones[hookedWords[i+1].ipos].vehicles[hookedWords[i+1].jpos].update();
      //zones[hookedWords[i+1].ipos].vehicles[hookedWords[i+1].jpos].setHookedTarget(currentX, mouseY+random(.5,10));
  }
}

//make pars objects and zone objects according to the list of parts of speech
function loadZoneDataPts() {
  //use the list of parts to make parts objects
  for (var i = 0; i < partsList.length; i++) {
    var partName = trim(partsList[i]);
    //colorMode(HSB, 360, 100, 100, 1);
    //waveX, waveY, yOffset, theta, thetaMod, amp
    var att = new Attractor(width+10, 0, i * 400 +150, 0, .02, 30);
    var cl = color(210, 100, (i * 2.6 - 100) * -1);
    var inhabitantsArray = [];
    //parts parameters: name, ymin, ymax, size, maxspeed, maxforce, cl
    var thisPart = new Part(partsList[i], i * 100, (i * 100) + 100, 12, random(1,2), .02, cl);
    //zone parameters: yMin, yMax, attractor, vehicles
    var thisZone = new Zone(partsList[i], i * 100, (i * 100) + 100, inhabitantsArray, att);
    //assign this part to the array using key-value pairing
    partsData[partsList[i]] = thisPart;
    //add the zone into the zone aray
    append(zones, thisZone);
    // this var is the max we can scroll, given the number and width of the zones
    // lowEnd = (i * 100 - 25) + 100;
  }

}


function makeWords() 
{
  //print(rawText.length + " " + allParts.length);
  //loop on the outside to get each line in the program
  for (var i = 0; i < rawText.length; i++) 
  {
    //split arrays into lines or sentences, work by line to make particles
    var tempWords = split(trim(rawText[i]), " ");
    var tempParts = split(trim(allParts[i]), " ");
    //loop to create words using input text
    for (var j = 0; j < tempWords.length; j++) 
    {
      //We are now making  vehicles and storing them in an array
      //use the current part of speech to ID the parts data
      //print(tempParts[j]);
      w = new Vehicle(
      //x, y
      random(width),random(partsData[tempParts[j]].yMin, partsData[tempParts[j]].yMax),
      //ymin, ymax, 
      partsData[tempParts[j]].yMin, partsData[tempParts[j]].yMax, 
      //r, maxspeed, maxforce,
      partsData[tempParts[j]].size, partsData[tempParts[j]].maxspeed, partsData[tempParts[j]].maxforce, 
      //word,lineref, posref
      tempWords[j],i,j);
     // print(w.word + " is the word");
      for (var k = 0; k < zones.length; k++) 
      {
        if (tempParts[j] === zones[k].name) 
        {
          //if zones of that name is full, use next zone, if that one is full, use next zone
          append(zones[k].vehicles, w);
          //print(zones[k].vehicles);
        }
      }  
    }
  }
}

function printVehicleCountsPerZone()
{
  for (var i = 0; i < zones.length; i++) 
  {
    print(zones[i].vehicles.length + "  " + zones[i].name);
  }  
}