/*
 * Deals with the help popup in the app itself (as opposed to homeHelpView).
 */
define([
	'jQuery',
	'Underscore',
	'Backbone'
], function($, _, Backbone){

	var HelpView = Backbone.View.extend({

		el: "#help-letscode",

		initialize: function() {

			this.global_dispatcher.bind('app:helpClicked', function() {
				this.$el.show();
			}, this);

			$('.help-close', this.$el).bind('click', {context: this}, function(event) {
				event.data.context.$el.hide();
				event.preventDefault();
			});

		}

	});

	return HelpView;

});
