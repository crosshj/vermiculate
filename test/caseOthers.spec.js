//show-preview
import { describe, it, expect } from './_framework.js';
import { setupTest, readkeyMock, pickbankMock, Mock } from './_mocks.js';
import { logJSON } from './_utilities.js';

import {
	caseR, caseE, caseAddThread, caseRemoveThread, caseEscape, caseSpace, caseNumbers
} from '../src/caseOthers.js';

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

	it('should handle: number', () => {
		const { state, args } = setupTest();
		const threadMode = '3';
		caseNumbers({ ...args, ch: threadMode })
		state.threads.forEach(th => expect(th.tmode).toEqual(Number(threadMode)));
	});

	it('should handle: E', () => {
		const { state, args } = setupTest();
		caseE({ ...args })
		expect(state.erasing).toEqual(false);
	});

	it('should handle: ]', () => {
		const { state, args } = setupTest();
		caseAddThread({ ...args })
		expect(args.newonscreen.wasCalled).toEqual(true)
		expect(state.whichThread).toEqual(1)
	});
	it('should handle: [ w/ just one thread', () => {
		const { state, args } = setupTest();
		state.threads = [{}];
		state.whichThread = 1
		caseRemoveThread({ ...args })
		expect(state.whichThread).toEqual(1)
	});
	it('should handle: [ w/ last thread filled (uses reclen)', () => {
		const { state, args } = setupTest();
		state.threads = [null, {
			filled: true,
			reclen: 2,
			recpos: 1,
			xrec: [33, 44],
			yrec: [55, 66]
		}];
		state.whichThread = 2
		caseRemoveThread({ ...args })
		expect(state.whichThread).toEqual(1)
		expect(args.sp.history.length).toEqual(2);
		expect(args.sp.history[0].toString()).toEqual([33,55,0].toString())
		expect(args.sp.history[1].toString()).toEqual([44,66,0].toString())
	});
	it('should handle: [ w/ last thread NOT filled (uses recpos)', () => {
		const { state, args } = setupTest();
		state.threads = [null, {
			filled: false,
			reclen: 2,
			recpos: 1,
			xrec: [33, 44],
			yrec: [55, 66]
		}];
		state.whichThread = 2
		caseRemoveThread({ ...args })
		expect(state.whichThread).toEqual(1)
		expect(args.sp.history.length).toEqual(2);
		expect(args.sp.history[0].toString()).toEqual([33,55,0].toString())
		expect(args.sp.history[1].toString()).toEqual([44,66,0].toString())
	});

	it.todo('should handle: caseG'); //not sure I care about grid...

	// pallet: https://github.com/fnatter/ball2d/blob/647a7c43e0fb8bc4ede52ee070154dfa357428de/xscreensaver-5.35/hacks/vermiculate.c#L1093
	it.todo('should handle: caseP'); //palette
	it.todo('should handle: caseA'); //palette

	it.todo('should handle: caseB'); //border

	it.todo('should handle: -'); //speed
	it.todo('should handle: +'); //speed

	it.todo('should handle: /'); //curviness
	it.todo('should handle: *'); //curviness

});

export default {};
