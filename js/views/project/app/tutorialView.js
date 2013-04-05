/*
 * Tutorial step bubbles.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'app',
	'collections/tutorial',
	'views/project/app/tutorialLessonPanelView',
	'hbs!views/templates/tutorialStep'
], function($, _, Backbone, app, TutorialCollection, TutorialLessonPanelView, TutorialStepTemplate){

	var tutorialView = Backbone.View.extend({

		currentStepIndex: 0,
		tutorial: null,

		dispatcher: _.clone(Backbone.Events),

		el: "#tutorial-steps",

		views: [],

		lastObjectClickTime: 0,
		lastElementClickTime: 0,


		initialize: function(){

			this.global_dispatcher.bind('tutorial:previous', this.previousStep, this);
			this.global_dispatcher.bind('tutorial:next', this.nextStep, this);
			this.global_dispatcher.bind('object:onClick', this.handleObjectClick, this);
			this.global_dispatcher.bind('object:updated', this.handleObjectUpdated, this);
			this.global_dispatcher.bind('tutorial:onStep', this.updateOnStepChange, this);
			this.global_dispatcher.bind('edit:panelResized', this.stageMovedHandler, this);

			this.createSubViews();

			$(window).bind('resize', {context: this}, this.onWindowResize);

		},

		createSubViews: function() {

			this.views.tutorialLessonPanelView = new TutorialLessonPanelView();

		},

		previousStep: function() {

			if( this.currentStepIndex > 0 ) {

				this.currentStepIndex = this.currentStepIndex - 1;

				this.global_dispatcher.trigger('tutorial:onStep', this.tutorial.get('steps')[this.currentStepIndex]);

			}

		},

		nextStep: function() {

			if( this.currentStepIndex < this.tutorial.get('steps').length - 1) {

				this.currentStepIndex = this.currentStepIndex + 1;

				this.global_dispatcher.trigger('tutorial:onStep', this.tutorial.get('steps')[this.currentStepIndex]);


			} else {

				// Finished this lesson
				if( this.model.tutorials.models.length > this.model.get('tutorialNumber') + 1 ) {

					// There's another lesson - proceed to the next one
					app.router.navigate('/lesson/' + (this.model.get('tutorialNumber') + 2), {trigger:true} );

				} else {

					// Finished last lesson
					app.router.navigate('/scenario/' + app.router.scenarioId, {trigger: true} );
				}

			}

		},

		close: function() {

			this.$el.hide();

			$('.highlight').removeClass('highlight');
			$('.fade').removeClass('fade');

			this.currentStepIndex = 0;

		},

		render: function(){

			this.views.tutorialLessonPanelView.render();

			this.$el.empty();

			if( this.model.get('tutorialNumber') != null ) {

				this.tutorial = this.model.tutorials.models[this.model.get('tutorialNumber')];
				this.global_dispatcher.trigger('tutorial:tutorialSet', this.tutorial);

				var that = this;

				_.each(this.tutorial.get('steps'), function(step) {
					var stepEl = TutorialStepTemplate(step);
					that.$el.append(stepEl);
				});

				this.$el.show();

				this.currentStepIndex = 0;

				this.global_dispatcher.trigger('tutorial:onStep', this.tutorial.get('steps')[0]);

			}

		},

		updateOnStepChange: function(tutorialStep) {

			$('li', this.$el).hide();

            var tutorialStepEl = $('#tutorial-steps > li:eq('+ this.currentStepIndex + ')');

			// Change wording of 'Continue' button if last step
			if( this.currentStepIndex >= this.tutorial.get('steps').length - 1 ) {

				if( this.model.tutorials.models.length > this.model.get('tutorialNumber') + 1 ) {
					$('.continue', tutorialStepEl).html('Next lesson');
				} else {
					$('.continue', tutorialStepEl).html('Finish');
				}
			}

			$('.continue', tutorialStepEl).bind('click', {context: this}, function(event) {
				event.data.context.global_dispatcher.trigger("tutorial:next");
			});

			this.showStep(tutorialStep, tutorialStepEl);

            if( tutorialStep.substeps ) {

                for( var i=0; i < tutorialStep.substeps.length; i++ ) {

                    var substep = tutorialStep.substeps[i];
                    this.showStep(substep, $('li.substep:eq('+i+')', tutorialStepEl));

                }

            }

			// Instead of this we should probably trigger an event and let it be handled by main AppView
			this.applyHighlights(tutorialStep);
			this.applyFades(tutorialStep);

		},

		showStep: function(tutorialStep, tutorialStepEl) {

			var arrowLength = 45;

			if( tutorialStep.highlightSelector && tutorialStep.arrowDirection ) {

				var highlightEl = $(tutorialStep.highlightSelector);

				var targetLeft = highlightEl.offset().left;
				var targetRight = targetLeft + highlightEl.width();
				var targetHCentre = targetLeft + (highlightEl.width() / 2);

				var targetTop = highlightEl.offset().top;
				var targetBottom = targetTop + highlightEl.height();
				var targetVCentre = targetTop + (highlightEl.height() / 2);

				switch( tutorialStep.arrowDirection ) {

					case 'top':
						// NB. Child element is positioned 50% left for centering purposes...
						tutorialStepEl.css('left', targetHCentre + 'px');
						tutorialStepEl.css('top', (targetBottom + arrowLength) + 'px');

						break;

					case 'bottom':
						tutorialStepEl.css('left', targetHCentre + 'px');
						tutorialStepEl.css('top', (targetTop - arrowLength - tutorialStepEl.height()) + 'px');

						break;

					case 'left':
						tutorialStepEl.css('left', (targetRight + arrowLength + (tutorialStepEl.width() / 2)) + 'px');
						tutorialStepEl.css('top', (targetVCentre - (tutorialStepEl.height() / 2)) + 'px');

						break;

					case 'right':
						tutorialStepEl.css('left', (targetLeft - arrowLength - (tutorialStepEl.width() / 2)) + 'px');
						tutorialStepEl.css('top', (targetVCentre - (tutorialStepEl.height() / 2)) + 'px');

						break;

				}

			}

			tutorialStepEl.show();

		},

		applyHighlights: function(tutorialStep) {

			$('.highlight').removeClass('highlight');

			var highlightSelector = tutorialStep.highlightSelector;

			if( highlightSelector ) {
				$(highlightSelector).addClass('highlight');

			}

		},

		applyFades: function(tutorialStep) {

			$('.fade').removeClass('fade');

			var fadeSelector = tutorialStep.fadeSelector;

			if( fadeSelector ) {
				$(fadeSelector).addClass('fade');
			}

			if( tutorialStep.elementToClick ) {
				// Unbind first so we don't create duplicate handlers
				$(tutorialStep.elementToClick).unbind('click', this.elementClickHandler);
				$(tutorialStep.elementToClick).unbind('dblclick', this.elementClickHandler);
				$(tutorialStep.elementToClick).bind('click', {context: this, tutorialStep: tutorialStep},
					this.elementClickHandler);
			}

			if( tutorialStep.elementToDoubleClick ) {
				// Unbind first so we don't create duplicate handlers
				$(tutorialStep.elementToDoubleClick).unbind('click', this.elementClickHandler);
				$(tutorialStep.elementToDoubleClick).unbind('dblclick', this.elementClickHandler);
				$(tutorialStep.elementToDoubleClick).bind('dblclick', {context: this, tutorialStep: tutorialStep},
					this.elementClickHandler);
			}

		},


		handleObjectClick: function(obj) {

			// XXX Hacky - to make sure we don't count a double-click as two separate 'next's
			if( this.tutorial && Date.now() > this.lastObjectClickTime + 500 ) {

				this.lastObjectClickTime = Date.now();

				var step = this.tutorial.get('steps')[this.currentStepIndex];

				if( step && step.objectToClick && step.objectToClick === obj.get('name') ) {

					// User has clicked the object they were asked to - advance the tutorial

					// XXX Slight delay to allow time for other handlers to do their stuff first. To avoid problem
					// whereby we're trying to highlight an element on the next step that doesn't exist yet...
					var that = this;
					window.setTimeout(function() {
						that.nextStep();
					}, 500);

				}
			}

		},

		handleObjectUpdated: function(obj) {

			var step = this.tutorial.get('steps')[this.currentStepIndex];

			if( step && step.objectToUpdate && step.objectToUpdate === obj.get('name') ) {

				// User has updated the object they were asked to - advance the tutorial
				// (Would be nice if we could check that user has made the *right* update!)
				this.nextStep();

			}

		},

		elementClickHandler: function(event) {

			var context = event.data.context;

			// XXX Hacky - need to make sure we don't count a double-click as two separate 'next's
			if( Date.now() > context.lastElementClickTime + 500 ) {

				context.lastElementClickTime = Date.now();

				$('li', context.$el).hide();

				var nextStepDelay = event.data.tutorialStep.nextStepDelay;

				if( nextStepDelay ) {
					window.setTimeout(function() { context.nextStep(); }, nextStepDelay);
				} else {
					context.nextStep();
				}

			}

		},

		onWindowResize: function(event) {
			event.data.context.stageMovedHandler();
		},

		stageMovedHandler: function() {

			if( this.tutorial ) {

				var tutorialStepEl = $('#tutorial-steps > li:eq('+ this.currentStepIndex + ')');

				if( tutorialStepEl && tutorialStepEl.is(':visible') ) {

					// Window resized while we're showing a tutorial bubble - re-render to update its position

					var tutorialStep = this.tutorial.get('steps')[this.currentStepIndex];

					if( tutorialStep ) this.showStep(tutorialStep, tutorialStepEl);

				}

			}

		}

	});

	return tutorialView;

});