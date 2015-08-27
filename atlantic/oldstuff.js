      //if the number of words associated with a part is more than 200, we'll need to make an extra zone
      // if(population>200)
      // {
      //   //how many words do we want per zone? divide the total by this number
      //   var loopVal = Math.round(population/200); //********round up?
      //   //loopVal is the number of total zones we need to 
      //   // print("this is loopVal " +loopVal);
      //   //here we will need to make an extra zones, per loopVal
      //   for(var j = 0; j< loopVal; j++)
      //   {
      //     if(j> 0)
      //     {//we make a new name to associate with the additional divisions
      //       var num = j.toString();
      //       partName = partName.concat(num);
      //       print(partName);
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
      //   // print('offset for high pop ' + partName + "  "+ offset);
      //     population = population - population/loopVal;
      //     //print("updated population is :"+ population);
      //   }
      // }  
      //   //function? pass in offset (or make offset global) plus the number of times 
      //   //print(partName +"  has too many! " + partsCount[partName])
      // else
      // {
      
      
      //some feedback to show you have all the words in the line
//this is not working now
// function setColorForFullCatch()
// {
//   for (var i = 0; i < hookedWords.length; i++)
//   {
//     print(hookedWords.length);
//     print("status is " +zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].arrived
//       + "word is " + zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].word);
//     if(zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].getArrived())
//     {
//       println("here!");
//       counter+=1;
//       print("this is  counter " + counter);
//     }
//     if(counter === hookedWords.length)
//     {
//       for (var j = 0; j < hookedWords.length; j++)
//       {
//         println("all here!");
//         //zones[hookedWords[i].ipos].vehicles[hookedWords[i].jpos].setColor();
//       }
//     }
//   }
//   counter = 0;
// }


// //something wrong here, with concatenating the lines...
// function saveOutNewText()
// {
//   print("in saveOutNewText()!");
//   for (var h = 0; h < zones.length; h++) 
//   {
//       //this will release the vehicles
//       for (var i = 0; i < zones[h].vehicles.length; i++) 
//       {
//         var theLine = zones[h].vehicles[i].getLineref();
//         var thePos = zones[h].vehicles[i].getPosref();
//         newWords[theLine][thePos] = zones[h].vehicles[i].getWord();
//         newParts[theLine][thePos] = zones[h].vehicles[i].getPart();
//         // newWords[theLine][thePos] = "changed!";
//         // newParts[theLine][thePos] = "all new!";
//       }
//   }
//   //print them out to see....
//   for (var i = 0; i < newWords.length; i++) 
//   { 
//     //empty strings to hold new lines
//     var newStringWords ="";
//     var newStringParts = "";
//     for (var j = 0; j < newWords[i].length; j++) 
//     {
//       newStringWords= newStringWords.concat(newWords[i]);
//       newStringWords= newStringWords.concat(" ");
//       //print(newStringWords);
//       newStringParts= newStringParts.concat(newParts[i]);
//       newStringParts= newStringParts.concat(" ");
//       //print(newWords[i][j]);
//       //print(newParts[i][j]);
//     }
//     newWords[i]= newStringWords;
//     newParts[i]= newStringParts;
//   }
//   print(newWords);
//   print(newParts);
//   //var list =["apple", "banana", "peach", "kimchi"];
//   //saveStrings(list,"newWords.txt");
//   saveStrings(newWords,"newWords.txt");
//   saveStrings(newParts,"newParts.txt");
// }