//show-preview
import { describe, it, expect } from './_framework.js';
import { setupTest, readkeyMock, pickbankMock, Mock } from './_mocks.js';
import { logJSON } from './_utilities.js';

import caseTYN from '../src/caseTYN.js'

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

export default {};
