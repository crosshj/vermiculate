import globalstate from "./globalstate.js";
import helpers from "./helpers.js";
import constants from "./constants.js";

const { getThreads, getErasing } = globalstate;
const { wraparound, random1, atan2 } = helpers;
const {
	degs,
	degs2,
	degs4,
	degs8,
	dtor,
	cosof,
	sinof,
	tanof,
	curviness,
	thrmax,
} = constants;

const abs = Math.abs;
const fabs = Math.abs;

const withoutPrey = ({ LP }) => {
	switch (LP.tmode) {
		case 1:
			LP.deg += random1(2 * LP.turnsize + 1) - LP.turnsize;
			break;
		case 2:
			if (LP.slice == degs || LP.slice == degs2 || LP.slice == degs4) {
				if (LP.orichar == "D") {
					if (LP.deg % degs4 != degs8) LP.deg = degs4 * random1(4) + degs8;
				} else if (LP.orichar == "V") {
					if (LP.deg % degs4 != 0) LP.deg = degs4 * random1(4);
				}
			}
			if (random1(100) == 0) {
				if (LP.slice == 0) LP.deg = LP.deg - degs4 + random1(degs2);
				else LP.deg += (random1(2) * 2 - 1) * LP.slice;
			}
			break;
		case 3:
			LP.deg += LP.circturn;
			break;
		case 4:
			if (abs(LP.spiturn) > 11) LP.spiturn = 5;
			else LP.deg += LP.spiturn;
			if (random1(15 - abs(LP.spiturn)) == 0) {
				LP.spiturn += LP.ctinc;
				if (abs(LP.spiturn) > 10) LP.ctinc *= -1;
			}
			break;
		case 5:
			LP.turnco = abs(LP.turnco) - 1;
			if (LP.turnco == 0) {
				LP.turnco = curviness + random1(10);
				LP.circturn *= -1;
			}
			LP.deg += LP.circturn;
			break;
		case 6:
			if (abs(LP.turnco) == 1)
				LP.turnco *= -1 * (random1(degs2 / abs(LP.circturn)) + 5);
			else if (LP.turnco == 0) LP.turnco = 2;
			else if (LP.turnco > 0) {
				LP.turnco--;
				LP.deg += LP.circturn;
			} else {
				LP.turnco++;
			}
			break;
		case 7:
			LP.turnco++;
			if (LP.turnco > LP.tclim) {
				LP.turnco = 1;
				LP.tsc = (LP.tsc % LP.tslen) + 1;
			}
			LP.deg += LP.turnseq[LP.tsc - 1];
			break;
	} //switch (LP.tmode)
};

export function move(threadNumber, gfx) {
	const thr = threadNumber;
	const xmin = 0;
	const xmax = gfx.width;
	const ymin = 0;
	const ymax = gfx.height;
	const { gp, sp } = gfx;
	const LP = getThreads(threadNumber);
	const erasing = getErasing();

	if (LP.dead) return false;

	if (LP.prey == 0) {
		withoutPrey({ LP });
	} else {
		let desdeg;
		let dy, dx;
		const thread = getThreads();
		if (LP.tailfollow || LP.prey == thr) {
			dx = thread[LP.prey - 1].xrec[thread[LP.prey - 1].recpos] - LP.x;
			dy = thread[LP.prey - 1].yrec[thread[LP.prey - 1].recpos] - LP.y;
		} else {
			dx = thread[LP.prey - 1].x - LP.x;
			dy = thread[LP.prey - 1].y - LP.y;
		}
		desdeg = LP.vhfollow
			? fabs(dx) > fabs(dy)
				? dx > 0
					? 0 * degs4
					: 2 * degs4
				: dy > 0
				? 1 * degs4
				: 3 * degs4
			: dx > 0
			? dy > 0
				? 1 * degs8
				: 7 * degs8
			: dy > 0
			? 3 * degs8
			: 5 * degs8;
		if (desdeg - (desdeg % degs4) != LP.deg - (LP.deg % degs4) || LP.vhfollow) {
			if (!LP.vhfollow) {
				// Using atan2 here doesn't seem to slow things down:
				desdeg = atan2(dy, dx) / dtor;
				desdeg = wraparound(desdeg, 0, degs);
			}
			if (abs(desdeg - LP.deg) <= abs(LP.circturn)) LP.deg = desdeg;
			else
				LP.deg +=
					desdeg > LP.deg
						? desdeg - LP.deg > degs2
							? -1 * abs(LP.circturn)
							: abs(LP.circturn)
						: LP.deg - desdeg > degs2
						? abs(LP.circturn)
						: -abs(LP.circturn);
		} else {
			LP.deg += tanof[LP.deg] > dy / dx ? -abs(LP.circturn) : abs(LP.circturn);
		}
	}

	LP.deg = wraparound(LP.deg, 0, degs);
	function innerThingy() {
		let oldcol;
		let oldy = LP.y;
		let oldx = LP.x;
		LP.x += cosof[LP.deg];
		LP.x = wraparound(LP.x, xmin, xmax + 1);
		LP.y += sinof[LP.deg];
		LP.y = wraparound(LP.y, ymin, ymax + 1);

		const Int = (number) => number | 0;
		const xi = Int(LP.x);
		const yi = Int(LP.y);

		oldcol = gp(xi, yi);
		if (!oldcol) return { xi, yi };

		let vertwall = false;
		let horiwall = false;
		if (oldcol == 1 && ((LP.killwalls && gridden > 0) || LP.realbounce)) {
			vertwall = gp(xi, oldy) === 1;
			horiwall = gp(oldx, yi) === 1;
		}
		if (oldcol == 1 && LP.realbounce && (vertwall || horiwall)) {
			if (vertwall) LP.deg = -LP.deg + degs2;
			else LP.deg = -LP.deg;
		} else {
			if (
				(oldcol != LP.col && LP.realbounce) ||
				(oldcol == LP.col && LP.selfbounce)
			)
				LP.deg += degs4 * (random1(2) * 2 - 1);
			else if (oldcol != LP.col) LP.deg += degs2;
		}
		if (LP.killwalls && gridden > 0 && oldcol == 1) {
			if (vertwall && xi + 1 <= xmax) {
				let yy;
				for (
					yy = yi - (yi % boxh);
					yy <= yi - (yi % boxh) + boxh && yy <= ymax;
					yy++
				)
					if (gp(xi + 1, yy) != 1 || yy == ymax) sp(xi, yy, 0);
			}
			if (horiwall && yi + 1 <= ymax) {
				let xx;
				for (
					xx = xi - (xi % boxw);
					xx <= xi - (xi % boxw) + boxw && xx <= xmax;
					xx++
				)
					if (gp(xx, yi + 1) != 1 || xx == xmax) sp(xx, yi, 0);
			}
		}
		if (oldcol != LP.col || LP.selfbounce) {
			LP.x = oldx;
			LP.y = oldy;
		}
		LP.deg = wraparound(LP.deg, 0, degs);
		return { xi, yi };
	}
	const { xi, yi } = innerThingy(); //TODO: change name when better is known

	sp(xi, yi, LP.col);
	if (LP.filled) {
		if (erasing) sp(LP.xrec[LP.recpos], LP.yrec[LP.recpos], 0);
		else sp(LP.xrec[LP.recpos], LP.yrec[LP.recpos], LP.col + thrmax);
	}
	LP.yrec[LP.recpos] = yi;
	LP.xrec[LP.recpos] = xi;
	if (LP.recpos == LP.reclen - 1) LP.filled = true;
	if (LP.filled && !erasing) {
		let co = LP.recpos;
		LP.dead = true;
		do {
			let nextco = co + 1;
			nextco = wraparound(nextco, 0, LP.reclen);
			if (LP.yrec[co] !== LP.yrec[nextco] || LP.xrec[co] !== LP.xrec[nextco])
				LP.dead = false;
			co = nextco;
		} while (!(!LP.dead || co == LP.recpos));
	}
	LP.recpos++;
	LP.recpos = wraparound(LP.recpos, 0, LP.reclen);

	return !LP.dead;
}
