//show-preview
import { describe, it, Mock, expect } from './framework.js';

import constants from '../src/constants.js';
import caseC from '../src/caseC.js';
import caseM from '../src/caseM.js';
import caseTYN from '../src/caseTYN.js';

const { sampleStrings } = constants;
const logJSON = x => console.log(JSON.stringify(x,null,2))

const readkeyMock = k => k.shift.bind(k);
const pickbankMock = (readkey, exitOn) => () => {
	while( ![exitOn, '#', 'N', undefined].includes(readkey()) ){}
};

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

describe('initstring: Overall', ({ before }) => {
	before(() => {
		//console.log(sampleStrings)
	})
	it.todo('should parse init string without side effects, ie. no dependency injection');
	it.todo('should connect with app in way that allows decoupling');
	it.todo('should connect and code all missing cases');
})

describe('initstring: Case C', () => {
	it.todo('should figure out what this is really for and clarify');

	it.todo('should handle: CD{numbers}', ({ assert}) => {
		// caseC should be called with mocked versions of these
		// pickbank, getBank, getBankt, readkey, setForAllThreadsInBank, getThreads
	});
	it.todo('should handle: CDM');

	it.todo('should handle: CS{numbers}#');

	it.todo('should handle: CT{numbers}');
	it.todo('should handle: CTR');

	it('should handle: CO{any character}', () => {
		const charToSet = 'X';
		const arbitraryBankNumber = 9;
		const threads = [{}, {}];
		const args = {
			readkey: readkeyMock(['O', charToSet]),
			setForAllThreadsInBank: fn => threads.forEach(fn),
			// warning, real pickbank calls readkey
			pickbank: new Mock(),
			getBankt: new Mock().returns(arbitraryBankNumber),
			getThreads: new Mock().returns(threads),
		};

		caseC(args)

		expect(args.pickbank.wasCalled).toEqual(true);
		expect(args.getBankt.wasCalled).toEqual(true);
		expect(threads.every(x => x.orichar === charToSet)).toEqual(true);
	});

	it.todo('should handle: CF{numbers only?}');
	it.todo('should handle: CFN');

	it('should handle: C{numbers-pound}L', () => {
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
		
		logJSON(state)

		expect(firstRead).toEqual('C');
		expect(state.threads.every(x => Number.isInteger(x.prey))).toEqual(true);
		expect(state.threads.map(x=>x.prey).join('')).toEqual('2341')
	});

	it.todo('should handle: CRR');
	it.todo('should handle: CR{numbers}');
});

describe('initstring: Case M (set threads mode)', () => {
	const setupTest = (inputString) => {
		const state = {
			whichThread: 0,
			threads: new Array(constants.thrmax)
				.fill()
				.map(x =>({})),
		};
		const readkey = readkeyMock(inputString.toUpperCase().split(''));
		const args = {
			readkey, 
			getWhichThread: () => state.whichThread,
			setWhichThread: (which) =>  state.whichThread = which,
			getThreads: () => state.threads,
			setThreads: (threads) => state.threads = threads,
		};
		return { state, args };
	};

	it('should handle: MA{numbers}#', () => {
		const { state, args } = setupTest('ma123#');
		state.whichThread = 4;
		const firstRead = args.readkey();
		const ch = caseM({ ch: firstRead, ...args });

		expect(true).toEqual(true);
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

		expect(true).toEqual(true);
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

		expect(true).toEqual(true);
		expect(state.threads[0].tmode).toEqual(1);
		expect(state.threads[1].tmode).toEqual(2);
		expect(state.threads[2].tmode).toEqual(3);
	});
	it('should handle: MNR#', () => {
	const { state, args } = setupTest('mnrrr#');
		state.whichThread = 4;
		const firstRead = args.readkey();
		const ch = caseM({ ch: firstRead, ...args });

		expect(true).toEqual(true);
		expect(typeof state.threads[0].tmode).toEqual('number');
		expect(typeof state.threads[1].tmode).toEqual('number');
		expect(typeof state.threads[2].tmode).toEqual('number');
	});
});

describe('initstring: Case Others', () => {
	it.todo('should figure out what Case R really for and clarify');
	it.todo('should handle: R');
	
	it.todo('should handle: {numbers}');
	
	it.todo('should handle: escape');
	it.todo('should handle: space');

	it.todo('should handle: E');
	
	it.todo('should handle unkown cases');

	it.todo('should handle: ]');
	it.todo('should handle: [');
});

describe('initstring: Case TYN (change thread properties)', () => {
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

	it('should change only the threads that pickbank selects', () => {
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
	it.todo('should figure out what this is really for and clarify');
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

