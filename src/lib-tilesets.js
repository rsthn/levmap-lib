/*
**	@rsthn/levmap/lib-tilesets
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

/**
**	Provides access to the tilesets loaded from a descriptor.
*/

const LibTileSets = module.exports = Class.extend
({
	/**
	**	Array of the tilesets.
	*/
	tilesets: null,

	/**
	**	Map of the tilesets (by name).
	*/
	tilesetsByName: null,

	/**
	**	Constructor.
	*/
	__ctor: function()
	{
		this.tilesets = [ ];
		this.tilesetsByName = { };
	},

	/**
	**	Destroys all the tilesets.
	*/
	__dtor: function()
	{
		dispose(this.tilesets);
	},

	/**
	**	Returns the number of available tilesets.
	*/
	getCount: function()
	{
		return this.tilesets.length;
	},

	/**
	**	Returns a tileset given its index.
	*/
	getTileset: function (index)
	{
		return this.tilesets[index];
	},

	/**
	**	Returns a tileset given its name (integer/string).
	*/
	getTilesetByName: function (name)
	{
		if (typeof(name) == 'string')
			name = this.strings.indexOf(name);

		return name in this.tilesetsByName ? this.tilesetsByName[name] : null;
	},

	/**
	**	Enumerates the tilesets using the specified function.
	*/
	enum: function (fn)
	{
		for (let i in this.tilesets)
			fn (i, this.tilesets[i]);
	}
});

/**
**	Loads information of tilesets from the given Object.
**
**	The input must be of the following form:
**	[ name:INT, tiles:ARRAY[ width:FLOAT, height:FLOAT, resource:INT ] ]
*/
LibTileSets.loadFrom = function (input, ss, layout)
{
	if (Rin.typeOf(input) != 'array')
		throw new Error ("LibTileSets: Expected input to be an ARRAY.");

	const output = new LibTileSets();
	output.strings = layout.strings;

	for (let i of input)
	{
		let tileset = { name: i[0], tiles: [ ] };

		for (let j of i[1])
		{
			tileset.tiles.push(ss.getTexture(j[2]));
		}

		output.tilesets.push(tileset);
		output.tilesetsByName[tileset.name] = tileset;
	}

	return output;
}
