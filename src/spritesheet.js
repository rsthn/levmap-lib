/*
**	@rsthn/levmap/spritesheet
**
**	Copyright (c) 2018-2020, RedStar Technologies, All rights reserved.
**	https://www.rsthn.com/
**
**	THIS LIBRARY IS PROVIDED BY REDSTAR TECHNOLOGIES "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
**	INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
**	PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL REDSTAR TECHNOLOGIES BE LIABLE FOR ANY
**	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
**	NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
**	OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
**	STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
**	USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const Class = require('@rsthn/rin/class');

module.exports = Class.extend
({
	className: "SpriteSheet",

	width: 0,
	height: 0,

	drawableCache: null,

	__ctor: function (image)
	{
		if (image.type != "image")
			throw new Error ("Resource is not an image.");

		this.r_scale = image.data.width / image.owidth;
		this.v_scale = image.width / image.owidth;
		this.scale = this.v_scale;

		this.img = image;

		this.drawableCache = { };
		this.numTiles = 0;
	},

	setCoords: function (tileIndex, x, y, width, height)
	{
		if (!(tileIndex in this.drawableCache))
			this.numTiles++;

		this.drawableCache[tileIndex] =
		{
			x: this.r_scale*x,
			y: this.r_scale*y,
			rwidth: ~~(this.r_scale*width),
			rheight: ~~(this.r_scale*height),

			width: ~~(this.v_scale*width),
			height: ~~(this.v_scale*height),

			tileIndex: tileIndex,
			ss: this,

			draw: function (g, x, y) {
				g.drawImage (this.ss.img.data, this.x, this.y, this.rwidth, this.rheight, x, y, this.width, this.height);
			}
		};
	},

	getNumTiles: function ()
	{
		return this.numTiles;
	},

	getTexture: function (tileIndex)
	{
		if (!(tileIndex in this.drawableCache))
			return null;

		return this.drawableCache[tileIndex];
	}
});
