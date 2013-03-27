/*
 * For the properties shown in the details panel when the 'Properties' tab is selected.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'hbs!views/templates/propertyField'
], function($, _, Backbone, PropertyFieldTemplate){

	var sourceEditorView = Backbone.View.extend({

		el: "#detailspanel",

		visualView : true,

		showDetails: true,

		events: {
			"change input": 'updateObject'
		},

		initialize: function(){

			this.global_dispatcher.bind('object:onClick object:onSelect', function(obj) {
				if(obj) {
					this.current_obj = obj;
					this.refresh();
				}
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

		render: function() {
		},
		
		refresh: function(){

			if( this.showDetails ) {

				this.$el.empty();

				if( this.current_obj ) {

					this.$el.append('<p class="paneltitle">' + this.current_obj.get("name") + ' Properties</p>');

					if( this.visualView ) {
						this.showVisualSummary();
					} else {
						this.showCodeSummary();
					}

				}

			}

		},

		showVisualSummary: function() {

			var propertyList = $('<ul class="proplist"></ul>');

			// XXX Bit hacky - we want to show the name/id but it shouldn't be editable
			propertyList.append( PropertyFieldTemplate({key: 'id', value: this.current_obj.get('name'),
				comment: 'The name that identifies this object', readonly: true}) );

			_.each(this.current_obj.get('properties'), function(prop, key){

				propertyList.append( PropertyFieldTemplate({key: key, value: prop.value, comment: prop.comment}) );

			}, this);

			this.$el.append(propertyList);

		},

		showCodeSummary: function() {

			var codeEl = $('<div class="code"></div>');

			_.each(this.current_obj.get('properties'), function(prop, key){
				codeEl.append('<p class="comment">//' + prop.comment + '</p><p>' + prop.code + ';</p><br/>');
			}, this);

			this.$el.append(codeEl);

		},

		updateObject: function(obj) {

			prop = obj.currentTarget.name;
			value = obj.currentTarget.value;

			this.current_obj.get('properties')[prop].value = value;

			this.global_dispatcher.trigger("object:updated", this.current_obj);
		}
		
	});
	
	return sourceEditorView;
	
});