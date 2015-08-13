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

function preload() 
{
  rawText = loadStrings("assets/words.txt");
  allParts = loadStrings("assets/parts.txt");
  partsList = loadStrings("assets/partslookup.txt");
}

function setup() 
{
  print("HELP COMPUTER!!!")
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
}

function draw() 
{
  background(50);
  for (var h = 0; h < zones.length; h++)
  {
    for (var i = 0; i < zones[h].vehicles.length; i++) 
    { 
      //check if an object is hooked
      if(zones[h].vehicles[i].isHooked)
      {
        //if hooked, seek mouse
        zones[h].vehicles[i].applyBehaviors(zones[h].vehicles, mouseX, mouseY);
        //update, but don't check borders
        zones[h].vehicles[i].update();
      }
      else
      {
        //if not hooked, seek local attractor
         zones[h].vehicles[i].applyBehaviors(zones[h].vehicles, zones[h].attractor.getWaveX(), zones[h].attractor.getWaveY());
         //update and maintain zone borders
         zones[h].vehicles[i].update();
         zones[h].vehicles[i].borders();
      }
      //show all of them 
      zones[h].vehicles[i].show(); 
    }
    zones[h].attractor.wave();
    //FYI if we show wave w/o calling wave, marker will not be drawn with y offset 
    zones[h].attractor.showWave();
    zones[h].showZone();
  }  
}

function mouseClicked()
{
  //check to see if the zone and mouse intersect
  if(zone.checkZoneAndMouse())
  {
    for (var i = 0; i < zone.vehicles.length; i++) 
    {
      //check to see if the word and mouse intersect, if so, it's hooked!
      if(zone.vehicles[i].checkHook())
      {
        //hook the other words
      }
    }
  }
}

function keyPressed()
{
  if(keyCode === DOWN_ARROW)
  {
    //scroll up, and bring up the zone, attractor, and each object
    //update current max and min scroll 
    zone.setYUp(scrollVal);
    zone.attractor.setYUp(scrollVal);
    for (var i = 0; i < zone.vehicles.length; i++) 
    {
      zone.vehicles[i].setYUp(scrollVal); 
    }
    //update current max and min scroll 
    currentMaxScroll -= scrollVal; 
    currentMinScroll -= scrollVal;
  }
  
  else if(keyCode === UP_ARROW)
  {
    //scroll down, and bring down the zone, attractor, and each object
    zone.setYDown(scrollVal);
    zone.attractor.setYDown(scrollVal);
    for (var i = 0; i < zone.vehicles.length; i++) 
    {
      zone.vehicles[i].setYDown(scrollVal); 
    }
    //update current max and min scroll 
    currentMaxScroll += scrollVal;
    currentMinScroll += scrollVal;
  }
  
  else if(keyCode === ENTER)
  {
    //this will release the vehicles
    for (var i = 0; i < zone.vehicles.length; i++) 
    {
      if(zone.vehicles[i].isHooked)
      {
        zone.vehicles[i].unHook();
        //zone.vehicles[i].resetBounds(zone.getYMin(),zone.getYMax());
      }
    }  
  }
  
  // print("cMax " + currentMaxScroll);
  // print("cMin " + currentMinScroll);
  return false;
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

//make pars objects and zone objects according to the list of parts of speech
function loadZoneDataPts() {
  //use the list of parts to make parts objects
  for (var i = 0; i < partsList.length; i++) {
    var partName = trim(partsList[i]);
    //colorMode(HSB, 360, 100, 100, 1);
    //waveX, waveY, yOffset, theta, thetaMod, amp
    var att = new Attractor(width/2,i * 100, 200, 0, .02, 60);
    var cl = color(210, 100, (i * 2.6 - 100) * -1);
    var inhabitantsArray = [];
    //parts parameters: name, ymin, ymax, size, minspeed, maxspeed,cl
    var thisPart = new Part(partsList[i], i * 100, (i * 100) + 100, 12, 1, 3, cl);
    //zone parameters: yMin, yMax, attractor, vehicles
    var thisZone = new Zone(partsList[i], i * 100, (i * 100) + 100, inhabitantsArray, att);
    //assign this to the array using key-value pairing
    partsData[partsList[i]] = thisPart;
    //add the zone into the zone aray
    append(zones, thisZone);
    // this var is the max we can scroll, given the number and width of the zones
    // lowEnd = (i * 100 - 25) + 100;
  }
  
  //print("some data " + partsData["xx"].name);
  //print(" a zone " + zones[22]);
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
      //print(partsData[tempParts[j]]);
      w = new Vehicle(
      //x, y
      random(width),random(partsData[tempParts[j]].getYMin,partsData[tempParts[j]].getYMax),
      //ymin, ymax, 
      partsData[tempParts[j]].getYMin, partsData[tempParts[j]].getYMax, 
      //r, maxspeed, maxforce,
      partsData[tempParts[j]].getSize, partsData[tempParts[j]].getMaxSpeed, partsData[tempParts[j]].getMaxForce, 
      //word,lineref, posref
      tempWords[j],i,j);
      print(w.word + " is the word");
      for (var k = 0; k < zones.length; k++) 
      {
        if (tempParts[j] === zones[k].name) 
        {
          append(zones[k].vehicles, w);
          print("got one!")
        }
      }  
    }
  }
}
