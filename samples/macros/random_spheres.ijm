// Set of random spheres
// Jean-Christophe Taveau
// http://crazybiocomputing.blogspot.com

maxRad=50;
out="models";
setPasteMode("Add");
print("\\Clear");
setBatchMode(true);

// 1- Template
newImage("sphere", "8-bit Black", maxRad*2+1, maxRad*2+1, maxRad*2+1);
initSphere(maxRad);

// 2- Spheres set
newImage(out, "8-bit Black", 256, 256, 256);
for (i=0;i<10;i++)
{
  x=10+random()*200;
  y=10+random()*200;
  z=10+random()*200;
  setRadius("sphere","tmp",20+random()*20);
  translate("tmp",x,y,z);
  selectWindow("tmp");close();
}
selectWindow("models");
setBatchMode(false);
exit();

// F U N C T I O N S

function initSphere (rad)
{
  cx=rad; cy=rad; cz=rad;
  rad2=rad*rad;
  options="code=[if (pow((x-"+cx+"),2)+pow((y-"+cy+"),2)+pow((z-"+cz+"),2)<"+rad2+")v=255] stack";
  run("Macro...", options);
}

function translate(sph,tx,ty,tz)
{
  selectWindow(sph);side=getWidth();
  selectWindow(out);max=getWidth();
  for (z=1;z< side;z++)
  {
    selectWindow(sph);setSlice(z);
    run("Copy");
    selectWindow("models");
    if (tz+z<max)
    {
      setSlice(tz+z);
      makeRectangle(tx,ty,side,side);
      run("Paste");
    }
  }
}

function setRadius(sph_in,sph_out,rad)
{
  newSize=rad*2+1;
  selectWindow(sph_in);
  run("Scale...", "x=- y=- z=- width="+newSize+" height="+newSize+" depth="+newSize+"  interpolation=Bilinear average process create title="+sph_out);
}
