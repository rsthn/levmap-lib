/*
**	@rsthn/levmap/layout
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

const LibStrings = require('./lib-strings');
const LibTextures = require('./lib-textures');
const LibAnimations = require('./lib-animations');
const LibTileSets = require('./lib-tilesets');
const LibObjects = require('./lib-objects');
const Layers = require('./layers');

const Layout = module.exports = Class.extend
({
	alreadyInitialized: false,

	strings: null,
	textures: null,
	animations: null,
	tilesets: null,
	objects: null,
	layers: null,

	namedObjects: null,
	allObjects: null,

	/**
	**	Creates a placeholder of the Layout object. Use method loadFrom to actually load data.
	*/
	__ctor: function()
	{
	},

	/**
	**	Destroys the layout and everything in it.
	*/
	__dtor: function()
	{
		if (!this.alreadyInitialized)
			return;

		this.clear();

		dispose(this.textures);
		dispose(this.strings);
		dispose(this.animations);
		dispose(this.tilesets);
		dispose(this.objects);
		dispose(this.layers);
	},

	/**
	**	Clears everything that was instantiated by the layout.
	*/
	clear: function()
	{
		if (this.allObjects != null)
			dispose(this.allObjects);

		if (this.namedObjects != null)
			dispose(this.namedObjects);

		this.allObjects = null;
		this.namedObjects = null;
	},

	/**
	**	Executed everytime an object is created, useful to add a wrapper or additional functionality based on the attributes of the object.
	*/
	onObjectCreated: null, /* function (obj, layout, world) */

	/**
	**	Loads the layout from the specified descriptor.
	**
	**	The input must be of the following form:
	**	{  textures: { }, strings: [ ], animations: [ ], tilesets: [ ], objects: [ ], layers: [ ] }
	*/
	loadFrom: function (input, texture)
	{
		if (this.alreadyInitialized)
			return this;

		if (input.hasOwnProperty("textures") == false)
			throw new Error ("Layout: Input descriptor does not have textures.");

		if (input.hasOwnProperty("strings") == false)
			throw new Error ("Layout: Input descriptor does not have strings.");

		if (input.hasOwnProperty("animations") == false)
			throw new Error ("Layout: Input descriptor does not have animations.");

		if (input.hasOwnProperty("tilesets") == false)
			throw new Error ("Layout: Input descriptor does not have tilesets.");

		if (input.hasOwnProperty("objects") == false)
			throw new Error ("Layout: Input descriptor does not have objects.");

		if (input.hasOwnProperty("layers") == false)
			throw new Error ("Layout: Input descriptor does not have layers.");

		this.alreadyInitialized = true;

		this.textures = LibTextures.loadFrom (input["textures"], texture);
		this.strings = LibStrings.loadFrom (input["strings"]);

		this.animations = LibAnimations.loadFrom (input["animations"], this.textures.getSpriteSheet(), this);
		this.tilesets = LibTileSets.loadFrom (input["tilesets"], this.textures.getSpriteSheet(), this);
		this.objects = LibObjects.loadFrom (input["objects"], this);
		this.layers = Layers.loadFrom (input["layers"], this);

		return this;
	},

	/**
	**	Instantiates the layout into the world. The namedObjects map will be populated with the objects instantiated that had a name.
	*/
	instantiate: function (world)
	{
		this.clear();

		this.namedObjects = { };
		this.allObjects = [ ];

		this.layers.instantiate (this, world);
	},

	/**
	**	Removes a DisplayObject from the internal lists.
	*/
	removeObject: function (obj)
	{
		/*if (obj.listNode != nullptr)
		{
			allObjects.remove (obj.listNode);
			obj.listNode = nullptr;
		}*/

		return obj;
	}
});
