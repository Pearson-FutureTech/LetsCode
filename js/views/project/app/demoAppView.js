/*
 * "Here's one we made earlier" versions to demonstrate that you can share a project and play it on a tablet.
 * XXX This is all a bit hacky...
 * The example that it links you to at the end of the tutorial is at: /#myapp
 */

define([
	'jQuery',
	'Underscore',
	'Backbone'
], function($, _, Backbone){

	var PredefinedDemoView = Backbone.View.extend({

		el: "#letscode",

		initialize: function() {
		},

		render: function() {

			$('#toolbar', this.$el).hide();
			$('#lessonpanel', this.$el).hide();
			$('#editpanel', this.$el).hide();

			$('#stage', this.$el).addClass('tablet-demo');

			$('#letscode-home-panel').hide();
			this.$el.show();

		}

	});
	
	return PredefinedDemoView;
	
});