import seedrandom from 'https://cdn.skypack.dev/seedrandom';
import constants from './constants.js'
const { PI } = constants;

//var globalstate = require('./globalstate');
//var instring = globalstate.instring;
//var instringPos = globalstate.instringPos;

// TODO: ------------------------------------------------------
function clearscreen() {
			console.log("TODO: clear the screen");
}

function bordupdate() {
			console.log("TODO: bordupdate");
}

function gridupdate() {
			console.log("TODO: gridupdate");
}

//-------------------------------------------------------------

function wraparound(VAL,LOWER,UPPER){
		 if (VAL >= UPPER)
			VAL -= UPPER - LOWER;
	 else if (VAL < LOWER)
			VAL += UPPER - LOWER;
	return VAL;
}

function createArray(length) {
		var arr = new Array(length || 0);
		var i = length;

		if (arguments.length > 1) {
			var args = Array.prototype.slice.call(arguments, 1);
			while(i--) arr[length-1 - i] = createArray.apply(this, args);
		}
		return arr;
}

function createObjectsArray(length){
		return Array.apply(null, Array(length))
		.map(function () { return {}; });
}

function inbank(thr, bankt){
	var c;
	if (bankt > 0)
		for (c = 1; c <= bankt; c++)
			if (bank[c - 1] == thr)
				return true;
	return false;
}

//-----------------------------------------------
// Fast arctan2
function f_atan2(y, x){
	var r = 0.0;
	var angle = 0.0;
	var coeff_1 = PI/4;
	var coeff_2 = 3*coeff_1;
	var abs_y = Math.abs(y)+1e-10;      // kludge to prevent 0/0 condition
	if (x >= 0){
		r = (x - abs_y) / (x + abs_y);
		angle = coeff_1 - coeff_1 * r;
	} else {
		r = (x + abs_y) / (abs_y - x);
		angle = coeff_2 - coeff_1 * r;
	}
	return (y < 0)
		? -angle   // negate if in quad III or IV
		: angle;
}

function random1(i){
	return Math.floor(Math.random()*i);
}

/*
alea	1.95 ns, 0.9x	~2^116	Baagøe
xor128	2.04 ns, 0.9x	2^128-1	Marsaglia
tychei	2.32 ns, 1.1x	~2^127	Neves/Araujo (ChaCha)
xorwow	2.40 ns, 1.1x	2^192-2^32	Marsaglia
xor4096	2.40 ns, 1.1x	2^4096-2^32	Brent (xorgens)
xorshift7	2.64 ns, 1.3x	2^256-1	Panneton/L'ecuyer
quick	3.80 ns, 1.8x	~2^1600	Bau (ARC4)
*/

let myrng = new seedrandom.alea();
function seedrandom1(i){
	return Math.floor(myrng()*i);
}
function setRNGSeed(seed){
	myrng = new seedrandom.alea(seed);
}

const tryFn = (fn, _default) => {
	try {
		return fn();
	} catch (e) {
		return _default;
	}
};
const loop = (fn, MAX=1e+9) => {
	let it = 0;
	while(fn() && it++ < MAX){}
};
const asyncLoop = async (fn, MAX=1e+9) => {
	let it = 0;
	while(await fn() && it++ < MAX){}
};
const sleep = () => new Promise(requestAnimationFrame);

export default {
	tryFn, loop, asyncLoop, sleep,
	wraparound: wraparound,
	createArray: createArray,
	createObjectsArray: createObjectsArray,
	inbank: inbank,
	atan2: f_atan2,
	random1: seedrandom1,
	setRNGSeed,
	clearscreen: clearscreen,
	bordupdate: bordupdate,
	gridupdate: gridupdate
}
