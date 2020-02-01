/*
**	@rsthn/levmap/lib-objects
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

const ObjectDef = require('./object-def');


/**
**	Library of object definitions.
*/

const LibObjects = module.exports = Class.extend
({
	/**
	**	Array of object definitions.
	*/
	objects: null,
	objectsByName: null,

	/**
	**	This should be instantiated only through LibObjects::loadFrom().
	*/
	__ctor: function()
	{
		this.objects = [ ];
		this.objectsByName = { };
	},

	/**
	**	Destroys all the object definitions.
	*/
	__dtor: function()
	{
		dispose(this.objectsByName);
		dispose(this.objects);
	},

	/**
	**	Returns the number of object definitions available.
	*/
	getCount: function()
	{
		return this.objects.length;
	},

	/**
	**	Returns the array of available objects.
	*/
	getArray: function()
	{
		return this.objects;
	},

	/**
	**	Returns the object definition given its index.
	*/
	getObject: function (index)
	{
		return this.objects[index];
	},

	/**
	**	Returns the object definition given its name (integer/string).
	*/
	getObjectByName: function (name)
	{
		if (typeof(name) == 'string')
			name = this.strings.indexOf(name);

		return objectsByName[name];
	}
});

/**
**	Loads an array of object definitions from the specified Object.
**
**	The input must be of the following form:
**	[ ObjectDef ]
*/
LibObjects.loadFrom = function (input, layout)
{
	const s = new LibObjects();

	for (let i = 0; i < input.length; i++)
	{
		let o = new ObjectDef();
		o.loadFrom(input[i], layout.textures.ss.scale);

		s.objects.push(o);
		s.objectsByName[o.getName()] = o;
	}

	return s;
}
