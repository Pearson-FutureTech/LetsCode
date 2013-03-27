/*
 * This is the core of the application. From here we handle all application-level logic.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'router'
], function($, _, Backbone, Router){
	
	var app = new Object({
	
		/*
		 * Probably need to handle loading and refresh of app data a bit better
		 */
		initialize: function(){
			Router.initialize({app: this});
			// This starts our application by routing the initial URL
			Backbone.history.start();
		}
		
	});
	
	return app;

});
