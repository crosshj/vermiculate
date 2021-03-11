//show-preview

/* 

	http://www.eclipse.net/~gmcsf/fdm/

*/

import main from './src/main.js';

document.body.style.overflow = "hidden";
document.head.innerHTML += `<link rel="stylesheet" href="index.css">`

//const CURRENT_CONFIG = 5; //some problems with this * pickbank
const CURRENT_CONFIG = 3;
window.process = { argv: [,,CURRENT_CONFIG] };

main({
	throttle: 100, //lower throttle is faster
	seed: 'what okay alright'
});
