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





module.exports = function() {
    console.log('---------- case_TYN happened');
    var boolop = ch;
    var _cleared = null;
    pickbank();

    var bankt = getBankt();
    if (bankt > 0) {
        ch = readkey();
        setForAllThreadsInBank(function(th) {
            function bankmod(_bool) {
			  switch (boolop) {
				  case 'T':
				    _bool = !_bool;
				    break;
				  case 'Y':
				    _bool = true;
				    break;
				  case 'N':
				    _bool = false;
				    break;
			  }
			}
            switch (ch) {
                case 'S':
                    bankmod(th.selfbounce);
                    break;
                case 'V':
                    bankmod(th.vhfollow);
                    break;
                case 'R':
                    bankmod(th.realbounce);
                    break;
                case 'L':
                    bankmod(th.little);
                    _cleared = true; //TODO: there is no example of this???
                    break;
                case 'T':
                    bankmod(th.tailfollow);
                    break;
                case 'K':
                    bankmod(th.killwalls);
                    break;
            }
        });
    }
    console.log('---------- case_TYN EXIT');
    return _cleared;
}