import animate;
import ui.ImageView;
import device;
import math.util as util;
import src.soundcontroller as soundcontroller;

var color = ['#999999', '#777777', '#555555', '#333333'];

var enemyImg = ["resources/images/enemy_1.png", "resources/images/enemy_2.png", "resources/images/enemy_3.png"];

var numTypes = 3;

exports = Class(ui.ImageView, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
			image: enemyImg[util.random(0, numTypes)],
			layout: "box",
			width: 32,
			height: 32,
			scaleMethod: 'strech',
			anchorX: 16,
			anchorY: 16,
			x: device.width,
			y: util.random(0, device.height)
		});

		this.dead = true;

		supr(this, 'init', [opts]);

		this.build();
	};

	this.isDead = function() {
		return this.dead;
	};

	this.startNewAnimation = function () {
		var sign = util.random(-1,2);
		if (sign == 0) sign = 1;
		this.dead = false;
		this._animator.now({x : -64, r: Math.PI * util.random(1, 4) * sign}, util.random(4000, 6000), animate.linear)
		.then(this.outOfScreen);
	};

	this.resetAnimation = function() {
		var size = util.random(16, 128);
		var scale = util.random(1,4);
		this.updateOpts({
			image: enemyImg[util.random(0, numTypes)],
			x: device.width,
			y: util.random(0, device.height - this.style.height),
			opacity: 1.0,
			scale: 1,
			r: 0,
		});
		this._animator.clear();
		this.startNewAnimation();
	};

	this.outOfScreen = function() {
		this.dead = true;
	};

	this.build = function () {
		this._animator = animate(this);
	};

	var sound = soundcontroller.getSound();

	this.die = function() {
		sound.play('enemy_out');
		this.dead = true;
		this._animator.now({opacity: 0.0, scale: 1.2}, 500);
	}
});
