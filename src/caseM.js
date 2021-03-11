import globalstate from './globalstate.js';
import helpers from './helpers.js';
import constants from './constants.js';

var WIN_WIDTH = constants.WIN_WIDTH;
var WIN_HEIGHT = constants.WIN_HEIGHT;
var thrmax = constants.thrmax;
var tmodes = constants.tmodes;

var palupdate = globalstate.palupdate;
var randpal = globalstate.randpal;
var newonscreen = globalstate.newonscreen;
var readkey = globalstate.readkey;
var getThreads = globalstate.getThreads;
var setThreads = globalstate.setThreads;
var getWhichThread = globalstate.getWhichThread;
var setWhichThread = globalstate.setWhichThread;

var createArray = helpers.createArray;
var random1 = helpers.random1;
var include = helpers.include;
var clearscreen = helpers.clearscreen;
var bordupdate = helpers.bordupdate;
var gridupdate = helpers.gridupdate;
var wasakeypressed = helpers.wasakeypressed;

export default function caseM() {
	console.log('---------- case_M happened');
	let threads = getThreads();
	let ch = readkey();
	switch (ch) {
		case 'A':
		case 'N':
			var othreads = getWhichThread();
			if (ch == 'N') setWhichThread(0);

			do {
				ch = readkey();
				switch (ch) {
					case '1': case '2': case '3':
					case '4': case '5': case '6':
					case '7': case '8': case '9':
						threads[setWhichThread(getWhichThread()+1)-1].tmode 
							= Number(ch);
						break;
					case 'R':
						threads[setWhichThread(getWhichThread()+1)-1].tmode
							= random1 (Number(tmodes)) + 1;
						break;
				}
			} while (!(ch == '16' || ch == '#' || getWhichThread() == thrmax));
			// c = '\15' is Shift In, js = 16

			if (getWhichThread() == 0) {
				setWhichThread(othreads);
			}
			break;
	}
	setThreads(threads);
	console.log('---------- case_M EXIT');
}



