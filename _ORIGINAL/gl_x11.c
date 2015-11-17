//#define DEBUG

/*

GL replacement for x11 calls in vermiculate

*/

#include <stdio.h>
#include "gl_x11.h"

#ifdef __STDC__
# include <stdlib.h>
#endif

#ifdef HAVE_UNISTD_H
# include <unistd.h>
#endif

int XCheckWindowEvent (Display* display, Window w, long event_mask, XEvent* event_return){
	//TEST("XCheckWindowEvent",0);
	// this happens alot

	// checks for keypresses???

	return 0;
}


void XSetForeground(Display *display, GC gc, unsigned long foreground){
#ifdef DEBUG	
printf("%d - ",foreground);
#endif
	//TEST("XSetForeground",0);
	// this happens alot
	
	// determines COLOR??? in GC???

}

void XDrawPoint(Display *display,Drawable d,GC gc,int x, int y){
#ifdef DEBUG
printf("[%d,%d]\n",x,y);
#endif
	
	//TEST("XDrawPoint",0);
	// this happens alot
	
	// Draws point
	
}

Status XAllocColor(Display *display, Colormap colormap, XColor *screen_in_out){
#ifdef DEBUG 
TEST("XAllocColor",0);
#endif
	//this happens a bit
	return 0;
}


Display* XOpenDisplay(char* display_name){
	TEST("XOpenDisplay",0);

	
	return NULL;

}

void XClearWindow(Display* display, Window w){
	TEST("XClearWindow",0);


}

void XWindowEvent(Display* display,Window w, long event_mask, XEvent* event_return){
	TEST("XWindowEvent",0);
	

}

int XLookupString(XKeyEvent * event_struct, char* buffer_return, int bytes_buffer, KeySym* keysym_return, XComposeStatus* status_in_out){
	TEST("XLookupString",0);

	return 0;
}

// DefaultScreen and XDefaultScreen are macros in X11, but defined as functions here
int DefaultScreen(Display* display){
	TEST("DefaultScreen",0);
	
}

// DefaultScreen and XDefaultScreen are macros in X11, but defined as functions here
int XDefaultScreen(Display* display){
	TEST("XDefaultScreen",0);
}


// more macros defined as functions - The names are intended to convey the expected relative intensity of the colors.
unsigned long BlackPixel(Display *display, int screen_number){
	TEST("BlackPixel",0);
	return 0;
}
unsigned long XBlackPixel(Display *display, int screen_number){
	TEST("XBlackPixel",0);
	return 0;
}
unsigned long WhitePixel(Display *display, int screen_number){
	TEST("WhitePixel",0);
	return 0;
}
unsigned long XWhitePixel(Display *display, int screen_number){
	TEST("XWhitePixel",0);
	return 0;
}
GC XDefaultGC(Display* display, int screen_number){
	TEST("XDefaultGC",0);
	return 0;
}


//
void XSetWindowBackground(Display *display,Window w, unsigned long background_pixel){
	TEST("XSetWindowBackground",0);
}

//
Status XGetWindowAttributes(Display *display,Window w,XWindowAttributes *window_attributes_return){
	TEST("XGetWindowAttributes",0);
	return 0;
}

void XSelectInput(Display *display,Window w,long event_mask){
	TEST("XSelectInput",0);
}

void XMapWindow(Display* display, Window w){
	TEST("XMapWindow",0);

}

void XStoreName(Display *display, Window w, char *window_name){
	TEST("XStoreName",0);

}

Window XCreateSimpleWindow( Display *display, Window parent, int x, int y, unsigned int width, unsigned int height, 
							unsigned int border_width, unsigned long border, unsigned long background){
	TEST("XCreateSimpleWindow",0);							

}

Window DefaultRootWindow(Display* display){
	TEST("DefaultRootWindow",0);

}
Window XDefaultRootWindow(Display* display){
	TEST("XDefaultRootWindow",0);

}

int XParseGeometry(char* parsestring, int* x_return, int* y_return, unsigned int* width_return, unsigned int* height_return){
	TEST("XParseGeometry",0);
	return 0;
}

GC XCreateGC(Display *display, Drawable d, unsigned long valuemask, XGCValues *values){
	TEST("XCreateGC",0);
	return 0;
}

Status XGetGCValues(Display *display, GC gc, unsigned long valuemask, XGCValues *values_return){
	TEST("XGetGCValues",0);
	return 0;
}

char* XDisplayName(char* string){
	TEST("XDisplayName",0);
	return string;
}





void TEST(char* string, int exit_code){
#ifdef GL_MODE
	fprintf(stderr, "TEST HERE: %s\n", string);
	if (exit_code==1) exit(1);
#endif
}
