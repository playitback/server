define('view/media/item', ['backbone', 'jquery.unveil', 'spinner', 'moment'], function(Backbone, jqUnveil, Spinner, moment) {
	
	return Backbone.View.extend({

		template: 	_.template($('script#media-item').html()),
		tagName: 'div',
		className: 'item col-md-2 col-sm-3 col-xs-6',
		
		initialize: function(options) {
			this.container = options && options.container || $('div#content #media .row.items');
			this.bindedModelSync 		= this.modelSync.bind(this);
			this.bindedModelRequest 	= this.modelRequest.bind(this);
		},
		
		render: function() {
			this.container.append(this.$el);
			
			this.updateUI();
			this.createEvents();
		},
		
		createEvents: function() {
			this.model
				.on('sync', this.modelSync, this);
			
			this.model
				.on('request', this.modelRequest, this);
		},
		
		remove: function() {
			this.model.off('sync', null, this);
			this.model.off('request', null, this);
		},
		
		modelRequest: function() {
			this.showProgress();
		},
		
		modelSync: function() {
			this.hideProgress();
		
			this.updateUI();
		},
		
		showProgress: function() {
			this.$el.find('.progress-overlay').show();
			
			this.spinner = new Spinner({ color: '#fff' }).spin(this.$el.find('.progress-overlay')[0]);
		},
		
		hideProgress: function() {
			this.$el.find('.progress-overlay').hide();
			
			this.spinner.stop();
		},
		
		updateUI: function() {
			var self = this;

			var displayAttributes = this.model.attributes;

			if (typeof this.model.__proto__.watchedStatusClassName == 'function') {
				displayAttributes.status = this.model.__proto__.watchedStatusClassName.bind(this.model);
			}
			if (typeof this.model.__proto__.unWatchedCount == 'function') {
				displayAttributes.statusText = this.model.__proto__.unWatchedCount.bind(this.model);
			}
			displayAttributes.year = this.model.year();
			if (typeof this.model.has('number') && this.model.has('show_id')) {
				displayAttributes.title = 'Season ' + this.model.get('number');
			}

			this.$el.html('');
			this.$el.append(this.template(displayAttributes));

			this.loadPoster();

			this.$el.off('click').click(function() {
				var type = self.model.type || 'tv';
				window.location = '/#media/' + type + '/' + self.model.get('id');
			});
		},
		
		loadPoster: function() {
			if(!this.model.has('poster')) {
				return;
			}

			var image 	= new Image(),
				self	= this;
			
			image.onload = function() {
				self.$el.find('.poster').css('background-image', 'url(' + this.src + ')');
			};
			
			image.src = '/asset/image?url=' + encodeURIComponent(this.model.get('poster').url) + '&profile=grid';
		}
		
	});
	
});