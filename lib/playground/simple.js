//Read and eval library
fs=require('fs');
eval(fs.readFileSync(__dirname+ '/glMatrix-0.9.5.min.js','utf8'));

var createArray = require('../helpers.js').createArray;

var WebGL=require('node-webgl');
var Image = WebGL.Image;
var document = WebGL.document();

document.setTitle("simple openGL");
requestAnimFrame = document.requestAnimationFrame;

var gl;

function initGL(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}

function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

  //display();
}

var vbo;

function tick() {
  drawScene();

  requestAnimFrame(tick);
}

function makeCheckImage(width,height){
  var i,j,c;

  var checkImage = createArray(width,height,3);
  
  for (j=0; j < height; j++){
    for (i=0; i < width; i++){
      c = ( ((i&0x8)==0) ^ ((j&0x8)==0) ) * 255; // make a checkerboard
      //c = 0;
      checkImage[i][j][0] = c;
      checkImage[i][j][1] = c;
      checkImage[i][j][2] = c;
    }
  }

  return checkImage;
}

function buffers(canvas){
  var jsArray = [255,255,255];
  var float32Data = new Float32Array(jsArray);
  vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, float32Data, gl.DYNAMIC_DRAW);
}

function init(canvas){
  gl.clearColor(0.0,0.0,0.0,0.0);
  //??gl.enable(gl.DEPTH_TEST); //DON'T THINK I NEED
  //gl.shadeModel(gl.GL_FLAT);  // NOT_IMPLEMENTED, may need
  
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1); //GL_UNPACK_ALIGNMENT
}

function display(){
  //glClear(GL_COLOR_BUFFER_BIT);
  //glRasterPos2i(-1,-1);  //may not need
  //glDrawPixels(checkImageWidth, checkImageHeight, GL_RGB, GL_UNSIGNED_BYTE, checkImage);
  //glFlush();
  //gl.clearColor(0,0,0,1);
  //gl.clear(gl.COLOR_BUFFER_BIT);
  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  //var mode = gl.TRIANGLE_STRIP;
  //var length = 3;
  //gl.drawArrays(mode, 0, length);
  //gl.begin(gl.POINTS); gl.vertex(1, 2, 3); gl.end();
}

function webGLStart() {
  console.log('does NOT look like I will be able to do what I want without a shader!!!');
  var canvas = document.createElement("canvas",800,600,250,100);
  initGL(canvas);
  document.on("resize", function (evt) {
    // console.log("resize "+canvas.width+" x "+canvas.height);
    gl.viewportWidth=canvas.width;
    gl.viewportHeight=canvas.height;
  });
  canvas.checkImage = makeCheckImage(canvas.width, canvas.height);
  buffers();

  init(canvas);

  tick();
}

webGLStart();

