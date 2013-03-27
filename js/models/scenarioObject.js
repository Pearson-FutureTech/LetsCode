
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'util/Parser'
], function($, _, Backbone, Parser){

	var ScenarioObjectModel = Backbone.Model.extend({

		/*
		 * We no longer want to be using raw AST in objects, because the custom object types play
		 * hell with DB storage and retrieval
		*/
		initialize: function() {
			// If the object hasn't has these properties set yet, then it's new and they all need doing
			if(!this.has('properties')) {
				this.set('properties', this.getPropertiesAsObject());
				this.set('privateProperties', this.getPrivatePropertiesAsObject());
				this.set('methods', this.getMethods());
				this.set('initialisers', this.getInitialisers());
				this.set('code', Parser.gen_code(this.get('ast'), {beautify: true}));
				this.set('events', this.getEvents());
			}
		},

		parse: function() {
			// Keep this here or kittens will cry.
		},
		
		/*
		 * Properties are simple user-editable properties, e.g. fooBar = 3
		 * Retrieve properties as raw AST nodes.
		 * Should be private.
		 */
		getProperties: function() {

			var nodes = Parser.find_nodes(this.get('ast'), 'assign');
			var props = [];
			$.each(nodes, function(key, node) {

				if(node[2].length == 3 && node[3].length == 2 ) {
					props.push(node);
				}
			});
			return props;
		},

		/*
		 * Private properties are the ones that shouldn't be edited by users or would be confusing to display in the UI.
		 * Currently determined as the properties that don't start with 'this.'
		 */
		getPrivateProperties: function() {

			var nodes = Parser.find_nodes(this.get('ast'), 'assign');
			var props = [];
			$.each(nodes, function(key, node) {

				if(node[2].length == 2 && node[3].length == 2 ) {
					props.push(node);
				}
			});
			return props;
		},

		/*
		 * Retrieve properties as properties of an object. A bit more usable than trying
		 * to manipulate raw AST.
		 */
		getPropertiesAsObject: function() {
			return this.getAsObject(this.getProperties());
		},

		getPrivatePropertiesAsObject: function() {
			return this.getAsObject(this.getPrivateProperties());
		},

		getAsObject: function(props) {

			var parsed_props = {};

			if( props ) {

				$.each(props, function(key, prop) {

					if (prop[0].start.comments_before.length) {
						comment = prop[0].start.comments_before[0].value;
					} else {
						comment = '';
					}

					if( prop[2].length == 3 ) {

						// Public property
						parsed_props[prop[2][2]] = {
							value: prop[3][1],
							comment: comment,
							code: Parser.gen_code(prop, {beautify: true})
						};

					} else if( prop[2].length == 2 ) {

						// Private property
						parsed_props[prop[2][1]] = {
							value: prop[3][1],
							comment: comment,
							code: Parser.gen_code(prop, {beautify: true})
						};

					}


				});
			}

			return parsed_props;

		},

		/*
		 * Does a search for a specific property and returns it's value.
		 * Can probably be deprecated.
		 */
		getAstProperty: function(name) {
			var nodes = Parser.find_nodes(this.get('ast'), 'assign');
			var prop_value = '';
			$.each(nodes, function(key, node) {
				if(node[3].length == 2 && node[2][2] == name) {
					prop_value = node[3][1];
				}
			});
			return prop_value;
		},

		/*
		 * Set a property. Storing it in the AST node makes sure that this chnage is
		 * persistent and is obeyed when refreshes happen.
		 * Can probably be deprecated.
		 */
		setAstProperty: function(prop_name, prop_value) {
			var nodes = Parser.find_nodes(this.get('ast'), 'assign');
			$.each(nodes, function(key, node) {
				if(node[3].length == 2 && node[2][2] == prop_name) {
					node[3][1] = prop_value;
				}
			});
			return prop_value;
		},


		/*
		 * 'Initialisers' (may need to revisit terminology) are when we set something up, for example:
		 * runCycle = sjs.Cycle([...])
		 * They're not user-editable like properties.
		 * Retrieve initialisers in raw AST format. Should be private.
		 */
		getAstInitialisers: function() {
			var nodes = Parser.find_nodes(this.get('ast'), 'assign');
			var initialisers = [];
			$.each(nodes, function(key, node) {
				if(node[3].length == 3) {
					initialisers.push(node);
				}
			});
			return initialisers;
		},

		// Retrieves initialisers as native JS objects.
		getInitialisers: function() {
			var initialisers = this.getAstInitialisers();
			var parsed_initialisers = {};
			$.each(initialisers, function(key, initialiser) {
				parsed_initialisers[initialiser[2][2]] = {
					code: Parser.gen_code(initialiser[3], {beautify: true}),
					name: initialiser[2][2]
				};
			});
			return parsed_initialisers;
		},

		
		/*
		 * Retrieve methods in raw AST format.
		 * Should be private.
		 */
		getAstMethods: function() {
			var nodes = Parser.find_nodes(this.get('ast'), 'assign');
			var methods = [];
			$.each(nodes, function(key, node) {
				if(node[3].length == 4) {
					methods.push(node);
				}
			});
			return methods;
		},

		// Retrieves methods as native JS objects.
		getMethods: function() {
			var methods = this.getAstMethods();
			var parsed_methods = {};
			$.each(methods, function(key, method) {
				parsed_methods[method[2][1]] = {
					code: Parser.gen_code(method[3], {beautify: true}),
					name: method[2][1],
					comment: method[0].start.comments_before[0].value
				};
			});
			return parsed_methods;
		},

		getEvents: function() {

			var parsed_events = {};

			var events = this.get('privateProperties')['_events'];

			if( events ) {
				$.each(events.value, function(key, value) {

					// XXX So ugly! Digging through the parsed node tree...
					// There must be a better way, e.g. some way to pull out the original JSON?
					parsed_events[value[1][0][1][1]] = {
						'name': value[1][0][1][1],
						'comment': value[1][1][1][1]
					};

				});

			}

			return parsed_events;
		}
		
	});
	
	return ScenarioObjectModel;
	
});