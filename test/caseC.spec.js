//show-preview
import { describe, it, expect } from './_framework.js';
import { setupTest, readkeyMock, pickbankMock, Mock } from './_mocks.js';
import { logJSON } from './_utilities.js';

import caseC from '../src/caseC.js'

describe('initstring: Case C (change threads?)', () => {
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

	it('should set followers to bank numbers', () => {
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
	it('should set followers to bank numbers (last leader)', () => {
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
	it('should set followers to none', () => {
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

	it('should set tmode to number', () => {
		const { state, args } = setupTest('c123#t2');
		args.pickbank = pickbankMock(args.readkey, null, state);
		state.bank = [1,2,3];
		state.bankt = 3;
		state.whichThread = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);

		const firstRead = args.readkey();
		const ch = caseC({ ch: firstRead, ...args });

		bankThreads.forEach(th => {
			expect(th.tmode).toEqual(2)
		})
		expect(state.threads[state.whichThread].tmode).toEqual(undefined)
	});
	it('should set tmode to random', () => {
		const { state, args } = setupTest('c123#tr');
		args.pickbank = pickbankMock(args.readkey, null, state);
		state.bank = [1,2,3];
		state.bankt = 3;
		state.whichThread = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);

		const firstRead = args.readkey();
		const ch = caseC({ ch: firstRead, ...args });

		bankThreads.forEach(th => {
			expect(typeof th.tmode).toEqual('number')
		})
		expect(state.threads[state.whichThread].tmode).toEqual(undefined)
	});

	it('should set circturn to number', () => {
		const { state, args } = setupTest('c123#r1');
		args.pickbank = pickbankMock(args.readkey, null, state);
		state.bank = [1,2,3];
		state.bankt = 3;
		state.whichThread = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);

		const firstRead = args.readkey();
		const ch = caseC({ ch: firstRead, ...args });

		bankThreads.forEach(th => {
			expect(th.circturn).toEqual(9)
		})
		expect(state.threads[state.whichThread].tmode).toEqual(undefined)

	});
	it('should set circturn to random', () => {
		const { state, args } = setupTest('c123#rr');
		args.pickbank = pickbankMock(args.readkey, null, state);
		state.bank = [1,2,3];
		state.bankt = 3;
		state.whichThread = 3;
		const bankThreads = state.bank.map(x => state.threads[x-1]);

		const firstRead = args.readkey();
		const ch = caseC({ ch: firstRead, ...args });

		bankThreads.forEach(th => {
			expect(typeof th.circturn).toEqual('number')
		})
		expect(state.threads[state.whichThread].circturn).toEqual(undefined)
	});
});

export default {};
