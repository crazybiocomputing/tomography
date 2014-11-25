// Marching squares
// Jean-Christophe Taveau
// http://crazybiocomputing.blogspot.com
// Nov 2014

// v0----e0----v1
//  |           |
//  |           |
//  e3         e1
//  |           |
//  |           |
// v3----e2----v2
//
// key = v3|v2|v1|v0
//

var lines={
"0000":[],
"1111":[],
"0001":[0,3],
"0010":[0,1],
"0100":[1,2],
"1000":[2,3],
"1110":[0,3],
"1101":[0,1],
"1011":[1,2],
"0111":[2,3],
"0011":[1,3],
"0110":[0,2],
"1100":[1,3],
"1001":[0,2],
"0101":[0,1,2,3],
"1010":[0,3,1,2]
};

// Marching Squares Parameters
var threshold=128;
var SIZE=2;
var filename='';
var interpolate = null;

var square={};
square.pixels=[];

// Output vertices
var vertices=[];


// M A I N

var imp=IJ.getImage();
var ip=imp.getProcessor();
var w=imp.getWidth();
var h=imp.getHeight();
var nz=imp.getStackSize();

// Small GUI to set parameters
dialog();
square.size=SIZE;

// Main Loop
for (var y=0;y<h-SIZE;y+=SIZE) {
  for (var x=0;x<w-SIZE;x+=SIZE) {
    square.x=x;
    square.y=y;

    square.pixels[0]=ip.get(x,y);
    square.pixels[1]=ip.get(x+SIZE,y);
    square.pixels[2]=ip.get(x+SIZE,y+SIZE);
    square.pixels[3]=ip.get(x,y+SIZE);

    square.code =(square.pixels[3] > threshold)?"1":"0";
    square.code+=(square.pixels[2] > threshold)?"1":"0";
    square.code+=(square.pixels[1] > threshold)?"1":"0";
    square.code+=(square.pixels[0] > threshold)?"1":"0";

    if (square.code !="0000" && square.code !="1111") {
      createVertices(square);
    }
  }
}

// Save contour lines as OBJ file
saveAsOBJ();

throw("-- End of Script -- ");


// F U N C T I O N S

function dialog() {
  var gd = new GenericDialog("Marching Squares");
  gd.addNumericField("Threshold: ", threshold, 0);
  gd.addNumericField("Square Size: ", SIZE, 0);
  gd.addChoice("Interpolation: ", ["None","Bilinear"], 0);

  gd.showDialog();
  if (gd.wasCanceled()) {
    throw("-- End of Script --");
    return;
  }
  threshold = gd.getNextNumber();
  SIZE = gd.getNextNumber();
  var mode = gd.getNextChoiceIndex();

  if (mode == 0) {
    interpolate = function (x0,y0,v0,x1,y1,v1) {
      return interpolateNone(x0,y0,v0,x1,y1,v1);
    }
  }
  else {
    interpolate = function (x0,y0,v0,x1,y1,v1) {
      return interpolateBilinear(x0,y0,v0,x1,y1,v1);
    }
  }

  var saveDialog = new SaveDialog("Save OBJ File As ...","Untitled",".obj");
  filename=saveDialog.getDirectory()+saveDialog.getFileName();

}


function createVertices(probe) {
  var edges = lines[probe.code];
  for (var i=0;i<edges.length;i++) {
    var vertex=null;
    switch (edges[i]) {
    case 0: 
      vertex = interpolate(
        probe.x             ,probe.y,probe.pixels[0],
        probe.x + probe.size,probe.y,probe.pixels[1]
      );      
      break;
    case 1:
      vertex = interpolate(
        probe.x + probe.size,probe.y             ,probe.pixels[1],
        probe.x + probe.size,probe.y + probe.size,probe.pixels[2]
      );     
      break;
    case 2:
      vertex = interpolate(
        probe.x + probe.size,probe.y + probe.size,probe.pixels[2],
        probe.x             ,probe.y + probe.size,probe.pixels[3]
      );     
      break;
    case 3:
      vertex = interpolate(
        probe.x,probe.y             ,probe.pixels[0],
        probe.x,probe.y + probe.size,probe.pixels[3]
      );      
      break;
    }
    vertices.push(vertex);
  }
}

function interpolateNone(x0,y0,v0,x1,y1,v1) {
  var x = (x0 + x1)/2.0;
  var y = (y0 + y1)/2.0;
  var z = 0.0;
  return {"x":x,"y":y,"z":z};
}

function interpolateBilinear(x0,y0,v0,x1,y1,v1) {
  var d = v1 - v0;
  var x = x0 + (x1 - x0) * (threshold - v0)/(v1 - v0);
  var y = y0 + (y1 - y0) * (threshold - v0)/(v1 - v0);
  var z = 0.0;
  return {"x":x,"y":y,"z":z};
}

function saveAsOBJ() {

  // Create/Open output text in file
  var file = new java.io.File(filename);
  var  printWriter = new java.io.PrintWriter(filename);

  // Header
  var text='';
  text+="# Marching Squares\n";
  text+="# Jean-Christophe Taveau\n";
  text+="# CrazyBioComputing\n";
  text+="# WaveFront OBJ\n";
  text+="# Vertices: "+vertices.length+"\n";
  text+="\n";
  text+="o "+imp.getTitle()+"\n";
  text+="\n";
  printWriter.println(text);

  // Vertices
  for (var i=0;i<vertices.length;i++) {
    printWriter.println("v "+vertices[i].x+" "+vertices[i].y + " " + vertices[i].z);
  }
  printWriter.println(" ");

  // Faces (aka lines)
  // *Note*: The first vertex in OBJ format has the index 1 (and not 0).
  for (var i=1;i<=vertices.length;i+=2) 
    printWriter.println("f "+(i)+" "+(i+1) );


  // Close file
  printWriter.close ();       

}

