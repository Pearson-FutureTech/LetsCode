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

	var HomeView = Backbone.View.extend({

		el: "#letscode-home-panel",

		views: [],

		initialize: function() {

			$('#home-intro .option-menu a', this.$el).bind('click', {context: this}, function(event) {
				event.data.context.global_dispatcher.trigger('nav:tutorialIntro', $(this).data('tutorialnumber'));
				return false;
			});

			$('.lesson-panel .go a', this.$el).bind('click', {context: this}, function(event) {
				event.data.context.global_dispatcher.trigger('nav:showTutorial', $(this).data('tutorialnumber'));
				return false;
			});

			$('.lesson-panel .back a', this.$el).bind('click', {context: this}, function(event) {
				event.data.context.global_dispatcher.trigger('nav:showHome');
				return false;
			});

			$('#tb-help-home', this.$el).bind('click', {context: this}, function(event) {
				event.data.context.global_dispatcher.trigger('home:helpClicked');
			});

            $('.home-browser-info a', this.$el).bind('click', {context: this}, function(event) {
                event.data.context.global_dispatcher.trigger('home:helpClicked');
            });

			this.global_dispatcher.bind('nav:tutorialIntro', function(tutorialNumber) {
				this.showTutorialIntro(tutorialNumber);
			}, this);

			this.global_dispatcher.bind('nav:showTutorial', function() {
				this.$el.hide();
			}, this);

			this.global_dispatcher.bind('nav:showHome', function() {
				this.showHome();
			}, this);

			this.createSubViews();

		},

		createSubViews: function() {

			this.views.homeHelpView = new HomeHelpView();
			this.views.homeToolbarView = new HomeToolbarView();

		},

		render: function() {

			this.views.homeHelpView.render();
			this.views.homeToolbarView.render();

		},

		showHome: function() {
			$('#home-intro', this.$el).show();
			$('.lesson-panel', this.$el).hide();
			this.$el.show();
		},

		showTutorialIntro: function(tutorialNumber) {
			$('#home-intro', this.$el).hide();
			$('.lesson-panel', this.$el).hide();
			$('#lesson-panel-'+(tutorialNumber+1), this.$el).show();
			this.$el.show();
		}

	});
	
	return HomeView;
	
});