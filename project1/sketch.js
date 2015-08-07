//NEXT STEPS
//parts of speech determine zones; create key value pairs DONE
//integrate words, text of full chapter parts of speech determining zones DONE
//automate object creation and storage DONE
//fix scrolling DONE

//add defined data fields for parts (size, color, etc) 
//implement vectors
//create springs thing with hooked words
//implement word mixing (random?)


//improve swimmming behavior
//fix text processing problems
//design page 

var hookedWords = [];
var hookedVal = false;
var isOver = false;
var yval = 200;
var count =250;
var scrollspeed = 5;
var zones = [];
var textH = 14;
var partsData = [];
var partsList =[];
var rawText = [];
var allParts =[];
var lowEnd;
var scrollPos = 0; // compare against top / bottom to start or stop scroll (starts at top)
var bgColor;
var onScroll = false;

function preload() {
  rawText = loadStrings("assets/words.txt");
  allParts = loadStrings("assets/parts.txt");
  partsList = loadStrings("assets/partslookup.txt");
  
}


function setup() 
{
   createCanvas(800,600);
   noStroke();
   textSize(textH);
   loadZoneDataPts();
   makeWords();
   
}

function draw() {
  colorMode(HSB, 360, 100, 100, 1);
  bgColor= color(221,100,100-scrollPos/36, 1);
  //print(100-scrollPos/36);
  //bgColor =(210,100,50,1);
  background(bgColor);
  displayZones();
  fill(255);
  //these are the scroll buttons
  ellipse(100,100,25,25);
  ellipse(100,300,25,25);
  if(mouseIsPressed)
   {
    //print("here i am j.h.");
    onScroll = updateScroll();
   }
  if(hookedWords.length > 0)
  {
    displayHookedWords();
  }
}

function mouseClicked()
{
  //only check for words if we weren't pressing to scroll 
    if(onScroll === false && hookedWords.length === 0)
    {
      checkOverWord();
    }
}

function checkOverWord()
{
  for(var i =0; i<zones.length; i++)
  { 
    //find out if zone is even on screen, if not don't bother
    var checkDisplay = zones[i].testToDisplay();
    if(checkDisplay === true)
     { 
       //if the zone is on screen, check if the mouse is in that zone
       var intersectZone = zones[i].checkZoneAndMouse();
       //print("zone intersect " + intersectZone)
       if(intersectZone === true)
       {
         //then check for a intersection with this set of objecys
         for(var j = 0; j<zones[i].inhabitants.length; j++)
         {
           if(zones[i].inhabitants[j].checkHook() === true)
           {
              hookTheFullLine(zones[i].inhabitants[j].lineref);
           }
             
         }
        }
      }
   }
}

function updateScroll()
{
  //if we are using the scroll button
  if(overCircle(100,300,25) === true && mouseIsPressed && scrollPos < lowEnd)
  {
    //do something: add to the Y pos of every object to shift down
   for(var i =0; i<zones.length; i++)
    {
      for(var j = 0; j<zones[i].inhabitants.length; j++)
       {
         zones[i].inhabitants[j].downScroll();
       }
       //now update the zone y max and min
       zones[i].downZone();
    }
    //we did it!
    scrollPos+=scrollspeed;
    //print("scroll: " + scrollPos);
    return true;
  }
  
  //if we are using the scroll button
  if(overCircle(100,100,25) === true && mouseIsPressed && scrollPos > 0)
  {
    //do something: subtract from the Y pos of every object to shift up
    for(var i =0; i<zones.length; i++)
    {
      for(var j = 0; j<zones[i].inhabitants.length; j++)
       {
         zones[i].inhabitants[j].upScroll();
       }
       //now update the zone y max and min
       zones[i].upZone();
    }
    //we did it! :)
    scrollPos-=scrollspeed;
    //print("scroll: " + scrollPos);
    return true;
 }
  //not on scroll button
  return false;
}

function overCircle(x, y, diameter) 
{
  disX = x - mouseX;
  disY = y - mouseY;
  if(sqrt(sq(disX) + sq(disY)) < diameter/2 ) 
  {
    return true;
  } 
  else
  {
    return false;
  }
}

function displayHookedWords()
{
  for(var i =0; i<hookedWords.length; i++)
    {

    }
}

function displayZones()
{
  for(var i =0; i<zones.length; i++)
   { 
     //only display objects if the zones are onscreen
    var checkDisplay = zones[i].testToDisplay();
    if(checkDisplay == true)
     { 
       //the zone is on screen so dislay and move inhabitants
       for(var j = 0; j<zones[i].inhabitants.length; j++)
       {
         zones[i].inhabitants[j].show();
         zones[i].inhabitants[j].move();
         zones[i].inhabitants[j].checkEdges();
       }
     }
   }
}

function loadZoneDataPts()
{
  //use the list of parts to make parts objects
  for(var i = 0; i<partsList.length; i++)
  {
    var partName = trim(partsList[i]);
    //colorMode(HSB, 360, 100, 100, 1);
    var cl = color(210,100,(i*2.6-100)*-1);
    colorMode(RGB,255);
    var cl = color(255, 255,255);
    var inhabitantsArray = [];
    //use preexisting input here for speeds, etc
    //name, ymin, ymax, size, minspeed, maxspeed,cl
    var thisPart = new Part(partsList[i],i*100-25,(i*100-25)+100,i+10,.05,3,cl);
    var thisZone = new Zone(partsList[i], i*100-25,(i*100-25)+100,inhabitantsArray);
    partsData[partsList[i]] = thisPart;
    //partsData["xx"] = obj;
    append(zones, thisZone);
    //this var is the max we can scroll, given the number and width of the zones
    lowEnd = (i*100-25)+100;
  }
}

function getMouseX()
{
  return mouseX;
}
  
function getMouseY()
{
  return mouseY;
}
  
function hookTheFullLine(lineref)
{
  for(var i =0; i<zones.length; i++)
  { 
      for(var j = 0; j<zones[i].inhabitants.length; j++)
      {
        if(zones[i].inhabitants[j].lineref === lineref)
        {
          //print(i + " is the i value ");
          //print(j + " is the j value ");
          var temploc = new Location(i,j);
          hookedWords[zones[i].inhabitants[j].wordpos] = temploc; 
          //print(hookedWords.length + "is the length");
        }
      }
    }
    
    for(var i =0; i<hookedWords.length; i++)
    {
      
      zones[hookedWords[i].ipos].inhabitants[hookedWords[i].jpos].changeSpeed();
      zones[hookedWords[i].ipos].inhabitants[hookedWords[i].jpos].changeWord();
      print(zones[hookedWords[i].ipos].inhabitants[hookedWords[i].jpos]);
    } 
}


function makeWords()
{
  //print(rawText.length + " " + allParts.length);
  //loop on the outside to get each line in the program
  for(var i = 0; i<rawText.length; i++)
  {
    //split arrays into lines or sentences, work by line to make particles
    var tempWords = split(trim(rawText[i])," ");
    var tempParts = split(trim(allParts[i])," ");
    // print("do the lengths match?")
    // print(tempWords.length);
    //print(tempParts.length);
    //loop to create words using input text
    for(var j =0; j<tempWords.length;j++)
    {
      //print(tempParts[j]);
      //print(partsData[tempParts[j]].name);
      var position = createVector(random(1, width), random(partsData[tempParts[j]].ymin,partsData[tempParts[j]].ymax));
      var vel = createVector(random(partsData[tempParts[j]].minspeed,partsData[tempParts[j]].maxspeed), random(0,1));
      //location, size, xsp, ysp, thecolor, ymin, ymax, word
      var w = new seaWord(
      //x,y
      position,
      //size
      partsData[tempParts[j]].size,
      //speed 
      vel,
      //color
      partsData[tempParts[j]].cl,
      //y bounds
      partsData[tempParts[j]].ymin,partsData[tempParts[j]].ymax, 
      //word,  lineref, wordpos
      tempWords[j],i,j,
      hookedVal); //end constructor
      //add obj to the appropriate zone array
      for(var k = 0; k< zones.length; k++)
      {
        //print("is zones name " +zones[k].name);
        //print("is the current part " +tempParts[j]);
        if(tempParts[j]===zones[k].name)
        {
          append(zones[k].inhabitants,w);
          //print("got one!")
        }
      }
      
    }
  }
}