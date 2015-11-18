module.exports = vermiculate_main;

var globalstate = require('./globalstate');
var palupdate = globalstate.palupdate;
var randpal = globalstate.randpal;
var newonscreen = globalstate.newonscreen;
var readkey = globalstate.readkey;
var getThreads = globalstate.getThreads;
var setThreads = globalstate.setThreads  ;
var getWhichThread = globalstate.getWhichThread;
var setWhichThread = globalstate.setWhichThread;
var wasakeypressed = globalstate.wasakeypressed;

var helpers = require('./helpers');
var createArray = helpers.createArray;
var random1 = helpers.random1;
var clearscreen = helpers.clearscreen;
var bordupdate = helpers.bordupdate;
var gridupdate = helpers.gridupdate;


var constants = require('./constants')
var WIN_WIDTH = constants.WIN_WIDTH;
var WIN_HEIGHT = constants.WIN_HEIGHT;
var thrmax = constants.thrmax;
var tmodes = constants.tmodes;

function vermiculate_main() {

    var had_instring = (globalstate.instring != 0);
    var tick = 0;
    var halted = false;
    var autopal = false;
    var cleared;
    var point = createArray(WIN_WIDTH, WIN_HEIGHT);

    globalstate.maininit();
    palupdate(true);
    var threads = getThreads();
    console.log("-- NUMBER OF THREADS: ", threads.length);

    do {
        clearscreen();
        for (var thr = 1; thr <= getWhichThread(); thr++) {
            newonscreen(thr);
        }
        if (autopal) {
            randpal();
            palupdate(false);
        }
        bordupdate();
        gridupdate(false);
        cleared = false;

        do {

          while (wasakeypressed ()) {
            ch = readkey ();
            switch (ch) {
              case 'M':
                require('./main/caseM')();
                break;
              case 'C':
                require('./main/caseC')();
                break;
              case '1': case '2': case '3':
              case '4': case '5': case '6':
              case '7': case '8': case '9':
                console.log('---------- case_NUMBERS happened');
                for (var c = 1; c <= thrmax; c++) {
                  threads[c - 1].tmode = ch - '0';
                }
                setThreads(threads);
                console.log('---------- case_NUMBERS EXIT');
                break;
            }

          }

          halted = cleared = true;
        } while (!(halted || cleared));

    } while (!halted);

}
