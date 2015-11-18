
var constants = require('../constants');
var WIN_WIDTH = constants.WIN_WIDTH;
var WIN_HEIGHT = constants.WIN_HEIGHT;
var thrmax = constants.thrmax;
var tmodes = constants.tmodes;
var degs = constants.degs;
var degs2 = constants.degs2;

var globalstate = require('../globalstate');
var palupdate = globalstate.palupdate;
var randpal = globalstate.randpal;
var newonscreen = globalstate.newonscreen;
var readkey = globalstate.readkey;
var threads = globalstate.getThreads();
var getWhichThread = globalstate.getWhichThread;
var setWhichThread = globalstate.setWhichThread;
var setForAllThreadsInBank = globalstate.setForAllThreadsInBank;
var bank = globalstate.getBank();
var getBankt = globalstate.getBankt;

var helpers = require('../helpers');
var createArray = helpers.createArray;
var random1 = helpers.random1;
var include = helpers.include;
var clearscreen = helpers.clearscreen;
var bordupdate = helpers.bordupdate;
var gridupdate = helpers.gridupdate;
var wasakeypressed = helpers.wasakeypressed;

var pickbank = require('../pickbank');

module.exports = function(){
    console.log('---------- case_C happened');
    pickbank();
    var bankt = getBankt();
    if (bankt > 0) {
        ch = readkey();
        switch (ch) {
            case 'D':
                ch = readkey();
                switch (ch) {
                    case '1': case '2': case '3':
                    case '4': case '5': case '6':
                    case '7': case '8': case '9':
                        setForAllThreadsInBank(function(th){
                            th.slice = degs / (ch - '0');
                        });
                        break;
                    case 'M':
                        setForAllThreadsInBank(function(th){
                            th.slice = 0;
                        });
                        break;
                }
                break;
            case 'S':
                setForAllThreadsInBank(function(th){
                    th.otslen = th.tslen;
                    th.tslen = 0;
                });
                do {
                    var oldch = ch+"";
                    ch = readkey();
                    setForAllThreadsInBank(function(th){
                        switch (ch) {
                            case '1': case '2': case '3':
                            case '4': case '5': case '6':
                            case '7': case '8': case '9':
                                th.tslen++;
                                th.turnseq[th.tslen - 1] = ch - '0';
                                if (oldch == '-'){
                                    th.turnseq[th.tslen - 1] *= -1;
                                }
                                if (bankc % 2 == 0){
                                    th.turnseq[th.tslen - 1] *= -1;
                                }
                                break;
                        }
                    });
                } while (!(ch == '\15' || ch == '#' || threads[bank[0] - 1].tslen == 50));

                setForAllThreadsInBank(function(th){
                    var seqSum = 0;

                    if (th.tslen === 0){
                        th.tslen = th.otslen;
                    }
                    for (var c = 1; c <= th.tslen; c++){
                        seqSum += th.turnseq[c - 1];
                    }
                    if (seqSum == 0){
                        th.tclim = 1;
                    } else {
                        th.tclim = Math.floor(degs2 / Math.abs(seqSum));
                        th.tsc = random1(th.tslen) + 1;
                    }
                });
                break;
            case 'T':
                ch = readkey();
                setForAllThreadsInBank(function(th){
                    switch (ch) {
                        case '1': case '2': case '3':
                        case '4': case '5': case '6':
                        case '7': case '8': case '9':
                            th.tmode = ch - '0';
                            break;
                        case 'R':
                            th.tmode = random1(tmodes - '0') + 1;
                            break;
                    }
                });
                break;
            case 'O':
                ch = readkey(); 
                setForAllThreadsInBank(function(th){
                    th.orichar = ch;
                });
                break;
            case 'F':
                var fbank = globalstate.getBank(); //TODO: should be a copy, yes???
                var fbankt = bankt;
                pickbank();
                for (var bankc = 1; bankc <= fbankt; bankc++) {
                    var L = threads[fbank[bankc - 1] - 1];
                    if (ch == 'N'){
                        L.prey = 0;
                    } else {
                        L.prey = bank[0 + (bankc - 1) % bankt];
                    }
                }
                globalstate.setThreads(threads); // TODO: because the threads we are working with are just copies, right???
                break;
            case 'L':
                setForAllThreadsInBank(function(th){
                    th.prey = bank[bankc % bankt]
                });
                break;
            case 'R':
                ch = readkey();
                setForAllThreadsInBank(function(th){
                    switch (ch) {
                        case '1': case '2': case '3':
                        case '4': case '5': case '6':
                        case '7': case '8': case '9':
                            th.circturn = 10 - (ch - '0');
                            break;
                        case 'R':
                            th.circturn = random1(7) + 1;
                            break;
                    }
                });
                break;
        }
    }
    console.log('---------- case_C EXIT');
}
