/*
 * For the objects on the stage when they're selected.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/project/app/stage/eventEditView',
	'views/project/app/stage/methodEditView',
	'views/project/app/stage/methodChooseView',
	'hbs!views/templates/editLabel'
], function($, _, Backbone, EventEditView, MethodEditView, MethodChooseView, EditLabelTemplate){

	var ScenarioObjectInstanceEditView = Backbone.View.extend({

		events: {
			'click a.deleteInstance': 'deleteInstance'
		},

		initialize: function(options) {
		},

		render: function() {

			this.label = $("<div class='edit-label' />").appendTo(this.$el);
			$("<div class='left-bracket' />").appendTo(this.$el)
			$("<div class='right-bracket' />").appendTo(this.$el)
			this.methodList = $("<ul class='edit-methods' />").appendTo(this.$el);
			this.eventList = $("<ul class='edit-events' />").appendTo(this.$el);

			var labelView = EditLabelTemplate({
				name: this.model.get('name')
			});
			this.label.html(labelView);

			_.each(this.model.get('events'), function(event) {
				new_el = $('<li class="event"/>');
				new_el.appendTo(this.eventList);
				new EventEditView({
					model: this.model,
					event: event,
					el: new_el
				}).render();
			}, this);

			var model = this.model;

			_.each(this.model.get('methods'), function(method, key) {
				new_el = $('<li class="method"/>');
				new_el.appendTo(this.methodList);
				new MethodEditView({
					model: this.model,
					method: method,
					el: new_el
				}).render();

			}, this);

		},

		destroy: function() {
			this.$el.html('');
		},

		/*
		 * For allowing one of our methods to be chosen as a listener for a particular event
		 */
		chooseMethod: function(eventObj) {

			// XXX Hacky - disallowed for Stage
			if( this.model.get('ast')[1][0][0] !== 'Stage' ) {

				if( !this.methodList || $('.edit-label', this.$el).length < 1 ) {
					this.render();
				}

				// XXX Should keep reference to methodChooseViews and update them or at least destroy before recreating?
				this.methodList.empty();

				var that = this;

				_.each(this.model.get('methods'), function(method, key) {

					var methodChooseView = new MethodChooseView({
						model: this.model,
						method: method,
						event: eventObj
					});

					methodChooseView.render();

					that.methodList.append(methodChooseView.el);

				}, this);

			}
		},

		deleteInstance: function() {
			this.model.destroy();
			return false;
		}
	
	});
	
	return ScenarioObjectInstanceEditView;
	
});