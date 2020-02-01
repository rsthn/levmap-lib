/*
**	@rsthn/levmap/element
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

const { DisplayElement, QuadTreeItem } = require('@rsthn/cherry');


/**
**	Extended version of a DisplayElement.
*/

module.exports = DisplayElement.extend
({
	elementDef: null,
	displayObject: null,
	group: 0,
	resource: 0,

	/**
	**	Constructor.
	*/
	__ctor: function (type, width, height, texture)
	{
		this._super.DisplayElement.__ctor(width, height);

		this.displayObject = null;
		this.elementDef = null;

		this.group = 0;
		this.resource = 0;

		this.setType (type);
		this.setPosition (0, 0);
		this.setFlags (QuadTreeItem.FLAG_CHILD);

		if (texture != null)
			this.setTexture (texture);
	},

	/**
	**	Destructor.
	*/
	__dtor: function()
	{
	},

	/**
	**	Returns the texture of the element.
	*/
	getTexture: function()
	{
		return this.texture;
	},

	/**
	**	Sets the drawing texture.
	*/
	setTexture: function(texture)
	{
		this.texture = texture;
	},

	/**
	**	Sets the display object related to the element.
	*/
	setDisplayObject: function (displayObject)
	{
		this.displayObject = displayObject;
	},

	/**
	**	Sets the element definition related to the element.
	*/
	setElementDef: function (elementDef)
	{
		this.elementDef = elementDef;
	},

	/**
	**	Returns the related display object.
	*/
	getDisplayObject: function()
	{
		return this.displayObject;
	},

	/**
	**	Returns the related element definition.
	*/
	getElementDef: function()
	{
		return this.elementDef;
	},

	round: function()
	{
		this.setPosition(Math.round(this.x), Math.round(this.y));
	},

	/**
	**	Draws the element on the specified canvas.
	*/
	draw: function (g)
	{
		if (this.texture != null)
			this.texture.draw (g, this.bounds.x1, this.bounds.y1);

		if (this.debug)
		{
			g.fillStyle("rgba(255,255,255,0.25)");
			g.fillRect(this.bounds.x1, this.bounds.y1, this.bounds.width(), this.bounds.height());
		}
	}
});
