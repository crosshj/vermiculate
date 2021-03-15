//show-preview
/*
https://github.com/fnatter/ball2d/blob/647a7c43e0fb8bc4ede52ee070154dfa357428de/xscreensaver-5.35/hacks/vermiculate.c
*/
import { describe, it, Mock, expect } from './framework.js';

import constants from '../src/constants.js';
import caseC from '../src/caseC.js';
import caseM from '../src/caseM.js';
import {
	caseR, caseEscape, caseSpace
} from '../src/caseOthers.js';
import caseTYN from '../src/caseTYN.js';
const { sampleStrings } = constants;

const logJSON = x => console.log(JSON.stringify(x,null,2))
const readkeyMock = k => k.shift.bind(k);
const pickbankMock = (readkey, exitOn, state) => () => {
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
const setupTest = (inputString) => {
	const state = {
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
	};
	return { state, args };
};

describe('initstring: all cases included', () => {
	it.todo('should parse all sample strings without missing cases');
});

describe.only('initstring: Case C (change threads?)', () => {
	it('should only change pickbank threads', () => {
		const { state, args } = setupTest('c123#d1');
		state.bank = [1,3];
		state.bankt = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);
		const otherThreads = state.threads.filter((x,i) => !state.bank.includes(i+1));

		const firstRead = args.readkey();
		caseC({ ch: firstRead, ...args });

		expect(
			bankThreads.every(th => typeof th.slice !== 'undefined')
		).toEqual(true);
		expect(
			otherThreads.every(th => typeof th.slice === 'undefined')
		).toEqual(true);
	});

	it('should set slice with number', () => {
		const { state, args } = setupTest('c123#d1');
		state.bank = [1,2,3];
		state.bankt = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);

		const firstRead = args.readkey();
		const ch = caseC({ ch: firstRead, ...args });

		expect(bankThreads.every(x => x.slice === 360)).toEqual(true);
	});
	it('should set slice to zero', ()=>{
		const { state, args } = setupTest('c123#dm');
		state.bank = [1,2,3];
		state.bankt = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);

		const firstRead = args.readkey();
		const ch = caseC({ ch: firstRead, ...args });

		expect(bankThreads.every(x => x.slice === 0)).toEqual(true);
	});

	it('should set turn props with numbers', () => {
		// sets tslen, turnseq, tclim, tsc
		const { state, args } = setupTest('c123#s123#');
		state.bank = [1,2,3];
		state.bankt = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);
		bankThreads.forEach(th => { th.turnseq = [] });

		const firstRead = args.readkey();
		const ch = caseC({ ch: firstRead, ...args });

		expect(bankThreads.every((x,i) => {
			const signsAreCorrect = i % 2 === 0
				? (x.turnseq[1] > 0 && x.turnseq[2] > 0)
				: (x.turnseq[1] < 0 && x.turnseq[2] < 0)
			const tslenCorrect = typeof x.tslen !== undefined && x.tslen === 3;
			return typeof x.turnseq !== undefined &&
				x.turnseq.length === 3 &&
				tslenCorrect &&
				typeof x.tclim !== undefined &&
				typeof x.tsc !== undefined &&
				signsAreCorrect;
		})).toEqual(true);
	});
	it('should set turn props with minus', () => {
		// sets tslen, turnseq, tclim, tsc
		const { state, args } = setupTest('c123#s12-3#');
		state.bank = [1,2,3];
		state.bankt = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);
		bankThreads.forEach(th => { th.turnseq = [] });

		const firstRead = args.readkey();
		const ch = caseC({ ch: firstRead, ...args });

		expect(bankThreads.every((x,i) => {
			const signsAreCorrect = i % 2 === 0
				? (x.turnseq[1] > 0 && x.turnseq[2] < 0)
				: (x.turnseq[1] < 0 && x.turnseq[2] > 0)
			const tslenCorrect = typeof x.tslen !== undefined && x.tslen === 3;
			return typeof x.turnseq !== undefined &&
				x.turnseq.length === 3 &&
				tslenCorrect &&
				typeof x.tclim !== undefined &&
				typeof x.tsc !== undefined &&
				signsAreCorrect;
		})).toEqual(true);
	});

	it('should set orichar', () => {
		const charToSet = 'X';
		const arbitraryBankNumber = 9;
		const threads = [{}, {}];
		const args = {
			readkey: readkeyMock(['O', charToSet]),
			setForAllThreadsInBank: fn => threads.forEach(fn),
			pickbank: new Mock(),
			getBank: new Mock(),
			getBankt: new Mock().returns(arbitraryBankNumber),
			getThreads: new Mock().returns(threads),
		};

		caseC(args)

		expect(args.pickbank.wasCalled).toEqual(true);
		expect(args.getBankt.wasCalled).toEqual(true);
		expect(threads.every(x => x.orichar === charToSet)).toEqual(true);
	});

	it('should set prey (leader?)', () => {
		//NOTE: in this case, a bank of threads is set with prey (lead?)
		const inputString = 'c1234#l'.toUpperCase();
		const state = {
			bankt: 4,
			threads: [{},{},{},{}], //simluate app threads
			bank: [1,2,3,4] // simulate pickbank "1234#"
		};
		const readkey = readkeyMock(inputString.split(''));
		const args = {
			readkey,
			setForAllThreadsInBank: (fn) => state.bank.forEach((b,i) => {
				return fn(state.threads[b-1], i+1);
			}),
			pickbank: pickbankMock(readkey),
			getBankt: new Mock().returns(state.bankt),
			getBank: new Mock().returns(state.bank),
			getThreads: new Mock().returns(state.threads),
		};

		const firstRead = args.readkey();
		caseC(args);

		expect(firstRead).toEqual('C');
		expect(state.threads.every(x => Number.isInteger(x.prey))).toEqual(true);
		expect(state.threads.map(x=>x.prey).join('')).toEqual('2341')
	});

	it('should handle: C{pickbank-pound}F{pickbank-#}', () => {
		const { state, args } = setupTest('c123#f456#');
		args.pickbank = pickbankMock(args.readkey, null, state);
		state.bank = [1,2,3];
		state.bankt = 3;
		state.whichThread = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);

		const firstRead = args.readkey();
		const ch = caseC({ ch: firstRead, ...args });

		bankThreads.forEach((th, i) => {
			expect(th.prey).toEqual(i+4);
		});
	});
	it('should handle: C{pickbank-#}F{pickbank-#} (last leader)', () => {
		const { state, args } = setupTest('c123456#f12#');
		args.pickbank = pickbankMock(args.readkey, null, state);
		state.bank = [1,2,3];
		state.bankt = 3;
		state.whichThread = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);

		const firstRead = args.readkey();
		const ch = caseC({ ch: firstRead, ...args });

		bankThreads.forEach((th, i) => {
			if(i >= 2){
				expect(th.prey).toEqual(2);
				return;
			}
			expect(th.prey).toEqual(i+1);
		});
	});
	it('should handle: C{pickbank-pound}F{pickbank-N}', () => {
		const { state, args } = setupTest('c123#fn');
		args.pickbank = pickbankMock(args.readkey, null, state);
		state.bank = [1,2,3];
		state.bankt = 3;
		state.whichThread = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);

		const firstRead = args.readkey();
		const ch = caseC({ ch: firstRead, ...args });

		bankThreads.forEach((th, i) => {
			expect(th.prey).toEqual(0);
		});
	});

	it.todo('should handle: CT{numbers}');
	it.todo('should handle: CTR');
	
	it.todo('should handle: CRR');
	it.todo('should handle: CR{numbers}');
});

describe('initstring: Case M (set threads mode)', () => {
	it('should handle: MA{numbers}#', () => {
		const { state, args } = setupTest('ma123#');
		state.whichThread = 4;
		const firstRead = args.readkey();
		const ch = caseM({ ch: firstRead, ...args });

		expect(state.threads[4].tmode).toEqual(1);
		expect(state.threads[5].tmode).toEqual(2);
		expect(state.threads[6].tmode).toEqual(3);
		expect(state.whichThread).toEqual(7);
	});
	it('should handle: MAR#',() => {
		const { state, args } = setupTest('mar#');
		state.whichThread = 4;
		const firstRead = args.readkey();
		const ch = caseM({ ch: firstRead, ...args });

		expect(typeof state.threads[state.whichThread-1].tmode).toEqual('number');
		expect(
			[1,2,3,4,5,6,7].includes(state.threads[state.whichThread-1].tmode)
		).toEqual(true);
	});

	it('should handle: MN{numbers}#', () => {
	const { state, args } = setupTest('mn123#');
		state.whichThread = 4;
		const firstRead = args.readkey();
		const ch = caseM({ ch: firstRead, ...args });

		expect(state.threads[0].tmode).toEqual(1);
		expect(state.threads[1].tmode).toEqual(2);
		expect(state.threads[2].tmode).toEqual(3);
	});
	it('should handle: MNR#', () => {
	const { state, args } = setupTest('mnrrr#');
		state.whichThread = 4;
		const firstRead = args.readkey();
		const ch = caseM({ ch: firstRead, ...args });

		expect(typeof state.threads[0].tmode).toEqual('number');
		expect(typeof state.threads[1].tmode).toEqual('number');
		expect(typeof state.threads[2].tmode).toEqual('number');
	});
});

describe('initstring: Case Others', () => {
	it('should not reset border when bordercol !== 1', () => {
		const args = {
			getBordCol: new Mock().returns(0),
			setBordCol: new Mock(),
			getBordCorn: new Mock(),
			setBordCorn: new Mock(),
			bordupdate: new Mock()
		};

		caseR(args);

		expect(args.getBordCol.wasCalled).toEqual(true);
		expect(args.setBordCol.wasCalled).toEqual(false);
		expect(args.getBordCorn.wasCalled).toEqual(false);
		expect(args.setBordCorn.wasCalled).toEqual(false);
		expect(args.bordupdate.wasCalled).toEqual(false);
	});
	
	it('should reset border attributes', () => {
		const args = {
			getBordCol: new Mock().returns(1),
			setBordCol: new Mock(),
			getBordCorn: new Mock(),
			setBordCorn: new Mock(),
			bordupdate: new Mock()
		};

		caseR(args);

		expect(args.getBordCol.wasCalled).toEqual(true);
		expect(args.setBordCol.wasCalled).toEqual(true);
		expect(args.getBordCorn.wasCalled).toEqual(true);
		expect(args.setBordCorn.wasCalled).toEqual(true);
		expect(args.bordupdate.wasCalled).toEqual(true);
	});

	it('should handle: escape', () => {
		const { halted, cleared } = caseEscape() || {};
		expect(typeof cleared).toEqual('undefined');
		expect(halted).toEqual(true);
	});
	it('should handle: space', () => {
		const { halted, cleared } = caseSpace() || {};
		expect(typeof halted).toEqual('undefined');
		expect(cleared).toEqual(true);
	});

	it.todo('should handle: {numbers}');

	it.todo('should handle: E');

	it.todo('should handle: ]');
	it.todo('should handle: [');
});

describe('initstring: Case TYN (boolean properties)', () => {
	const setupTest = (inputString) => {
		const state = {
			bankt: 4,
			threads: [{},{},{},{}], //simluate app threads
			bank: [1,2,3,4] // simulate pickbank "1234#"
		};
		const readkey = readkeyMock(inputString.toUpperCase().split(''));
		const args = {
			readkey, 
			setForAllThreadsInBank: (fn) => state.bank.forEach((b,i) => {
				return fn(state.threads[b-1], i+1);
			}),
			pickbank: pickbankMock(readkey, 'E'),
			getBankt: new Mock().returns(state.bankt),
			getBank: new Mock().returns(state.bank),
			getThreads: new Mock().returns(state.threads),
		};
		return { state, args };
	};

	it('should only change pickbank threads', () => {
		const { state, args } = setupTest('tes');
		state.bank = [1,4];

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.bank.every(x=>typeof state.threads[x-1].selfbounce !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.selfbounce?'T':'F').join('')).toEqual('TFFT');
	});
	
	it('should toggle self bounce', () => {
		const { state, args } = setupTest('tes');
		state.threads[0].selfbounce = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.selfbounce !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.selfbounce?'T':'F').join('')).toEqual('FTTT');
	});
	it('should toggle vhfollow', () => {
		const { state, args } = setupTest('tev');
		state.threads[0].vhfollow = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.vhfollow !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.vhfollow?'T':'F').join('')).toEqual('FTTT');
	});
	it('should toggle realbounce', () => {
		const { state, args } = setupTest('ter');
		state.threads[0].realbounce = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.realbounce !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.realbounce?'T':'F').join('')).toEqual('FTTT');
	});
	it('should toggle little', () => {
		const { state, args } = setupTest('tel');
		state.threads[0].little = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.little !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.little?'T':'F').join('')).toEqual('FTTT');
	});
	it('should toggle tailfollow', () => {
		const { state, args } = setupTest('tet');
		state.threads[0].tailfollow = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.tailfollow !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.tailfollow?'T':'F').join('')).toEqual('FTTT');
	});
	it('should toggle killwalls', () => {
		const { state, args } = setupTest('tek');
		state.threads[0].killwalls = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.killwalls !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.killwalls?'T':'F').join('')).toEqual('FTTT');
	});

	it('should set selfbounce TRUE', () => {
		const { state, args } = setupTest('yes');

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.selfbounce !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.selfbounce?'T':'F').join('')).toEqual('TTTT');
	});
	it('should set vhfollow TRUE', () => {
		const { state, args } = setupTest('yev');
		state.threads[0].vhfollow = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.vhfollow !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.vhfollow?'T':'F').join('')).toEqual('TTTT');
	});
	it('should set realbounce TRUE', () => {
		const { state, args } = setupTest('yer');
		state.threads[0].realbounce = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.realbounce !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.realbounce?'T':'F').join('')).toEqual('TTTT');
	});
	it('should set little TRUE', () => {
		const { state, args } = setupTest('yel');
		state.threads[0].little = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.little !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.little?'T':'F').join('')).toEqual('TTTT');
	});
	it('should set tailfollow TRUE', () => {
		const { state, args } = setupTest('yet');
		state.threads[0].tailfollow = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.tailfollow !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.tailfollow?'T':'F').join('')).toEqual('TTTT');
	});
	it('should set killwalls TRUE', () => {
		const { state, args } = setupTest('yek');
		state.threads[0].killwalls = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.killwalls !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.killwalls?'T':'F').join('')).toEqual('TTTT');
	});

	it('should set selfbounce FALSE', () => {
		const { state, args } = setupTest('nes');

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.selfbounce !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.selfbounce?'T':'F').join('')).toEqual('FFFF');
	});
	it('should set vhfollow FALSE', () => {
		const { state, args } = setupTest('nev');
		state.threads[0].vhfollow = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.vhfollow !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.vhfollow?'T':'F').join('')).toEqual('FFFF');
	});
	it('should set realbounce FALSE', () => {
		const { state, args } = setupTest('ner');
		state.threads[0].realbounce = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.realbounce !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.realbounce?'T':'F').join('')).toEqual('FFFF');
	});
	it('should set little FALSE', () => {
		const { state, args } = setupTest('nel');
		state.threads[0].little = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.little !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.little?'T':'F').join('')).toEqual('FFFF');
	});
	it('should set tailfollow FALSE', () => {
		const { state, args } = setupTest('net');
		state.threads[0].tailfollow = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.tailfollow !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.tailfollow?'T':'F').join('')).toEqual('FFFF');
	});
	it('should set killwalls FALSE', () => {
		const { state, args } = setupTest('nek');
		state.threads[0].killwalls = true;

		const firstRead = args.readkey();
		caseTYN({ ch: firstRead, ...args });

		expect(args.getBankt.wasCalled).toEqual(true);
		expect(state.threads.every(x=>typeof x.killwalls !== 'undefined')).toEqual(true);
		expect(state.threads.map(x=>x.killwalls?'T':'F').join('')).toEqual('FFFF');
	});

});

describe('initstring: pickbank', () => {
	it.todo('should handle: +');
	it.todo('should handle: -');
	it.todo('should handle: space');
	it.todo('should handle: {numbers}');
	it.todo('should handle: I');

	it.todo('should handle: T');
	it.todo('should handle: T{numbers}');

	it.todo('should handle: A');
	it.todo('should handle: E');
});

describe('threads: move', () => {
	/*
		+ prey behavior
		0) not active?
		1) straight w/ slight wiggle
		2) zig-zag triangles
		3) circular
		4) swirly | ornate
		5) wiggle | sinusoidal
		6) oblong | stone-shaped
		7) rounded 4-point star | clover
	*/
	it.todo('move when prey is set');
	it.todo('move when mode is 1: straight');
	it.todo('move when mode is 2: zig-zag');
	it.todo('move when mode is 3: circular');
	it.todo('move when mode is 4: swirly');
	it.todo('move when mode is 5: sinusoidal');
	it.todo('move when mode is 6: rounded oblong');
	it.todo('move when mode is 7: clover');
});

