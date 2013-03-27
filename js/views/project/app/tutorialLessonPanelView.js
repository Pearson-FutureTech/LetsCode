/*
 * The bar that describes the current tutorial.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone'
], function($, _, Backbone){

	var TutorialLessonPanelView = Backbone.View.extend({

		el: "#lessonpanel",

		events: {
			'click .close-button': 'closeClicked'
		},

		initialize: function() {

			this.global_dispatcher.bind('nav:showTutorial', function() {
				this.$el.show();
			}, this);

			this.global_dispatcher.bind('tutorial:close', function() {
				this.$el.hide();
			}, this);

			this.global_dispatcher.bind('tutorial:tutorialSet', function(tutorial) {
				$('.tutorial-description', this.$el).html('<p>'+tutorial.get('description')+'</p>');
			}, this);

			this.global_dispatcher.bind('tutorial:onStep', function(tutorialStep) {

				if( tutorialStep.description ) {
					$('.tutorial-description', this.$el).html('<p>'+tutorialStep.description+'</p>');
				}

			}, this);

		},

		closeClicked: function() {

			this.global_dispatcher.trigger('tutorial:close');

			return false;

		}

	});

	return TutorialLessonPanelView;

});