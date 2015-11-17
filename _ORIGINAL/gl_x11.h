/*

GL replacement for x11 calls in vermiculate

*/


#ifndef Bool
#define Bool int
#define TRUE 1
#define True 1

#define FALSE 0
#define False 0

#endif

typedef char KeySym;

#define Drawable Window
#define Status int

#define ExposureMask 00110011  // something something something, USED BY XSelectInput 
#define KeyPressMask 10101010  // again.. this is BS right now, USED BY XSelectInput
#define GCForeground 00010101  // USED BY XGetGCValues 

#define ConfigureNotify 13 		// more BS, I'm not sure what int val is used, used by XEvent::type
#define Expose 666		 		// more BS, I'm not sure what int val is used, used by XEvent::type 



//typedef unsigned int * Display; // mydpy
typedef struct {
	// XExtData *ext_data;	/* hook for extension to hang data */
	//struct _XPrivate *private1;
	int fd;			/* Network socket. */
	int private2;
	int proto_major_version;/* major version of server's X protocol */
	int proto_minor_version;/* minor version of servers X protocol */
	char *vendor;		/* vendor of the server hardware */
     //XID private3;
	//XID private4;
	//XID private5;
	int private6;
	//XID (*resource_alloc)(	/* allocator function */		struct _XDisplay*	);
	int byte_order;		/* screen byte order, LSBFirst, MSBFirst */
	int bitmap_unit;	/* padding and data requirements */
	int bitmap_pad;		/* padding requirements on bitmaps */
	int bitmap_bit_order;	/* LeastSignificant or MostSignificant */
	int nformats;		/* number of pixmap formats in list */
	//ScreenFormat *pixmap_format;	/* pixmap format list */
	int private8;
	int release;		/* release of the server */
	//struct _XPrivate *private9, *private10;
	int qlen;		/* Length of input event queue */
	unsigned long last_request_read; /* seq number of last event read */
	unsigned long request;	/* sequence number of last request. */
	//XPointer private11;
	//XPointer private12;
	//XPointer private13;
	//XPointer private14;
	unsigned max_request_size; /* maximum number 32 bit words in request*/
	//struct _XrmHashBucketRec *db;
	//int (*private15)(struct _XDisplay*	);
	char *display_name;	/* "host:display" string used on this connect*/
	int default_screen;	/* default screen for operations */
	int nscreens;		/* number of screens on this server*/
	//Screen *screens;	/* pointer to list of screens */
	unsigned long motion_buffer;	/* size of motion buffer */
	unsigned long private16;
	int min_keycode;	/* minimum defined keycode */
	int max_keycode;	/* maximum defined keycode */
	//XPointer private17;
	//XPointer private18;
	int private19;
	char *xdefaults;	/* contents of defaults from server */
	/* there is more to this structure, but it is private to Xlib */
} Display;

typedef unsigned int Window; //mywindow
typedef unsigned int GC; //mygc
typedef unsigned int Colormap; //mycmap 
//typedef unsigned int XWindowAttributes; //xgwa



typedef struct {
	int x, y;			/* location of window */
	int width, height;		/* width and height of window */
	int border_width;		/* border width of window */
	int depth;			/* depth of window */
	//Visual *visual;			/* the associated visual structure */
	Window root;			/* root of screen containing window */
	int class;			/* InputOutput, InputOnly*/
	int bit_gravity;		/* one of the bit gravity values */
	int win_gravity;		/* one of the window gravity values */
	int backing_store;		/* NotUseful, WhenMapped, Always */
	unsigned long backing_planes;	/* planes to be preserved if possible */
	unsigned long backing_pixel;	/* value to be used when restoring planes */
	Bool save_under;		/* boolean, should bits under be saved? */
	Colormap colormap;		/* color map to be associated with window */
	Bool map_installed;		/* boolean, is color map currently installed*/
	int map_state;			/* IsUnmapped, IsUnviewable, IsViewable */
	long all_event_masks;		/* set of events all people have interest in*/
	long your_event_mask;		/* my event mask */
	long do_not_propagate_mask;	/* set of events that should not propagate */
	Bool override_redirect;		/* boolean value for override-redirect */
	//Screen *screen;			/* back pointer to correct screen */
} XWindowAttributes;


typedef struct {
    int type;    /* Expose */
    unsigned long serial;    /* # of last request processed by server */
    Bool send_event;    /* true if this came from a SendEvent request */
    Display *display;    /* Display the event was read from */
    Window window;
    int x, y;
    int width, height;
    int count;    /* if nonzero, at least this many more */
} XExposeEvent;

typedef struct {
    int type;    /* ConfigureNotify */
    unsigned long serial;    /* # of last request processed by server */
    Bool send_event;    /* true if this came from a SendEvent request */
    Display *display;    /* Display the event was read from */
    Window event;
    Window window;
    int x, y;
    int width, height;
    int border_width;
    Window above;
    Bool override_redirect;
} XConfigureEvent;


typedef struct {
            int type;                /* KeyPress or KeyRelease */
            unsigned long serial;    /* # of last request processed by server */
            Bool send_event;         /* true if this came from a SendEvent request */
            Display *display;        /* Display the event was read from */
            Window window;           /* ``event'' window it is reported relative to */
            Window root;             /* root window that the event occurred on */
            Window subwindow;        /* child window */
            //Time time;               /* milliseconds */
            int x, y;                /* pointer x, y coordinates in event window */
            int x_root, y_root;      /* coordinates relative to root */
            unsigned int state;      /* key or button mask */
            unsigned int keycode;    /* detail */
            Bool same_screen;        /* same screen flag */
} XKeyEvent;


// see http://tronche.com/gui/x/xlib/events/structures.html or google XEvent
typedef union _XEvent {
	int type;	/* must not be changed */
	/*
	XAnyEvent xany;
	*/
	XKeyEvent xkey;
	/*
	XButtonEvent xbutton;
	XMotionEvent xmotion;
	XCrossingEvent xcrossing;
	XFocusChangeEvent xfocus;
	*/
	XExposeEvent xexpose;
	
	/*
	XGraphicsExposeEvent xgraphicsexpose;
	XNoExposeEvent xnoexpose;
	XVisibilityEvent xvisibility;
	XCreateWindowEvent xcreatewindow;
	XDestroyWindowEvent xdestroywindow;
	XUnmapEvent xunmap;
	XMapEvent xmap;
	XMapRequestEvent xmaprequest;
	XReparentEvent xreparent;
	*/
	XConfigureEvent xconfigure;
	/*
	XGravityEvent xgravity;
	XResizeRequestEvent xresizerequest;
	XConfigureRequestEvent xconfigurerequest;
	XCirculateEvent xcirculate;
	XCirculateRequestEvent xcirculaterequest;
	XPropertyEvent xproperty;
	XSelectionClearEvent xselectionclear;
	XSelectionRequestEvent xselectionrequest;
	XSelectionEvent xselection;
	XColormapEvent xcolormap;
	XClientMessageEvent xclient;
	XMappingEvent xmapping;
	XErrorEvent xerror;
	XKeymapEvent xkeymap;
	*/
	long pad[24];
} XEvent; 




//typedef unsigned int XColor;  // mycolors
#define DoRed 110000
#define DoGreen 001100
#define DoBlue 000011

typedef struct {
	unsigned long pixel;			/* pixel value */
	unsigned short red, green, blue;	/* rgb values */
	char flags;				/* DoRed, DoGreen, DoBlue */	
	char pad;
} XColor;


typedef struct {
	int function;			/* logical operation */
	unsigned long plane_mask;	/* plane mask */
	unsigned long foreground;	/* foreground pixel */
	unsigned long background;	/* background pixel */
	int line_width;			/* line width (in pixels) */
	int line_style;			/* LineSolid, LineOnOffDash, LineDoubleDash */
	int cap_style;			/* CapNotLast, CapButt, CapRound, CapProjecting */
	int join_style;			/* JoinMiter, JoinRound, JoinBevel */
	int fill_style;			/* FillSolid, FillTiled, FillStippled FillOpaqueStippled*/
	int fill_rule;			/* EvenOddRule, WindingRule */
	int arc_mode;			/* ArcChord, ArcPieSlice */
	//Pixmap tile;			/* tile pixmap for tiling operations */
	//Pixmap stipple;			/* stipple 1 plane pixmap for stippling */
	int ts_x_origin;		/* offset for tile or stipple operations */
	int ts_y_origin;
	//Font font;			/* default text font for text operations */
	int subwindow_mode;		/* ClipByChildren, IncludeInferiors */
	Bool graphics_exposures;	/* boolean, should exposures be generated */
	int clip_x_origin;		/* origin for clipping */
	int clip_y_origin;
	//Pixmap clip_mask;		/* bitmap clipping; other calls for rects */
	int dash_offset;		/* patterned/dashed line information */
	char dashes;
} XGCValues;

typedef struct _XComposeStatus {
                char * compose_ptr;
                int chars_matched;
} XComposeStatus;  // used by XLookupString

extern int XCheckWindowEvent (Display*, Window, long, XEvent*);
extern Display* XOpenDisplay(char *display_name);
extern void XClearWindow(Display*, Window);
extern void XWindowEvent(Display*, Window, long, XEvent*);
extern int XLookupString(XKeyEvent*, char*, int, KeySym*, XComposeStatus*);
extern void XSetForeground(Display*, GC, unsigned long);
extern void XDrawPoint(Display *display,Drawable d,GC gc,int x, int y);

// DefaultScreen and XDefaultScreen are macros in X11, but defined as functions here
extern int DefaultScreen(Display*);
extern int XDefaultScreen(Display*);

// more macros defined as functions - The names are intended to convey the expected relative intensity of the colors.
extern unsigned long BlackPixel(Display*, int);
extern unsigned long XBlackPixel(Display*, int);
extern unsigned long WhitePixel(Display*, int);
extern unsigned long XWhitePixel(Display*, int);
extern GC XDefaultGC(Display*, int);
extern Window DefaultRootWindow(Display*);
extern Window XDefaultRootWindow(Display*);

//
extern void XSetWindowBackground(Display*,Window, unsigned long);
extern Status XGetWindowAttributes(Display*,Window,XWindowAttributes*);
extern void XSelectInput(Display*,Window,long);
extern void XMapWindow(Display*, Window);
extern void XStoreName(Display*, Window, char*);
extern Window XCreateSimpleWindow( Display*, Window, int, int, unsigned int, unsigned int, unsigned int, unsigned long, unsigned long);
extern int XParseGeometry(char*, int*, int*, unsigned int*, unsigned int*);
extern GC XCreateGC(Display*, Drawable, unsigned long, XGCValues*);
extern Status XGetGCValues(Display*, GC, unsigned long, XGCValues*);
extern char* XDisplayName(char*);

extern Status XAllocColor(Display *display, Colormap colormap, XColor *screen_in_out);


#define GL_MODE

extern void TEST(char*,int);


