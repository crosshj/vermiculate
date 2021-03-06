//Read and eval library
fs = require('fs');
eval(fs.readFileSync(__dirname + '/glMatrix-0.9.5.min.js', 'utf8'));
var createArray = require('../helpers.js').createArray;
var WebGL = require('node-webgl');
var Image = WebGL.Image;
var document = WebGL.document();

document.setTitle("simple openGL");
requestAnimFrame = document.requestAnimationFrame;

var gl;

var preProcDir = ["#ifdef GL_ES", "precision mediump float;","#endif",""].join("\n");

var shadersSource = {
    vertex: " \
        attribute vec2 a_position; \n\
        uniform vec2 u_resolution; \n\
                \n\
        void main() { \n\
           // convert the rectangle from pixels to 0.0 to 1.0 \n\
           vec2 zeroToOne = a_position / u_resolution; \n\
                \n\
           // convert from 0->1 to 0->2 \n\
           vec2 zeroToTwo = zeroToOne * 2.0; \n\
                \n\
           // convert from 0->2 to -1->+1 (clipspace) \n\
           vec2 clipSpace = zeroToTwo - 1.0; \n\
                \n\
           gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); \n\
        }\n",
    fragment: preProcDir +
        "uniform vec4 u_color; \n\
                \n\
        void main() { \n\
            gl_FragColor = u_color; \n\
        }\n"
};

function initShaders(source) {

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, source.fragment);
    gl.compileShader(fragShader);
    if (gl.getShaderParameter(fragShader, gl.COMPILE_STATUS) == 0){
        throw new Error(gl.getShaderInfoLog(fragShader));
    }
      
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, source.vertex);
    gl.compileShader(vertShader);
    if (gl.getShaderParameter(vertShader, gl.COMPILE_STATUS) == 0){
        throw new Error(gl.getShaderInfoLog(vertShader));
    }

    var prog = gl.createProgram();
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    var loc = gl.getAttribLocation(prog, "a_position");
    
    var uloc = gl.getUniformLocation(prog, "u_resolution");
    var colorloc = gl.getUniformLocation(prog, "u_color");

    gl.uniform2f(uloc, gl.viewportWidth, gl.viewportHeight);
    

    return {
        src: source,
        compiled: {
            vertex: vertShader,
            fragment: fragShader
        },
        program: prog,
        location: loc,
        ulocation: uloc,
        colorloc: colorloc,
        size: 2
    }
}

function initBuffers(canvas) {
    var vertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    var checkImage = canvas.images.checkImage;
    var vertices = canvas.images.checkImage.vertices;

    gl.enableVertexAttribArray(shaders.location);
    gl.vertexAttribPointer(shaders.location, shaders.size, gl.FLOAT, false, 0, 0);

    for(var i=5; i<vertices.length;i+=6){
        var _v=[
            vertices[i-5], vertices[i-4],
            vertices[i-3], vertices[i-2],
            vertices[i-1], vertices[i]
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_v), gl.STATIC_DRAW);
        gl.uniform4f(shaders.colorloc, Math.random(), Math.random(), Math.random(), 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    return {
        vertBuffer: vertBuffer,
        vertices: vertices
    }
}

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
        console.log("Some init error: " + e)
    }

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertBuffer);
    //gl.uniform2f(shaders.ulocation, canvas.width, canvas.height);
    //gl.vertexAttribPointer(shaders.location, shaders.size, gl.FLOAT, false, 0, 0);
    //console.log(buffers.vertices.length);


}

function tick() {
    drawScene();

    requestAnimFrame(tick);
}

function makeCheckImage(canvas) {
    var i, j, c;
    var height = canvas.height;
    var width = canvas.width;
    canvas.images = canvas.images || {};
    canvas.images.checkImage = createArray(width, height, 3);
    canvas.images.checkImage.vertices = [];
    var checkImage = canvas.images.checkImage;
    var vertices = canvas.images.checkImage.vertices;

    for (j = 0; j < height; j++) {
        for (i = 0; i < width; i++) {
            c = (((i & 0x8) == 0) ^ ((j & 0x8) == 0)) * 255; // make a checkerboard
            //c = 0;
            checkImage[i][j][0] = c;
            checkImage[i][j][1] = c;
            checkImage[i][j][2] = c;
            vertices.push(i);   vertices.push(j);
            vertices.push(i+1); vertices.push(j+1);
            vertices.push(i+1); vertices.push(j);
        }
    }

    return checkImage;
}

var buffers = {};
var shaders = {};
var canvas = {};

function webGLStart() {
    canvas = document.createElement("canvas", 800, 600, 250, 100);
    initGL(canvas);
    document.on("resize", function(evt) {
        //console.log(evt);
        //console.log("resize "+evt.width+" x "+evt.height);
        gl.viewportWidth = canvas.width = evt.width;
        gl.viewportHeight = canvas.height = evt.height;
    });
    makeCheckImage(canvas);
    
    shaders = initShaders(shadersSource);
    buffers = initBuffers(canvas);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    tick();
}

webGLStart();