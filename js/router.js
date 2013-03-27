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
	AppView,
	DemoAppView){

	var AppRouter = Backbone.Router.extend({
		
		app: null, // Stores the app instance in case we ever need it
		views: {}, // Nice & convenient way to store references to our views
		scenario: null, // Useful for storing currently active scenario
		sceObjBuffer: new ScenarioObjects(),
		sceObjInsBuffer: new ScenarioObjectInstances(),

		/*
		 * Routes are set up to fire off to methods of the Router.
		 */
		routes: {
			'published/:appname': 'launchDemoApp',
			'published': 'launchDemoApp',
			'': 'defaultAction'
		},
		
		/*
		 * Fetches initial data, sets up event handlers and initialises the main views.
		 */
		initialize: function() {

			this.global_dispatcher.bind('scenario:reset', function() {
				this.loadScenarioTemplate('longjump');
			}, this);

		},

		createTopLevelViews: function() {

			this.views.appView = new AppView();

			if( this.demoApp ) {
				this.views.demoAppView = new DemoAppView();
			} else {
				this.views.homeView = new HomeView();
			}

		},

		defaultAction: function() {

			this.createTopLevelViews();

			// NB. It's currently hard-coded that this prototype is going to use
			// the long jump scenario. If you create your own scenario, you could
			// change 'longjump' to your own scenario ID here to make it the default.

			this.loadScenarioTemplate('longjump');
		},

		launchDemoApp: function(appName) {

			// Default published app
			if( !appName ) appName = 'myapp';

			console.log('Demo app: ', appName);

			this.demoApp = appName;

			this.defaultAction();
		},

		/*
		 * Loads a template scenario from the filesystem. Does an aysnc Ajax request for all dependencies,
		 * then moves on to the next step ONLY when they're all done.
		 */
		loadScenarioTemplate: function(scenario_name) {

			var self = this;

			var pathStart = 'content/scenarios/' + scenario_name;

			// First, load in the stylesheet if it hasn't been loaded already
			if( $('#scenarioCss').length < 1 ) {
				var $scenarioCssLink = $('<link>');
				$scenarioCssLink.attr({
					id: 'scenarioCss',
					type: 'text/css',
					rel: 'stylesheet',
					href: pathStart + '/css/' + scenario_name + '.css'
				});
				$('head').append( $scenarioCssLink );
			}

			// Load in the scenario data
			if( this.demoApp ) {

				// For demo purposes, loads in the demo setup config too
				$.when(
					$.ajax({url: pathStart + '/objects.js', dataType: 'text'}),
					$.ajax({url: pathStart + '/setup.js', dataType: 'text'}),
					$.ajax({url: pathStart + '/tutorials.js', dataType: 'text'}),
					$.ajax({url: pathStart + '/demo-'+this.demoApp+'.js', dataType: 'text' })

				).done(
					function(objs, setup, tutorials, demoAppSetup) {
						self.onScenarioTemplateLoaded(scenario_name, objs, setup, tutorials, demoAppSetup);
					}
				);


			} else {

				// Normal scenario load
				$.when(
					$.ajax({url: pathStart + '/objects.js', dataType: 'text'}),
					$.ajax({url: pathStart + '/setup.js', dataType: 'text'}),
					$.ajax({url: pathStart + '/tutorials.js', dataType: 'text'})

				).done(
					function(objs, setup, tutorials) {
						self.onScenarioTemplateLoaded(scenario_name, objs, setup, tutorials);
					}
				);

			}


		},

		/*
		 * This gets called once all scenario dependencies have been loaded by
		 * this.loadScenario(). Adds data to the app, then renders views.
		 */
		onScenarioTemplateLoaded: function(scenarioName, objs, setup, tutorials, demoAppSetup){

			// The Scenario deals with object-wrangling itself.
			this.scenario = new Scenario({
				name: scenarioName,
				object_data: objs[0],
				setup_data: setup[0],
				tutorial_data: tutorials[0],
				demo_app_setup_data: demoAppSetup ? demoAppSetup[0] : null,
				asset_path: 'content/scenarios/'+scenarioName+'/assets/'
			});

			this.loadScenarioFinish();

		},

		/*
		 * Once the data's been loaded, render the top-level view
		 * (which will call render() on its sub-views).
		 */
		loadScenarioFinish: function() {

			this.views.appView.model = this.scenario;
			this.views.appView.render();

			if( this.demoApp ) {

				this.views.demoAppView.render();

			} else {

				this.views.homeView.model = this.scenario;
				this.views.homeView.render();

			}

		}

	});

	/*
	 * Creates a singleton of the AppRouter and stores a reference to the app
	 * in case we need it.
	 */
	var initialize = function(options) {
		var appRouter = new AppRouter();
		appRouter.app = options.app;
	};
	
	/*
	 * AppRouter doesn't get instantiated directly, instead we expose this
	 * helper method.
	 */
	return {
		initialize: initialize
	};

});