import globalstate from './globalstate.js';
import helpers from './helpers.js';
import constants from './constants.js';
import { move } from './threads.js';
import Graphics from './graphics.js';
import pickbank from './pickbank.js';

import caseC from './caseC.js';
import caseM from './caseM.js';
import caseTYN from './caseTYN.js';
import { 
	caseR , caseNumbers, caseEscape , caseSpace, caseErasing, unknownCase,
	caseAddThread, caseBorder
} from './caseOthers.js'

const {
	getState,
	palupdate, randpal,
	newonscreen, getThreads, setThreads, getWhichThread, setWhichThread,
	wasakeypressed, readkey,
	getBordCol, setBordCol,
	getBordCorn, setBordCorn,
	getErasing, getSpeed,
	getBank, getBankt, setForAllThreadsInBank,
	gridden
} = globalstate;

const {
	loop, asyncLoop, createArray, random1, clearscreen,
	bordupdate, gridupdate, sleep, setRNGSeed
} = helpers;

const {
	WIN_WIDTH, WIN_HEIGHT, thrmax, tmodes
} = constants;

const mainMap = {
	B: caseBorder,
	M: caseM,
	C: caseC,
	R: caseR,
	27: caseEscape,
	32: caseSpace,
	E: caseErasing,
	']': caseAddThread,
};
['T', 'Y', 'N'].forEach(x => {
	mainMap[x] = caseTYN;
});
[1,2,3,4,5,6,7,8,9].forEach(x => {
	mainMap[x] = caseNumbers(x);
});

/*
case '/':
	if (curviness > 5)
		curviness -= 5;
	break;
case '*':
	if (curviness < 50)
		curviness += 5;
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
*/

const keyPressHandler = ({ cleared, halted }) => {
	let _halted = halted;
	let _cleared = cleared;

	const handler = () => {
		const ch = wasakeypressed() && readkey();
		if(!ch) return false;
		const caseHandler = mainMap[ch] || unknownCase(ch);
		const res = caseHandler({...globalstate, pickbank, ch }) || {};
		if(typeof res.halted !== 'undefined') _halted = res.halted;
		if(typeof res.cleared !== 'undefined') _cleared = res.cleared;
		return true; //loop
	}

	const logs = [];
	console.bak = console.log;
	console.log = (...args) => logs.push(args.join(' ').trim());

	//eat all input until done
	loop(handler);

	console.log = console.bak;
	if(logs.length){
		logs.length && console.log(
			logs.filter(x=>x.includes('DON\'T KNOW ABOUT THIS CASE')).join('\n')
		);
		window.state = getState();
		console.log(window.state);
	}
	
	return {
		cleared: _cleared,
		halted: _halted
	};
}

export default async function main({ throttle=8, seed }={}) {
	let halted = false;
	let cleared = false;
	let ch;
	setRNGSeed(seed);

	globalstate.maininit();
	const autopal = true;
	const throttleThis =  x => {
		const MIN = 1;
		const MAX = 30;
		const proposedSpeed = Math.floor(x/throttle);
		if(proposedSpeed < MIN) return MIN;
		if(proposedSpeed > MAX) return MAX;
		return proposedSpeed;
	};
	const speed = throttleThis(getSpeed());

	const gfx = new Graphics(WIN_WIDTH, WIN_HEIGHT);
	palupdate(true);

	let iteration = 0;

	const insideLoop = async () => {
		({ cleared, halted } = keyPressHandler({ cleared, halted }));
		let alltrapped = true;
		if(iteration++ === speed){
			iteration = 0;
			await sleep();
		}
		for(let t=0, len=getWhichThread(); t < len; t++){
			const canmove = move(t, gfx);
			if(canmove) alltrapped = false;
		}
		if(alltrapped) cleared = true;
		return !(halted || cleared);
	};
	
	const outsideLoop = async () => {
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
		await asyncLoop(insideLoop);
		return !halted;
	};

	await asyncLoop(outsideLoop);
}

