/*
 * For linking an event to a method.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'hbs!views/templates/chooseMethod'
], function($, _, Backbone, ChooseMethodTemplate){

	var MethodChooseView = Backbone.View.extend({

		method: null,
		event: null,

		events: {
			'click': 'clickOnEvent'
		},

		initialize: function(options) {
			this.method = options.method;
			this.event = options.event;
		},

		render: function() {

			var methodEl = ChooseMethodTemplate({
				method: this.method
			});

			this.$el.html(methodEl);

		},

		clickOnEvent: function(event) {
			this.global_dispatcher.trigger('createLink:choice', this.event, this.model, this.method);
			return false;
		}
	
	});
	
	return MethodChooseView;
	
});