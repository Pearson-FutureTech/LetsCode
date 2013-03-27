/*
 * For the editable methods list shown next to objects when they're selected on the stage.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'hbs!views/templates/editMethods'
], function($, _, Backbone, EditMethodsTemplate){

	var MethodEditView = Backbone.View.extend({

		method: null,

		events: {
			'hover': 'hoverOnMethod',
			'mouseout': 'hoverOutMethod',
			'click': 'clickOnMethod',
			'dblclick': 'doubleClickOnMethod'
		},

		initialize: function(options) {

			this.method = options.method;

			this.global_dispatcher.bind('object:onMethodHover', function(object, method) {

				if( this.model.get('name') == object.get('name') && this.method.name == method.name ) {
					this.$el.addClass('hover');
				} else {
					this.$el.removeClass('hover');
				}

			}, this);

			this.global_dispatcher.bind('object:onMethodHoverOut', function() {
				this.$el.removeClass('hover');
			}, this);

		},

		render: function() {

			var methodEl = EditMethodsTemplate({
				method: this.method
			});

			this.$el.html(methodEl);
			this.isLinked();

		},

		isLinked: function() {
			if(!_.isEmpty(this.method.references)) {
				this.$el.addClass('is-linked');
			}
		},

		hoverOnMethod: function() {
			this.global_dispatcher.trigger('object:onMethodHover', this.model, this.method);
		},

		hoverOutMethod: function() {
			this.global_dispatcher.trigger('object:onMethodHoverOut');
		},

		// Clicking method selects it in edit panel
		clickOnMethod: function() {

			this.global_dispatcher.trigger('edit:onMethodClick', this.method);

			// Stop propagation to prevent object click registering
			return false;

		},

		// Double-clicking method makes it actually run
		doubleClickOnMethod: function() {

			var listener = {
				"instance": this.model.get('name'),
				"method": this.method.name
			};

			this.global_dispatcher.trigger('object:onCustomEvent', [listener]);

		}

	});
	
	return MethodEditView;
	
});