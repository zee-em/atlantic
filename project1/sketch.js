//NEXT STEPS
//parts of speech determine zones; create key value pairs DONE
//integrate words, text of full chapter parts of speech determining zones DONE
//automate object creation and storage DONE
//improve swimmming behaviors, various sizes?
//create springs thing with hooked words
//implement word mixing (random?)
//fix scrolling


var isOver = false;
var yval = 200;
var circles = [];
var pink;
var marineblue;
var seagreen;
var bluecircles = [];
var greencircles = [];
var count =250;
var scrollspeed = 5;
var zones = [];
var textH = 12;
var partsData = [];
var partsList =[];
var rawText = [];
var allParts =[];
var lowEnd;
var currentBottom; // based on lowEnd calc
var scrollPos = 0; // compare against top / bottom to start or stop scroll (starts at top)

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
  background(0);
  displayZones();
  fill(255);
  //these are the scroll buttons
  ellipse(100,100,25,25);
  ellipse(100,300,25,25);
  //if mouse is down, we might be scrolling or fishing
  if(mouseIsPressed)
  {
    //call updateScroll and return a boolean if it happened
    var onScroll = updateScroll();
    //only check for words if we weren't pressing to scroll 
    if(onScroll === false)
    {
      checkOverWord();
    }
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
           zones[i].inhabitants[j].checkHook();
         }
      }
     }
   }
}

function updateScroll()
{
  //if we are using the scroll button
  if(overCircle(100,100,25) === true && mouseIsPressed && scrollPos < lowEnd)
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
    return true;
  }
  
  //if we are using the scroll button
  if(overCircle(100,300,25) === true && mouseIsPressed && scrollPos > 0)
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
    scrollPos-=scrollSpeed;
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
    var cl = color(200,i*15,255);
    var inhabitantsArray = [];
    var thisPart = new Part(partsList[i],i*100-25,(i*100-25)+100,10,.25,5,cl);
    var thisZone = new Zone(partsList[i], i*100-25,(i*100-25)+100,inhabitantsArray);
    partsData[partsList[i]] = thisPart;
    //partsData["xx"] = obj;
    append(zones, thisZone);
    lowEnd = (i*100-25)+100;
  }
  //print("THIS IS LOW END " + lowEnd);
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
      //x,y, size, xsp, ysp, thecolor, ymin, ymax, word
      var w = new Word(
      //x,y
      random(1,width),random(partsData[tempParts[j]].ymin,partsData[tempParts[j]].ymax),
      //size
      partsData[tempParts[j]].size,
      //speed range x
      random(partsData[tempParts[j]].minspeed,partsData[tempParts[j]].maxspeed),
      //speed range y
      random(.005,.75),
      //color
      partsData[tempParts[j]].color,
      //y bounds
      partsData[tempParts[j]].ymin,partsData[tempParts[j]].ymax, 
      //word,  lineref, wordpos
      tempWords[j],i,j); //end constructor
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