var isOver = false;
var yval = 200;
var circles = [];
var pink;
var marineblue;
var seagreen;
var bluecircles = [];
var greencircles = [];
var count =150;
var scrollspeed = 5;
var zones = [];

function setup() {
   createCanvas(800,600);
   noStroke();
   pink = color(255,0,255);
   marineblue =color(0,200,255);
   seagreen= color(150,255,220);
   
   for(var i =0; i<count; i++)
   {
     var c = new Circle(random(1,width),random(200,300),10,random(1,7),random(.005,1), pink, 150,300);
     append(circles,c);
     
     var b = new Circle(random(1,width),random(300,400),15,random(.5,4),random(.005,.75),marineblue,275,425);
     append(bluecircles,b);
     
     var g = new Circle(random(1,width),random(400,600),20,random(.05,3),random(.005,.5),seagreen,400,600 );
     append(greencircles,g);
   }
   

   var zonePink = new Zone(150,300,circles);
   var zoneBlue = new Zone(275,425,bluecircles);
   var zoneGreen = new Zone(400,600,greencircles);
   append(zones,zonePink);
   append(zones,zoneBlue);
   append(zones,zoneGreen);
}

function draw() {
  background(0);
  for(var i =0; i<zones.length; i++)
   { 
     var checkDisplay = zones[i].testToDisplay();
     if(checkDisplay === true)
     {
       for(var j = 0; j<zones[i].length; j++)
       {
         zones[i].inhabitants[j].show();
         zones[i].inhabitants[j].move();
       }
     }
   }
  fill(255);
  ellipse(100,100,25,25);
  ellipse(100,300,25,25);
  if(overCircle(100,100,25) === true && mouseIsPressed)
  {
    //do something: add
   for(var i =0; i<zones.length; i++)
    {
      for(var j = 0; j<zones[i].length; j++)
       {
         zones[i].inhabitants[j].upScroll();
       }
    }
  }
   if(overCircle(100,300,25) === true && mouseIsPressed)
  {
    //do something: subtract
    for(var i =0; i<zones.length; i++)
    {
      for(var j = 0; j<zones[i].length; j++)
       {
         zones[i].inhabitants[j].downScroll();
       }
    }
 }
}

function overCircle(x, y, diameter) {
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