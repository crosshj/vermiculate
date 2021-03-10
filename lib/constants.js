var sampleStrings =
[
  	//0
  	{ str: "]]]]]]]]7ces123400-9-8#c123456#s9998880004#ma3#car9ma6#c-#r1", speed: 600 },
	{ str: "emn1", speed: 600 }, //simple
	{ str: "bmarrrr#c1234#lc5678#lyet]", speed: 600 },
	{ str: "mn333#c23#f1#]]]]]]]]]]]3bc9#r9#c78#f9#ma4#", speed: 600 },
	{ str: "AEBMN22222#CAD4CAORc1#f2#c1#r6", speed: 100 },
	//6
	{ str: "mn6666666#c1i#f1#y2#sy2#vyety1#ry13i#l", speed: 40 },
	{ str: "aebmnrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr#", speed: 500 },
	{ str: "BMN22222223#CAD4CAOVYAS", speed: 150 },
	{ str: "aebmnrrrrrrrrrrrrrrrr#yaryakg--#", speed: 100 },
	{ str: "mn6rrrrrrrrrrrrrrr#by1i#lcalc1#fnyav", speed: 200  },
	//11
	{ str: "mn1rrrrrrrrrrrrrrr#by1i#lcalc1#fn", speed: 200 },
	{ str: "AEBMN222222223#CAR9CAD4CAOV", speed: 150 },
	{ str: "AEBMN22222#CAD4CAORc1#f2#c1#r6", speed: 100 },
	{ str: "mn6666666#c1i#f1#y2#sy2#vyety1#ry13i#l", speed: 40 },
	{ str: "aebmnrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr#", speed: 500 },
	//16
	{ str: "bg+++++++++++++++++++++++#mnrrrrrrrrrrrrrrrrrrrrrrr#y1#k", speed: 500 },
	{ str: "mn6rrrrrrrrrrrrrrr#by1i#lcalc1#fnyav" , speed: 200  },
	{ str: "baeMn333333333333333333333333#CerrYerCal", speed: 800 },
	{ str: "baMn111111222222333333444444555555#Ct1#lCt2#lCt3#lCt4#lCt5#lCerrYerYet", speed: 1400 },
	{ str: "baMn111111222222333333444444555555#Ct1#lCt2#lCt3#lCt4#lCt5#lCerrYerYetYt1i#lYt1i#sYt1#v", speed: 1400 },
	//21
	{ str: "AEBMN222222223#CAR9CAD4CAOV", speed: 150 },
	{ str: "bg+++++++++++++++++++++++#mnrrrrrrrrrrrrrrrrrrrrrrr#y1#k", speed: 500 },
	{ str: "]]]]]]]]7ces123400-9-8#c123456#s9998880004#ma3#car9ma6#c-#r1", speed: 600 },
	{ str: "bmarrrr#c1234#lc5678#lyet]", speed: 600 },
	{ str: "mn333#c23#f1#]]]]]]]]]]]3bc9#r9#c78#f9#ma4#", speed: 600 },
	//26
	{ str: "BMN22222223#CAD4CAOVYAS", speed: 150 },
	{ str: "aebmnrrrrrrrrrrrrrrrr#yaryakg--#", speed: 100 },
	{ str: "mn1rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr#by1i#lcalc1#fn", speed: 2000 },
	{ str: "baeMn1111111111111111111111111111111111111111111111111111111111#Cer9YesYevYerCal", speed: 1200 },
];

var degs = 360;
const degs2 = (degs/2);
const degs4 = (degs/4);
const degs8 = (degs/8);
const dtor = 0.0174532925; /*  pi / degs2; */
var thrmax = 20;

var wid = 768;
var hei = 1024;


var speed = 100;

const sinof = new Array(degs);
const cosof = new Array(degs);
const tanof = new Array(degs);

for (let d = degs - 1; d >= 0; d--) {
  	sinof[d] = Math.sin(d * dtor);
	cosof[d] = Math.cos(d * dtor);
	tanof[d] = (d % degs4 === 0) 
		? tanof[d + 1] 
		: Math.tan(d * dtor);
}

export default {
  	curviness: 30,
	sampleStrings: sampleStrings,
	PI: 3.141592653589793,
	degs, degs2, degs4, degs8,
	dtor, sinof, cosof, tanof,
	thrmax: thrmax,
	tailmax: (thrmax * 2 + 1),
	tmodes: '7',
	ymax: (hei - 1),
	ymin: 0,
	xmax: (wid - 1),
	xmin: 0,
	rlmax: 200,
	SPEEDINC: 10,
	SPEEDMAX: 1000,
	WIN_WIDTH: wid,
	WIN_HEIGHT: hei,
};
