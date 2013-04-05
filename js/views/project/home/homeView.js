/*
 * Deals with the home page and lesson intro pages, before you get to the actual app.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/project/home/homeHelpView',
	'views/project/home/homeToolbarView',
	'util/WindowUtils'
], function($, _, Backbone, HomeHelpView, HomeToolbarView, WindowUtils){

	var HomeView = Backbone.View.extend({

		el: "#letscode-home-panel",

		events: {
			'click #desc-panel .fullscreen': 'toggleFullScreen',
			'click .home-browser-info a': 'homeBrowserInfoClicked'
		},

		views: [],

		initialize: function() {

			$(window).bind('resize.app', _.bind(this.onResize, this));

			this.createSubViews();

			// Call explicitly the first time
			this.onResize();

		},

		createSubViews: function() {

			this.views.homeHelpView = new HomeHelpView();
			this.views.homeToolbarView = new HomeToolbarView();

		},

		render: function() {

			this.views.homeHelpView.render();
			this.views.homeToolbarView.render();

			$('#home-intro', this.$el).show();
			$('.lesson-panel', this.$el).hide();

			$('.page').hide();
			this.$el.show();

		},

		homeBrowserInfoClicked: function() {

			this.global_dispatcher.trigger('home:helpClicked');

		},

		toggleFullScreen: function() {
			WindowUtils.toggleFullScreen();
			return false;
		},

		onResize: function() {

			var width = $(window).width();

			var height = $(window).height();

			if( width < 1024 || height < 900 ) {
				$('.home-screensize-info', this.$el).show();
			} else {
				$('.home-screensize-info', this.$el).hide();
			}

		}

	});
	
	return HomeView;
	
});