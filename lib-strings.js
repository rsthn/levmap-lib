/*
**	@rsthn/levmap/lib-strings
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
**	Fast collection of the strings loaded from a descriptor.
*/

const LibStrings = module.exports = Class.extend
({
	/**
	**	Containers for the available strings.
	*/
	stringToIndex: null,
	indexToString: null,

	/**
	**	This class should only be instantiated only through Strings::loadFrom().
	*/
	__ctor: function ()
	{
	},

	/**
	**	Destroys the containers and all strings.
	*/
	__dtor: function()
	{
	},

	/**
	**	Returns the number of available strings.
	*/
	getCount: function()
	{
		return this.indexToString.length;
	},

	/**
	**	Returns a string at a given index or null if not found.
	*/
	get: function (index)
	{
		return this.indexToString[index-1];
	},

	/**
	**	Returns the index of a string.
	*/
	indexOf: function (str)
	{
		return this.stringToIndex[str];
	}
});

/**
**	Common strings, loaded when the class is instantiated.
*/

LibStrings.Y = 0;
LibStrings.DEFAULT = 0;
LibStrings.MANHATTAN = 0;

/**
**	Loads all strings from a descriptor and prepares them for fast access.
**
**	The input must be of the following form:
**	[ string:STRING ]
*/
LibStrings.loadFrom = function (input)
{
	if (Rin.typeOf(input) != 'array')
		throw new Error ("LibStrings: Expected input to be an ARRAY.");

	const strings = new LibStrings();

	strings.stringToIndex = { };
	strings.indexToString = [ ];

	for (let i = 0; i < input.length; i++)
	{
		const tmp = input[i];

		strings.indexToString[i] = tmp;
		strings.stringToIndex[tmp] = i+1;
	}

	strings.Y = strings.indexOf("Y");
	strings.DEFAULT = strings.indexOf("DEFAULT");
	strings.MANHATTAN = strings.indexOf("MANHATTAN");

	return strings;
};
