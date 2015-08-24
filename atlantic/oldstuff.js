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