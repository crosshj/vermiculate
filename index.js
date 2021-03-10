//show-preview

/* 

	http://www.eclipse.net/~gmcsf/fdm/

*/

import main from './lib/main.js';

var style = document.createElement('style');
style.innerHTML = `
body {
		display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: calc(100vh - 0em);
	overflow: hidden;
}
canvas {
		/*background: #00000040;*/
	width: 100%;
	/*max-width: 1024px;*/
	ximage-rendering: pixelated;
	ximage-rendering: crisp-edges;
}
`;

document.body.append(style);
//const CURRENT_CONFIG = 5; //some problems with this * pickbank
const CURRENT_CONFIG = 12;
window.process = { argv: [,,CURRENT_CONFIG] };
main();
