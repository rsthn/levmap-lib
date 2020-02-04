/*
**	@rsthn/levmap/object-def
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
const { DisplayElement } = require('@rsthn/cherry');

const CollisionGroup = require('./collision-group');
const ElementDef = require('./element-def');
const DisplayObject = require('./display-object');
const Element = require('./element');


/**
**	Definition of an object.
*/

module.exports = Class.extend
({
	index: 0,
	name: 0,
	width: 0,
	height: 0,

	collisionGroups: null,
	elements: null,

	/**
	**	Constructor.
	*/
	__ctor: function()
	{
		this.collisionGroups = [];
		this.elements = [];
	},

	/**
	**	Destroys the object definition.
	*/
	__dtor: function()
	{
		dispose(this.collisionGroups);
		dispose(this.elements);
	},

	getIndex: function () { return this.index; },
	getName: function () { return this.name; },
	getWidth: function () { return this.width; },
	getHeight: function () { return this.height; },

	/**
	**	Loads an object definition from the specified Object.
	**
	**	Input must be of the form:
	**	[ index:INT, name:INT, width:FLOAT, height:FLOAT, collisionGroups:ARRAY[CollisionGroup], elements:ARRAY[ElementDef] ]
	*/
	loadFrom: function (input, scale)
	{
		if (Rin.typeOf(input) != 'array')
			throw new Error("ObjectDef: Expected input to be an ARRAY.");

		if (input.length != 6)
			throw new Error("ObjectDef: Expected input to have 6 elements.");

		this.index = input[0];
		this.name = input[1];
		this.width = input[2]*scale;
		this.height = input[3]*scale;

		for (let i = 0; i < input[4].length; i++)
		{
			let c = new CollisionGroup();
			c.loadFrom(input[4][i], scale);

			this.collisionGroups.push(c);
		}

		for (let i = 0; i < input[5].length; i++)
		{
			let c = new ElementDef();
			c.loadFrom(input[5][i], scale);

			this.elements.push(c);
		}

		return this;
	},

	/**
	**	Instantiates the object into the world. A default layer must be provided. If the group index is non-zero then
	**	only the elements under that specific group (and their related collision fragments) will be instantiated.
	*/
	instantiate: function (layout, world, layer, group)
	{
		let obj = new DisplayObject (this);

		let x = -0.5*this.width;
		let y = -0.5*this.height;

		for (let elem of this.elements)
		{
			if (group && elem.group != group)
				continue;

			obj.addElement (elem.instantiate (layout, world, layer));
		}

		if (layer == null)
		{
			obj.translate (x, y, 0);
			obj.fixed = true;

			layout.allObjects.push (obj);
			return obj;
		}

		let collisionLayer = world.getLayer(world.numLayers - 1);

		for (let collisionGroup of this.collisionGroups)
		{
			if (group != 0 && collisionGroup.name != group)
				continue;

			let e = new Element (0, this.width, this.height);

			e.setFlags (DisplayElement.FLAG_HOLLOW);
			e.translate (0.5*this.width, 0.5*this.height, 0);

			e.group = collisionGroup.name;
			e.setLayer (collisionLayer);

			let dx = -0.5*this.width;
			let dy = -0.5*this.height;

			for (let j of collisionGroup.fragments)
				e.addFragment (dx + j.bounds.x1 + 0.5*j.bounds.width(), dy + j.bounds.y1 + 0.5*j.bounds.height(), j.bounds.width(), j.bounds.height()).setTag(j);

			obj.addCollisionElement (e);

		}

		obj.translate (x, y, 0);

		layout.allObjects.push (obj);
		return obj;
	}
});
