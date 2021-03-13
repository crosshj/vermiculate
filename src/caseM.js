import helpers from './helpers.js';
import constants from './constants.js';

const { thrmax, tmodes } = constants;
const { random1, loop } = helpers;
const oneToNine = [1,2,3,4,5,6,7,8,9].map(x => x+'');

export default function caseM({
	readkey, getThreads, setThreads, getWhichThread, setWhichThread
}){
	const threads = getThreads();
	let ch = readkey();
	if(typeof ch === 'undefined') return;
	if(!['A', 'N'].includes(ch)) return ch;

	const othreads = getWhichThread();
	if (ch == 'N') setWhichThread(0);

	const loopNumbersR = () => {
		ch = readkey();
		if(typeof ch === 'undefined' ||
			ch === '#'
		) return false;
		let lastThread;
		if(['R', ...oneToNine].includes(ch)){
			lastThread = getWhichThread() + 1;
			setWhichThread(lastThread);
		}
		if(oneToNine.includes(ch)){
			threads[lastThread-1].tmode = Number(ch);
		}
		if(ch === 'R'){
			threads[lastThread-1].tmode = random1(Number(tmodes)) + 1;
		}
		// c = '\15' is Shift In, js = 16
		return !(ch == '16' || lastThread == thrmax);
	};
	loop(loopNumbersR);

	if (getWhichThread() === 0) setWhichThread(othreads);
	setThreads(threads);

	return ch;
}



