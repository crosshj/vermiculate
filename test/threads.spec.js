//show-preview
import { describe, it, expect } from 'https://cdn.skypack.dev/footils/fiug.test.js';
import { setupTest, readkeyMock, pickbankMock, Mock } from './_mocks.js';
import { logJSON } from './_utilities.js';

import { move } from '../src/threads.js'

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

export default {};
