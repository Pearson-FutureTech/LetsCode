/*
 * A collection of ScenarioObject models.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'models/scenarioObject'
], function($, _, Backbone, ScenarioObjectModel){
	
	var ScenarioObjectCollection = Backbone.Collection.extend({

		model: ScenarioObjectModel
		
	});

	return ScenarioObjectCollection;
	
});