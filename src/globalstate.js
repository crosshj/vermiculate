import helpers from './helpers.js';
import constants from './constants.js';

const {
	random1,
	createArray,
	createObjectsArray,
} = helpers;

const {
	curviness,
	thrmax,
	sampleStrings,
	degs,
	degs4,
	dtor,
	tailmax,
	rlmax,
	WIN_WIDTH,
	WIN_HEIGHT
} = constants;

var instring = '';

var boxh = 10;
var boxw = 10;
var gridden = 0;

var threadLength = 4;

var ogd = 8;
var ch = '';

var speed = 1;
function getSpeed(){
	return speed;
}
function setSpeed(s){
	speed = s;
}

var RGB = createArray(256,3);
function setRGB(rgb){ RGB = rgb; return rgb; }
function getRGB(){ return RGB; }

var threads = createObjectsArray(thrmax);
function setThreads(th){ 
	threads = th;
	return threads; 
}
function setForAllThreadsInBank(mutator){
	const bankThreads = bank.map(b => threads[b-1]);
	bankThreads.forEach((th,i) => {
		mutator(th, i+1);
	});
	return bankThreads;
}
function getThreads(number){ 
	return typeof number === 'undefined'
		? threads
		: threads[number];
}

var whichThread = 0;
function setWhichThread(th){ 
	whichThread = th;
	return whichThread; 
}
function getWhichThread(){ 
	return whichThread; 
}

var bank = new Array(thrmax);
function setBank(ba){ 
	bank = ba;
	return bank; 
}
function getBank(){ return bank; }

var bankt = 0;
function setBankt(bt){ 
	bankt = bt;
	return bankt; 
}
function getBankt(){ 
	return bankt; 
}

var bordcol = 1;
function setBordCol(bc){ 
	bordcol = bc;
	return bordcol; 
}
function getBordCol (){
	return bordcol;
}

var bordcorn = 0;
function setBordCorn(bc){ 
	bordcorn = bc;
	return bordcorn; 
}
function getBordCorn (){
	return bordcorn;
}

var erasing = true;
function setErasing(er){ 
	erasing = er;
	return erasing; 
}
function getErasing (){
	return erasing;
}

// typedef struct linedata
// {
// int deg, spiturn, turnco, turnsize;
// unsigned char col;
// Bool dead;

// char orichar;
// real x, y;
// int tmode, tsc, tslen, tclim, otslen, ctinc, reclen, recpos, circturn, prey,
// slice;
// int xrec[rlmax + 1], yrec[rlmax + 1];
// int turnseq[50];
// Bool filled, killwalls, vhfollow,
// selfbounce, tailfollow, realbounce, little;
// }
// linedata;

function firstinit(thr){
	var LP = threads[thr-1];
	LP.col = thr + 1;
	LP.prey = 0;
	LP.tmode = 1;
	LP.slice = degs / 3;
	LP.orichar = 'R';
	LP.spiturn = 5;
	LP.selfbounce = false;
	LP.realbounce = false;
	LP.vhfollow = false;
	LP.tailfollow = false;
	LP.killwalls = false;
	LP.little = false;
	LP.ctinc = random1(2) * 2 - 1;
	LP.circturn = ((thr % 2) * 2 - 1) * ((thr - 1) % 7 + 1);
	LP.tsc = 1;
	LP.tslen = 6;
	LP.xrec = new Array(rlmax + 1);
	LP.yrec= new Array(rlmax + 1);
	LP.turnseq = new Array(50);
	LP.turnseq[0] = 6;
	LP.turnseq[1] = -6;
	LP.turnseq[2] = 6;
	LP.turnseq[3] = 6;
	LP.turnseq[4] = -6;
	LP.turnseq[5] = 6;
	LP.tclim = Math.floor(degs / 2 / 12); //TODO: not sure this has to be an int, maybe
}

function newonscreen(thr){
	var LP = threads[thr-1];
	LP.filled = false;
	LP.dead = false;
	LP.reclen = LP.little
		? random1 (10) + 5
		: random1 (rlmax - 30) + 30;
	LP.deg = random1 (degs);
	LP.y = random1(WIN_HEIGHT);
	LP.x = random1(WIN_WIDTH);

	LP.recpos = 0;
	LP.turnco = 2;
	LP.turnsize = random1(4) + 2;
}

function randpal(){
	var co, ro;
	for (co = 1; co <= 255; co++)
		for (ro = 0; ro <= 2; ro++)
			RGB[co][ro] = co > tailmax
				? random1(255)
				: random1(255);
	for (ro = 0; ro <= 2; ro++)
		RGB[0][ro] = 0;
}

function palupdate (forceUpdate){
		if (forceUpdate || instring === 0){
				for (var colnum = 0; colnum < tailmax; colnum++){
						//mycolors[colnum].red = rgb[colnum][0] << 10;
						//mycolors[colnum].green = rgb[colnum][1] << 10;
						//mycolors[colnum].blue = rgb[colnum][2] << 10;
						//mycolors[colnum].flags = DoRed | DoBlue | DoGreen;
						//XAllocColor (mydpy, mycmap, &mycolors[colnum]);
				};

				//redraw (xmin, ymin, wid, hei);
		}
}

function maininit(){
	if (!instring){
		var n = random1 (sampleStrings.length);
		n=process.argv.slice(2);
		instring = sampleStrings[n].str;
		setSpeed(sampleStrings[n].speed);
		console.log(`
			CONFIG: ${instring}
			SPEED: ${sampleStrings[n].speed}
		`.replace(/^\t\t\t/gm, ''));
	}

	for (var thr = 1; thr <= thrmax; thr++){
		firstinit (thr);
		newonscreen (thr);
	}

	randpal();
}

var instringPos = 0;
function readkey() {
		var readkey_result = "";
		if (!instring[instringPos]){
				//TODO:
				//char key_buffer[1];
				//KeySym key_sym;
				//if (neednewkey){
				//XWindowEvent (mydpy, mywindow, KeyPressMask, &myevent);
				//}
				//XLookupString (&myevent.xkey, key_buffer, 1, &key_sym, NULL);
				//readkey_result = key_sym;
				readkey_result = '#';
				//neednewkey = True;
		} else {
			readkey_result = instring[instringPos];
			instringPos++;
		};
		return readkey_result.toUpperCase();
}

function wasakeypressed() {
	var instringRemainder = (instring||"").substring(instringPos||"");
	return instringRemainder.length > 0;
}

function getState(){
	return {
		bank: getBank(),
		bankt: getBankt(),
		threads: getThreads(),
		whichThread: getWhichThread(),
		bordCol: getBordCol(),
		bordCorn: getBordCorn(),
		erasing: getErasing(),
		rgb: getRGB(),
		speed: getSpeed()
	};
}

export default {
	getState, 
	getBank: getBank,
	setBank: setBank,
	getBankt: getBankt,
	setBankt: setBankt,

	getThreads: getThreads,
	setThreads: setThreads,
	setForAllThreadsInBank: setForAllThreadsInBank,
	getWhichThread: getWhichThread,
	setWhichThread: setWhichThread,

	getBordCol: getBordCol,
	setBordCol: setBordCol,
	getBordCorn: getBordCorn,
	setBordCorn: setBordCorn,
	bordupdate: () => {}, //TODO: bleh, border stuff

	getErasing: getErasing,
	setErasing: setErasing,

	getRGB: getRGB,
	setRGB: setRGB, //may not need

	instring: instring,
	instringPos: instringPos,
	wasakeypressed: wasakeypressed,
	newonscreen: newonscreen,

	palupdate: palupdate,
	randpal: randpal, //may not need
	readkey: readkey,
	maininit: maininit,

	getSpeed, setSpeed,
	gridden
}
