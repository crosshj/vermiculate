import globalstate from './globalstate.js';
const { getRGB } = globalstate;

class Graphics {
	width;
	height;
	point;

	canvas;
	ctx;

	constructor(width, height){
		this.width = width;
		this.height = height;
		this.point = new Array(width*height);

		this.canvas = document.createElement('canvas');
		this.canvas.width = width;
		this.canvas.height = height;
		document.body.append(this.canvas);
		this.ctx = this.canvas.getContext('2d');

		this.sp = this.sp.bind(this);
		this.gp = this.gp.bind(this);
		this.redraw = this.redraw.bind(this);
		this.clearscreen = this.clearscreen.bind(this);
	}

	sp(x,y,c){
		if(isNaN(x) || isNaN(y)){
			throw new Error(`cannot SET pixel at ${x}, ${y}`);
			return;
		}
		const _x = Math.floor(x);
		const _y = Math.floor(y);
		const palette = getRGB();
		this.point[(this.width * _y) + _x] = c;

		const [r,g,b] = palette[c];
		//console.log(`pixel ${r}, ${g}, ${b} at ${_x}, ${_y}`)

		if(c===0){
				this.ctx.clearRect(_x, _y, 1, 1);
		} else {
				this.ctx.fillStyle = `rgba(${r},${g},${b},1)`;
			//this.ctx.fillStyle = `rgba(255,255,255,1)`;
			this.ctx.fillRect(_x, _y, 1, 1);
		}

		/* ALTERNATE WAY TO SET PIXEL
		var id = myContext.createImageData(1,1); // only do this once per page
		var d  = id.data;                        // only do this once per page
		d[0]   = r;
		d[1]   = g;
		d[2]   = b;
		d[3]   = a;
		myContext.putImageData( id, x, y ); 
		*/
	}

	gp(x,y){
			if(isNaN(x) || isNaN(y)){
				throw new Error(`cannot GET pixel at ${x}, ${y}`);
		}
		//console.log(`get ${x}, ${y}`)
		return this.point[(this.width * y) + x];
	}

	redraw(x,y,width,height){
			for (let xc = x; xc <= x + this.width - 1; xc++){
				for (let yc = y; yc <= y + this.height - 1; yc++){
					if (this.point[wid * yc + xc] != 0){
						this.sp(xc, yc, this.point[wid * yc + xc]);
				}
			}
		}
	}

	clearscreen(){
			//this.ctx.fillStyle = "rgb(0, 0, 0)";
		//this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

}

export default Graphics;

