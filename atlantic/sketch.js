

// A list of vehicles aka words
var vehcs = [];

//a list of zones
var zones = [];
// attractor object
var att;

//intial yMin and yMax for the test
var yMin = 200;
var yMax = 500;
//intial attractor x and y for the text 
var attX = 400;
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
  textSize(18);
  createCanvas(640,640);
  currentMaxScroll = height;
  currentMinScroll = 0;
  //attractor parameters are waveX, waveY, yOffset, theta, thetaMod, amp
  att = new Attractor(attX, attY, 400, 0, .02, 60);
  makeWords();
  zone = new Zone(yMin,yMax,att,vehcs);
}

function draw() 
{
  background(50);
  for (var i = 0; i < zone.vehicles.length; i++) 
  { 
    //check if an object is hooked
    if(zone.vehicles[i].isHooked)
    {
      //if hooked, seek mouse
      zone.vehicles[i].applyBehaviors(zone.vehicles, mouseX, mouseY);
      //update, but don't check borders
      zone.vehicles[i].update();
    }
    else
    {
      //if not hooked, seek local attractor
       zone.vehicles[i].applyBehaviors(zone.vehicles, zone.attractor.getWaveX(), zone.attractor.getWaveY());
       //update and maintain zone borders
       zone.vehicles[i].update();
       zone.vehicles[i].borders();
    }
    //show all of them 
    zone.vehicles[i].show(); 
  }
  zone.attractor.wave();
  //FYI if we show wave w/o calling wave, marker will not be drawn with y offset 
  zone.attractor.showWave();
  zone.showZone();
}

function mouseClicked()
{
  //check to see if the zone and mouse intersect
  if(zone.checkZoneAndMouse())
  {
    for (var i = 0; i < zone.vehicles.length; i++) 
    {
      //check to see if the word and mouse intersect, if so, it's hooked!
      zone.vehicles[i].checkHook(); 
    }
  }
}

function keyPressed()
{
  if(keyCode === UP_ARROW)
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
  
  else if(keyCode === DOWN_ARROW)
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
      // We are now making random vehicles and storing them in an array
      //these are parameters for Vehicle x, y, ymin, ymax, word
      vehcs.push(new Vehicle(random(width),random(yMin,yMax), yMin, yMax, tempWords[j]));
    }
  }
}
