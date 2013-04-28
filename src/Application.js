import ui.TextView as TextView;
import device;
import math.geom.Point as Point;
import math.util as util;
import ui.View as View;
import ui.ImageView;
import ui.resource.Image as Image;
import animate;

import src.Star as Star;
import src.Enemy as Enemy;
import src.Bullet as Bullet;

var player = {
	loc : new Point(0, 0),
	lives : 5,
	step : 2,
	maxVelocity : 5,
	vel : new Point(0, 0)
};

var playerView;
var enemy;

var numEnemies = 5;
var enemies = [];

var nextEnemySecs = 2000;
var nextEnemySecsStep = 10;

var numStars = 100;
var stars = [];

var numBullets = 10;
var bullets = [];

var left = false;
var top = false;
var right = false;
var down = false;
var space = false;

exports = Class(GC.Application, function () {

	this.initUI = function () {

		this.view.updateOpts({
			backgroundColor: '#ffffff'
		});

		var textview = new TextView({
			superview: this.view,
			layout: "box",
			text: "Minimalism",
			color: "white"
		});

		window.addEventListener('keydown', this._keyDown, true);
		window.addEventListener('keyup', this._keyUp, true);

		player.loc.x = ~~(device.width / 5);
		player.loc.y = ~~(device.height / 2);

		for (i = 0 ; i < numStars ; i++)
			stars.push(new Star({superview: this.view}));

		playerView = new ui.ImageView({
			superview: this.view,
			image: "resources/images/nave.png",
			layout: "box",
			width: 16,
			height: 16,

			x: player.loc.x,
			y: player.loc.y,
		});

		for (i = 0 ; i < numEnemies ; i++) {
			enemies.push(new Enemy({superview: this.view}));
		}

		for (i = 0 ; i < numBullets ; i++) {
			bullets.push(new Bullet({superview: this.view}));
		}

		this.enemiesInterval = setInterval(update_enemies.bind(this), nextEnemySecs);
		var bulletInterval = setInterval(update_bullets.bind(this), 250);

/*
		var canvas = device.get("Canvas");
		var context = canvas.getContext('2d');
		context.rect(0, 0, canvas.width, canvas.height);

		// add linear gradient
		var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height);
		// light blue
		grd.addColorStop(0, '#8ED6FF');   
		// dark blue
		grd.addColorStop(1, '#004CB3');
		context.fillStyle = grd;
		context.fill();
*/

	window.focus();
	window.addEventListener('mouseover',this.onResume,false);
	window.addEventListener('blur',this.onPause,false);

	};

	this.tick = function(dt) {

		this._updateView();

	};

	this.onResume = function() {
		window.focus();
		GC.app.engine.resume()
		GC.app.engine.startLoop();
	};

	this.onPause = function() {
		left = false;
		top = false;
		right = false;
		down = false;
		space = false;
		GC.app.engine.pause();
		GC.app.engine.stopLoop();
	};

	this._updateView = function() {
		this._updatePlayer();
		this._updateWorld();
	};

	this._updatePlayer = function() {
		var usedX = false, usedY = false;
		if (left)  { player.vel.x -= player.step; usedX = true; }
		if (top)   { player.vel.y -= player.step; usedY = true; }
		if (right) { player.vel.x += player.step; usedX = true; }
		if (down)  { player.vel.y += player.step; usedY = true; }

		if (player.vel.x > player.maxVelocity) player.vel.x = player.maxVelocity;
		if (player.vel.y > player.maxVelocity) player.vel.y = player.maxVelocity;
		if (player.vel.x < -player.maxVelocity) player.vel.x = -player.maxVelocity;
		if (player.vel.y < -player.maxVelocity) player.vel.y = -player.maxVelocity;

		player.loc.x += player.vel.x;
		player.loc.y += player.vel.y;

		if (player.loc.x > device.width - playerView.style.width) player.loc.x = device.width - playerView.style.width;
		if (player.loc.x < 0) player.loc.x = 0;
		if (player.loc.y > device.height - playerView.style.height) player.loc.y = device.height - playerView.style.height;
		if (player.loc.y < 0) player.loc.y = 0;

		playerView.updateOpts({
			x: player.loc.x,
			y: player.loc.y
		});

		if (!usedX) {
			if (player.vel.x > 0) player.vel.x -= 0.5;
			if (player.vel.x < 0) player.vel.x += 0.5;
		}
		if (!usedY) {		
			if (player.vel.y > 0) player.vel.y -= 0.5;
			if (player.vel.y < 0) player.vel.y += 0.5;
		}
	};

	this._updateWorld = function() {
		for (i = 0 ; i < numEnemies ; i++) {
			var enemy = enemies[i];
			if (enemy.isDead())
				continue;

			if (collision(enemy, playerView))
				console.log("enemy-player-x");

			for (j = 0 ; j < numBullets ; j++) {
				var bullet = bullets[j];
				if (bullet.isActive() && collision(enemy, bullet)) {
					enemy.die();
					bullet.setInactive();
				}
			}

		}
	};

	this._keyUp = function(e) {
		switch (e.keyCode) {
			case 32:
			space = false;
			break;
			case 37:
			left = false;
			break;
			case 38:
			top = false;
			break;
			case 39:
			right = false;
			break;
			case 40:
			down = false;
			break;
		}
	}

	this._keyDown = function(e) {		
		switch (e.keyCode) {
			case 32:
			space = true;
			break;
			case 37:
			left = true;
			break;
			case 38:
			top = true;
			break;
			case 39:
			right = true;
			break;
			case 40:
			down = true;
			break;
		}
	}
	
	this.launchUI = function () {};
});

function update_enemies() {
	for (i = 0 ; i < numEnemies ; i++) {
		if (enemies[i].isDead()) {
			enemies[i].resetAnimation();
			break;
		}
	}
	if (nextEnemySecs == 1500 || nextEnemySecs == 1000 || nextEnemySecs == 500)
		addEnemy();

	if (nextEnemySecs <= 500)
		return;

	clearInterval(this.enemiesInterval);
	nextEnemySecs -= nextEnemySecsStep;
	if (nextEnemySecs<500) nextEnemySecs = 500;
	clearInterval(this.enemiesInterval);
	this.enemiesInterval = setInterval(update_enemies.bind(this), nextEnemySecs);
}

function addEnemy() {
	enemies.push(new Enemy({superview: this.view}));
	numEnemies++;
}

function update_bullets() {
	if (space) {
		for (i = 0 ; i < numBullets ; i++) {
			if (!bullets[i].isActive()) {
				bullets[i].resetAnimation(player.loc.x + 8, player.loc.y + 8);
				break;
			}
		}
	}
}

function collision(v1, v2) {
	if (v1.style.x <= v2.style.x + v2.style.width &&
		v1.style.x + v1.style.width >= v2.style.x &&
		v1.style.y <= v2.style.y + v2.style.height &&
		v1.style.y + v1.style.height >= v2.style.y)
		return true;
	else
		return false;
}