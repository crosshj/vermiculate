import helpers from './helpers.js';
import constants from './constants.js';

var WIN_WIDTH = constants.WIN_WIDTH;
var WIN_HEIGHT = constants.WIN_HEIGHT;
var thrmax = constants.thrmax;
var tmodes = constants.tmodes;
var degs = constants.degs;
var degs2 = constants.degs2;

var createArray = helpers.createArray;
var random1 = helpers.random1;
var include = helpers.include;
var clearscreen = helpers.clearscreen;
var bordupdate = helpers.bordupdate;
var gridupdate = helpers.gridupdate;
var wasakeypressed = helpers.wasakeypressed;

export default function({
	pickbank, getBank, getBankt, readkey, setForAllThreadsInBank, getThreads, setThreads, ch
}) {
		console.log('---------- case_TYN happened');
		var boolop = ch;
		var _cleared = null;
		pickbank();

		var bankt = getBankt();
		if(bankt <= 0){
			console.log('---------- case_TYN EXIT');
			return { cleared: _cleared };
		}

		ch = readkey();
		setForAllThreadsInBank(function(th) {
			function bankmod(obj, prop) {
				switch (boolop) {
					case 'T':
						obj[prop] = !obj[prop];
						break;
					case 'Y':
						obj[prop] = true;
						break;
					case 'N':
						obj[prop] = false;
						break;
				}
			}
			switch (ch) {
				case 'S':
					bankmod(th, 'selfbounce');
					break;
				case 'V':
					bankmod(th, 'vhfollow');
					break;
				case 'R':
					bankmod(th, 'realbounce');
					break;
				case 'L':
					bankmod(th, 'little');
					_cleared = true;
					break;
				case 'T':
					bankmod(th, 'tailfollow');
					break;
				case 'K':
					bankmod(th, 'killwalls');
					break;
			}
		});

		console.log('---------- case_TYN EXIT');
		return { cleared: _cleared };
}
