/*
 * Just for a quick demo... "Here's one we made earlier" published apps to
 * demonstrate sharing a project and being able to play it on a tablet.
 * Real publishing is not yet implemented.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'app',
	'views/project/app/appView'
], function($, _, Backbone, app, AppView){

	var DemoAppView = Backbone.View.extend({

		el: "#letscode",

		render: function() {

			// We piggy-back on the regular app view
			this.appView = app.router.views.appView;
			this.appView.model = this.model;
			this.appView.render();

			$('#lessonpanel', this.$el).hide();
			$('#publish-confirm', this.$el).hide();
			$('#editpanel', this.$el).hide();
			$('#toolbar .ui-button', this.$el).hide();

			$('#stage', this.$el).addClass('tablet-demo');

			$('.page').hide();
			this.$el.show();

		}

	});
	
	return DemoAppView;
	
});