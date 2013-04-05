/* Require.js initialisation */

require.config({

	// Shortcut aliases
	paths: {
		jQuery: 'lib/jquery/jquery-1.7.2.min',
		jQueryUI: 'lib/jquery-ui/jquery-ui-1.8.22.custom.min',
		Underscore: 'lib/underscore/underscore-1.3.3.min',
		Backbone: 'lib/backbone/backbone-0.9.2.min',
		Handlebars: 'lib/handlebars/handlebars',
		Uglify: 'lib/uglify',
		hbs: 'lib/require/hbs',
		sprite: 'lib/sprite/sprite-1.2.1.mod'
	},
	
	// We need to use shim configuration to strongarm non-AMD libraries to
	// behave like AMD, and not to pollute the global namespace.
	shim: {
		jQuery: {
			exports: '$'
		},
		Underscore: {
			exports: '_'
		},
		Backbone: {
			deps: ["Underscore", "jQuery"],
			exports: "Backbone"
		},
		Handlebars: {
			exports: 'Handlebars'
		}
	},

	// Config for Handlebars plugin.
	hbs: {
		disableI18n: true
    }

});

require([
	'jQuery',
	'Underscore',
	'Backbone',
	'app',
	'router'
], function($, _, Backbone, app, Router){

	// Extending Backbone to give every Collection, Model, View and Router a
	// global_dispatcher for easily pub/sub'ing events across the application
	// See: http://www.michikono.com/2012/01/11/adding-a-centralized-event-dispatcher-on-backbone-js/
	(function() {

		var dispatcher;

		if (this.isExtended) {
			return; // If already extended, don't do anything
		}

		dispatcher = _.extend({}, Backbone.Events, {
			cid: "dispatcher"
		});

		return _.each([
			Backbone.Collection.prototype,
			Backbone.Model.prototype,
			Backbone.View.prototype,
			Backbone.Router.prototype
		], function(proto) {
			return _.extend(proto, {
				global_dispatcher: dispatcher
			});
		});
		
	})();

	app.router = new Router();

	// Now, let's fire up the app!
	app.initialize();
	
});