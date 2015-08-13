function Part(name, yMin, yMax, size, maxspeed, maxforce,cl)
{

  this.name = name;
  this.yMin = yMin;
  this.yMax = yMax;
  this.size = size;
  this.maxspeed = maxspeed;
  this.maxforce = maxforce;
  this.cl = cl;
  
  this.getName = function()
  {
    return this.name;
  }
  
  this.getYMin = function()
  {
    return this.yMin;
  }
  
  this.getYMax = function()
  {
    return this.yMax;
  }
  
  this.getYSize = function()
  {
    return this.size;
  }
  
  this.getMaxspeed = function()
  {
    return this.maxspeed;
  }
  
  this.getMaxForce = function()
  {
    return this.maxforce;
  }
  
  this.getCl = function()
  {
    return this.cl;
  }
}  