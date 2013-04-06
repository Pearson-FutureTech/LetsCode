/*
 * Just for a quick demo... "Here's one we made earlier" published apps to
 * demonstrate sharing a project and being able to play it on a tablet.
 * Real publishing is not yet implemented.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/project/app/appView'
], function($, _, Backbone, AppView){

	var DemoAppView = Backbone.View.extend({

		el: "#letscode",

		render: function() {

			this.appView = new AppView();
			this.appView.model = this.model;
			this.appView.render();

			$('#toolbar', this.$el).hide();
			$('#lessonpanel', this.$el).hide();
			$('#editpanel', this.$el).hide();

			$('#stage', this.$el).addClass('tablet-demo');

			$('.page').hide();
			this.$el.show();

		}

	});
	
	return DemoAppView;
	
});