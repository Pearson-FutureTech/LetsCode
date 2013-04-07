/*
 * For the object library popup (launched from the + button on the edit panel).
 */

define([
	'jQuery',
	'Underscore',
	'Backbone'
], function($, _, Backbone){

	var objectLibraryView = Backbone.View.extend({

		el: "#library",

		initialize: function() {

			// XXX Outside of our $el so can't use in-built events
			$('#btn-addobject').bind('click', {context: this}, function(event) {
				event.data.context.togglePopupShown();
			});

			// XXX Outside of our $el so can't use in-built events
			$('#stage-container').bind('click', {context: this}, function(event) {
				event.data.context.hide();
			});

			this.global_dispatcher.bind('scenario:reset', function() {
				this.hide();
			}, this);

		},

		render: function() {

			this.$el.html('<p class="title">Add New Object <a href="#" class="close-button">Close</a>');

			var list = $("<ul></ul>");

			this.model.scenarioObjects.each(function(scenarioObj) {

				var privateProperties = scenarioObj.get('privateProperties');

				if( privateProperties['_description'] ) {

					var li = $("<li></li>");

					var objEl = $(
						'<img src="'+privateProperties['_thumbnail'].value+'"/>' +
						'<p class="name">'+scenarioObj.get('name')+'</p>' +
						'<p class="desc">'+privateProperties['_description'].value+'</p>');

					li.append(objEl);

					li.bind('click', {context: this, scenarioObj: scenarioObj}, function(event) {
						event.data.context.global_dispatcher.trigger('object:add', event.data.scenarioObj);
						event.data.context.hide();
					});

					list.append(li);

				}

			}, this);

			this.$el.append(list);

		},

		refresh: function() {
		},

		togglePopupShown: function() {

			if( this.$el.is(':visible') ) {
				this.hide();
			} else {
				this.show();
			}

		},

		show: function() {

			this.$el.fadeIn('fast');

			// For some reason, seems we can't have this in initialise or render, since it doesn't pick up the element..
			$('.close-button', this.$el).bind('click', {context: this}, function(event) {
				event.data.context.hide();
				return false;
			});
		},

		hide: function() {
			this.$el.fadeOut('fast');
		}
		
	});
	
	return objectLibraryView;
	
});