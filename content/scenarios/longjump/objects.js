/*
This is where we're setting up all of the objects for use in our scenario.
*/

var Stage = function() {

	// The background for the object
	this.backgroundImage = 'background.png';

	// The width of the object
	width = 1024;

	// The height of the object
	height = 450;

	// The HTML template for this object (internal property)
	_template = '<div style="width:<%= width %>px; height:<%= height %>px; background:url(./content/scenarios/longjump/assets/<%= backgroundImage %>) no-repeat"></div>';

}

var Athlete = function() {

	// The current left position of this object
	this.left = 50;

	// The current top position of this object
	this.top = 240;

	// Steps to run
	this.runSteps = 6;

	// Angle to jump at
	this.jumpAngle = 35;

	// Initial running speed
	this.runStartSpeed = 0;

	// How much the athlete will increase in speed as they run
	this.runAcceleration = 6;

	// Represents the force of gravity
	this.gravityDeceleration = 5;

	// Represents the force of friction
	this.friction = 1;

	/* Initialisiations */

	this.runCycle = sjs.Cycle([
		[200, 0, 5], // x offset, y offset, ticks duration
		[400, 0, 5]
	]);

	this.jumpCycle = sjs.Cycle([
		[600, 0, 0],
		[400, 200, 1],
		[600, 200, 1],
		[800, 200, 1]
	]);

	// Sprite is initialised by View (where it has access to the Scene)
	this.sprite;


	/* Private properties used by the View */

	// The width of the object
	width = 200;

	// The height of the object
	height = 200;

	// Tell the View that we are a Sprite that should be rendered with Sprite.js
	_isSprite = true;

	// Location of the sprite-sheet image (ideally shouldn't need to specify filepath...)
	_spriteImage = 'content/scenarios/longjump/assets/athleteSprite.png';

	// Defines the spriteCycle variables that we need to assign the Sprite to
	_spriteCycles = ['runCycle', 'jumpCycle'];

	// The left position this object will start at
	_startLeft = 50;

	// The top position this object will start at
	_startTop = 240;

	// The thumbnail image to display in the Object Library (ideally shouldn't need to specify filepath...)
	_thumbnail = 'content/scenarios/longjump/assets/thumbnails/thumb-athlete.png';

	// Description for the Object Library (internal property)
	_description = 'An athlete that can do long jumps';

	_events = [
		{
			"name": "whenRunFinishes",
			"comment": "When the athlete finishes his run-up"
		},
		{
			"name": "whenJumpFinishes",
			"comment": "When the athlete finishes his jump"
		}
	];


	// Get into position ready to start the run and jump
	getReady = function() {

		this.sprite.setX( this._startLeft );
		this.sprite.setY( this._startTop );
		this.sprite.offset(0, 0);
		this.sprite.update();

	};

	// Run for the predetermined number of steps
	run = function() {

		this.sprite.setVelocity(this.runStartSpeed, 0);
		this.sprite.setForce(this.runAcceleration / 10, 0);

		// Reset y position (would be nice if he fell down via gravity...)
		this.top = this._startTop;
		this.sprite.setY( this._startTop );
		this.sprite.update();

		var self = this;

		var runTicker = this.scene.Ticker(30, function() {

			self.sprite.applyForce(runTicker.lastTicksElapsed);
			self.sprite.applyVelocity(runTicker.lastTicksElapsed);

			self.runCycle.next().update();

			if( runTicker.currentTick  >= (self.runSteps * 5) ) {
				self.runCycle.reset();

				self.trigger('whenRunFinishes', self);
				runTicker.pause();
			}

		});

		runTicker.run();

	};

	// Jump at the current speed and predetermined jump angle
	jump = function() {

		var jumpAngleRad = this.jumpAngle * Math.PI / 180;

		this.sprite.setVelocity(this.sprite.xv * Math.cos(jumpAngleRad), -this.sprite.xv * Math.sin(jumpAngleRad));
		this.sprite.setForce(0, this.gravityDeceleration / 10);

		// Crouch ready to jump
		this.jumpCycle.reset();
		this.jumpCycle.next().update();

		var goingUp = true;

		var self = this;

		window.setTimeout(function() {

			// Start jump
			self.jumpCycle.next().update();

			var jumpTicker = self.scene.Ticker(30, function() {

				self.sprite.applyForce(jumpTicker.lastTicksElapsed);
				self.sprite.applyVelocity(jumpTicker.lastTicksElapsed);

				self.sprite.update();

				if( !goingUp && self.sprite.y >= self._startTop ) {

					// Finish jump
					self.jumpCycle.next().update();

					self.trigger('whenJumpFinishes', self);

					jumpTicker.pause();

					window.setTimeout(function() {
						self.getReady();
					}, 2000);

				} else if( goingUp && self.sprite.yv >= 0 ) {

					goingUp = false;

					self.jumpCycle.next().update();

				}

			});

			jumpTicker.run();

		}, 200);

	};

	// Set the number of steps that the athlete will run
	setRunSteps = function(event) {

		if( event && event.target.value ) {
			this.runSteps = event.target.value;
		}

	};

};

var Button = function() {

	// The label for the button
	this.label = "My Button";

	// The left position of this object
	this.left = 440;
	
	// The top position of this object
	this.top = 150;

	// The width of the object
	width = 100;

	// The height of the object
	height = 25;

	// The HTML template for this object (internal property)
	_template = '<button style="width:<%= width %>px; height:<%= height %>px"><%= label %></button>';

	// The thumbnail image to display in the Object Library (ideally shouldn't need to specify filepath...)
	_thumbnail = 'content/scenarios/longjump/assets/thumbnails/thumb-button.png';

	// Description for the Object Library (internal property)
	_description = 'A simple push button';

	// Pre-defined events (internal property)
	_events = [
		{
			"name": "click",
			"comment": "When the button is clicked by the user"
		},
		{
			"name": "hover",
			"comment": "When the user moves their mouse over the button"
		}
	];

};

var Label = function() {

	// The label for the number input
	this.label = "My Label";

	// The left position of this object
	this.left = 380;

	// The top position of this object
	this.top = 150;

	// The width of the object
	width = 150;

	// The height of the object
	height = 18;

	// The HTML template for this object (internal property)
	_template = '<label><%= label %></label>';

	// The thumbnail image to display in the Object Library (ideally shouldn't need to specify filepath...)
	_thumbnail = 'content/scenarios/longjump/assets/thumbnails/thumb-label.png';

	// Description for the Object Library (internal property)
	_description = 'A simple text label';

}

var NumberBox = function() {

	// The current value of the number input
	this.value = 0;

	// The left position of this object
	this.left = 440;

	// The top position of this object
	this.top = 150;

	// The width of the object
	width = 150;

	// The height of the object
	height = 18;

	// The HTML template for this object (internal property)
	_template = '<input type="number" value="<%= value %>" style="width:<%= width %>px; height:<%= height %>px" />';

	// The thumbnail image to display in the Object Library (ideally shouldn't need to specify filepath...)
	_thumbnail = 'content/scenarios/longjump/assets/thumbnails/thumb-numberbox.png';

	// Description for the Object Library (internal property)
	_description = 'An editable number input field';

	// Pre-defined events (internal property)
	_events = [
		{
			"name": "change",
			"comment": "When the user writes or edits the number in the box"
		}
	];

};

var Scoreboard = function() {

	// The left position of this object
	this.left = 500;
	
	// The top position of this object
	this.top = 50;

	// The background for the object
	this.backgroundImage = 'scoreboard.png';

	// The width of the object
	width = 131;

	// The height of the object
	height = 128;

	// Whether current jump is a foul (internal property)
	foul = false;

	// Result strings (internal property)
	results = [];

	// The HTML template for this object (internal property)
	_template = '<div style="width:<%= width %>px; height:<%= height %>px; background:url(./content/scenarios/longjump/assets/<%= backgroundImage %>) no-repeat"><ol><li></li><li></li><li></li></ol></div>';

	// The thumbnail image to display in the Object Library (ideally shouldn't need to specify filepath...)
	_thumbnail = 'content/scenarios/longjump/assets/thumbnails/thumb-scoreboard.png';


	// Update the board with the result of the last jump
	update = function(event, obj) {

		// If called directly by double-clicking, obj (i.e. athlete object) won't be set...
		if( obj ) {

			if( this.foul ) {

				this.results.push('FOUL');

			} else {

				var dist = ($(obj).position().left + ($(obj).width() / 2) ) - this.position().left;

				// XXX Should be defined globally!
				var metresPerPixel = 0.025;

				if( dist >= 0 ) {
					this.results.push((dist * metresPerPixel).toFixed(2) + 'm');
				} else {
					this.results.push('0m');
				}

			}

			// XXX Should really be a separate method but don't want it to show up in method list
			var listPos = 0;

			for( var i= this.results.length-1; i >=0; i-- ) {

				var result = this.results[i];

				$('ol li:eq('+listPos+')', this).html(result);

				listPos++;

			}

		}

	};

	// Mark the current jump as a foul
	setFoul = function() {

		this.foul = true;

	};

	// Mark the current jump as clean (not a foul)
	setClean = function() {

		this.foul = false;

	};

	// Description for the Object Library (internal property)
	_description = 'A scoreboard for recording long jumps';

};

var Sandpit = function() {

	// The left position of this object
	this.left = 300;
	
	// The top position of this object
	this.top = 250;

	// The width of the object
	this.width = 359;

	// The height of the object
	this.height = 86;

	// The background for the object
	this.backgroundImage = 'sandPit.png';

	// The HTML template for this object (internal property)
	_template = '<div style="width:<%= width %>px; height:<%= height %>px; background:url(./content/scenarios/longjump/assets/<%= backgroundImage %>) no-repeat"></div>';

	// The thumbnail image to display in the Object Library (ideally shouldn't need to specify filepath...)
	_thumbnail = 'content/scenarios/longjump/assets/thumbnails/thumb-sandpit.png';

	// Pre-defined events (internal property)
	_events = [
		{
			"name": "isFoul",
			"comment": "When the jump is marked as a foul"
		},
		{
			"name": "isClean",
			"comment": "When the jump is marked as clean (not a foul)"
		}
	];

	// Check whether the athlete has crossed the line or not, to determine whether a foul has occurred
	checkJump = function(event, obj) {

		if( obj ) {

			if (($(obj).position().left + ($(obj).width() / 2)) > this.position().left) {
				this.trigger("isFoul", this);
			} else {
				this.trigger("isClean", this);
			}

		}

	};

	// Description for the Object Library (internal property)
	_description = 'A long jump sandpit and jumping board';

};

var Sun = function() {

	// The left position of this object
	this.left = 700;

	// The top position of this object
	this.top = 100;

	// The width of the object
	this.width = 214;

	// The height of the object
	this.height = 130;

	// The background for the object
	this.backgroundImage = 'sunSprite.png';

	// The HTML template for this object (internal property)
	_template = '<div class="sun" style="width:<%= width %>px; height:<%= height %>px; background:url(./content/scenarios/longjump/assets/<%= backgroundImage %>) no-repeat"></div>';

	// Make the sun smile
	smile = function() {

		// Currently only works with one sun...
		var sun = document.getElementsByClassName('sun')[0];
		sun.style.backgroundPosition = '0px -130px';

		var thisSun = this;
		window.setTimeout(
			function() {thisSun.lookSurprised();},
			5000);


	};

	// Make the sun look surprised
	lookSurprised = function() {

		// Currently only works with one sun...
		var sun = document.getElementsByClassName('sun')[0];
		sun.style.backgroundPosition = '0px 0px';

	};

};
