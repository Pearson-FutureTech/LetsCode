/*
 * Convenience methods for parsing and processing JS source
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'Uglify/lib/parse-js',
	'Uglify/lib/process'
], function($, _, Backbone, parser, processor){

	var get_node = function(code, type) {
		var ast = parser.parse(code.toString(), false, true);
		var walker = processor.ast_walker();
		var handler = {};
		handler[type] = function() {
			console.log(processor.gen_code(this, { beautify: true }));
		};
		var new_ast = walker.with_walkers(handler, function() {
			return walker.walk(ast);
		});
	};

	var get_nodes = function(code, type) {
		return walk(code, type);
	};
	
	var find_nodes = function(ast, type) {
		var nodes = [];
		var walker = processor.ast_walker();
		var handler = {};
		handler[type] = function(expr, args, value) {
			nodes.push(this);
			return value;
		};
		var new_ast = walker.with_walkers(handler, function() {
			return walker.walk(ast);
		});
		return nodes;
	};

	var walk = function(code, type) {
		var ast = parser.parse(code.toString(), false, true);
		var walker = processor.ast_walker();
		var handler = {};
		handler[type] = function() {
			var node = walker.dive(this); // walk depth first
			return node;
		};
		var new_ast = walker.with_walkers(handler, function() {
			return walker.walk(ast);
		});

		return new_ast;
	};

	return {
		get_node: get_node,
		get_nodes: get_nodes,
		find_nodes: find_nodes,
		parse: parser.parse,
		gen_code: processor.gen_code
	};
	
});