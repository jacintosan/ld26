import animate;
import ui.View;
import device;
import math.util as util;
import src.soundcontroller as soundcontroller;

exports = Class(ui.View, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
			backgroundColor: '#000000',
			width: 10,
			height: 1
		});

		this.active = false;

		supr(this, 'init', [opts]);

		this.build();
	};

	this.isActive = function() {
		return this.active;
	};

	this.startNewAnimation = function () {
		this._animator.now({x: device.width + this.style.x}, 1500, animate.linear)
		.then(this.outOfScreen);
	};

	var sound = soundcontroller.getSound();

	this.resetAnimation = function(x, y) {
		sound.play('laser');
		this.active = true;
		this.updateOpts({
			x : x,
			y : y,
			opacity: 1
		});
		this._animator.clear();
		this.startNewAnimation();
	};

	this.outOfScreen = function() {
		this.active = false;
	};

	this.setInactive = function() {
		this.active = false;
		this._animator.clear();
		this.updateOpts({
			opacity: 0
		});
	}

	this.build = function () {
		this._animator = animate(this);
	};
});
