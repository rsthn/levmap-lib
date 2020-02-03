/*
**	@rsthn/levmap/lib-animations
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

const Animation = require('./animation');


/**
**	Provides access to the animations loaded from a descriptor.
*/

const LibAnimations = module.exports = Class.extend
({
	/**
	**	Array of the spritesheet animations.
	*/
	animations: null,

	/**
	**	Constructor.
	*/
	__ctor: function()
	{
	},

	/**
	**	Destroys all the spritesheet animations.
	*/
	__dtor: function()
	{
		dispose(this.animations);
	},

	/**
	**	Returns the number of available animations.
	*/
	getCount: function()
	{
		return this.animations.length;
	},

	/**
	**	Returns an animation given its index.
	*/
	getAnimation: function (index)
	{
		return this.animations[index];
	},

	/**
	**	Returns an animation given its name (integer/string).
	*/
	getAnimationByName: function (name)
	{
		if (typeof(name) == 'string')
			name = this.strings.indexOf(name);

		for (let anim of this.animations)
			if (anim.name == name) return anim;

		return null;
	},

	/**
	**	Enumerates the animations using the specified function.
	*/
	enum: function (fn)
	{
		for (let i in this.animations)
			fn (i, this.animations[i]);
	}
});

/**
**	Loads information of animations from the given Object.
**
**	The input must be of the following form:
**	[ index:INT, defaultSequence:INT, name:INT, sequences:ARRAY[ name:INT, loop:INT, rate:FLOAT, width:FLOAT, height:FLOAT, frames:ARRAY[ duration:INT, resource:INT ] ] ]
*/
LibAnimations.loadFrom = function (input, ss, layout)
{
	if (Rin.typeOf(input) != 'array')
		throw new Error ("LibAnimations: Expected input to be an ARRAY.");

	const output = new LibAnimations();

	output.animations = [];
	output.strings = layout.strings;

	for (let descriptor of input)
	{
		let anim = new Animation();
		anim.loadFrom(descriptor, ss, layout.strings);

		output.animations[anim.getIndex()] = anim;
	}

	return output;
}
