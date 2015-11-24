var GLFW= require('node-glfw');
var log = console.log;

if (!GLFW.Init()) {
  log("Failed to initialize GLFW");
  process.exit(-1);
}

var createWindow = function (width, height) {
    var attribs = GLFW.WINDOW;

    GLFW.DefaultWindowHints();
    var monitors = GLFW.GetMonitors();
    var primaryMonitor = monitors[0];
    //look for is_primary === true in array of monitors
    
	GLFW.WindowHint(GLFW.FULLSCREEN, 0);
	GLFW.WindowHint(GLFW.RESIZABLE, 1);
	//GLFW.WindowHint(GLFW.VISIBLE, 1);
	GLFW.WindowHint(GLFW.DECORATED, 0);
	//GLFW.WindowHint(GLFW.RED_BITS, 8);
	//GLFW.WindowHint(GLFW.GREEN_BITS, 8);
	//GLFW.WindowHint(GLFW.BLUE_BITS, 8);
	//GLFW.WindowHint(GLFW.DEPTH_BITS, 24);
	//GLFW.WindowHint(GLFW.REFRESH_RATE, 0);
    
    
	
    var windowTitle = "tets-changeme";
    var windowInitialized = (window=GLFW.CreateWindow(
    	primaryMonitor.width, 
    	primaryMonitor.height-80, 
    	windowTitle//, 
    	//null
    	//GLFW.NULL
	));
	GLFW.SetWindowPos(window, 0,0);
	//GLFW.SetWindowSize(window, primaryMonitor.width, primaryMonitor.height-200);
    if (!windowInitialized) {
        GLFW.Terminate();
        throw "Can't initialize GL surface";
    }

    GLFW.MakeContextCurrent(window);


    GLFW.SwapBuffers(window);
    GLFW.SwapInterval(0); // Disable VSync (we want to get as high FPS as possible!)

};

createWindow()

while(!GLFW.WindowShouldClose(window) && !GLFW.GetKey(window, GLFW.KEY_ESCAPE)) {
  // Get window size (may be different than the requested size)
  var wsize = GLFW.GetFramebufferSize(window);
  //if(wsize) log("FB size: "+wsize.width+', '+wsize.height);

  GLFW.testScene(wsize.width, wsize.height);
  
  // Swap buffers
  GLFW.SwapBuffers(window);
  GLFW.PollEvents();

}

// Close OpenGL window and terminate GLFW
GLFW.DestroyWindow(window);
GLFW.Terminate();

process.exit(0);