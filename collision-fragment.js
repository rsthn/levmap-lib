/*
**	@rsthn/levmap/collision-fragment
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


/**
**	Describes a collision fragment.
*/

module.exports = Class.extend
({
	name: 0,
	bounds: null,

	/**
	**	Constructor.
	*/
	__ctor: function()
	{
		this.bounds = Rect.alloc();
	},

	/**
	**	Destroys the object definition.
	*/
	__dtor: function()
	{
		dispose(this.bounds);
	},

	/**
	**	Loads a collision fragment from the specified Object.
	**
	**	Input must be of the form:
	**	[ name:INT, bounds:ARRAY[x1:INT, y1:INT, x2:INT, y2:INT] ]
	*/
	loadFrom: function (input, scale)
	{
		if (Rin.typeOf(input) != 'array')
			throw new Error("CollisionFragment: Expected input to be an ARRAY.");

		if (input.length != 2)
			throw new Error("CollisionFragment: Expected input to have 2 elements.");

		let rect = input[1];

		if (Rin.typeOf(rect) != 'array')
			throw new Error("CollisionFragment: Expected input[1] to be an ARRAY.");

		if (rect.length != 4)
			throw new Error("CollisionFragment: Expected input[1] to have 4 elements.");

		this.name = input[0];
		this.bounds.set (rect[0]*scale, rect[1]*scale, rect[2]*scale, rect[3]*scale);

		return this;
	}
});
