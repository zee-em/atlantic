function Img(img,x,y)
{
  this.img = img;
  this.y = y;
  this.x = x;
  
  this.show = function()
  {
     image(img,this.x,this.y);
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