/*
**	@rsthn/levmap/collision-group
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

const CollisionFragment = require('./collision-fragment');

/**
**	Describes a group of collision fragments.
*/

module.exports = Class.extend
({
	name: 0,
	fragments: null,

	/**
	**	Constructor.
	*/
	__ctor: function()
	{
		this.fragments = [];
	},

	/**
	**	Destroys the object definition.
	*/
	__dtor: function()
	{
		dispose(this.fragments);
	},

	/**
	**	Loads a collision fragment group from the specified Object.
	**
	**	Input must be of the form:
	**	[ name:INT, fragments:ARRAY[CollisionFragment] ]
	*/
	loadFrom: function (input, scale)
	{
		if (Rin.typeOf(input) != 'array')
			throw new Error("CollisionGroup: Expected input to be an ARRAY.");

		if (input.length != 2)
			throw new Error("CollisionGroup: Expected input to have 2 elements.");

		this.name = input[0];

		for (let i = 0; i < input[1].length; i++)
		{
			let c = new CollisionFragment();
			c.loadFrom(input[1][i], scale);

			this.fragments.push(c);
		}

		return this;
	}
});
