/*
**	@rsthn/levmap/lib-textures
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
const SpriteSheet = require('./spritesheet');

/**
**	Provides access to the spritesheet and its individual tiles loaded from a descriptor.
*/

const LibTextures = module.exports = Class.extend
({
	/**
	**	Actual texture bitmap.
	*/
	texture: null,

	/**
	**	Sprite sheet with all the available textures.
	*/
	ss: null,

	/**
	**	Class can be instantiated only through LibTextures::loadFrom().
	*/
	__ctor: function ()
	{
	},

	/**
	**	Destroys the internal spritesheet and the texture.
	*/
	__dtor: function()
	{
		dispose(this.ss);
		dispose(this.texture);
	},

	/**
	**	Returns the number of available tiles.
	*/
	getCount: function()
	{
		return this.ss.getNumTiles();
	},

	/**
	**	Returns the drawable of a tile at the specified index.
	*/
	getDrawable: function (index)
	{
		return this.ss.getDrawable(index);
	},

	/**
	**	Returns the underlying spritesheet object.
	*/
	getSpriteSheet: function()
	{
		return this.ss;
	}
});

/**
**	Loads information of textures from the given texture and descriptor.
**
**	The input must be of the following form:
**	{  textureIndex:STRING : [ x:INT, y:INT, width:INT, height:INT ] }
*/
LibTextures.loadFrom = function (input, texture)
{
	if (Rin.typeOf(input) != 'object')
		throw new Error ("Textures: Expected input to be an OBJECT.");

	const textures = new LibTextures();

	textures.texture = texture;
	textures.ss = new SpriteSheet (texture);

	for (i in input)
	{
		let value = input[i];
		textures.ss.setCoords (i, value[0], value[1], value[2], value[3], true);
	}

	return textures;
}
