/*
 * A collection of ScenarioObjectInstance models.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'models/scenarioObjectInstance'
], function($, _, Backbone, ScenarioObjectInstanceModel){
	
	var ScenarioObjectInstanceCollection = Backbone.Collection.extend({

		model: ScenarioObjectInstanceModel
		
	});
	
	return ScenarioObjectInstanceCollection;
	
});