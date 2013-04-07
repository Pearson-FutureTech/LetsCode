/*
 * For the method list in the edit panel and the methods shown in the details panel.
 */

define([
	'jQuery',
	'Underscore',
	'Backbone',
	'hbs!views/templates/methodDetails'
], function($, _, Backbone, MethodDetailsTemplate){

	var methodEditorView = Backbone.View.extend({

		el: "#methodlistpanel",

		visualView : true,

		showDetails: false,

		initialize: function() {

			this.global_dispatcher.bind('object:onClick object:unfocus object:onSelect', function(obj) {
				if(obj) {
					this.current_obj = obj;
					this.current_method = null;
					this.refresh();
				}
			}, this);

			this.global_dispatcher.bind('object:onMethodHover', function(object, method) {

				if( this.current_obj && this.current_obj.get('name') == object.get('name') ) {
					$('.method', this.$el).removeClass('hover');
					$('.method[data-method='+method.name+']', this.$el).addClass('hover');
				}

			}, this);

			this.global_dispatcher.bind('object:onMethodHoverOut', function() {
				$('.method', this.$el).removeClass('hover');
			}, this);

			this.global_dispatcher.bind('edit:viewVisual', function() {
				this.visualView = true;
				this.refresh();
			}, this);

			this.global_dispatcher.bind('edit:viewCode', function() {
				this.visualView = false;
				this.refresh();
			}, this);

			this.global_dispatcher.bind('edit:chooseTab', function(tabId, methodObj) {
				this.showDetails = (tabId == this.$el.data('tab'));
				this.current_method = methodObj;
				this.refresh();
			}, this);

			this.global_dispatcher.bind('edit:onMethodClick', function(methodObj) {
				this.global_dispatcher.trigger('edit:chooseTab', 'tab-methods', methodObj);
			}, this);

			// Outside of our $el (so can't use in-built events), but logically belongs here...
			$(document).on('click', '#detailspanel .methodlist a', function(event) {
				// XXX Just ignores these links for now - should show the appropriate method
				event.preventDefault();
			});

		},

		render: function(){
			this.refresh();
		},
		
		refresh: function(){

			$(this.$el).html('<ul class="method-list"></ul>');

			if( this.current_obj ) {

				_.each(this.current_obj.get('methods'), function(value, key) {
					this.addListItem(key, value);
				}, this);

				$('.method-list', this.$el).append('<li class="method add">Add New Method</li>');

			}

			$('.method', this.$el).removeClass('selected');

			if( this.showDetails ) {

				$('#detailspanel').empty();

				if( this.current_obj ) {

					$('#detailspanel').append('<p class="paneltitle"></p><div id="details-contents"></div>');

					if( this.visualView ) {

						if( this.current_method ) {
							this.showVisualMethod(this.current_method);
						} else {
							this.showVisualSummary();
						}

					} else {

						if( this.current_method ) {
							this.showCodeMethod(this.current_method);
						} else {
							this.showCodeSummary();
						}

					}

					if( !$('#detailspanel .paneltitle').html() ) {
						$('#detailspanel .paneltitle').removeClass('paneltitle-method').html(
							this.current_obj.get('name') + ' Methods');
					}

				}

			}

		},

		showVisualSummary: function() {

            var methodArray = [];
            _.each(this.current_obj.get('methods'), function(methodObj){
                methodArray.push(methodObj);
            });

            var methodDetailsEl = MethodDetailsTemplate({methods: methodArray});

			$('#details-contents').html(methodDetailsEl);

		},


		/*
		 * Prototype just shows mocked up images...
		 */
		showVisualMethod: function(methodObj) {

			$('#detailspanel .paneltitle').addClass('paneltitle-method').html(
				this.current_obj.get('name') + '.' + methodObj.name);

			$('[data-method='+methodObj.name+']', this.$el).addClass('selected');

			// 'Class' name, e.g. Athlete (ID of object, not instance)
			var objectName = this.current_obj.get('ast')[1][0][0];

			var imageName = objectName + '-' + methodObj.name + '.png';

			// Should use a template...
			$('#details-contents').html('<div class="comment">' + methodObj.comment + '</div></div><div class="method">' +
				'<img src="content/scenarios/'+ this.model.get('name') + '/assets/methods/'+imageName+'"/></div>');

		},

		showCodeSummary: function() {

			var codeEl = $('<div class="code"></div>');

			_.each(this.current_obj.get('methods'), function(methodObj) {
				codeEl.append('<p class="comment">//' + methodObj.comment + '</p><pre>' + this.formatCode(methodObj) + '</pre>');
			}, this);

			if( $('p', codeEl).length < 1 ) {
				codeEl.append('<p class="empty">This object does not have any methods defined.</p>');
			}

			$('#details-contents').html(codeEl);

		},

		showCodeMethod: function(methodObj) {

			$('#detailspanel .paneltitle').addClass('paneltitle-method').html(
				this.current_obj.get('name') + '.' + methodObj.name + '()');

			$('[data-method='+methodObj.name+']', this.$el).addClass('selected');

			var codeEl = $('<div class="code"></div>');

			codeEl.append('<p class="comment">//' + methodObj.comment + '</p><pre>' + this.formatCode(methodObj) + '</pre>');

			$('#details-contents').html(codeEl);

		},

		formatCode: function(methodObj) {

			return methodObj.code.replace(/^\(/, methodObj.name + ' = ').replace(/\)$/, '');

		},

		addListItem: function(methodName, methodObj) {

			var li = $('<li class="method" data-method="'+methodName+'">'+methodName+'</li>');

			if(_.has(methodObj, 'references')) {
				li.addClass('is-linked');
			}

			li.bind('click', {context: this}, function(event) {
				event.data.context.global_dispatcher.trigger('edit:onMethodClick', methodObj);
			});

			li.bind('hover', {context: this}, function(event) {

				var context = event.data.context;
				context.global_dispatcher.trigger('object:onMethodHover', context.current_obj, methodObj);

			});

			li.bind('mouseout', {context: this}, function(event) {
				event.data.context.global_dispatcher.trigger('object:onMethodHoverOut');
			});

			$(this.$el).find("ul").append(li);

		}
		
	});
	
	return methodEditorView;
	
});