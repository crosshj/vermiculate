#CFLAGS = -lm -lX11
CLFAGS = -lm


all:	vermiculate
	
	
setup:
	alias ver="make && ./vermiculate"

vermiculate:	vermiculate.c yarandom gl_x11
	gcc -o vermiculate $(CFLAGS) vermiculate.c yarandom.o gl_x11.o

usleep:	usleep.c
	gcc -c usleep.c
	
yarandom:	yarandom.c
	gcc -c yarandom.c
	
gl_x11:	gl_x11.c
	gcc -c gl_x11.c 

clean:
	rm -f *.exe *.o *.log
	
