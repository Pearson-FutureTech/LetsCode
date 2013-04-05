/*
 * For the main app toolbar.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'app',
	'hbs!views/templates/projectHeadline',
	'util/WindowUtils'
], function($, _, Backbone, app, ProjectHeadlineTemplate, WindowUtils){

	var ToolbarView = Backbone.View.extend({

		el: "#toolbar",

		events: {
			'click #btn-edit': 'switchToEditMode',
			'click #btn-preview': 'switchToPreviewMode',
			'click #tb-publish': 'publishScenario',
			'click #tb-help': 'helpClicked',
			'click #tb-undo': 'ignoreClick',
			'click #tb-redo': 'ignoreClick',
			'click #tb-fullscreen': 'toggleFullScreen'
		},

		initialize: function(){

			this.global_dispatcher.bind('state:previewMode', function() {
				$('#btn-preview').removeClass('deselected');
				$('#btn-edit').addClass('deselected');
			});

			this.global_dispatcher.bind('state:editMode', function() {
				$('#btn-edit').removeClass('deselected');
				$('#btn-preview').addClass('deselected');
			});

			// Outside of the toolbar element, but logically belongs here for now
			$('#publish-confirm').bind('click', this.closePublishPanel);

        },

		render: function() {

			var tutorial = this.model.tutorials.models[this.model.get('tutorialNumber')];

			var scenarioName = tutorial ? tutorial.get('project') : app.router.scenarioName;
			var tutorialName = tutorial ? tutorial.get('name') : null;

			if( tutorial ) {

				var headingEl = ProjectHeadlineTemplate({
					scenario: scenarioName,
					tutorial: tutorialName
				});

				$('#tb-projname', this.$el).html(headingEl);

			}

		},

		switchToEditMode: function() {
			this.global_dispatcher.trigger('state:editMode');
			return false;
		},

		switchToPreviewMode: function() {
			this.global_dispatcher.trigger('state:previewMode object:unfocus');
			return false;
		},

		publishScenario: function() {
            $("#publish-confirm").show();
			return false;
		},

		helpClicked: function() {
			this.global_dispatcher.trigger('app:helpClicked');
			return false;
		},

		closePublishPanel: function() {
			$("#publish-confirm").hide();
			return false;
		},

		ignoreClick: function() {
			return false;
		},

		toggleFullScreen: function() {
			WindowUtils.toggleFullScreen();
			return false;
		}

	});

	return ToolbarView;
	
});
