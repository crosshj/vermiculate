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
const oneToNine = [1,2,3,4,5,6,7,8,9].map(x => x+'');

export default function({
	pickbank, getBank, getBankt, readkey, setForAllThreadsInBank, getThreads, setThreads
}){
	pickbank();
	var bankt = getBankt();
	if (bankt <= 0) return;
	const bank = getBank();
	const threads = getThreads();

	let ch = readkey();
	switch (ch) {
		case 'D':
			// sets slice
			ch = readkey();
			if(oneToNine.includes(ch)){
				setForAllThreadsInBank((th) => {
					th.slice = degs / (Number(ch));
				});
			};
			if(ch === 'M'){
				setForAllThreadsInBank((th) => { th.slice = 0; });
			}
			break;
		case 'S':
			// sets tslen, turnseq, tclim, tsc
			setForAllThreadsInBank((th) => {
				th.otslen = th.tslen;
				th.tslen = 0;
			});
			const doLoop = () => {
				const oldch = ch+"";
				ch = readkey();

				if(typeof ch === 'undefined' || ch === '#'){
					return false;
				}
				if(!oneToNine.includes(ch)) return true;

				setForAllThreadsInBank((th, bankc) => {
					th.tslen++;
					th.turnseq[th.tslen - 1] = Number(ch);
					if (oldch == '-'){
						th.turnseq[th.tslen - 1] *= -1;
					}
					if (bankc % 2 == 0){
						th.turnseq[th.tslen - 1] *= -1;
					}
				});
				// c = '\15' is Shift In, js = 16
				return !(
					ch == '16' ||threads[bank[0] - 1].tslen === 50
				);
			}
			loop(doLoop);
			setForAllThreadsInBank((th) => {
				var seqSum = 0;
				if (th.tslen === 0){
					th.tslen = th.otslen;
				}
				for (var c = 1; c <= th.tslen; c++){
					seqSum += th.turnseq[c - 1];
				}
				if (seqSum == 0){
					th.tclim = 1;
					return;
				}
				th.tclim = Math.floor(degs2 / Math.abs(seqSum));
				th.tsc = random1(th.tslen) + 1;
			});
			break;
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
			const followerbank = clone(bank);
			ch = pickbank();
			const leaderbank = getBank();
			let lastLeader;
			followerbank.forEach((b, i) => {
				if(typeof b === 'undefined' || b === null) return;
				lastLeader = leaderbank[i] || lastLeader;
				var L = threads[b - 1];
				L.prey = ch == 'N'
					? 0
					: Number(lastLeader);
			});
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
}

