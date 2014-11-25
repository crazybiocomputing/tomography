// Toric solenoid
// Jean-Christophe Taveau
// Formulas from http://www.mathcurve.com/courbes3d/solenoidtoric/solenoidtoric.shtml
// http://crazybiocomputing.blogspot.com

// Initialization

setPasteMode("Transparent-zero");

var c=12.0;  // sphere radius
var a=100.0; // torus outer radius
var b=40.0;  // torus inner radius

out="Toric_Solenoid";
nx=256;ny=256;nz=256;
cx=nx/2;cy=ny/2;cz=nz/2;

// M A I N
//
Dialog.create("Parameters");
Dialog.addNumber("p", 9);
Dialog.addNumber("q", 2);
Dialog.show();
p=Dialog.getNumber();
q=Dialog.getNumber();

setBatchMode(true);
out=out + "_" + p + "/" + q;
newImage(out, "8-bit Black", nx, ny, nz);

// Create a sphere of radius 'c'
initSphere(c);

n=p/q;
for (t=0;t<q*2*PI;t+=0.05) {
   x=(a+b*cos(n*t))*cos(t);
   y=(a+b*cos(n*t))*sin(t);
   z=b*sin(n*t);
   translate("sphere3D",x*0.7+cx,y*0.7+cy,z*0.7+cz);
}

selectWindow(out);
setBatchMode(false);
exit();

// F U N C T I O N S
//
function translate(sph,tx,ty,tz)
{
  selectWindow(sph);side=getWidth();
  selectWindow(out);max=getWidth();
  for (z=1;z< side;z++)
  {
    selectWindow(sph);setSlice(z);
    run("Copy");
    selectWindow(out);
    if (tz+z<max)
    {
      setSlice(round(tz-side/2+z));
      makeRectangle(tx-side/2,ty-side/2,side,side);
      run("Paste");
    }
  }
}

function initSphere(radius) {
   newImage("sphere3D", "8-bit Black", 2*radius+1, 2*radius+1, 2*radius+1);
  rad2=radius*radius;
  cx=radius; cy=radius; cz=radius;
  options="code=[if (pow((x-"+cx+"),2)+pow((y-"+cy+"),2)+pow((z-"+cz+"),2)<="+rad2+") v=255] stack";
  run("Macro...", options);
}


