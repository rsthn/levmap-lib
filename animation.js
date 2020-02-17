/*
**	@rsthn/levmap/animation
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

const { System } = require('@rsthn/cherry');

/**
**	Animation Texture.
*/
const AnimationTexture = Class.extend
({
	seq: null, seq_i: 0,
	queue: null,

	fps: 0, frameMillis: 0, time: 0,

	frameNumber: -1,

	finished: false,
	paused: false,

	width: null,
	height: null,

	onFinishedCallback: null,
	onFinishedArg: null,

	onFrameCallback: null,
	onFrameArg: null,

	offsX: 0,
	offsY: 0,

	__ctor: function (anim, seq, rate)
	{
		this.anim = anim;
		this.queue = [ ];

		this.seq = seq;
		this.width = seq.width;
		this.height = seq.height;
		this.offsX = seq.offsX;
		this.offsY = seq.offsY;

		this.rate = rate;
		this.setRate (this.seq.rate || this.rate);
	},

	__dtor: function ()
	{
	},

	setRate: function (fps)
	{
		this.frameMillis = ~~(1000 / fps);
		this.time = 0;

		return this;
	},

	setPaused: function (value)
	{
		this.paused = value;
		return this;
	},

	setInitialDelay: function (dt)
	{
		this.time = -dt*1000.0;
		return this;
	},

	onFinished: function (fn, arg)
	{
		this.onFinishedCallback = fn;
		this.onFinishedArg = arg;
		return this;
	},

	onFrame: function (fn, arg)
	{
		this.onFrameCallback = fn;
		this.onFrameArg = arg;
		return this;
	},

	setFrame: function (i)
	{
		this.seq_i = i % this.seq.frames.length;
		return this;
	},

	getFrame: function (normalized)
	{
		return normalized === true ? (this.seq_i / (this.seq.frames.length-1)) : this.seq_i;
	},

	getLength: function ()
	{
		return this.seq.frames.length;
	},

	draw: function (g, x, y)
	{
		if (this.time < 0)
		{
			if (!this.paused)
			{
				this.time += this.frameNumber == System.frameNumber ? 0 : System.frameDeltaMillis;
				this.frameNumber = System.frameNumber;
			}

			if (this.time > 0) this.time = 0;
			return;
		}

		if (this.seq_i == this.seq.frames.length)
		{
			if (g != null) this.seq.frames[this.seq_i-1].draw(g, x + this.offsX, y + this.offsY);
			return;
		}

		if (g != null) this.seq.frames[this.seq_i].draw(g, x + this.offsX, y + this.offsY);

		if (!this.paused)
		{
			this.time += this.frameNumber == System.frameNumber ? 0 : System.frameDeltaMillis;
			this.frameNumber = System.frameNumber;
		}

		if (this.time >= this.frameMillis)
		{
			const frameIndex = this.seq_i;

			this.time -= this.frameMillis;
			this.seq_i++;

			if (this.seq_i == this.seq.frames.length)
			{
				if (this.seq.loop)
				{
					this.seq_i = 0;
				}
				else
				{
					this.finished = true;

					if (this.onFinishedCallback)
					{
						this.onFinishedCallback(this.onFinishedArg);
						this.onFinishedCallback = null;
					}
				}

				if (this.queue.length)
					this.use(this.queue.shift(), true);
			}

			if (this.onFrameCallback)
			{
				if (this.onFrameCallback(frameIndex, this.seq.frames.length-1, this.onFrameArg) === false)
					this.onFrameCallback = null;
			}
		}
	},

	advance: function ()
	{
		this.setPaused (false);
		this.draw (null, 0, 0);
	},

	use: function (seqName, force)
	{
		if (typeof(seqName) == 'string')
			seqName = this.anim.strings.indexOf(seqName);

		var seq = this.seq;

		if (seq.name == seqName && force !== true)
			return this;

		this.seq = this.anim.getSequence(seqName);
		this.setRate (this.seq.rate || this.rate);

		this.offsX = this.seq.offsX;
		this.offsY = this.seq.offsY;

		this.seq_i = 0;
		this.time = 0;

		this.finished = false;
		return this;
	},

	setQueue: function (list)
	{
		this.queue = list;
		this.use(this.queue.shift(), true);
	},

	enqueue: function (seqName, force)
	{
		var seq = this.seq;

		if (seq.name == seqName && seq.loop)
			return this;

		if (force !== true && this.queue.length > 0 && this.queue[this.queue.length-1] == seqName)
			return this;

		if (seq.loop || this.finished)
		{
			this.use(seqName, true);
			return this;
		}

		this.queue.push(seqName);
		return this;
	}
});

/**
**	Represents an animation sequence.
*/
const AnimationSequence = Class.extend
({
	index: 0,
	name: 0,
	width: 0,
	height: 0,

	frames: null,
	loop: 1,
	offsX: 0, offsY: 0,
	rate: 0,

	/**
	**	Internal constructor. Instantiate using static unflatten method.
	*/
	__ctor: function()
	{
		this.frames = [];
	},

	/**
	**	Destructor.
	*/
	__dtor: function()
	{ },

	/**
	**	Returns the name index of the sequence.
	*/
	getName: function()
	{
		return this.name;
	},

	/**
	**	Returns the original frame rate of the sequence.
	*/
	getRate: function()
	{
		return this.rate;
	},

	/**
	**	Returns the width of the textures of the sequence.
	*/
	getWidth: function()
	{
		return this.width;
	},

	/**
	**	Returns the height of the textures of the sequence.
	*/
	getHeight: function()
	{
		return this.height;
	},

	/**
	**	Loads the AnimationSequence from the specified descriptor.
	*/
	loadFrom: function (input, ss)
	{
		if (Rin.typeOf(input) != 'array')
			throw new Error("AnimationSequence: Expected input to be an ARRAY.");

		if (input.length < 6)
			throw new Error("AnimationSequence: Expected input to have 6 elements.");

		this.name = input[0];
		this.rate = input[1];
		this.loop = input[2];
		this.offsX = input[3];
		this.offsY = input[4];
		this.width = input[5]*ss.scale;
		this.height = input[6]*ss.scale;

		let frames = input[7];

		if (Rin.typeOf(frames) != 'array')
			throw new Error("AnimationSequence: Expected input[7] to be an ARRAY.");

		for (let frame of frames)
		{
			if (Rin.typeOf(frame) != 'array')
				throw new Error("AnimationSequence: Expected input[5][i] to be an ARRAY.");

			if (frame.length != 2)
				throw new Error("AnimationSequence: Expected input[5][i] to have 2 elements.");

			let duration = frame[0];
			let resource = frame[1];

			while (duration-- > 0)
				this.frames.push(ss.getDrawable(resource));
		}

		return this;
	}
});


const Animation = module.exports = Class.extend
({
	className: "Animation",

	frameDelay: 0,
	defaultSequence: 0,

	index: 0,
	name: 0,
	sequenceByName: null,

	/**
	**	Internal constructor. Instantiate using static unflatten method.
	*/
	__ctor: function ()
	{
		this.sequenceByName = { };
	},

	/**
	**	Destructor.
	*/
	__dtor: function()
	{
	},

	/**
	**	Sets the default frame delay (in milliseconds) for the animation sequences.
	*/
	setFrameDelay: function (frameDelay)
	{
		this.frameDelay = frameDelay;
		return this;
	},

	/**
	**	Returns the index of the animation.
	*/
	getIndex: function()
	{
		return this.index;
	},

	/**
	**	Returns the name index of the animation.
	*/
	getName: function()
	{
		return this.name;
	},

	/**
	**	Returns an animation sequence given its integer name.
	*/
	getSequence: function (sequenceName)
	{
		return this.sequenceByName[sequenceName];
	},

	/**
	**	Returns an animation sequence given its string name.
	*/
	getSequenceByName: function (name)
	{
		return this.sequenceByName[this.strings.indexOf(name)];
	},

	/**
	**	Returns the count of sequences.
	*/
	getCount: function ()
	{
		return Object.values(this.sequenceByName).length;
	},

	/**
	**	Loads the Animation from the specified input Object.
	*/
	loadFrom: function (input, ss, strings)
	{
		if (Rin.typeOf(input) != 'array')
			throw new Error ("SpriteSheetAnimation: Expected input to be an ARRAY.");

		if (input.length != 4)
			throw new Error ("SpriteSheetAnimation: Expected input to have 4 elements.");

		this.strings = strings;

		this.ss = ss;
		this.index = input[0];
		this.defaultSequence = -1;
		this.name = input[2];

		const sequences = input[3];

		if (Rin.typeOf(sequences) != 'array')
			throw new Error("SpriteSheetAnimation: Expected input[3] to be an ARRAY.");

		for (let i = 0; i < sequences.length; i++)
		{
			let seq = new AnimationSequence();
			seq.loadFrom(sequences[i], ss);
			seq.index = i;

			if (this.defaultSequence == -1 && input[1] == i)
				this.defaultSequence = seq.name;

			this.sequenceByName[seq.getName()] = seq;
		}

		return this;
	},

	/**
	**	Returns a texture for the specified animation sequence (or default if none specified).
	*/
	getDrawable: function (seqName)
	{
		return new AnimationTexture (this, this.getSequence(seqName ? seqName : this.defaultSequence), this.rate);
	},

	/**
	**	Returns a texture for the specified animation sequence name (integer/string).
	*/
	getDrawableByName: function (name)
	{
		return this.getDrawable(typeof(name) == 'string' ? this.strings.indexOf(name) : name);
	},

	/**
	**	Enumerates the animations using the specified function.
	*/
	enum: function (fn)
	{
		for (let i in this.sequenceByName)
			fn (i, this.sequenceByName[i]);
	}
});
