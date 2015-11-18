var random1 = require('./helpers').random1;
var thrmax = require('./constants').thrmax;
var createArray = require('./helpers').createArray;
var createObjectsArray = require('./helpers').createObjectsArray;

var sampleStrings = require('./constants').sampleStrings;
var degs = require('./constants').degs;
var degs4 = require('./constants').degs4;
var dtor = require('./constants').dtor;
var tailmax = require('./constants').tailmax;
var rlmax = require('./constants').rlmax;
var WIN_WIDTH = require('./constants').WIN_WIDTH;
var WIN_HEIGHT = require('./constants').WIN_HEIGHT;

var instring = '';

var boxh = 10;
var boxw = 10;
var gridden = 0;
var bordcorn = 0;
var threadLength = 4;
var curviness = 30;
var bordcol = 1;
var ogd = 8;
var ch = '\0';
var erasing = true;
var speed = 0;
var sinof = new Array(degs);
var cosof = new Array(degs);
var tanof = new Array(degs);

var RGB = createArray(256,3);
function setRGB(rgb){ RGB = rgb; }
function getRGB(){ return RGB; }


var threads = createObjectsArray(thrmax);
function setThreads(th){ threads = th; }
function setForAllThreadsInBank(mutator){
  threads.forEach(function(th){
    //TODO: is thread in bank???
    mutator(th);
  })
}
function getThreads(){ return threads; }

var whichThread = 0;
function setWhichThread(th){ whichThreads = th; }
function getWhichThread(){ return whichThread; }

var bank = new Array(thrmax);
function setBank(ba){ bank = ba; }
function getBank(){ return bank; }

var bankt;
function getBankt(){ return bankt; }
function setBankt(bt){ bankt = bt; }

// typedef struct linedata
// {
//   int deg, spiturn, turnco, turnsize;
//   unsigned char col;
//   Bool dead;

//   char orichar;
//   real x, y;
//   int tmode, tsc, tslen, tclim, otslen, ctinc, reclen, recpos, circturn, prey,
//     slice;
//   int xrec[rlmax + 1], yrec[rlmax + 1];
//   int turnseq[50];
//   Bool filled, killwalls, vhfollow,
//     selfbounce, tailfollow, realbounce, little;
// }
// linedata;

function firstinit(thr){
  var LP = threads[thr-1];
  LP.col = thr + 1;
  LP.prey = 0;
  LP.tmode = 1;
  LP.slice = degs / 3;
  LP.orichar = 'R';
  LP.spiturn = 5;
  LP.selfbounce = false;
  LP.realbounce = false;
  LP.vhfollow = false;
  LP.tailfollow = false;
  LP.killwalls = false;
  LP.little = false;
  LP.ctinc = random1(2) * 2 - 1;
  LP.circturn = ((thr % 2) * 2 - 1) * ((thr - 1) % 7 + 1);
  LP.tsc = 1;
  LP.tslen = 6;
  LP.turnseq = new Array(50);
  LP.turnseq[0] = 6;
  LP.turnseq[1] = -6;
  LP.turnseq[2] = 6;
  LP.turnseq[3] = 6;
  LP.turnseq[4] = -6;
  LP.turnseq[5] = 6;
  LP.tclim = Math.floor(degs / 2 / 12); //TODO: not sure this has to be an int, maybe

}

function newonscreen(thr)
{
  var LP = threads[thr-1];
  
  LP.filled = false;
  LP.dead = false;
  LP.reclen = LP.little
    ? random1 (10) + 5
    : random1 (rlmax - 30) + 30;
  LP.deg = random1 (degs);
  LP.y = random1(WIN_HEIGHT);
  LP.x = random1(WIN_WIDTH);

  LP.recpos = 0;
  LP.turnco = 2;
  LP.turnsize = random1(4) + 2;
}

function randpal(){
  var co, ro;
  for (co = 1; co <= 255; co++)
    for (ro = 0; ro <= 2; ro++)
      if (co > tailmax)
        RGB[co][ro] = random1(20);
      else
        RGB[co][ro] = random1(64);
  for (ro = 0; ro <= 2; ro++)
    RGB[0][ro] = 0;
}

function palupdate (forceUpdate){
    if (forceUpdate || instring === 0){
        for (var colnum = 0; colnum < tailmax; colnum++){
            //mycolors[colnum].red = rgb[colnum][0] << 10;
            //mycolors[colnum].green = rgb[colnum][1] << 10;
            //mycolors[colnum].blue = rgb[colnum][2] << 10;
            //mycolors[colnum].flags = DoRed | DoBlue | DoGreen;
            //XAllocColor (mydpy, mycmap, &mycolors[colnum]);
        };

        //redraw (xmin, ymin, wid, hei);
    }
}

function maininit(){
    if (!instring){
      var n = random1 (sampleStrings.length);
      n=process.argv.slice(2);
      instring = sampleStrings[n].str;
      speed = sampleStrings[n].speed;
    }

    for (var thr = 1; thr <= thrmax; thr++){
      firstinit (thr);
      newonscreen (thr);
    }

    for (var d = degs - 1; d >= 0; d--){
        sinof[d] = Math.sin(d * dtor);
        cosof[d] = Math.cos(d * dtor);
        if (d % degs4 == 0){
            tanof[d] = (d % degs4 == 0) 
                ? tanof[d + 1] 
                : Math.tan(d * dtor);
        }
    }

    randpal();
}

var instringPos = 0;
function readkey() {
    var readkey_result = "";
    if (!instring[instringPos]){
        //TODO:
        //char key_buffer[1];
        //KeySym key_sym;
        //if (neednewkey){
        //  XWindowEvent (mydpy, mywindow, KeyPressMask, &myevent);
        //}
        //XLookupString (&myevent.xkey, key_buffer, 1, &key_sym, NULL);
        //readkey_result = key_sym;
        readkey_result = '#';
        //neednewkey = True;
    } else {
      readkey_result = instring[instringPos];
      instringPos++;
    };
    console.log("\t\t\t\t\t\t\treadkey: ", readkey_result)
    return readkey_result.toUpperCase();
}

function wasakeypressed() {
    var instringRemainder = (instring||"").substring(instringPos||"");
    console.log("\t\t\t\t\t\t\t\t\t"+instringRemainder)
    return instringRemainder.length > 0;
}

module.exports = {
    getBank: getBank,
    setBank: setBank,
    getBankt: getBankt,
    setBankt: setBankt,

    getThreads: getThreads,
    setThreads: setThreads, //may not need
    setForAllThreadsInBank: setForAllThreadsInBank,
    getWhichThread: getWhichThread,
    setWhichThread: setWhichThread,


    getRGB: getRGB,
    setRGB: setRGB, //may not need

    instring: instring,
    instringPos: instringPos,
    wasakeypressed: wasakeypressed,
    newonscreen: newonscreen,

    palupdate: palupdate,
    randpal: randpal, //may not need
    readkey: readkey,
    maininit: maininit
}