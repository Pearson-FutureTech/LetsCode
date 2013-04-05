/*
 * Deals with the home page and lesson intro pages, before you get to the actual app.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/project/home/homeHelpView',
	'views/project/home/homeToolbarView'
], function($, _, Backbone, HomeHelpView, HomeToolbarView){

	var LessonIntroView = Backbone.View.extend({

		el: "#letscode-home-panel",

		views: [],

		initialize: function() {
			this.createSubViews();
		},

		createSubViews: function() {

			this.views.homeHelpView = new HomeHelpView();
			this.views.homeToolbarView = new HomeToolbarView();

		},

		render: function() {

			this.views.homeHelpView.render();
			this.views.homeToolbarView.render();

			$('#home-intro', this.$el).hide();
			$('.lesson-panel', this.$el).hide();
			$('#lesson-panel-'+(this.model.tutorialNumber+1), this.$el).show();

			$('.page').hide();
			this.$el.show();

		}

	});

	return LessonIntroView;

});