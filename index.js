//show-preview

/* 

	http://www.eclipse.net/~gmcsf/fdm/
	
	THREAD TYPES:
	0) not active?
	1) straight w/ slight wiggle
	2) zig-zag triangles
	3) circular
	4) swirly | ornate
	5) wiggle | sinusoidal
	6) oblong | stone-shaped
	7) rounded 4-point star | clover
	
	> prey behavior
	> selfbounce
	
*/

import main from './src/main.js';

document.body.style.overflow = "hidden";
document.head.innerHTML += `<link rel="stylesheet" href="index.css">`

//const CURRENT_CONFIG = 5; //some problems with this * pickbank
const CURRENT_CONFIG = 7;
window.process = { argv: [,,CURRENT_CONFIG] };

main({
	throttle: 5, //lower throttle is faster
	seed: 'canister danister fanister lanister stanister'
});
