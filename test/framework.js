import _QUnit from 'https://cdn.skypack.dev/@dev.mohe/qunit';
//import QUnit from 'https://cdn.skypack.dev/qunit';
document.head.innerHTML += `<link rel="stylesheet" href="test.css">`

_QUnit.config.autostart = false;
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
		//console.log(item)
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

/*
	"runStart",
	"suiteStart",
	"testStart",
	"assertion",
	"testEnd",
	"suiteEnd",
	"runEnd"
*/
/*
_QUnit.on("suiteStart", (...args) => {
	console.log(args);
});
*/
_QUnit.on("runEnd", browserRender);
export const QUnit = _QUnit

const suites = [];
function debounce (fn, wait) {
	let t
	return function () {
		clearTimeout(t)
		t = setTimeout(() => fn.apply(this, arguments), wait)
	}
}
const debounceTimeout = 1500;
const runTests = debounce(() => {
	const hasOnly = suites.find(x => x.only);
	suites.forEach(s => {
		if(s.only) {
			return _QUnit.module(s.desc, s.test || (() => {}) );
		}
		if(hasOnly && !s.skip) return
		if(s.skip){
			return  _QUnit.module.skip(s.desc, s.test || (() => {}) );
		}
		_QUnit.module(s.desc, s.test || (() => {}) );
	});
	_QUnit.start();
}, debounceTimeout);


export const describe = (desc, test) => {
	suites.push({ desc, test });
	runTests();
};
describe.skip = (desc, test) => {
	suites.push({ desc, test, skip: true });
	runTests();
};
describe.only = (desc, test) => {
	suites.push({ desc, test, only: true });
	runTests();
};


export const it = _QUnit.test.bind(QUnit);
it.todo = (desc, cb) => _QUnit.todo(desc, cb || (() => {}));
it.skip = _QUnit.skip;
it.only = _QUnit.only;

export class Mock {
	history = [];

	constructor(){
		function self(...args){
			return this.exec(...args);
		};
		this.self = self.bind(this);
		this.self.history = this.history;
		this.self.returns = this.returns.bind(this);
		Object.defineProperty(this.self, 'wasCalled', {
			get() { return this.history.length > 0; }
		});
		return this.self;
	}
	returns = (res) => {
		this.returns = res;
		return this.self;
	}
	exec = (...args) => {
		this.history.push(args);
		return this.returns;
	}
}

export const expect = (actual) => {
	return {
		toEqual: (expected) => {
			const msg = `expected ${actual} to equal ${expected}`;
			_QUnit.assert.true(actual === expected, msg)
		}
	}
}
