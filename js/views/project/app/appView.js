/*
 * Deals with high-level aspects of the main app view, i.e. after you go through the intro screens and the actual
 * app is launched.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/project/app/helpView',
	'views/project/app/toolbarView',
	'views/project/app/tutorialView',
	'views/project/app/editor/editPanelView',
	'views/project/app/stage/stageView'
], function($, _, Backbone, HelpView, ToolbarView, TutorialView, EditPanelView, StageView){

	var AppView = Backbone.View.extend({

		el: "#letscode",

		views: [],

		initialize: function() {

			this.createSubViews();

		},

		createSubViews: function() {

			this.views.helpAppView = new HelpView();
			this.views.toolbarAppView = new ToolbarView();
			this.views.tutorialView = new TutorialView();
			this.views.editPanelView = new EditPanelView();
			this.views.stageView = new StageView();

		},

		render: function() {

			this.views.toolbarAppView.model = this.model;
			this.views.tutorialView.model = this.model;
			this.views.editPanelView.model = this.model;
			this.views.stageView.model = this.model;

			this.views.helpAppView.render();
			this.views.toolbarAppView.render();
			this.views.tutorialView.render();
			this.views.editPanelView.render();
			this.views.stageView.render();

			$('.page').hide();
			this.$el.show();

			// If tutorial, start in edit mode (this will ensure edit panel is open)
			if( this.model.get('tutorialNumber') != -1 ) {
				this.global_dispatcher.trigger('state:editMode');
			}

			// XXX Yucky - select the Stage by default - hardcoded name - this should be defined as part of scenario...
			var stageObj = _.find(this.model.scenarioObjectInstances.models, function(obj) {
				if( obj.get('name') == 'myStage' ) return obj;
			});
			this.global_dispatcher.trigger('object:onClick', stageObj);

		}

	});

	return AppView;

});
