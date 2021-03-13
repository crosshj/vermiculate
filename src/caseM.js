import helpers from './helpers.js';
import constants from './constants.js';

const { thrmax, tmodes } = constants;
const { random1, loop } = helpers;

export default function caseM({
	readkey, getThreads, setThreads, getWhichThread, setWhichThread
}){
	console.log('---------- case_M happened');
	const threads = getThreads();
	let ch = readkey();
	if(!['A', 'N'].includes(ch)) return ch;
	const othreads = getWhichThread();
	if (ch == 'N') setWhichThread(0);

	const loopNumbersR = () => {
		ch = readkey();
		const numbers = [1,2,3,4,5,6,7,8,9].map(x => x+'');
		let lastThread;
		if(['R', ...numbers].includes(ch)){
			lastThread = getWhichThread() + 1;
			setWhichThread(lastThread);
		}
		if(numbers.includes(ch)){
			threads[lastThread-1].tmode = Number(ch);
		}
		if(ch === 'R'){
			threads[lastThread-1].tmode = random1(Number(tmodes)) + 1;
		}
		// c = '\15' is Shift In, js = 16
		console.log(ch)
		return !(ch == '16' || ch == '#' || lastThread == thrmax);
	};
	loop(loopNumbersR);

	if (getWhichThread() === 0) setWhichThread(othreads);
	setThreads(threads);

	console.log('---------- case_M EXIT');
	return ch;
}



