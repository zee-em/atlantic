//fix motion along y for anchor word DONE
//fix x wrap for words DONE
//divide zones properly THIS ONE NEXT!!!

//how can we swap and save out? //DO WE EVEN WANT TO? ONLY TO DISPLAY SEPARATELY
//how can we show when you've got a complete sentence ALMOSt DONE, needs help!

//view the new text??

//add flocking?
//add noise to motion? wiggle

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

function preload() {
  rawText = loadStrings("assets/wordsLast.txt");
  allParts = loadStrings("assets/partsLast.txt");
  //this is the ordered list of parts
  partsList = loadStrings("assets/partslookup.txt");
}

function setup() {
  frameRate(30);
  //print("HELP COMPUTER!!!")
  textSize(18);
  concordance = new Concordance();
  //
  checkWordCounts(allParts);
  createCanvas(800, 480);
  currentMaxScroll = height;
  currentMinScroll = 0;
  arrivedColor = color(255,0,0);
  loadZoneDataPts();
  makeWords();
  for (var h = 0; h < zones.length; h++) {
  }
}

function draw() {
  //print(frameRate());
  background(50);
  for (var h = 0; h < zones.length; h++) {
    var checkDisplay = zones[h].testToDisplay();
    if (checkDisplay === true) 
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
      zones[h].attractor.wave();
      //FYI if we show wave w/o calling wave, marker will not be drawn with y offset 
      zones[h].attractor.showWave();
      zones[h].showZone();
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
  setColorForFullCatch();
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
  if (keyCode === DOWN_ARROW) {
    for (var h = 0; h < zones.length; h++) {
      //scroll up, and bring up the zone, attractor, and each object
      //update current max and min scroll 
      zones[h].setYUp(scrollVal);
      zones[h].attractor.setYUp(scrollVal);
      for (var i = 0; i < zones[h].vehicles.length; i++) {
        zones[h].vehicles[i].setYUp(scrollVal);
      }
      //update current max and min scroll 
      currentMaxScroll -= scrollVal;
      currentMinScroll -= scrollVal;
    }
  } else if (keyCode === UP_ARROW) {
    for (var h = 0; h < zones.length; h++) {
      //scroll down, and bring down the zone, attractor, and each object
      zones[h].setYDown(scrollVal);
      zones[h].attractor.setYDown(scrollVal);
      for (var i = 0; i < zones[h].vehicles.length; i++) {
        zones[h].vehicles[i].setYDown(scrollVal);
      }
      //update current max and min scroll 
      currentMaxScroll += scrollVal;
      currentMinScroll += scrollVal;
    }
  } else if (keyCode === ENTER) {
    for (var h = 0; h < zones.length; h++) {
      //this will release the vehicles
      for (var i = 0; i < zones[h].vehicles.length; i++) {
        if (zones[h].vehicles[i].isHooked) {
          //swapOutWords(zones[h].vehicles[i]);
          zones[h].vehicles[i].unHook();
      }
    }
  }
  hookedWords = [];
}
  // print("cMax " + currentMaxScroll);
  // print("cMin " + currentMinScroll);
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
     
     zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].setMaxspeed(random(2,7));
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

function swapOutWords()
{
  
}

//some feedback to show you have all the words in the line
//this is not working now -- variable problems? why won't counter increment?
function setColorForFullCatch()
{
  for (var i = 0; i < hookedWords.length; i++)
   {
     print(hookedWords.length);
     print("status is " +zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].arrived
      + "word is " + zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].word);
     if(zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].getArrived())
     {
       println("here!");
       counter+=1;
       print("this is  counter " + counter);
     }
     if(counter === hookedWords.length)
     {
       for (var j = 0; j < hookedWords.length; j++)
       {
         println("all here!");
         //zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].setColor();
       }
     }
   }
   counter = 0;
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
      //if the number of words associated with a part is more than 200, we'll need to make an extra zone
      // if(population>175)
      // {
      //   //how many words do we want per zone? divide the total by this number
      //   var loopVal = Math.round(population/175);
      //   //loopVal is the number of total zones we need to 
      //   // print("this is loopVal " +loopVal);
      //   //here we will need to make an extra zones, per loopVal
      //   for(var j = 0; j< loopVal; j++)
      //   {
      //     if(j> 0)
      //     {
      //     //we make a new name to associate with the additional divisions
      //       num = j.toString();
      //       partName = partName.concat(num);
      //     }
      //     print("this is the new part name " + partName);
      //     //we call make part using the name and the offset
      //     thisPart = makePart(partName, offset, population);
      //     thisZone = makeZone(partName, offset, thisPart.yMax);
      //     partsData[partsList[i]] = thisPart;
      //     //add the zone into the zone aray
      //     append(zones, thisZone);
      //     //***update offset before you go!!****
      //     offset = thisPart.yMax;
      //     print('offset for high pop ' + partName + "  "+ offset);
      //     population = population - population/loopVal;
      //     print("updated population is :"+ population);
      //   }
      //   //function? pass in offset (or make offset global) plus the number of times 
      //   //print(partName +"  has too many! " + partsCount[partName])
      // }
      // else
      // {
          thisPart = makePart(partName, offset, population);
          thisZone = makeZone(partName, offset, thisPart.yMax);
          partsData[partsList[i]] = thisPart;
          //add the zone into the zone array
          append(zones, thisZone);
          //***update offset before you go!!****
          offset = thisPart.yMax;
          print('this is the name ' + partName + " this is yMax "+ offset);
    //}
      //we need to determine the bondaries for each part of speech
      //the ymin should be the the current offset
      //the ymax is the ymin plus space to allow for the words. 
      // var ymax;
      // if(partName === "xx" )
      // {
      //   //make zone width smaller for the punctuation because they're so tiny
      //   ymax = offset + (population *.75)+ 25;
      // }
      // else
      // {
      //   ymax = offset + (population *1.5)+ 25;
      // }
      // //parts parameters: name, ymin, ymax, size, maxspeed, maxforce, cl
      // //colorMode(HSB, 360, 100, 100, 1);
      // var cl = color(210, 100, (i * 2.6 - 100) * -1);
      // var thisPart = new Part(partsList[i], offset, ymax, 10, random(.05, 5), random(.05, .5), cl);
      // //THIS IS JUST FOR THE ATTRACTOR
      // //attractor parameters: waveX, waveY, yOffset, theta, thetaMod, amp
      // attrY = ymax-offset/2;
      // var att = new Attractor(width + 10, offset, attrY, 0, .02, 30);
      
      // //THIS IS FOR THE ZONES
      // //zone parameters: name, yMin, yMax, attractor, vehicles
      // var inhabitantsArray = [];
      // var thisZone = new Zone(partsList[i], offset, ymax, inhabitantsArray, att);
      // //assign this part to the array using key-value pairing
    }
  }
}

function makePart(name, offset, population)
{
      print("in make part and the population is" + population);
      //use the current offset and info about the population to determine the max y value
      var ymax;
      print(name + " is name in makePart!");
      print(offset + " is intial  offset in makePart!");
      if(name === "xx" )
      {
        //make zone width smaller for the punctuation because they're so tiny
         ymax = offset + (population *.75)+ 25;
      }
      else
      {
         ymax = offset + (population *1.5)+ 25;
      }
      //parts parameters: name, ymin, ymax, size, maxspeed, maxforce, cl
      //colorMode(HSB, 360, 100, 100, 1);
      print(offset + " is updated  offset in makePart!");
      var cl = color(210, 100, offset * -1);
      //could use name here?
      var thisPart = new Part(name, offset, ymax, 10, random(.05, 5), random(.05, .5), cl);
      return thisPart;
}

function makeZone(name, offset, ymax)
{
  //THIS IS JUST FOR THE ATTRACTOR
  //attractor parameters: waveX, waveY, yOffset, theta, thetaMod, amp
  attrY = ymax-offset/2;
  var att = new Attractor(width + 10, offset, attrY, 0, .02, 30)
  //THIS IS FOR THE ZONES
  //zone parameters: name, yMin, yMax, attractor, vehicles
  var inhabitantsArray = [];
  var thisZone = new Zone(name, offset, ymax, inhabitantsArray, att);
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
      //We are now making  vehicles and storing them in an array
      //use the current part of speech to ID the parts data
      //print(partsData[tempParts[j]]);
      w = new Vehicle(
        //x, y
        random(width), random(partsData[tempParts[j]].yMin, partsData[tempParts[j]].yMax),
        //ymin, ymax, 
        partsData[tempParts[j]].yMin, partsData[tempParts[j]].yMax,
        //r, maxspeed, maxforce,
        partsData[tempParts[j]].size, partsData[tempParts[j]].maxspeed, partsData[tempParts[j]].maxforce,
        //word,lineref, posref
        tempWords[j], i, j);
      // print(w.word + " is the word");
      for (var k = 0; k < zones.length; k++) {
        if (tempParts[j] === zones[k].name) {
          append(zones[k].vehicles, w);
          //print(zones[k].vehicles);
        }
      }
    }
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
//new dynamic approach for zones and words
  
// function dynamicZonesAndWords()
// {
//   //loop on the outside to get each line in the program
//   for (var i = 0; i < rawText.length; i++) {
//     //split arrays into lines or sentences, work by line to make particles
//     var tempWords = split(trim(rawText[i]), " ");
//     var tempParts = split(trim(allParts[i]), " ");
//     //loop to create words using input text
//     for (var j = 0; j < tempWords.length; j++) {
    
//     if(isZoneInList(tempParts[j]) //check if a corresponding zone already exists
//     {

    
//     }
//     else
//     {
      
//     }
// //bring in words,  for each word, 
// //zones need a zone name and an identifier (if they are a second version of a zone)

// // if it does, and the zone is not full,
// // make the word, and  add the word to the zone array

// // if the zone does not exist, 
// // make a new zone
// // make the word, and  add the word to the zone array

// // if the zone does exist but is full, 
// // make a new zone
// // make the word, and  add the word to the zone array
// }

// function isZoneInList(thisPart)
// {
//   for(var k = 0; k<partsList; k++)
//     {
//       if(partsData[k] === thisPart)
//       {
//         return true;
//       }
//       else 
//       {
//         return false;
//       }
// }
