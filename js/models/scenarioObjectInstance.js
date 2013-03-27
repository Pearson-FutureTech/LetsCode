/*
 * An instance of a library object. There can be any number of object instances
 * created on the stage, each with their own properties, methods and events.
*/

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'models/scenarioObject',
	'util/Parser'
], function($, _, Backbone, ScenarioObject, Parser){
	
	var ScenarioObjectInstanceModel = ScenarioObject.extend({

		/*
		 * We don't do too much here other than setting up subscriptions to global events.
		 */
		initialize: function(options){

			this.global_dispatcher.bind("state:editMode", function() {
				this.set('editable', true);
				this.trigger("change:editable");
			}, this);

			this.global_dispatcher.bind("state:previewMode", function() {
				this.set('editable', false);
				this.trigger("change:editable");
			}, this);

			this.global_dispatcher.bind("object:createMethodEventReference", function(eventAndListener, objectWithEvent) {

				if (this.get('name') == eventAndListener.listener.instance && this.collection) {
					this.createMethodEventReference(eventAndListener, objectWithEvent);
				}
			}, this);

			this.global_dispatcher.bind("object:destroyMethodReferenceToEvent", function(eventAndListener, objectWithEventName) {

				if (this.get('name') == eventAndListener.listener.instance) {
					this.destroyMethodReferenceToEvent(eventAndListener, objectWithEventName);
				}
			}, this);

			this.global_dispatcher.bind("object:destroyEventListener", function(eventAndListener, objectWithEventName) {

				if (this.get('name') == objectWithEventName) {
					this.destroyEventListener(eventAndListener);
				}
			}, this);

			this.global_dispatcher.bind("createLink:choice", function(eventObj, modelObj, methodObj) {
				if (this.get('being_linked')) {
					this.addLink(eventObj, modelObj, methodObj);
				}
			}, this);

			this.parseData();

		},

		/*
		 * Takes all of the data provided on initiation, and parses it so that we have a sane,
		 * usable instance. there are two scenarios where an object might have been created:
         *
		 *	- An instance is instantiated from setup.js
		 *  - An object has been dragged onto the stage and is cloned into an instance
		 *
		 * Ideally, we ought to sanitise this so that the interface for creating and parsing
		 * is agnostic to how it is created - the introspection for object types is perhaps a
		 * bit prescriptive.
		 */
		parseData: function() {

			if(this.get('instance_obj')) {

				// Set some convenience vars
				var instance_obj_name = this.get('instance_obj').object;
				var instance_obj_props = this.get('instance_obj').properties;
				var instance_obj_events = this.get('instance_obj').events;

				// Find which object to derive from
				var scenario_objects = this.collection.parent.scenarioObjects;
				var scenario_obj = scenario_objects.find(function(obj) {
					return obj.get('name') == instance_obj_name;
				});
				// Set the instance's name
				this.set('name', this.get('instance_obj').name);
				this.set('object', instance_obj_name);

				// XXX Really hacky, resource-intensive way around deep copying :(
				var nodes = Parser.get_nodes(this.collection.parent.get('object_data'), 'object');
				this.set('ast', nodes[1][scenario_obj.get('node_index')]);
				this.set('code', Parser.gen_code(this.get('ast'), {beautify: true}));

				this.set('properties', this.getPropertiesAsObject());
				this.set('privateProperties', this.getPrivatePropertiesAsObject());
				this.set('initialisers', this.getInitialisers());
				this.set('methods', this.getMethods());
				this.set('events', this.getEvents());

				// Override any object defaults with those of this instance
				_.each(instance_obj_props, function(value, key) {
					this.get('properties')[key].value = value;
				}, this);

				_.each(instance_obj_events, function(value, key) {
					this.get('events')[value.name] = value;
				}, this);

				// Unset this, else DB saves won't work
				this.unset('instance_obj');

			} else if (this.get('scenario_obj')) {

				// If being duplicated from the object library...

				var scenarioObj = this.get('scenario_obj');

				var instancesOfThisType = _.filter(this.collection.parent.scenarioObjectInstances.models, function(objIns) {
					return objIns.get('object') == scenarioObj.get('name');
				});

				// Give it a unique name
				this.set('name', scenarioObj.get('name') + (instancesOfThisType.length + 1));

				// Clone the arrays by stringifying and parsing, so we don't update object class
				this.set('properties', JSON.parse(JSON.stringify(scenarioObj.get('properties'))));
				this.set('privateProperties', JSON.parse(JSON.stringify(scenarioObj.get('privateProperties'))));
				this.set('methods', JSON.parse(JSON.stringify(scenarioObj.get('methods'))));
				this.set('events', JSON.parse(JSON.stringify(scenarioObj.get('events'))));

				this.set('initialisers', _.clone(scenarioObj.get('initialisers')));

				this.set('ast', scenarioObj.get('ast'));
				this.set('code', scenarioObj.get('code'));
				this.set('object', scenarioObj.get('name'));

				// Unset this, else DB saves won't work
				this.unset('scenario_obj');

			}

		},

		/*
		 * Create references to events linked to methods of this instance. Kind of a
		 * reverse lookup. Rather than setting anything here, we trigger an event, then
		 * let the specific object instance create the link itself - much cleaner.
		 */
		linkEvents: function() {
			_.each(this.get('events'), function(event) {
				_.each(event.listeners, function(listener) {
					this.global_dispatcher.trigger('object:createMethodEventReference',
						{event: event, listener: listener}, this);
				}, this);
			}, this);
		},

		/*
		 * Unlink all the methods and events for this object.
		 * Remove references from other objects' methods to our events,
		 * and remove our event links to other methods.
		 */
		unlinkEvents: function() {

			// Remove references of other objects' methods to our events
			_.each(this.get('events'), function(event) {

				_.each(event.listeners, function(listener) {
					this.global_dispatcher.trigger('object:destroyMethodReferenceToEvent',
						{event: event, listener: listener}, this.get('name'));
				}, this);
			}, this);

			// Also need to remove event listeners on other objects that point to methods of this now-removed object
			_.each(this.get('methods'), function(method) {

				_.each(method.references, function(reference) {

					this.global_dispatcher.trigger('object:destroyEventListener',
						{event: reference.event, listener: reference.listener}, reference.objectWithEventName);

				}, this);

			}, this);

		},

		/*
		 * Adds a reverese lookup link for an event, by extending the method object in
		 * the 'methods' attribute. Because a method might be referenced by any number of
		 * other instances, we store this in an array.
		 */
		createMethodEventReference: function(data, objectWithEvent) {

			var methodObj = _.find(this.get('methods'), function(obj, key) {
				return data.listener.method == key;
			});

			if( methodObj ) {

				if(!_.has(methodObj, 'references')) {
					methodObj.references = [];
				}

				methodObj.references.push({
					event: data.event.name,
					listener: {
						instance: this.get('name'),
						method: data.listener.method
					},
					objectWithEventName: objectWithEvent.get('name')
				});

			}
		},

		/*
		 * Remove references from our methods to the given event.
		 * If we delete a reference, then we need to rebuild the references.
		 */
		destroyMethodReferenceToEvent: function(eventAndListener, objectWithEventName) {

			var linkedMethodObj = _.find(this.get('methods'), function(method) {
				return eventAndListener.listener.method == method.name;
			});

			if( linkedMethodObj ) {

				var new_references = _.reject(linkedMethodObj.references, function(reference) {
					return reference.event == eventAndListener.event.name &&
						reference.objectWithEventName == objectWithEventName;
				});

				linkedMethodObj.references = new_references;

			}
			
		},

		/*
		 * Remove event listener from our event
		 */
		destroyEventListener: function(eventAndListener) {

			var event = this.get('events')[eventAndListener.event];

			for( var i=0; i < event.listeners.length; i++ ) {

				if( event.listeners[i].instance == eventAndListener.listener.instance &&
					event.listeners[i].method == eventAndListener.listener.method ) {

					// It's bi-directional - need to also delete reference from the linked object method to this event
					this.global_dispatcher.trigger('object:destroyMethodReferenceToEvent',
						{event: event, listener: eventAndListener.listener}, this.get('name'));

					event.listeners.splice(i, 1);
					i--;
				}
			}

		},

		/*
		 * Add a new link to a method from an event - usually done on the stage.
		 */
		addLink: function(eventObj, modelObj, methodObj) {

			var event = _.find(this.get('events'), function(event) {
				return event.name == eventObj.name;
			});

			// Avoid duplicate listeners
			var listener = _.find(event.listeners, function(listener) {
				return listener.instance == modelObj.get('name') && listener.method == methodObj.name;
			});
			if( !listener ) {

				var listener = {
					instance : modelObj.get('name'),
					method : methodObj.name
				};

				if( !event.listeners ) {
					event.listeners = [];
				}
				event.listeners.push(listener);

				this.global_dispatcher.trigger('object:createMethodEventReference', {event: event, listener: listener},
					this);
				this.set("being_linked", false);
				this.global_dispatcher.trigger('object:unfocus');

			}

		},

		/*
		 * Does what it says on the tin.
		 */
		destroy: function() {
			this.unlinkEvents();
			this.collection.remove(this);
			this.global_dispatcher.trigger('object:removed');
		}

	});

	return ScenarioObjectInstanceModel;

});