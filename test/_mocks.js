import { Mock } from 'https://cdn.skypack.dev/footils/fiug.test.js';
//import { Mock } from './_framework.js';
import constants from '../src/constants.js'

export { Mock };

export const readkeyMock = k => k.shift.bind(k);

export const pickbankMock = (readkey, exitOn, state) => () => {
	if(state){
		state.bank = [];
	}
	let ch;
	while(true){
		ch = readkey();
		if([exitOn, '#', 'N', undefined].includes(ch)) break;
		state && (state.bank.push(ch));
		state && (state.bankt = ch);
	}
	return ch;
};

export const setupTest = (inputString='') => {
	const state = {
		erasing: true,
		whichThread: 0,
		bank: [],
		threads: new Array(constants.thrmax)
			.fill()
			.map(x =>({})),
	};
	const readkey = readkeyMock(inputString.toUpperCase().split(''));
	const args = {
		readkey,

		setForAllThreadsInBank: (fn) => state.bank.forEach((b,i) => {
			return fn(state.threads[b-1], i+1);
		}),
		pickbank: pickbankMock(readkey, 'E'),

		getBankt: () => state.bankt,
		setBankt: () => state.bankt,

		getBank: () => state.bank,
		setBank: (bank) => (state.bank = bank),

		getWhichThread: () => state.whichThread,
		setWhichThread: (which) =>  (state.whichThread = which),
		
		getThreads: () => state.threads,
		setThreads: (threads) => state.threads = threads,
		
		sp: new Mock(),
		gp: new Mock(),
		
		getErasing: () => state.erasing,
		setErasing: (e) => state.erasing = e,
		
		newonscreen: new Mock()
	};
	return { state, args };
};
