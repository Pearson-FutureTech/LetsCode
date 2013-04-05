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

		}
		
	};
	
	return app;

});
