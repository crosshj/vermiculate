import constants from './constants.js';
import helpers from './helpers.js';
const {
	loop, asyncLoop, createArray, random1, clearscreen,
	bordupdate, gridupdate, sleep, setRNGSeed
} = helpers;

const {
	degs,
	degs2,
	degs4,
	degs8,
	dtor,
	cosof,
	sinof,
	tanof,
	curviness,
	thrmax,
} = constants;
const clone = x => JSON.parse(JSON.stringify(x));

export default function({
	pickbank, getBank, getBankt, readkey, setForAllThreadsInBank, getThreads, setThreads
}){
	pickbank();
	var bankt = getBankt();
	if (bankt <= 0) return;

	let ch = readkey();
	switch (ch) {
		case 'D':
			ch = readkey();
			switch (ch) {
				case '1': case '2': case '3':
				case '4': case '5': case '6':
				case '7': case '8': case '9':
					setForAllThreadsInBank(function(th){
						th.slice = degs / (Number(ch));
					});
					break;
				case 'M':
					setForAllThreadsInBank(function(th){
						th.slice = 0;
					});
					break;
			}
			break;
		case 'S': {
			setForAllThreadsInBank(function(th){
				th.otslen = th.tslen;
				th.tslen = 0;
			});
			const bank=getBank();
			const threads=getThreads();
			do {
				var oldch = ch+"";
				ch = readkey();
				setForAllThreadsInBank(function(th, bankc){
						switch (ch) {
						case '1': case '2': case '3':
						case '4': case '5': case '6':
						case '7': case '8': case '9':
							th.tslen++;
							th.turnseq[th.tslen - 1] = Number(ch);
							if (oldch == '-'){
								th.turnseq[th.tslen - 1] *= -1;
							}
							if (bankc % 2 == 0){
								th.turnseq[th.tslen - 1] *= -1;
							}
							break;
					}
				});
			} while (!(ch == '16' || ch == '#' || threads[bank[0] - 1].tslen == 50));
			// c = '\15' is Shift In, js = 16

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
		}
		case 'T':
			ch = readkey();
			setForAllThreadsInBank(function(th){
				switch (ch) {
					case '1': case '2': case '3':
					case '4': case '5': case '6':
					case '7': case '8': case '9':
						th.tmode = Number(ch);
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
			const bank=getBank();
			const fbank = clone(bank);
			const fbankt = bankt;
			ch = pickbank();
			const threads = getThreads();
			for (var bankc = 1; bankc <= fbankt; bankc++) {
				var L = threads[fbank[bankc - 1] - 1];
				if (ch == 'N'){
					L.prey = 0;
				} else {
					L.prey = bank[0 + (bankc - 1) % bankt];
				}
			}
			setThreads(threads);
			break;
		case 'L': {
			setForAllThreadsInBank((th, bankc) => {
				th.prey = getBank()[bankc % getBankt()];
			});
			break;
		}
		case 'R':
			ch = readkey();
			setForAllThreadsInBank(function(th){
				switch (ch) {
					case '1': case '2': case '3':
					case '4': case '5': case '6':
					case '7': case '8': case '9':
						th.circturn = 10 - (Number(ch));
						break;
					case 'R':
						th.circturn = random1(7) + 1;
						break;
				}
			});
			break;
	}

	console.log('---------- case_C EXIT');
}

