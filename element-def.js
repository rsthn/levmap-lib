/*
**	@rsthn/levmap/element-def
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

const { Rin, Class } = require('@rsthn/rin');
const { Rect } = require('@rsthn/cherry');

const Element = require('./element');

/**
**	Describes a definition of an object element.
*/

module.exports = Class.extend
({
	type: 0,
	group: 0,
	name: 0,
	layerIndex: 0,
	visible: false,

	offsX: 0,
	offsY: 0,

	lbounds: null,
	resource: 0,

	/**
	**	Constructor.
	*/
	__ctor: function()
	{
		this.lbounds = Rect.alloc();
	},

	/**
	**	Destroys the object definition.
	*/
	__dtor: function()
	{
		dispose(this.lbounds);
	},

	/**
	**	Loads an object element from the given Object
	**
	**	The input must be of the following form:
	**	[ type:INT, group:INT, name:INT, layerIndex:INT, visible:BOOL, offsX:FLOAT, offsY:FLOAT, lbounds:ARRAY[x1:INT, y1:INT, x2:INT, y2:INT], resource:INT ]
	*/
	loadFrom: function (input, scale)
	{
		if (Rin.typeOf(input) != 'array')
			throw new Error("ElementDef: Expected input to be an ARRAY.");

		if (input.length != 9)
			throw new Error("ElementDef: Expected input to have 9 elements.");

		this.type = input[0];
		this.group = input[1];
		this.name = input[2];
		this.layerIndex = input[3];
		this.visible = input[4] ? true : false;
		this.offsX = input[5]*scale;
		this.offsY = input[6]*scale;
		this.resource = input[8];

		let rect = input[7];

		if (Rin.typeOf(rect) != 'array')
			throw new Error("Element: Expected input[7] to be an ARRAY.");

		if (rect.length != 4)
			throw new Error("Element: Expected input[7] to have 4 elements.");

		this.lbounds.set (rect[0]*scale, rect[1]*scale, rect[2]*scale, rect[3]*scale);

		return this;
	},

	/**
	**	Instantiates the element into the world at the specified default layer (unless the element has layer override).
	*/
	instantiate: function (layout, world, layer)
	{
		let texture = null;

		if (this.type == 1) // Tile
			texture = layout.textures.getDrawable(this.resource);
		else if (this.type == 2) // Animation
			texture = layout.animations.getAnimation(this.resource).getDrawable();
		else
			throw new Error ("ElementDef: Unknown type of element detected.");

		if (texture == null)
			throw new Error ("ElementDef: Unable to find related resource.");

		let width = texture.width;
		let height = texture.height;
		let depth = 1.0;

		let elem = new Element (0, width, height, texture);

		elem.resource = this.resource;
		elem.setElementDef (this);
		elem.setVisible (this.visible);

		elem.getLBounds().set(this.lbounds).translate(-0.5*width, -0.5*height, -0.5*depth);
		elem.translate (this.offsX + 0.5*width, this.offsY + 0.5*height, this.offsZ + 0.5*depth);

		if (layer != null)
		{
			if (this.layerIndex == -1)
				elem.setLayer(layer);
			else
				elem.setLayer(world.getLayer(layerIndex));
		}
		else
		{
			world.drawQueueAdd (elem);
		}

		return elem;
	}
});
