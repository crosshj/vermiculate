var global = require('./global');

var thrmax = require('./constants').thrmax;
var tailmax = require('./constants').tailmax;
var createArray = require('./helpers').createArray;
var inbank = require('./helpers').inbank;
var rgb = require('./global').getRGB();
var setRGB = require('./global').setRGB;

var threads = require('./global').getThreads();
var palupdate = require('./global').palupdate;
var wraparound = require('./helpers').wraparound;

var getWhichThread = global.getWhichThread;
var setWhichThread = global.setWhichThread;

var inbank = require('./helpers').inbank;


var readkey = require('./global').readkey;

var bank = require('./global').getBank();
var setBank = require('./global').setBank;

var pickbank = function()
{
  var thr = 1;
  var co, ro;
  var orgb = rgb;

  for (co = 2; co <= tailmax; co++){
    for (ro = 0; ro <= 2; ro++){
      orgb[co][ro] = 25;
    }
  }
  bankt = 0;
  ch = '\0';
  do {
    while ( inbank(thr) ){
      thr = thr % getWhichThread() + 1;
    }
    for (co = 1; co <= getWhichThread(); co++){
      for (ro = 0; ro <= 2; ro++){
        orgb[co + 1][ro] = 25;
      }
      if (inbank (co)){
        for (ro = 0; ro <= 1; ro++){
          orgb[co + 1][ro] = 60;
        }
      }
    }
    for (ro = 0; ro <= 2; ro++){
      orgb[thr + 1][ro] = 60;
    }
    palupdate (false);
    ch = readkey();
    palupdate(false);
    switch (ch) {
      case '+':
      case '-':
        do {
          thr = (ch === '+') ? thr+1 : thr-1;
          wraparound(thr, 1, getWhichThread() + 1);
        } while (inbank (thr));
        break;
      case ' ':
        bank[++bankt - 1] = thr;
        break;
      case '1': case '2': case '3':
        case '4': case '5': case '6':
        case '7': case '8': case '9':

        bank[++bankt - 1] = ch - '0';
        if (bank[bankt - 1] > getWhichThread()){
          bankt--;
        }
        break;
      case 'I':
        var tbank;
        var tbankt = 0;
        var c;
        for (c = 1; c <= getWhichThread(); c++){ 
          if (!inbank(c)){
            tbank[++tbankt - 1] = c;
          }
        }
        bankt = tbankt;
        bank = tbank;
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
                bank[++bankt - 1] = c;
              }
            }
            break;
          }
        break;
      case 'A':
        for (bankt = 1; bankt <= getWhichThread(); bankt++){
          bank[bankt - 1] = bankt;
        }
        bankt = getWhichThread();
        break;
      case 'E':
        for (bankt = 1; bankt <= thrmax; bankt++){
          bank[bankt - 1] = bankt;
        }
        bankt = thrmax;
        break;
    }
  } while (!(bankt >= getWhichThread() || ch === 'N' || ch === '\15' || ch == '#'));
  if (bankt == 0 && ch != 'N'){
    bankt = 1;
    bank[0] = thr;
  }
  setRGB(orgb);
  palupdate (false);
  setBank(bank);
}

module.exports = pickbank;