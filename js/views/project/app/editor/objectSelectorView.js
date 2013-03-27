/*
 * For the select element that allows you to choose an object to edit.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone'
], function($, _, Backbone){

	var objectSelectorView = Backbone.View.extend({

		el: '#btn-selobject select',

		/*
		 * events: {
		 * 	'change': 'objectSelected'
		 * },
		 */

		initialize: function() {

			$(this.$el).bind('change', {context: this}, this.objectSelected);

			this.global_dispatcher.bind('object:onClick', function(obj) {
				this.selectObject(obj);
			}, this);

			this.global_dispatcher.bind('object:added', function() {
				// Check model is ready - this is for handling new objects after stage has been set up, not before
				if( this.model ) {
					this.refresh();
				}
			}, this);

			this.global_dispatcher.bind('object:removed', function() {
				this.refresh();
				// Select the Stage and fire change event so the edit panel views update
				$(this.$el).val('myStage').change();
			}, this);

		},

		render: function() {

			this.refresh();

		},

		refresh: function() {

			$(this.$el).empty();

			this.model.scenarioObjectInstances.each(function(instance_obj) {

				var objName = instance_obj.get('name');

				var option = $('<option value="'+objName+'">'+objName+'</option>');

				if( this.selectedObj && objName == this.selectedObj.get('name') ) {
					option.attr('selected', 'selected');
				}

				$(this.$el).append(option);

			}, this);

		},

		selectObject: function(object) {

			if( object ) {
				this.selectedObj = object;
				$(this.$el).val(object.get('name'));
			}

		},

		objectSelected: function(event) {

			var selectedObjName = $('option:selected', this.$el).val();

			this.selectedObj = _.find(event.data.context.model.scenarioObjectInstances.models, function(instance_obj) {
				return instance_obj.get('name') == selectedObjName;
			});

			// Fire event and let other views update
			event.data.context.global_dispatcher.trigger('object:onSelect', this.selectedObj);

		}

	});

	return objectSelectorView;

});