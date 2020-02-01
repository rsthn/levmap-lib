/*
**	@rsthn/levmap/layers
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

const { Class } = require('@rsthn/rin');

const Layer = require('./layer');


/**
**	Collection of layers loaded from a descriptor.
*/

const Layers = module.exports = Class.extend
({
	layers: null,

	/**
	**	Constructor.
	*/
	__ctor: function ()
	{
		this.layers = [];
	},

	/**
	**	Destroys the layers and all of its contents.
	*/
	__dtor: function()
	{
	},

	/**
	**	Returns the number of available layers.
	*/
	getCount: function()
	{
		return this.layers.length;
	},

	/**
	**	Returns the layer at the specified index.
	*/
	get: function (index)
	{
		return this.layers[index];
	},

	/**
	**	Instantiates all layers into the world and returns a map of named objects.
	*/
	instantiate: function (layout, world)
	{
		for (let layer of this.layers)
			layer.instantiate (layout, world);
	}
});

/**
**	Loads information of layers and its contents from the given Object.
**
**	The input must be of the following form:
**	[ Layer ]
*/
Layers.loadFrom = function (input, layout)
{
	let s = new Layers();

	for (let i = 0; i < input.length; i++)
	{
		let c = new Layer();
		c.loadFrom(input[i], layout);

		s.layers.push(c);
	}

	return s;
}
