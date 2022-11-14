import globalstate from './globalstate.js';
import constants from './constants.js';
import helpers from './helpers.js';

const {
	palupdate, randpal,
	newonscreen, getThreads, setThreads, getWhichThread, setWhichThread,
	wasakeypressed, readkey,
	getErasing, setErasing,
	getSpeed
} = globalstate;
const { thrmax } = constants;

const {
	loop, asyncLoop, createArray, random1, clearscreen,
	bordupdate, gridupdate, sleep
} = helpers;

export const caseR = ({
	getBordCol, setBordCol,
	getBordCorn, setBordCorn,
	bordupdate
}) => {
	if (getBordCol() !== 1) return;
	setBordCol(0);
	bordupdate();
	setBordCorn( (getBordCorn() + 1) % 4 );
	setBordCol(1);
	bordupdate();
	return;
};

export const caseNumbers = ({ ch, getThreads, setThreads }) => {
	const threads = getThreads();
	for (var c = 1; c <= thrmax; c++) {
		threads[c - 1].tmode = Number(ch);
	}
	setThreads(threads);
};

export const caseEscape = () => ({ halted: true });

export const caseSpace = () => ({ cleared: true });

export const caseErasing = () => {
	setErasing(!getErasing());
}

export const unknownCase = (ch) => () => {
	console.log(`----- DON'T KNOW ABOUT THIS CASE [ ${ch} ] ----`)
};

// ]
export const caseAddThread = ({ getWhichThread, newonscreen, setWhichThread }) => {
	const lastThreadNumber = getWhichThread();
	if (lastThreadNumber >= thrmax) return;
	newonscreen(lastThreadNumber+1);
	setWhichThread(lastThreadNumber+1);
};

// [
export const caseRemoveThread = ({ getWhichThread, setWhichThread, getThreads, sp }) => {
	const whichThread = getWhichThread();
	const threads = getThreads();
	if(whichThread <= 1) return;
	const L = threads[whichThread - 1];
	const lastpos = L.filled
		? L.reclen -1
		: L.recpos;
	for(let c=0; c <= lastpos; c++){
		sp(L.xrec[c], L.yrec[c], 0);
		setWhichThread(whichThread - 1);
		// maybe should also remove thread itself?
	}
}

export const caseE = ({ getErasing, setErasing }) => setErasing(!getErasing());

export const caseBorder = () => {
	// don't really care about borders?
};
