/*
 * Deals with the help popup on the homepage.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone'
], function($, _, Backbone){

	var HelpHomeView = Backbone.View.extend({

		el: "#help-letscode-home-panel",

		initialize: function() {

			this.global_dispatcher.bind('home:helpClicked', function() {
				this.$el.show();
			}, this);

			$('.help-close', this.$el).bind('click', {context: this}, function(event) {
				event.data.context.$el.hide();
				event.preventDefault();
			});

		}

	});

	return HelpHomeView;

});