/*
 * The router is now passing a persistent Collection for use in our views. Probably
 * not the right way of handling application data between app.js and the views, but
 * it works for now...
*/

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'collections/scenarioObjects',
	'collections/scenarioObjectInstances',
	'models/scenario',
	'views/project/home/homeView',
	'views/project/home/lessonIntroView',
	'views/project/app/appView',
	'views/project/app/demoAppView'
], function(
	$,
	_,
	Backbone,
	ScenarioObjects,
	ScenarioObjectInstances,
	Scenario,
	HomeView,
	LessonIntroView,
	AppView,
	DemoAppView){

	var AppRouter = Backbone.Router.extend({

		app: null, // Stores the app instance in case we ever need it
		views: {}, // Nice & convenient way to store references to our views
		scenario: null, // Useful for storing currently active scenario
		sceObjBuffer: new ScenarioObjects(),
		sceObjInsBuffer: new ScenarioObjectInstances(),

		// XXX It's currently hard-coded that this prototype is going to use
		// the long jump scenario. If you create your own scenario, you could
		// change the ID and name here...
		scenarioId : 'longjump',
		scenarioName : 'Long Jump',

		/*
		 * Routes are set up to fire off to methods of the Router.
		 */
		routes: {
			'': 'homePage',
			'lesson/:tutorialNumber': 'lessonIntroPage',
			'scenario/:scenario': 'appPage',
			'scenario/:scenario/lesson/:tutorialNumber': 'appPage',
			'published': 'publishedAppDemo',
			'published/:appName': 'publishedAppDemo'
		},
		
		/*
		 * Fetches initial data, sets up event handlers and initialises the main views.
		 */
		initialize: function() {

			console.log('Router initialize');

			this.createTopLevelViews();

		},

		initializeScenario: function(callback) {

			this.loadScenario(this.scenarioId, callback);

		},

		createTopLevelViews: function() {

			this.views.homeView = new HomeView();
			this.views.lessonIntroView = new LessonIntroView();
			this.views.appView = new AppView();
			this.views.demoAppView = new DemoAppView();

		},

		homePage: function() {

			var self = this;

			// XXX Currently resets the scenario data each time you go back to
			// the homepage - it should probably do this only after you complete
			// a tutorial...

			this.initializeScenario(function() {
				self.views.homeView.render();
			});

		},

		lessonIntroPage: function(tutorialNumber) {

			var tutorialNumInt = parseInt(tutorialNumber) - 1;

			this.views.lessonIntroView.model = {tutorialNumber: tutorialNumInt};

			if( this.scenario == null ) {

				var self = this;
				this.initializeScenario(function() {
					self.views.lessonIntroView.render();
				});

			} else {
				this.views.lessonIntroView.render();
			}

		},

		appPage: function(scenarioId, tutorialNumber) {

			// XXX Should use the given scenarioId...

			var tutorialNumInt = tutorialNumber? parseInt(tutorialNumber) - 1 : -1;

			if( this.scenario == null ) {

				var self = this;
				this.initializeScenario(function() {
					self.views.appView.model.set({tutorialNumber: tutorialNumInt});
					self.views.appView.render();
				});

			} else {
				this.views.appView.model.set({tutorialNumber: tutorialNumInt});
				this.views.appView.render();
			}

		},

		publishedAppDemo: function(appName) {

			// Default published app (there's also 'mysuperapp')
			if( !appName ) appName = 'myapp';

			console.log('Demo app: ', appName);

			this.demoApp = appName;

			if( this.scenario == null ) {

				var self = this;
				this.initializeScenario(function() {
					self.views.demoAppView.render();
				});
			}

			this.views.demoAppView.render();
		},

		/*
		 * Loads a template scenario from the filesystem. Does AJAX requests
		 * for all dependencies, then calls the callback when they're all done.
		 */
		loadScenario: function(scenarioId, callback) {

			var pathStart = 'content/scenarios/' + scenarioId;

			// First, load in the stylesheet if it hasn't been loaded already
			if( $('#scenarioCss').length < 1 ) {
				var $scenarioCssLink = $('<link>');
				$scenarioCssLink.attr({
					id: 'scenarioCss',
					type: 'text/css',
					rel: 'stylesheet',
					href: pathStart + '/css/' + scenarioId + '.css'
				});
				$('head').append( $scenarioCssLink );
			}

			var self = this;

			$.when(
				$.ajax({url: pathStart + '/objects.js', dataType: 'text'}),
				$.ajax({url: pathStart + '/setup.js', dataType: 'text'}),
				$.ajax({url: pathStart + '/tutorials.js', dataType: 'text'}),
				(this.demoApp ?
					$.ajax({url: pathStart + '/demo-'+this.demoApp+'.js', dataType: 'text' }) :
					function() {$.Deferred().resolve(null);}
				)

			).done(function(objs, setup, tutorials, demoAppSetup) {

				// The Scenario deals with object-wrangling itself.
				self.scenario = new Scenario({
					name: scenarioId,
					object_data: objs[0],
					setup_data: setup[0],
					tutorial_data: tutorials[0],
					demo_app_setup_data: demoAppSetup ? demoAppSetup[0] : null,
					asset_path: 'content/scenarios/'+scenarioId+'/assets/'
				});

				self.views.appView.model = self.scenario;

				if( callback != undefined ) {
					callback();
				}

			});

		}

	});

	return AppRouter;

});