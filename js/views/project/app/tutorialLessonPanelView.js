/*
 * The bar that describes the current tutorial.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'app'
], function($, _, Backbone, app) {

	var TutorialLessonPanelView = Backbone.View.extend({

		el: "#lessonpanel",

		events: {
			'click .close-button': 'closeClicked'
		},

		initialize: function() {

			this.model = {tutorial: null};

			this.global_dispatcher.bind('tutorial:onStep', this.render, this);

		},

		render: function() {

			if( this.model.tutorial ) {

				$('.tutorial-description', this.$el).html(
					'<p>'+this.model.tutorial.get('description')+'</p>');

				this.$el.show();

			} else {

				this.$el.hide();

			}

		},

		closeClicked: function() {
			app.router.navigate('/scenario/'+app.router.scenarioId, {trigger: true});
			return false;
		}

	});

	return TutorialLessonPanelView;

});