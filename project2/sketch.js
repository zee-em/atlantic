//NEXT STEPS
//parts of speech determine zones; create key value pairs
//integrate words, text of full chapter parts of speech determining zones
//automate object creation and storage
//improve swimmming behaviors, various sizes?
//create springs thing with hooked words
//implement word mixing (random?)

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

function preload() {
  //rawText = loadStrings("assets/words.txt");
  allParts = loadStrings("/assets/parts.txt");
  partsList = loadStrings("/assets/partslookup.txt");
  
}


function setup() 
{
   createCanvas(800,600);
   noStroke();
   textSize(textH);
   //loadZoneDataPts();
   
   pink = color(255,0,255);
   marineblue =color(0,200,255);
   seagreen= color(150,255,220);
  
   //here we create the arrays of objects 
   for(var i =0; i<count; i++)
   {
     var c = new Circle(random(1,width),random(200,300),10,random(1,7)-3,random(.005,1), pink, 150,300, "herp");
     append(circles,c);
     
     var b = new Circle(random(1,width),random(300,400),15,random(.5,1)-.5,random(.005,.75),marineblue,275,425, "derp");
     append(bluecircles,b);
     
     var g = new Circle(random(1,width),random(400,600),20,random(.05,1)-.05,random(.005,.5),seagreen,400,600, "pants" );
     append(greencircles,g);
   }
   //we create the corresponding zone objects
   var zonePink = new Zone(150,300,circles);
   var zoneBlue = new Zone(275,425,bluecircles);
   var zoneGreen = new Zone(400,600,greencircles);
   //add them to the zone array
   append(zones,zonePink);
   append(zones,zoneBlue);
   append(zones,zoneGreen);
}

function draw() {
  background(0);
  //displayZones();
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
       print("zone intersect " + intersectZone)
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
  if(overCircle(100,100,25) === true && mouseIsPressed)
  {
    //do something: add to the Y pos of every object to shift up
   for(var i =0; i<zones.length; i++)
    {
      for(var j = 0; j<zones[i].inhabitants.length; j++)
       {
         zones[i].inhabitants[j].upScroll();
       }
       //now update the zone y max and min
       zones[i].upZone();
    }
    //we did it!
    return true;
  }
  
  //if we are using the scroll button
  if(overCircle(100,300,25) === true && mouseIsPressed)
  {
    //do something: subtract from the Y pos of every object to shift down
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
  for(var i = 0; i<partsList.length; i++)
  {
    var partName = trim(partsList[i]);
    var thisPart = new Part(partsList[i],i*100-25,(i*100-25)+100,10,.25,5);
    partsData[partsList[i]] = thisPart;
   
  }
  print(partsData["xx"]);
}