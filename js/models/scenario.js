/*
 * A Scenario is part of a Project collection.
 */

define([
	'Underscore',
	'Backbone',
	'collections/scenarioObjects',
	'collections/scenarioObjectInstances',
	'collections/tutorial',
	'util/Parser'

], function(_, Backbone, ScenarioObjectCollection, ScenarioObjectInstanceCollection, TutorialCollection, Parser){

	var ScenarioModel = Backbone.Model.extend({

		storeName: 'scenarios',

		initialize: function() {
			/*
			If this is a scenario loaded from a template, we have to do additional parsing
			and processing of objects, events etc. Probably be a much nicer way to do this
			with more time.
			*/
			if(this.isNew()) {
				this.scenarioObjects = new ScenarioObjectCollection();
				this.scenarioObjectInstances = new ScenarioObjectInstanceCollection();
				this.tutorials = new TutorialCollection();
				this.parseObjects();
				this.linkEvents();
				this.loaded = true;
			}

		},

		/*
		Creates app objects from those defined in objects.js, then create instances
		of them as defined in setup.js
		*/
		parseObjects: function() {

			this.scenarioObjectInstances.on('add', function(ins) {

				ins.parse();

				// After initial load, adding new objects to the stage (by the user) should trigger an event...
				if( this.loaded ) {
					this.global_dispatcher.trigger('object:added', ins);
				}
			}, this);

			// Creates an AST
			var nodes = Parser.get_nodes(this.get('object_data'), 'object');

			// Create ScenarioObjects - they build themselves introspectively
			_.each(nodes[1], function(node, index) {
				this.scenarioObjects.add({
					'node_index': index,
					'name': node[1][0][0],
					'ast': node
				});
			}, this);

			// Parse the setup JSON
			var setup_obj = JSON.parse(this.get('setup_data'));

			// We need this to be set so that the scenario can be referenced from
			// the collection as a property when doing introspection. Setting directly
			// on the object causes mayhem with data in the DB.
			this.scenarioObjectInstances.parent = this;

			this.demoAppSetupData = this.get('demo_app_setup_data');

			// Create ScenarioObjectInstances. These work out their object derivatives
			// introspectively.
			_.each(setup_obj, function(instance_obj) {
				this.scenarioObjectInstances.add({
					'instance_obj': instance_obj,
					'editable': !this.demoAppSetupData
				});
			}, this);

			if( this.demoAppSetupData ) {

				var demo_app_setup_obj = JSON.parse(this.demoAppSetupData);

				_.each(demo_app_setup_obj, function(instance_obj) {
					this.scenarioObjectInstances.add({
						'instance_obj': instance_obj,
						'editable': false
					});
				}, this);

			}

			this.scenarioObjectInstances.each(function(instance_obj) {
				instance_obj.parseData();
			}, this);

			var tutorial_obj = JSON.parse(this.get('tutorial_data'));

			_.each(tutorial_obj, function(instance_obj) {
				this.tutorials.add(instance_obj);
			}, this);

		},

		/*
		Create reverse-lookup links for events. This needs to happen once all
		object instances have been created, else not all references will exist yet
		*/
		linkEvents: function() {
			this.scenarioObjectInstances.each(function(scenarioIns) {
				scenarioIns.linkEvents();
			}, this);
		}
		
	});
	
	return ScenarioModel;
	
});