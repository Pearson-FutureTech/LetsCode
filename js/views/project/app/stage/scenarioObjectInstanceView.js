/*
 * These are representations of instances of library objects which appear on the stage.
 * They can have an `edit` or `preview` state.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/project/app/stage/scenarioObjectInstanceEditView',
	'jQueryUI',
	'sprite'
], function($, _, Backbone, ScenarioObjectInstanceEditView, sprite){

	var ScenarioObjectInstanceView = Backbone.View.extend({

		initialize: function(options){

			this.attachObjectCode();

			// If a custom event has been dispatched, then we use this subscriber to catch it.
			this.global_dispatcher.bind('object:onCustomEvent', function(data) {

				var listener = data[0];
				var event = data[1];
				var params = data[2];

				if (this.model.get('name') == listener.instance) {
					this.$el[listener.method](event, params);
				}
			}, this);

			// If object is updated, e.g. through visual property editor, then we need to re-attach the code
			this.global_dispatcher.bind('object:updated', function(obj) {
				if( obj == this.model ) {
					this.attachObjectCode();
					if( this.isSprite ) {
						this.setupSprite();
					} else {
						this.setupFromTemplate();
					}
				}
			}, this);

			// If object is selected from the Object Selector
			this.global_dispatcher.bind("object:onSelect", function(obj) {
				if (this.model.get('name') == obj.get('name')) {
					this.highlight(true);
				} else {
					this.highlight(false);
				}
			}, this);

			this.model.on('change:editable', this.refresh, this);

			this.model.on('remove', this.destroy, this);

			// There are two types of object instance:
			// Sprite.js sprites - these are rendered onto the Sprite.js Scene and they need to be set up here
			// Normal DOM elements - they are created using the defined _template, or simply default to a div element

			var properties = this.model.get('properties');
			var privateProperties = this.model.get('privateProperties');

			this.isSprite = privateProperties['_isSprite'] && privateProperties['_isSprite'].value;

			if( this.isSprite ) {

				// This object represents a Sprite.js sprite
				// Set up Sprite and assign relevant properties to it

				var sprite = options.spriteScene.Sprite( privateProperties['_spriteImage'].value );

				$(sprite.dom).append('<div class="sprite"></div>');

				this.setElement( sprite.dom );

				this.$el.sprite = sprite;
				this.$el.scene = options.spriteScene;

				// Now we've changed this.$el, we need to re-attach the properties and methods
				this.attachObjectCode();

				this.setupSprite();


			} else {

				// Not a Sprite - a normal HTML element / template

				var baseEl = $('<div class="sprite"></div>');

				this.$el.html(baseEl);

				this.setupFromTemplate();

			}

			// Set up Edit view

			this.$el.append("<div class='edit' />");

			this.editView = new ScenarioObjectInstanceEditView({
				model: this.model,
				el: this.$el.find('div.edit')
			});

		},

		/*
		 * Attaching methods and properties to the DOM element; our sprite.
		 * Really need something here to stop overrides, but we need to make
		 * sure the properties are native to $el
		 */
		attachObjectCode: function() {

			var methods = this.model.get('methods');
			var initialisers = this.model.get('initialisers');
			var properties = this.model.get('properties');
			var privateProperties = this.model.get('privateProperties');

			_.each(methods, function(prop, key) {
				this.$el[key] = eval(prop.code);
			}, this);

			_.each(initialisers, function(prop, key) {
				this.$el[key] = eval(prop.code);
			}, this);

			_.each(properties, function(prop, key) {
				this.$el[key] = prop.value;
			}, this);

			_.each(privateProperties, function(prop, key) {
				this.$el[key] = prop.value;
			}, this);

		},

		setupSprite: function() {

			var properties = this.model.get('properties');
			var privateProperties = this.model.get('privateProperties');

			if( privateProperties['width'] ) this.$el.sprite.setW( privateProperties['width'].value );
			if( privateProperties['height'] ) this.$el.sprite.setH( privateProperties['height'].value );
			if( properties['left'] ) this.$el.sprite.setX( parseFloat(properties['left'].value) );
			if( properties['top'] ) this.$el.sprite.setY( parseFloat(properties['top'].value) );
			if( properties['friction'] ) this.$el.sprite.friction = properties['friction'].value / 100;

			this.$el.sprite.update();

			// Add sprite to any defined sprite cycles
			if( this.$el['_spriteCycles'] ) {

				for( var i=0; i < this.$el['_spriteCycles'].length; i++ ) {
					var cycleName = this.$el['_spriteCycles'][i][1];
					this.$el[cycleName].addSprite(this.$el.sprite);
					this.$el[cycleName].addSprite(this.$el.sprite);
				}

			}

			// Reset to first sprite
			this.$el.sprite.offset(0,0).update();

		},

		setupFromTemplate: function() {

			var properties = this.model.get('properties');
			var privateProperties = this.model.get('privateProperties');

			$('.sprite', this.$el).empty();

			// Look for a template (it should be private if we have one at all)
			var template = privateProperties['_template'];
			if( template ) {

				// We have an HTML template defined for this object

				var propKeyVals = {};
				for( var propKey in properties ) {
					propKeyVals[propKey] = properties[propKey].value;
				}
				for( var propKey in privateProperties ) {
					propKeyVals[propKey] = privateProperties[propKey].value;
				}

				var template_el = _.template( template.value, propKeyVals );
				$('.sprite', this.$el).append(template_el);

			}

		},

		// If a custom event has been fired, we publish it here and let the relevant
		// view deal with it.
		handleEventLink: function(event, params) {

			for( var index in event.data.obj_event.listeners ) {

				var listener = event.data.obj_event.listeners[index];
				event.data.context.global_dispatcher.trigger('object:onCustomEvent', [listener, event, params]);

			}
		},


		
		// Publish an event whenever an instance is clicked; let the subscriber
		// deal with the state change globally.
		selectObject: function() {
			this.global_dispatcher.trigger('object:onClick', this.model);
		},

		// It seems that this needs to be here, even though it's empty...?
		dragStart: function(event, ui) {
		},

		dragStop: function(event, ui) {

			var self = event.data.context;

			// Update properties
			self.model.get('properties').left.value = ui.position.left;
			self.model.get('properties').top.value = ui.position.top;

			if( self.isSprite ) {
				// Update sprite
				self.$el.sprite.setX( ui.position.left );
				self.$el.sprite.setY( ui.position.top );
			}

			event.data.context.global_dispatcher.trigger('object:updated', event.data.context.model);
		},

		/*
		 * Not doing much here at the moment, but we might want to do some default rendering.
		 */
		render: function(){
			return this;
		},

		/*
		 * Ideally we should refactor this view, so that we have separate views for editable
		 * and non-editable objects. This'll do for now though.
		 */
		refresh: function() {

			if( !this.isSprite ) {

				// We can assume that any properties which are not recognised by .css()
				// will fail silently.
				_.each(this.model.get('properties'), function(prop, key) {
					this.$el.css(key, prop.value);
					this.$el.css(key, prop.value + "px"); // Ugh!
				}, this);

				_.each(this.model.get('privateProperties'), function(prop, key) {
					this.$el.css(key, prop.value);
					this.$el.css(key, prop.value + "px"); // Ugh!
				}, this);

			}

			// For safety, unbind and destroy any events or draggables which might
			// end up being referenced twice by accident.

			this.$el.unbind('createLink:selected object:onClick click dragstart drag dragstop hover');
			this.$el.draggable('destroy'); // 'disable' won't cut it here because we kill all event bindings

			// Unbind events - we'll re-bind them below...
			_.each(this.model.get("events"), function(obj_event, key){
				this.$el.unbind(key);
			}, this);

			if (this.model.get("editable")) {

				this.$el.bind('click', {context: this}, function(event) {
					event.data.context.selectObject();
				});

				// Whenever any of the instances are clicked, we need to change focus
				// Bit of a crappy way of doing this at the moment.
				this.global_dispatcher.bind("object:onClick", function(obj) {
					if (this.model === obj) {
						this.highlight(true);
					} else {
						this.highlight(false);
					}
				}, this);

				// Un-highlight (remove edit panels)
				this.global_dispatcher.bind('object:unfocus', function(obj) {
					this.highlight(false);
				}, this);

				this.global_dispatcher.bind("createLink:choose", function(modelObj, eventObj) {

					if(modelObj === this.model) {
						this.model.set('being_linked', true);
					}

					this.chooseMethod(eventObj);
				}, this);

				// Make the instance draggable, and set up event handlers
				// XXX Hacky! Prevent Stage from being dragged

				if( this.model.get('ast')[1][0][0] !== 'Stage' ) {
					this.$el.draggable({cancel: false});
					this.$el.bind('dragstart', {context: this}, this.dragStart);
					this.$el.bind('dragstop', {context: this}, this.dragStop);
				}

			}

			// For each custom event defined for the object instance, we set up
			// an event handler which binds back to this view, then gets dispatched
			// This is likely to be abstracted out a bit more so that events can be
			// added/removed on-the-fly

			_.each(this.model.get("events"), function(obj_event){
				// Ignore click and hover events in Edit mode
				if( !this.model.get('editable') || (obj_event.name !== 'click' && obj_event.name !== 'hover') ) {
					this.$el.bind(obj_event.name, {context: this, obj_event: obj_event}, this.handleEventLink);
				}
			}, this);

			// User customised name (ID of object instance)
			this.$el.attr( 'data-name', this.model.get('name') );

			// 'Class' name, e.g. Athlete (ID of object, not instance)
			var objectName = this.model.get('ast')[1][0][0];
			if( objectName ) this.$el.attr( 'data-object', objectName );

		},

		highlight: function(show) {

			var objectClass = this.model.attributes.ast[1][0][0];

			if( show ) {

				// XXX Hacky - objects are clickable except for the Stage
				if( !this.selected && objectClass !== 'Stage' ) {
					this.selected = true;
					this.editView.render();
				}
			} else {
				this.selected = false;
				this.editView.destroy();
			}
		},

		chooseMethod: function(eventObj) {
			this.editView.chooseMethod(eventObj);
		},

		destroy: function() {
			this.remove();
		}
				
	});
	
	return ScenarioObjectInstanceView;
	
});