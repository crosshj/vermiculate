import _QUnit from 'https://cdn.skypack.dev/@dev.mohe/qunit';
//import QUnit from 'https://cdn.skypack.dev/qunit';
document.head.innerHTML += `<link rel="stylesheet" href="test.css">`

//QUnit.start()
//QUnit.begin(console.log);
//QUnit.done(console.log);
//QUnit.on( "runEnd", console.log);

function browserRender(){
	const { childSuites } = arguments[0]
	let allErrors = [];
	const testDom = (item) => {
		const { status, name, runtime, tests, errors } = item;
		const testItem = document.createElement('div');
		if(!tests || !tests.length){
			const isIgnored = ['todo', 'skipped'].includes(status);

			testItem.innerHTML = `
				<span class="status ${status}"></span>
				<span>${name}</span>
				${ !isIgnored
					? `<span>(${runtime.toFixed(3)} ms)</span>`
					: " " || `<span>{${status}}</span>`
				}
			`;
			document.body.append(testItem)
			if(!isIgnored && errors.length){
				errors.forEach(e => {
					allErrors.push({
						...e,
						name
					})
				})
				
			}
			return;
		}
		
		testItem.classList.add('header');
		testItem.innerHTML = `
			<span class="overall-status ${status} light-text">${status}</span>
			<span class="light-text">${name}</span>
			${ !['todo', 'skipped'].includes(status)
				? `<span>(${runtime.toFixed(3)} ms)</span>`
				: " " || `<span>{${status}}</span>`
			}
		`;
		document.body.append(testItem)
		tests?.length && tests.forEach(testDom);
	}
	childSuites.forEach(testDom)
	
	const errorDom = (error) => {
		const errorItem = document.createElement('div');
		errorItem.classList.add('error')
		errorItem.innerHTML = `
			<div>TEST: ${error.name}</div>
			<div>MSG: ${error.message || '<blank>'}</div>
			<div>STACK: ${error.stack}</div>
		`;
		document.body.append(errorItem);
	};
	allErrors.forEach(errorDom);
	//console.log(arguments)
}

_QUnit.on( "runEnd", browserRender);
export const QUnit = _QUnit
export const describe = _QUnit.module.bind(QUnit);
export const it = _QUnit.test.bind(QUnit);
it.todo = (desc, cb) => _QUnit.todo(desc, cb || (() => {}));
it.skip = _QUnit.skip