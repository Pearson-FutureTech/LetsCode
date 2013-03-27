/*
 * For the event list in the edit panel and the events shown in the details panel.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'hbs!views/templates/eventDetails'
], function($, _, Backbone, EventDetailsTemplate){

	var eventEditorView = Backbone.View.extend({

		el: "#eventlistpanel",

		visualView : true,

		showDetails : false,

		initialize: function() {

			this.global_dispatcher.bind('object:onClick object:unfocus object:onSelect', function(obj) {
				if(obj) {
					this.current_obj = obj;
					this.refresh();
				}
			}, this);

			this.global_dispatcher.bind('object:onEventHover', function(object, event) {

				if( this.current_obj && this.current_obj.get('name') == object.get('name') ) {
					$('.event', this.$el).removeClass('hover');
					$('.event[data-event='+event.name+']', this.$el).addClass('hover');
				}

			}, this);

			this.global_dispatcher.bind('object:onEventHoverOut', function() {
				$('.event', this.$el).removeClass('hover');

			}, this);

			this.global_dispatcher.bind('edit:viewVisual', function() {
				this.visualView = true;
				this.refresh();
			}, this);

			this.global_dispatcher.bind('edit:viewCode', function() {
				this.visualView = false;
				this.refresh();
			}, this);

			this.global_dispatcher.bind('edit:chooseTab', function(tabId) {
				this.showDetails = (tabId == this.$el.data('tab'));
				this.refresh();
			}, this);

		},

		render: function(){
			this.refresh();
		},
		
		refresh: function(){

			$(this.$el).html('<ul class="event-list""></ul>');

			if( this.current_obj ) {

				_.each(this.current_obj.get('events'), function(value) {
					this.addListItem(value);
				}, this);

				$('.event-list', this.$el).append('<li class="event add">Add New Event</li>');

			}

			if( this.showDetails ) {

				$('#detailspanel').empty();

				if( this.current_obj ) {

					$('#detailspanel').append('<p class="paneltitle">' + this.current_obj.get("name") + ' Events</p>');

					if( this.visualView ) {
						this.showVisualSummary();
					} else {
						this.showCodeSummary();
					}

				}

			}

		},

		showVisualSummary: function() {

            var eventArray = [];
            _.each(this.current_obj.get('events'), function(eventObj){
                eventArray.push(eventObj);
            });

			var eventDetailsEl = EventDetailsTemplate({events: eventArray});

			$('#detailspanel').append(eventDetailsEl);

		},

		showCodeSummary: function() {

			var codeEl = $('<div class="code"></div>');

			_.each(this.current_obj.get('events'), function(eventObj){
				codeEl.append('<p class="comment">// ' + eventObj.comment + '</p><pre>' + eventObj.name + '</pre><br/>');
			}, this);

			if( $('p', codeEl).length < 1 ) {
				codeEl.append('<p class="empty">This object does not have any events defined.</p>');
			}

			$('#detailspanel').append(codeEl);

		},

		addListItem: function(eventObj) {

			var li = $('<li class="event" data-event="'+eventObj.name+'">'+eventObj.name+'</li>');

			if( eventObj.listeners && eventObj.listeners.length > 0 ) {
				li.addClass('is-linked');
			}

			li.bind('hover', {context: this}, function(event) {

				var context = event.data.context;
				context.global_dispatcher.trigger('object:onEventHover', context.current_obj, eventObj);

			});

			li.bind('mouseout', {context: this}, function(event) {

				event.data.context.global_dispatcher.trigger('object:onEventHoverOut');

			});

			$(this.$el).find("ul").append(li);
		}

	});
	
	return eventEditorView;
	
});