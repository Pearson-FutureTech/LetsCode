/*
 * For the editable events list shown next to objects when they're selected on the stage.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'hbs!views/templates/editEvents'
], function($, _, Backbone, EditEventTemplate){

	var EventEditView = Backbone.View.extend({

		event: null,

		events: {
			'click': 'clickOnEvent',
			'dblclick': 'doubleClickOnEvent',
			'hover': 'hoverOnEvent',
			'mouseout': 'hoverOutEvent'
		},

		initialize: function(options) {

			this.event = options.event;

			this.global_dispatcher.bind('object:onEventHover', function(object, event) {

				if( this.model.get('name') == object.get('name') && this.event.name == event.name ) {
					this.$el.addClass('hover');
				} else {
					this.$el.removeClass('hover');
				}

			}, this);

			this.global_dispatcher.bind('object:onEventHoverOut', function() {
				this.$el.removeClass('hover');
			}, this);

		},

		render: function() {

			var eventView = EditEventTemplate({
				event: this.event
			});

			this.$el.html(eventView);
			this.setLinked();

			$('.close-button', this.$el).bind('click', {context: this}, function(event) {

				var listenerInstance = $(this).data('instance');
				var listenerMethod = $(this).data('method');

				var context = event.data.context;

				context.global_dispatcher.trigger('object:destroyEventListener',
					{event: context.event.name, listener: {instance: listenerInstance, method: listenerMethod}},
					context.model.get('name'));

				// Trigger refreshing the stage
				context.global_dispatcher.trigger('object:eventListenerRemoved');
			});

		},

		setLinked: function() {
			if(this.event.listeners && this.event.listeners.length > 0) {
				this.$el.addClass('is-linked');
			}
		},

		clickOnEvent: function(eventObj) {
			this.global_dispatcher.trigger('createLink:choose', this.model, this.event);
			return false;
		},

		// Double-clicking event makes it actually fire
		doubleClickOnEvent: function() {

			// First, fire click event on current item to hide edit view on the others that we just showed on click
			this.global_dispatcher.trigger('object:onClick', this.model);

			for( var index in this.event.listeners ) {

				var listener = this.event.listeners[index];

				this.global_dispatcher.trigger('object:onCustomEvent', [listener]);

			}

		},

		hoverOnEvent: function() {
			this.global_dispatcher.trigger('object:onEventHover', this.model, this.event);
		},

		hoverOutEvent: function() {
			this.global_dispatcher.trigger('object:onEventHoverOut');
		}
	
	});
	
	return EventEditView;
	
});