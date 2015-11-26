var PI = require('./constants').PI;
//var globalstate = require('./globalstate');
//var instring = globalstate.instring;
//var instringPos = globalstate.instringPos;

// TODO: ------------------------------------------------------
function clearscreen() {
    console.log("TODO: clear the screen");
}

function bordupdate() {
    console.log("TODO: bordupdate");
}

function gridupdate() {
    console.log("TODO: gridupdate");
}

//-------------------------------------------------------------

function wraparound(VAL,LOWER,UPPER){
   if (VAL >= UPPER)
      VAL -= UPPER - LOWER;
   else if (VAL < LOWER)
      VAL += UPPER - LOWER;
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function createObjectsArray(length){
	return Array.apply(null, Array(length))
		.map(function () { return {}; });
}

function inbank(thr, bankt)
{
  var c;
  if (bankt > 0)
    for (c = 1; c <= bankt; c++)
      if (bank[c - 1] == thr)
      return true;
  return false;
}

//-----------------------------------------------
// Fast arctan2
function f_atan2(y, x)
{
   var r = 0.0;
   var angle = 0.0;
   var coeff_1 = PI/4;
   var coeff_2 = 3*coeff_1;
   var abs_y = Math.abs(y)+1e-10;      // kludge to prevent 0/0 condition
   if (x >= 0){
      r = (x - abs_y) / (x + abs_y);
      angle = coeff_1 - coeff_1 * r;
   } else {
      r = (x + abs_y) / (abs_y - x);
      angle = coeff_2 - coeff_1 * r;
   }
   return (y < 0)
   ? -angle   // negate if in quad III or IV
   : angle;
}

function random1(i){
  return Math.floor(Math.random()*i);
}

module.exports = {
	wraparound: wraparound,
	createArray: createArray,
	createObjectsArray: createObjectsArray,
	inbank: inbank,
	f_atan2: f_atan2,
	random1: random1,
  clearscreen: clearscreen,
  bordupdate: bordupdate,
  gridupdate: gridupdate
}