/*
**	@rsthn/levmap/layer
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
**	Describes a layer.
*/
module.exports = Class.extend
({
	index: 0,
	name: 0,
	comparator: 0,
	items: null,

	/**
	**	Constructor.
	*/
	__ctor: function()
	{
		this.items = [];
	},

	/**
	**	Destroys the layer.
	*/
	__dtor: function()
	{
	},

	getCount: function () { return this.items.length; },
	getItem: function (index) { return this.items[index]; },
	getIndex: function () { return this.index; },
	getName: function () { return this.name; },

	/**
	**	Loads an layer from the given Object.
	**
	**	The input must be of the following form:
	**	[ index:INT, name:INT, comparator:INT, items:ARRAY[LayerItem] ]
	*/
	loadFrom: function (input, layout)
	{
		if (Rin.typeOf(input) != 'array')
			throw new Error("Layer: Expected input to be an ARRAY.");

		if (input.length != 4)
			throw new Error("Layer: Expected input to have 4 elements.");

		this.index = input[0];
		this.name = input[1];
		this.comparator = input[2];

		for (let i = 0; i < input[3].length; i++)
		{
			let c = new LayerItem();
			c.loadFrom(input[3][i], layout.textures.ss.scale);
			this.items.push(c);
		}

		return this;
	},

	/**
	**	Instantiates the layer in the world. Any named object will be added to the namedObjects map.
	*/
	instantiate: function (layout, world)
	{
		let layer = world.getLayer(this.index);

		/*
		VIOLET
		if (comparator == layout->strings->Y)
			layer->setComparator (OctTree::COMPARATOR_Y);
		else if (comparator == layout->strings->DEFAULT)
			layer->setComparator (OctTree::COMPARATOR_DEFAULT);
		else if (comparator == layout->strings->MANHATTAN)
			layer->setComparator (OctTree::COMPARATOR_MANHATTAN);
		*/

		for (let i of this.items)
			i.instantiate (layout, world, layer);
	}
});
