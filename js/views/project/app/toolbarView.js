/*
 * For the main app toolbar.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'util/WindowUtils'
], function($, _, Backbone, WindowUtils){

	var ToolbarView = Backbone.View.extend({

		el: "#toolbar",

		events: {
			'click #btn-edit': 'switchToEditMode',
			'click #btn-preview': 'switchToPreviewMode',
			'click #tb-publish': 'publishScenario',
			'click #tb-help': 'helpClicked',
			'click #tb-close': 'closeClicked',
			'click #tb-fullscreen': 'toggleFullScreen'
		},

		headlineTemplate: _.template('<span class="project"><%= project %></span> - <span class="name"><%= name %></span>'),


		initialize: function(){

			this.global_dispatcher.bind('state:previewMode', function() {
				$('#btn-preview').removeClass('deselected');
				$('#btn-edit').addClass('deselected');
			});

			this.global_dispatcher.bind('state:editMode', function() {
				$('#btn-edit').removeClass('deselected');
				$('#btn-preview').addClass('deselected');
			});

			this.global_dispatcher.bind('tutorial:tutorialSet', function(tutorial) {

				var headingEl = this.headlineTemplate({
					project: tutorial.get('project'),
					name: tutorial.get('name')
				});

				$('#tb-projname', this.$el).html(headingEl);

			}, this);

			this.global_dispatcher.bind('app:startFreePlay', function(project) {
				$('#tb-projname', this.$el).html('<span class="project">'+project+'</span>')
			}, this);

			// These really belong in a separate view...

            $("#publish-continue").click(function(){
                $("#publish-confirm").hide();
                $("#publish-inprogress").show();
                window.setTimeout(function(){
                    $("#publish-inprogress").hide();
                    $("#publish-share").show();
                }, 1500);
            });

            $("#publish-cancel").click(function(){
                $("#publish-confirm").hide();
            });

            $("#publish-close").click(function(){
                $("#publish-share").hide();
            });

            $("#publish-done").click(function(){
                $("#publish-share").hide();
            });
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

		closeClicked: function() {
			this.global_dispatcher.trigger('state:editMode');
			this.global_dispatcher.trigger('nav:showHome');
			return false;
		},

		toggleFullScreen: function() {
			WindowUtils.toggleFullScreen();
		}

	});

	return ToolbarView;
	
});
