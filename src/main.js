import globalstate from './globalstate.js';
import helpers from './helpers.js';
import constants from './constants.js';
import { move } from './threads.js';
import Graphics from './graphics.js';

import caseC from './main/caseC.js';
import caseM from './main/caseM.js';
import caseTYN from './main/caseTYN.js';

var palupdate = globalstate.palupdate;
var randpal = globalstate.randpal;
var newonscreen = globalstate.newonscreen;
var readkey = globalstate.readkey;
var getThreads = globalstate.getThreads;
var setThreads = globalstate.setThreads  ;
var getWhichThread = globalstate.getWhichThread;
var setWhichThread = globalstate.setWhichThread;
var wasakeypressed = globalstate.wasakeypressed;
var getBordCol = globalstate.getBordCol;
var setBordCol = globalstate.setBordCol;
var getBordCorn = globalstate.getBordCorn;
var setBordCorn = globalstate.setBordCorn;
var getErasing = globalstate.getErasing;
var setErasing = globalstate.setErasing;

const { getSpeed } = globalstate;

var createArray = helpers.createArray;
var random1 = helpers.random1;
var clearscreen = helpers.clearscreen;
var bordupdate = helpers.bordupdate;
var gridupdate = helpers.gridupdate;

var WIN_WIDTH = constants.WIN_WIDTH;
var WIN_HEIGHT = constants.WIN_HEIGHT;
var thrmax = constants.thrmax;
var tmodes = constants.tmodes;

const sleep = () => new Promise(requestAnimationFrame);

const keyPressHandler = ({ cleared }) => {
  	let ch;
  	while (wasakeypressed()) {
  		ch = readkey ();
  		if(!ch) break;
  		switch (ch) {
  			case 'M': // change thread mode (depends on what follows)
				caseM();
				break;
			case 'C':
				caseC();
				break;
			case 'T': // Toggle
			case 'Y': // Yes
			case 'N': // No
				caseTYN() && (cleared = true);
				break;
			case 'R':
				if (getBordCol() !== 1) break;
				setBordCol(0);
				bordupdate();
				setBordCorn( (getBordCorn() + 1) % 4 );
				setBordCol(1);
				bordupdate();
				break;
			case '27':                 //ESCAPE, c = '\33'
				halted = true;
				break;
			case '1': case '2': case '3':
			case '4': case '5': case '6':
			case '7': case '8': case '9': // change all thread modes
				console.log('---------- case_NUMBERS happened');
				const threads = getThreads();
				for (var c = 1; c <= thrmax; c++) {
  					threads[c - 1].tmode = Number(ch);
				}
				setThreads(threads);
				console.log('---------- case_NUMBERS EXIT');
				break;
			case '32':                 //SPACE, c = '\40'
				cleared = true;
				break;
			case 'E': // Erasing
				setErasing( !getErasing() );
				break;
			default:
				console.log(`----- DON'T KNOW ABOUT THIS CASE [ ${ch} ] ----`)
				break;
		}
	}
	return { cleared };
}

export default async function vermiculate_main() {
  	globalstate.maininit();
	const autopal = true;
	const speed = getSpeed();
	const throttle =  x => {
  		const MIN = 1;
		const MAX = 20;
		const proposedSpeed = Math.floor(x/10);
		if(proposedSpeed < MIN) return MIN;
		if(proposedSpeed > MAX) return MAX;
		return proposedSpeed;
	};

	//var had_instring = (globalstate.instring !== 0);
	//var tick = 0;

	let halted = false;
	let cleared = false;
	let ch;

	const gfx = new Graphics(WIN_WIDTH, WIN_HEIGHT);
	palupdate(true);

	let iteration = 0;
	const MAX_ITERATION = 1000;
	do {
  		gfx.clearscreen();
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
  			({ cleared } = keyPressHandler({ cleared }));
			let alltrapped = true;
			if(iteration++ % throttle(speed) === 0) await sleep();
			for(let t=0, len=getWhichThread(); t < len; t++){
  				const canmove = move(t, gfx);
				if(canmove) alltrapped = false;
			}
			if(alltrapped) cleared = true;

			/*
			if(iteration++ > MAX_ITERATION){
  				halted = cleared = true;
			}
			*/
		} while (!(halted || cleared));

	} while (!halted);

}

