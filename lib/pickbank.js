import globalstate from './globalstate.js';
import helpers from './helpers.js';
import constants from './constants.js';

var thrmax = constants.thrmax;
var tailmax = constants.tailmax;
var createArray = helpers.createArray;
var inbank = helpers.inbank;
var rgb = globalstate.getRGB();  //TODO: do this inline!!!
var setRGB = globalstate.setRGB;
var getBank = globalstate.getBank;
var setBank = globalstate.setBank;
var setBankt = globalstate.setBankt;
var getBankt = globalstate.getBankt;

var getThreads = globalstate.getThreads;
var getWhichThread = globalstate.getWhichThread;
var setWhichThread = globalstate.setWhichThread;


var palupdate = globalstate.palupdate;
var wraparound = helpers.wraparound;

var inbank = helpers.inbank;

var readkey = globalstate.readkey;

var threads = [];
var bank = [];
var bankt = 0;
let ch;

var pickbank = function(){
  	console.log('---------- pickbank happened');
	threads=getThreads();
	bank=getBank();
	bankt = getBankt();
	var thr = 1;
	var co, ro;
	var orgb = rgb;

	for (co = 2; co <= tailmax; co++){
  		for (ro = 0; ro <= 2; ro++){
  			//orgb[co][ro] = 25;
		}
	}

	ch = '';
	do {
  		while ( inbank(thr) ){
  			thr = thr % getWhichThread() + 1;
		}
		for (co = 1; co <= getWhichThread(); co++){
  			for (ro = 0; ro <= 2; ro++){
  				//orgb[co + 1][ro] = 25;
			}
			if (inbank (co)){
  				for (ro = 0; ro <= 1; ro++){
  					//orgb[co + 1][ro] = 60;
				}
			}
		}
		for (ro = 0; ro <= 2; ro++){
  			//orgb[thr + 1][ro] = 60;
		}
		//palupdate (false);
		ch = readkey();
		//palupdate(false);
		switch (ch) {
  			case '+':
			case '-':
				do {
  					thr = (ch === '+') ? thr+1 : thr-1;
					wraparound(thr, 1, getWhichThread() + 1);
				} while (inbank (thr));
				break;
			case ' ':
				bank = getBank();
				bank[++bankt - 1] = thr;
				setBank(bank);
				break;
			case '1': case '2': case '3':
			case '4': case '5': case '6':
			case '7': case '8': case '9':
				bank = getBank();
				bank[++bankt - 1] = Number(ch);
				setBank(bank);
				if (bank[bankt - 1] > getWhichThread()){
  					bankt--;
				}
				break;
			case 'I':
				bank = getBank();
				// TODO: this does not make sense !!!
				var tbank = []; //TODO: should init as array of what length?
				var tbankt = 0;
				for (var c = 1; c <= getWhichThread(); c++){ 
  					if (!inbank(c)){
  						tbank[++tbankt - 1] = c;
					}
				}
				setBankt(tbankt);
				setBank(tbank);
				break;
			case 'T':
				ch = readkey();
				switch (ch) {
  					case '1': case '2': case '3':
					case '4': case '5': case '6':
					case '7': case '8': case '9':
						var c;
						for (c = 1; c <= getWhichThread(); c++){
  							if (threads[c - 1].tmode == ch - '0'){
  								bank = getBank();
								bank[++bankt - 1] = c;
								setBank(bank);
							}
						}
						break;
					}
				break;
			case 'A':
				bank = getBank();
				for (bankt = 1; bankt <= getWhichThread(); bankt++){
  					bank[bankt - 1] = bankt;
				}
				setBank(bank);
				setBankt(getWhichThread());
				break;
			case 'E':
				bank = getBank();
				for (bankt = 1; bankt <= thrmax; bankt++){
  					bank[bankt - 1] = bankt;
				}
				setBank(bank);
				setBankt(thrmax);
				break;
		}
	} while (!(bankt >= getWhichThread() || ch === 'N' || ch === '0o15' || ch == '#'));
	if (getBankt() == 0 && ch != 'N'){
  		setBankt(1);
		bank = getBank();
		bank[0] = thr;
		setBank(bank);
	}
	setRGB(orgb);
	palupdate (false);


	console.log('---------- pickbank EXIT');
}

export default pickbank;
