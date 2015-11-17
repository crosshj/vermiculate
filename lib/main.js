module.exports = vermiculate_main;

var global = require('./global');
var palupdate = global.palupdate;
var randpal = global.randpal;
var newonscreen = global.newonscreen;
var readkey = global.readkey;
var threads = global.getThreads();
var getWhichThread = global.getWhichThread;
var setWhichThread = global.setWhichThread;

var helpers = require('./helpers');
var createArray = helpers.createArray;
var random1 = helpers.random1;


var constants = require('./constants')
var WIN_WIDTH = constants.WIN_WIDTH;
var WIN_HEIGHT = constants.WIN_HEIGHT;
var thrmax = constants.thrmax;
var tmodes = constants.tmodes;



function clearscreen(){
	console.log("TODO: clear the screen");
}
function bordupdate(){
	console.log("TODO: bordupdate");	
}
function gridupdate(){
	console.log("TODO: gridupdate");	
}
function wasakeypressed(){
	return true;
}


function vermiculate_main(){

  var had_instring = (global.instring != 0);
  var tick = 0;
  var halted = false;
  var autopal = false;
  var cleared;
  var point = createArray(WIN_WIDTH, WIN_HEIGHT);
  
  global.maininit();
  palupdate(true);

  do {
		clearscreen();
		for (var thr = 1; thr <= getWhichThread(); thr++){
			newonscreen(thr);
		}
		if (autopal)
		{
		randpal();
		palupdate(false);
		}
		bordupdate();
		gridupdate(false);
		cleared = false;

  		do {
	        while (wasakeypressed()) {
	            ch = readkey ();
	            switch (ch) {
	            	case 'M':
	              		ch = readkey ();
						switch (ch){
							case 'A':
							case 'N':
								var othreads = getWhichThread();
							  	if (ch == 'N') setWhichThread(0);
							  	do {
							        ch = readkey ();
							        switch (ch) {
							            case '1': case '2': case '3':
							            case '4': case '5': case '6':
							            case '7': case '8': case '9':
							        		var _th = getWhichThread()+1;
							        		setWhichThread(_th-1);
							        		threads[_th].tmode = ch - '0';
							        		break;
							        	case 'R':
							        		var _th2 = getWhichThread()+1;
							        		setWhichThread(_th-1);
							        		threads[_th2].tmode = 
							          			random1 (tmodes - '0') + 1;
							        		break;
							        }
						    	} while (!(ch == '\15' || ch == '#' || getWhichThread() == thrmax));
							    if (getWhichThread() == 0) setWhichThread(othreads);
							    cleared = true;
					    }
						break;
					}
					break;
// ------------------------------------------------
			}
	} while(false);
	} while(false);}
/*
// ------------------------------------------------

            case 'C':
              pickbank ();
              if (bankt > 0)
                {
                  ch = readkey ();
                  switch (ch)
                  {
                  case 'D':
                    ch = readkey ();
                    switch (ch)
                      {
                            case '1': case '2': case '3':
                            case '4': case '5': case '6':
                            case '7': case '8': case '9':
// Careful!  The following macro needs to be at the beginning of any
// block in which it's invoked, since it declares variables: 
#define forallinbank(LDP) linedata *LDP; int bankc; \
            for (bankc = 1;   \
            (LDP = &thread[bank[bankc - 1] - 1],      \
            bankc <= bankt); bankc++)
                        {
                        forallinbank (L) L->slice = degs / (ch - '0');
                        }
                        break;
                      case 'M':
                        {
                        forallinbank (L) L->slice = 0;
                        }
                        break;
                      }
                    break;
                  case 'S':
                    {
                      forallinbank (L)
                      {
                        L->otslen = L->tslen;
                        L->tslen = 0;
                      }
                    }
                    do
                      {
                        char oldch = ch;
                        ch = readkey ();
                        {
                        forallinbank (L)
                        {
                          switch (ch)
                            {
                                    case '0':
                                    case '1': case '2': case '3':
                                    case '4': case '5': case '6':
                                    case '7': case '8': case '9':
                              L->tslen++;
                              L->turnseq[L->tslen - 1] = ch - '0';
                              if (oldch == '-')
                              L->turnseq[L->tslen - 1] *= -1;
                              if (bankc % 2 == 0)
                              L->turnseq[L->tslen - 1] *= -1;
                              break;
                            }
                        }
                        }
                      }
                    while (!(ch == '\15' || ch == '#'
                           || thread[bank[0] - 1].tslen == 50));
                    {
                      forallinbank (L)
                      {
                        int seqSum = 0, c;

                        if (L->tslen == 0)
                        L->tslen = L->otslen;
                        for (c = 1; c <= L->tslen; c++)
                        seqSum += L->turnseq[c - 1];
                        if (seqSum == 0)
                        L->tclim = 1;
                        else
                        L->tclim =
                          (int) (((real) degs2) / abs (seqSum));
                        L->tsc = random1 (L->tslen) + 1;
                      }
                    }
                    break;
                  case 'T':
                    {
                      ch = readkey ();
                      {
                        forallinbank (L)
                        {
                        switch (ch)
                          {
                                  case '1': case '2': case '3':
                                  case '4': case '5': case '6':
                                  case '7': case '8': case '9':
                            L->tmode = ch - '0';
                            break;
                          case 'R':
                            L->tmode = random1 (tmodes - '0') + 1;
                            break;
                          }
                        }
                      }
                    }
                    break;
                  case 'O':
                    ch = readkey ();
                    {
                      forallinbank (L) L->orichar = ch;
                    }
                    break;
                  case 'F':
                    {
                      banktype fbank;
                      arrcpy (fbank, bank);
                      {
                        int fbankt = bankt;
                        int bankc;
                        pickbank ();
                        for (bankc = 1; bankc <= fbankt; bankc++)
                        {
                          linedata *L = &thread[fbank[bankc - 1] - 1];
                          if (ch == 'N')
                            L->prey = 0;
                          else
                            L->prey = bank[0 + (bankc - 1) % bankt];
                        }
                      }
                    }
                    break;
                  case 'L':
                    {
                      forallinbank (L) L->prey = bank[bankc % bankt];
                    }
                    break;
                  case 'R':
                    ch = readkey ();
                    {
                      forallinbank (L) switch (ch)
                        {
                              case '1': case '2': case '3':
                              case '4': case '5': case '6':
                              case '7': case '8': case '9':
                        L->circturn = 10 - (ch - '0');
                        break;
                        case 'R':
                        L->circturn = random1 (7) + 1;
                        break;
                        }
                    }
                    break;
                  }
                }
              break;
            case 'T':
            case 'Y':
            case 'N':
              boolop = ch;
              pickbank ();
              if (bankt > 0)
                {
                  ch = readkey ();
                  {
                  forallinbank (L)
                  {
                    switch (ch)
                      {
                      case 'S':
                        bankmod (&L->selfbounce);
                        break;
                      case 'V':
                        bankmod (&L->vhfollow);
                        break;
                      case 'R':
                        bankmod (&L->realbounce);
                        break;
                      case 'L':
                        bankmod (&L->little);
                        cleared = True;
                        break;
                      case 'T':
                        bankmod (&L->tailfollow);
                        break;
                      case 'K':
                        bankmod (&L->killwalls);
                        break;
                      }
                  }
                  }
                }
              break;
            case 'R':
              if (bordcol == 1)
                {
                  bordcol = 0;
                  bordupdate ();
                  bordcorn = (bordcorn + 1) % 4;
                  bordcol = 1;
                  bordupdate ();
                }
              break;
            case '\33':
              halted = True;
              break;
                case '1': case '2': case '3':
                case '4': case '5': case '6':
                case '7': case '8': case '9':
              {
                int c;
                for (c = 1; c <= thrmax; c++)
                  thread[c - 1].tmode = ch - '0';
              }
              break;
            case '\40':
              cleared = True;
              break;
            case 'E':
              erasing = !erasing;
              break;
            case 'P':
              randpal ();
              palupdate (True);
              break;
            case 'G':
              {
                char dimch = 'B';
                Bool gridchanged = True;
                if (gridden == 0)
                  gridden = ogd;
                do
                  {
                  int msize = 0;
                  if (gridchanged)
                    {
                      clearscreen ();
                      gridupdate (True);
                    }
                  ch = readkey ();
                  gridchanged = True;
                  switch (ch)
                    {
                    case '+':
                      msize = 1;
                      break;
                    case '-':
                      msize = -1;
                      break;
                    case ']':
                      if (gridden < 15)
                        gridden++;
                      break;
                    case '[':
                      if (gridden > 0)
                        gridden--;
                      break;
                    case 'O':
                      ogd = gridden;
                      gridden = 0;
                      break;
                    case 'S':
                      boxw = boxh;
                    case 'W':
                    case 'H':
                    case 'B':
                      dimch = ch;
                      break;
                    default:
                      gridchanged = False;
                    }
                  if (dimch == 'W' || dimch == 'B')
                    boxw += msize;
                  if (dimch == 'H' || dimch == 'B')
                    boxh += msize;
                  if (boxw == 0)
                    boxw = 1;
                  if (boxh == 0)
                    boxh = 1;
                  }
                while (!(ch == '\15' || ch == '#' || ch == 'O'));
                cleared = True;
              }
              break;
            case 'A':
              autopal = !autopal;
              break;
            case 'B':
              bordcol = 1 - bordcol;
              bordupdate ();
              break;
            case '-':
              speed -= SPEEDINC;
              if (speed < 1)
                speed = 1;
              break;
            case '+':
              speed += SPEEDINC;
              if (speed > SPEEDMAX)
                speed = SPEEDMAX;
              break;
            case '/':
              if (curviness > 5)
                curviness -= 5;
              break;
            case '*':
              if (curviness < 50)
                curviness += 5;
              break;
            case ']':
              if (threads < thrmax)
                newonscreen (++threads);
              break;
            case '[':
              if (threads > 1)
                {
                  linedata *L = &thread[threads - 1];
                  int lastpos = (L->filled) ? L->reclen - 1 : L->recpos;
                  int c;
                  for (c = 0; c <= lastpos; c++)
                  sp (L->xrec[c], L->yrec[c], 0);
                  threads--;
                }
              break;
            }
          }

#ifdef VERMICULATE_STANDALONE
        {
          XEvent xe;
          while (XCheckWindowEvent
               (mydpy, mywindow, ExposureMask, &xe))
            switch (xe.type)
            {
            case ConfigureNotify:
              wid = xe.xconfigure.width;
              TEST("ConfigureNotify",0);
              hei = xe.xconfigure.height;
              free (point);
              point = (unsigned char *) malloc (wid * hei);
              cleared = True;
              break;
            case Expose:
              if (!cleared)
                redraw (xe.xexpose.x,
                      xe.xexpose.y, xe.xexpose.width,
                      xe.xexpose.height);
              break;
            }
        }
#else
        screenhack_handle_events (mydpy);
#endif // VERMICULATE_STANDALONE 

        if (!cleared)
          {
            Bool alltrap = True;
            unsigned char thr;
            for (thr = 1; thr <= threads; thr++)
            if (move (thr))
              alltrap = False;
            if (alltrap)      // all threads are trapped
            cleared = True;
            if (speed != SPEEDMAX)
            waitabit ();
          }

          if (tick++ > max_ticks && !had_instring)
            {
              tick = 0;
              instring = 0;
              maininit();
              cleared = True;
              autopal = False;
            }
      }
      while (!(halted || cleared));
    }
  while (!halted);
}

*/
