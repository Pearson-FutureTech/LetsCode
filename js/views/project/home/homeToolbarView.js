/*
 * For the main app toolbar on the homepage.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'util/WindowUtils'
], function($, _, Backbone, WindowUtils){

	var ToolbarHomeView = Backbone.View.extend({

		el: "#toolbar-home",

		events: {
			'click #tb-fullscreen-home': 'toggleFullScreen'
		},

		toggleFullScreen: function() {
			WindowUtils.toggleFullScreen();
			return false;
		}
		
	});
	
	return ToolbarHomeView;
	
});
