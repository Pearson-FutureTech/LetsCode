/*
 * A collection of tutorial steps that make up a complete tutorial.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'models/tutorialStep'
], function($, _, Backbone, tutorialStep){

	var TutorialCollection = Backbone.Collection.extend({

		model: tutorialStep,

		url: '/content/tutorials/tutorials.js',

		nextOrder: function() {
			if( !this.length ) return 1;
			return this.last().get('order') + 1;
		}

	});

	return TutorialCollection;

});
