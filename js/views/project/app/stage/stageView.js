/*
 * The Stage is where the Scenario objects are displayed in their literal form.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/project/app/stage/scenarioObjectInstanceView',
	'sprite'
], function($, _, Backbone, ScenarioObjectInstanceView){

	var stageView = Backbone.View.extend({

		el: "#stage",

		initialize: function(){

			/*
			 * XXX This probably shouldn't be here...
			 * Event handler for when an object is added via the Object Library
			 */
			this.global_dispatcher.bind('object:add', function(scenarioObj) {

				this.model.scenarioObjectInstances.add({
					'scenario_obj': scenarioObj,
					'parent': this.model,
					'editable': true
				});

			}, this);

			// When object is added to the stage, we select it automatically
			this.global_dispatcher.bind('object:added', function(obj) {

				// Check model is ready - this is for handling new objects after stage has been set up, not before
				if( this.model ) {

					this.render();
					this.global_dispatcher.trigger('object:onSelect', obj);

				}

			}, this);

			this.global_dispatcher.bind('object:removed object:eventListenerRemoved', function() {
				this.render();
			}, this);

			// Update position when edit panel is resized
			this.global_dispatcher.bind('edit:panelResized', function(newEditPanelHeight) {
				var newStageMarginTop = this.calculateNewStageMarginTop(newEditPanelHeight);
				this.$el.css('margin-top', newStageMarginTop+'px');
			}, this);

			// Update position when edit panel is resizing - perform corresponding animation
			this.global_dispatcher.bind('edit:panelResizing', function(editPanelTargetHeight, timeToAnimate) {
				var newStageMarginTop = this.calculateNewStageMarginTop(editPanelTargetHeight);
				this.$el.animate({'margin-top': newStageMarginTop+'px'}, timeToAnimate);
			}, this);

		},

		render: function() {

			this.$el.empty();

			this.spriteScene = sjs.Scene({w: 1024, h: 450, autoPause: false, parent: this.$el[0]})

			// XXX This is all a bit ugly...
			// If we have already rendered views, we need to destroy them before starting again
			if( this.scenarioObjectInstanceViews ) {

				for( var index in this.scenarioObjectInstanceViews ) {
					var view = this.scenarioObjectInstanceViews[index];
					view.destroy();
				}

				// And unbind the custom events because we will bind them again and don't want to make multiple handlers
				this.global_dispatcher.unbind("object:onCustomEvent");

			}

			this.scenarioObjectInstanceViews = [];

			this.model.scenarioObjectInstances.each(function(scenarioObj) {

				var objInstanceView = new ScenarioObjectInstanceView({
					model: scenarioObj,
					spriteScene: this.spriteScene
				});

				objInstanceView.render();
				objInstanceView.refresh();

				this.scenarioObjectInstanceViews.push(objInstanceView);

				this.$el.append(objInstanceView.el);

			}, this);

		},

		calculateNewStageMarginTop: function(newEditPanelHeight) {

			var topStart = $('#toolbar').height();

			// 225px is half the stage height
			return -225 - (0.5 * (newEditPanelHeight)) + topStart;

		}

	});
	
	return stageView;
	
});