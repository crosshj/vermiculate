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

export const caseNumbers = (ch) => () => {
	console.log('---------- case_NUMBERS happened');
	const threads = getThreads();
	for (var c = 1; c <= thrmax; c++) {
		threads[c - 1].tmode = Number(ch);
	}
	setThreads(threads);
	console.log('---------- case_NUMBERS EXIT');
};

export const caseEscape = () => ({ halted: true });

export const caseSpace = () => ({ cleared: true });

export const caseErasing = () => {
	setErasing(!getErasing());
}

export const unknownCase = (ch) => () => {
	console.log(`----- DON'T KNOW ABOUT THIS CASE [ ${ch} ] ----`)
};

export const caseAddThread = () => {
	const lastThreadNumber = getWhichThread();
	if (lastThreadNumber >= thrmax) return;
	newonscreen(lastThreadNumber+1);
	setWhichThread(lastThreadNumber+1);
};

export const caseBorder = () => {
	// don't really care about borders?
};
