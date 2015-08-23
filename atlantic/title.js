function Title(word,x,y,size)
{
  this.word = word;
  this.y = y;
  this.x = x;
  this.size = size;
  
  this.show = function()
  {
     noStroke();
     textSize(this.size);
     text(this.word,this.x,this.y);
  }
  
 this.setYDown = function(val)
  {
   this.y+=val;
  }

 this.setYUp = function(val)
  {
   this.y-=val;
  }
}