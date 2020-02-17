/*
**	@rsthn/levmap/display-object
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
const { Vec2 } = require('@rsthn/cherry');


/**
**	Display object is the representation of an on-world object, that is a group of display elements and collision fragments.
*/

module.exports = Class.extend
({
	x: 0, y: 0, zindex: 0,

	elements: null,
	collisionElements: null,
	primaryElement: null,
	primaryCollisionElement: null,
	objectDef: null,
	fixed: false,
	attributes: null,
	dir: null,

	__ctor: function (objectDef)
	{
		this.elements = [];
		this.collisionElements = [];

		this.attributes = null;
		this.objectDef = objectDef;

		this.primaryElement = null;
		this.primaryCollisionElement = null;

		this.dir = new Vec2();

		this.x = this.y = this.zindex = 0;
		this.fixed = false;
	},

	/*
	**	Ensure to destroy all related elements.
	*/
	__dtor: function()
	{
		for (let i of this.elements)
			dispose(i);

		for (let i of this.collisionElements)
			dispose(i);

		dispose(this.dir);
	},

	setPosition: function (x, y)
	{
		this.translate (x - this.x, y - this.y, 0);
	},

	translate: function (dx, dy, dzi)
	{
		dzi = dzi || 0;

		this.x += dx;
		this.y += dy;
		this.zindex += dzi;

		for (let i of this.elements)
			i.translate(dx, dy, dzi);

		for (let i of this.collisionElements)
			i.translate(dx, dy, dzi);
	},

	round: function ()
	{
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);

		for (let i of this.elements)
			i.round();

		for (let i of this.collisionElements)
			i.round();
	},

	addElement: function (elem)
	{
		this.elements.push (elem);
		elem.setDisplayObject (this);

		if (this.primaryElement == null)
			this.primaryElement = elem;
	},

	addCollisionElement: function (elem)
	{
		this.collisionElements.push (elem);
		elem.setDisplayObject (this);

		if (this.primaryCollisionElement == null)
			this.primaryCollisionElement = elem;
	},

	getElements: function()
	{
		return this.elements;
	},

	/*
	bool getGroupVisibility (const char *group)
	{
		for (auto i = elements.top; i; i = i.next)
		{
			if (i.value.getElementDef().group.compare (group) == 0)
				return i.value.getVisible();
		}

		return false;
	}

	void setGroupVisibility (const char *group, bool visibility)
	{
		for (auto i = elements.top; i; i = i.next)
		{
			if (i.value.getElementDef().group.compare (group) == 0)
				i.value.setVisible(visibility);
			else
				i.value.setVisible(!visibility);
		}

		for (auto i = collisionElements.top; i; i = i.next)
		{
			if (i.value.group.compare (group) == 0)
				i.value.setVisible(visibility);
			else
				i.value.setVisible(!visibility);
		}
	}*/

	setVisibility: function (visibility)
	{
		for (let i of this.elements)
			i.setVisible(visibility);

		for (let i of this.collisionElements)
			i.setVisible(visibility);
	},

	getX: function() { return this.x; },
	getY: function() { return this.y; },
	getZ: function() { return 0; },

	getAttribute: function (name)
	{
		return this.attributes != null ? this.attributes[name] : null;
	}
});
