/*
**	@rsthn/levmap/layer-item
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

const LayerItem = require('./layer-item');


/**
**	Describes a layer item.
*/

module.exports = Class.extend
({
	type: 0,
	x: 0, y: 0,
	zindex: 0,
	width: 0, height: 0,
	group: 0,
	object: 0,
	attributes: null,

	/**
	**	Constructor.
	*/
	__ctor: function ()
	{
	},

	/**
	**	Destroys the Item.
	*/
	__dtor: function()
	{
	},

	getType: function() { return this.type; },
	getX: function() { return this.x; },
	getY: function() { return this.y; },
	getZindex: function() { return this.zindex; },
	getWidth: function() { return this.width; },
	getHeight: function() { return this.height; },
	getGroup: function() { return this.group; },
	getObject: function() { return this.object; },
	getAttributes: function() { return this.attributes; },

	/**
	**	Loads an Item from the given Object.
	**
	**	The input must be of the following form:
	**	[ type:INT, x:INT, y:INT, zindex:INT, width:FLOAT, height:FLOAT, group:INT, object:INT, attributes:MAP ]
	*/
	loadFrom: function (input, scale)
	{
		if (Rin.typeOf(input) != 'array')
			throw new Error("Item: Expected input to be an ARRAY.");

		if (input.length != 9)
			throw new Error("Item: Expected input to have 9 elements.");

		this.type = input[0];
		this.x = input[1]*scale;
		this.y = input[2]*scale;
		this.zindex = input[3];
		this.width = input[4]*scale;
		this.height = input[5]*scale;
		this.group = input[6];
		this.object = input[7];

		let tmp = input[8];

		if (Rin.typeOf(tmp) != 'object' || Object.keys(tmp).length == 0)
			return this;

		this.attributes = { };

		for (let i of Object.entries(tmp))
			this.attributes[i[0]] = i[1];

		return this;
	},

	/**
	**	Instantiates the item into the world. A default layer should be provided, however if the item's display elements
	**	have a layer override they will be instantiated in another layer.
	*/
	instantiate: function (layout, world, layer)
	{
		let obj = layout.objects.getObject(this.object).instantiate(layout, world, layer, this.group);

		obj.attributes = this.attributes;
		obj.translate (this.x, this.y, this.zindex);

		let name = obj.getAttribute("name");
		if (name != null) layout.namedObjects[name] = obj;

		if (layout.onObjectCreated)
			layout.onObjectCreated (obj, layout, world);

		return obj;
	}
});
