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
	TEST("XCheckWindowEvent",0);


	return 0;
}

Display* XOpenDisplay(char* display_name){
	

	
	return NULL;

}

void XClearWindow(Display* display, Window w){



}

void XWindowEvent(Display* display,Window w, long event_mask, XEvent* event_return){



}

int XLookupString(XKeyEvent * event_struct, char* buffer_return, int bytes_buffer, KeySym* keysym_return, XComposeStatus* status_in_out){


	return 0;
}


void XSetForeground(Display *display, GC gc, unsigned long foreground){



}

void XDrawPoint(Display *display,Drawable d,GC gc,int x, int y){


}



// DefaultScreen and XDefaultScreen are macros in X11, but defined as functions here
int DefaultScreen(Display* display){

}

// DefaultScreen and XDefaultScreen are macros in X11, but defined as functions here
int XDefaultScreen(Display* display){

}


// more macros defined as functions - The names are intended to convey the expected relative intensity of the colors.
unsigned long BlackPixel(Display *display, int screen_number){

	return 0;
}
unsigned long XBlackPixel(Display *display, int screen_number){

	return 0;
}
unsigned long WhitePixel(Display *display, int screen_number){

	return 0;
}
unsigned long XWhitePixel(Display *display, int screen_number){

	return 0;
}
GC XDefaultGC(Display* display, int screen_number){

	return 0;
}


//
void XSetWindowBackground(Display *display,Window w, unsigned long background_pixel){

}

//
Status XGetWindowAttributes(Display *display,Window w,XWindowAttributes *window_attributes_return){

	return 0;
}

void XSelectInput(Display *display,Window w,long event_mask){

}

void XMapWindow(Display* display, Window w){


}

void XStoreName(Display *display, Window w, char *window_name){


}

Window XCreateSimpleWindow( Display *display, Window parent, int x, int y, unsigned int width, unsigned int height, 
							unsigned int border_width, unsigned long border, unsigned long background){
							

}

Window DefaultRootWindow(Display* display){


}
Window XDefaultRootWindow(Display* display){


}

int XParseGeometry(char* parsestring, int* x_return, int* y_return, unsigned int* width_return, unsigned int* height_return){

	return 0;
}

GC XCreateGC(Display *display, Drawable d, unsigned long valuemask, XGCValues *values){

	return 0;
}

Status XGetGCValues(Display *display, GC gc, unsigned long valuemask, XGCValues *values_return){

	return 0;
}

char* XDisplayName(char* string){

	return string;
}

void TEST(char* string, int exit_code){
#ifdef GL_MODE
	fprintf(stderr, "TEST HERE: %s\n", string);
	if (exit_code==1) exit(1);
#endif
}
