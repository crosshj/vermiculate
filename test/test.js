//show-preview
import { describe, it, QUnit } from './framework.js';
import constants from '../src/constants.js';

import caseC from '../src/caseC.js';

const { sampleStrings } = constants;

describe('Init string parsing: Overall', ({ before }) => {
	before(() => {
		console.log(sampleStrings)
	})
	it.todo('should parse init string without side effects');
	it.todo('should connect with app in way that allows decoupling');
	it.todo('should connect and code all missing cases');
})

describe('Init string parsing: Case C', ({ beforeEach }) => {
	let called = [];
	const mock = (name, res) => (...args) => {
		called.push({ name, args });
		return res;
	};

	
	beforeEach(() => {
		called = [];
	});

	it.todo('should figure out what this is really for and clarify');

	it.todo('should handle: CD{numbers}', ({ assert}) => {
		// caseC should be called with mocked versions of these
		// pickbank, getBank, getBankt, readkey, setForAllThreadsInBank, getThreads
	});
	it.todo('should handle: CDM');

	it.todo('should handle: CS{numbers}#');

	it.todo('should handle: CT{numbers}');
	it.todo('should handle: CTR');

	it('should handle: CO{any character}', (assert) => {
		const charToSet = 'X';
		const arbitraryBankNumber = 9;
		const readkey = (k => () => k.shift())(['O', charToSet]);
		const threads = [{}, {}];
		const setForAllThreadsInBank = fn => threads.forEach(fn);

		caseC({
			readkey,
			//WARNING: pickbank calls readkey
			pickbank: mock('pickbank'),
			getBankt: mock('getBankt', arbitraryBankNumber),
			setForAllThreadsInBank
		})

		assert.true(called.some(({ name, args }) => name === 'pickbank' && args.length === 0));
		assert.true(called.some(({ name, args }) => name === 'getBankt' && args.length === 0));
		assert.true(threads[0].orichar === charToSet);
		assert.true(threads[1].orichar === charToSet);
	});

	it.todo('should handle: CF{numbers only?}');
	it.todo('should handle: CFN');

	it('should handle: CL', (assert) => {
		//c1234#l
		//c5678#l
		const arbitraryBankNumber = 2;
		const readkey = (k => () => k.shift())(['L']);
		const threads = [{}, {}];
		const setForAllThreadsInBank = fn => threads.forEach(fn);

		caseC({
			readkey,
			//WARNING: pickbank calls readkey
			pickbank: mock('pickbank'),
			getBankt: mock('getBankt', arbitraryBankNumber),
			getBank: mock('getBank', [1,2]),
			getThreads: mock('getThreads', threads),
			setForAllThreadsInBank
		});

		console.log(threads)
		assert.true(true);
	});

	it.todo('should handle: CRR');
	it.todo('should handle: CR{numbers}');
});

describe('Init string parsing: Case M', () => {
	it.todo('should figure out what this is really for and clarify');

	it.todo('should handle: MA{numbers}#');
	it.todo('should handle: MAR#');

	it.todo('should handle: MN{numbers}#');
	it.todo('should handle: MNR#');
});

describe('Init string parsing: Case Others', () => {
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

describe('Init string parsing: Case TYN (change thread properties)', () => {
	it.todo('should handle: TS');
	it.todo('should handle: TV');
	it.todo('should handle: TR');
	it.todo('should handle: TL');
	it.todo('should handle: TT');
	it.todo('should handle: TK');

	it.todo('should handle: YS');
	it.todo('should handle: YV');
	it.todo('should handle: YR');
	it.todo('should handle: YL');
	it.todo('should handle: YT');
	it.todo('should handle: YK');

	it.todo('should handle: NS');
	it.todo('should handle: NV');
	it.todo('should handle: NR');
	it.todo('should handle: NL');
	it.todo('should handle: NT');
	it.todo('should handle: NK');
});

describe('Init string parsing: pickbank', () => {
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
