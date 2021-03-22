//show-preview
import { describe, it, expect } from './_framework.js';
import { setupTest, readkeyMock, pickbankMock, Mock } from './_mocks.js';
import { logJSON } from './_utilities.js';

import caseM from '../src/caseM.js'

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

export default {};
