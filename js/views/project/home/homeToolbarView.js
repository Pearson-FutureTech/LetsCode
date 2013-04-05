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
			'click #tb-help-home': 'homeHelpClicked',
			'click #tb-fullscreen-home': 'toggleFullScreen'
		},

		homeHelpClicked: function() {
			this.global_dispatcher.trigger('home:helpClicked');
		},

		toggleFullScreen: function() {
			WindowUtils.toggleFullScreen();
			return false;
		}

	});
	
	return ToolbarHomeView;
	
});
