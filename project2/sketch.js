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

function setup() {
   createCanvas(800,600);
   noStroke();
   pink = color(255,0,255);
   marineblue =color(0,200,255);
   seagreen= color(150,255,220);
   for(var i =0; i<count; i++)
   {
     var c = new Circle(random(1,width),random(200,300),10,random(1,7),random(.05,6), pink, 150,300);
     append(circles,c);
     
     var b = new Circle(random(1,width),random(300,400),15,random(.5,4),random(.05,1),marineblue,275,425);
     append(bluecircles,b);
     
     var g = new Circle(random(1,width),random(400,600),20,random(.05,3),random(.05,.5),seagreen,400,600 );
     append(greencircles,g);
   }

}

function draw() {
  background(0);
  for(var i =0; i<count; i++)
   {
     circles[i].show();
     circles[i].move();
     bluecircles[i].show();
     bluecircles[i].move();
     greencircles[i].show();
     greencircles[i].move();
   }
  fill(255);
  ellipse(100,100,25,25);
  ellipse(100,300,25,25);
  if(overCircle(100,100,25) === true && mouseIsPressed)
  {
    //do something: add
    for(var i =0; i<count; i++)
    {
      circles[i].upScroll();
      bluecircles[i].upScroll();
      greencircles[i].upScroll();
    }
  }
   if(overCircle(100,300,25) === true && mouseIsPressed)
  {
    //do something: subtract
    for(var i =0; i<count; i++)
    {
      circles[i].downScroll();
      bluecircles[i].downScroll();
      greencircles[i].downScroll();
      
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