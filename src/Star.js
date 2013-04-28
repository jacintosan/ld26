import animate;
import ui.View;
import device;
import math.util as util;

var color = ['#aaaaaa', '#999999', '#888888', '#777777'];

var maxVel = 5000;
var minVel = 10000;

exports = Class(ui.View, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
			backgroundColor: '#eeeeee'
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	/* Set the mole as active and animate it up.
	 */
	this.initAnimation = function () {
		var size = util.random(1,3);
		this.updateOpts({
			x : util.random(1, device.width),
			y : util.random(1, device.height),
			width : size,
			height : size,
			backgroundColor: color[util.random(0,4)]
		});
		this._animator.now({x: 0}, this.style.x * ~~(util.random(maxVel, minVel) / device.width), animate.linear)
		.then(this.resetAnimation);
	};

	/* Set the mole as active and animate it up.
	 */
	this.startNewAnimation = function () {
//		this.x = device.width;
//		this.y = util.random(0, device.height);
		this._animator.now({x: 0}, util.random(maxVel, minVel), animate.linear)
		.then(this.resetAnimation);
	};

	this.resetAnimation = function() {
		var size = util.random(1,3);
		this.updateOpts({
			x : device.width,
			y : util.random(0, device.height),
			width : size,
			height : size,
			backgroundColor: color[util.random(0,4)]
		});
		this._animator.clear();
		this.startNewAnimation();
	};

	/*
	 * Layout
	 */
	this.build = function () {
		/* Create an animator object for mole.
		 */
		this._animator = animate(this);
		this.initAnimation();
	};
});
