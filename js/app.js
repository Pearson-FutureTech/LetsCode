/*
 * This is the core of the application. From here we handle all application-level logic.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone'
], function($, _, Backbone) {
	
	var app = {
	
		initialize: function() {

			// This starts our application by routing the initial URL
			Backbone.history.start();

			// Prevent 'bounce' scroll on touch screen device
			// See: http://www.kylejlarson.com/blog/2011/fixed-elements-and-scrolling-divs-in-ios-5/
			document.addEventListener('touchmove', function(event) {
				event.preventDefault();
			}, false);

		}
		
	};
	
	return app;

});
