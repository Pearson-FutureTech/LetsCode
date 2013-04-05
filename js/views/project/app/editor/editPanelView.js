/*
 * The main view for the edit panel
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/project/app/editor/eventEditorView',
	'views/project/app/editor/methodEditorView',
	'views/project/app/editor/objectLibraryView',
	'views/project/app/editor/objectSelectorView',
	'views/project/app/editor/propertyEditorView'
], function($, _, Backbone, EventEditorView, MethodEditorView, ObjectLibraryView, ObjectSelectorView, PropertyEditorView){

	var EditPanelView = Backbone.View.extend({

		el: "#editpanel",

		events: {
			'click #btn-debug': 'ignoreClick'
		},

		views: [],

		initialize: function(){

			 $('.ui-tab', this.$el).bind('click', {context: this}, function(event) {
				 event.data.context.global_dispatcher.trigger('edit:chooseTab', this.id);
				 event.preventDefault();
			 });

			$('#btn-viewcode', this.$el).bind('click', {context: this}, function(event) {

				event.data.context.global_dispatcher.trigger('edit:viewCode');

				$(this).removeClass('deselected');
				$('#btn-viewvisual', this.$el).addClass('deselected');

				event.preventDefault();

			});

			$('#btn-viewvisual', this.$el).bind('click', {context: this}, function(event) {

				event.data.context.global_dispatcher.trigger('edit:viewVisual');

				$(this).removeClass('deselected');
				$('#btn-viewcode', this.$el).addClass('deselected');

				event.preventDefault();

			});

			// Select Properties tab by default when object is clicked
			this.global_dispatcher.bind('object:onClick', function() {
				this.global_dispatcher.trigger('edit:chooseTab', 'tab-properties');
			}, this);

			this.global_dispatcher.bind('edit:chooseTab', function(tabId) {

				$('.ui-tab', this.$el).removeClass('selected');
				$('#'+tabId, this.$el).addClass('selected');

				$('.side-panel', this.$el).removeClass('selected');
				$('.side-panel[data-tab='+ tabId +']').addClass('selected');

			}, this);

			this.$el.resizable({handles: 'n'});

			// On resize of edit panel, trigger event so stage can update its position
			this.$el.bind('resize', {context: this}, function(event, ui) {
				// + 20px to include padding
				event.data.context.global_dispatcher.trigger('edit:panelResized', ui.size.height + 20);
			});

			this.global_dispatcher.bind('state:previewMode', function() {
				var that = this;
				this.$el.animate({height: '0px', padding: '0'}, 1000, function() {
					that.global_dispatcher.trigger('edit:panelResized', 0);
				});
				this.global_dispatcher.trigger('edit:panelResizing', 0, 1000);
			}, this);

			this.global_dispatcher.bind('state:editMode', function() {
				var that = this;
				this.$el.animate({height: '280px', padding: '10px'}, 1000, function() {
					that.global_dispatcher.trigger('edit:panelResized', 300);
				});
				this.global_dispatcher.trigger('edit:panelResizing', 300, 1000);
			}, this);

			this.createSubViews();

		},

		createSubViews: function() {

			this.views.eventEditorView = new EventEditorView();
			this.views.methodEditorView = new MethodEditorView();
			this.views.objectLibraryView = new ObjectLibraryView();
			this.views.objectSelectorView = new ObjectSelectorView();
			this.views.propertyEditorView = new PropertyEditorView();

		},

		render: function() {

			this.views.methodEditorView.model = this.model;
			this.views.objectLibraryView.model = this.model;
			this.views.objectSelectorView.model = this.model;
			this.views.propertyEditorView.model = this.model;

			this.views.eventEditorView.render();
			this.views.methodEditorView.render();
			this.views.objectLibraryView.render();
			this.views.objectSelectorView.render();
			this.views.propertyEditorView.render();

		},

		ignoreClick: function() {
			return false;
		}

	});

	return EditPanelView;

});