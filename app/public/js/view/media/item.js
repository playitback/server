define('view/media/item', ['backbone', 'jquery.unveil', 'spinner'], function(Backbone, jqUnveil, Spinner) {
	
	return Backbone.View.extend({
		
		tagName: 'div',
		className: 'item col-md-2 col-sm-3 col-xs-6',
		
		inititialize: function() {
			this.bindedModelSync 		= this.modelSync.bind(this);
			this.bindedModelRequest 	= this.modelRequest.bind(this);
		},
		
		render: function() {
			this.$el.append(
				$('<div></div>', { 'class': 'poster' })
			)
			.append(
				$('<div></div>', { 'class': 'overlay' })
					.append(
						$('<i></i>', { 'class': 'status' })
					)
			)
			.append(
				$('<div></div>', { 'class': 'attr' })
					.append(
						$('<label></label>')
					)
					.append(
						$('<span></span>')
					)
			)
			.append(
				$('<div></div>', { 'class': 'progress-overlay' })
					.append(
						$('<div></div>', { 'class': 'spinner' })
					)
			);
		
			$('div#content #media .row.items').append(this.$el);
			
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

			this.loadPoster();

			this.$el.off('click').click(function() {
				var type = self.model.get('type') || 'tv';
				window.location = '/#media/' + type + '/' + self.model.get('id');
			});
			
			this.$el.find('.overlay .status')
				.attr('class', 'status') // reset
				.addClass(this.model.watchedStatusClassName())
				.text(this.model.unWatchedCount());
			
			this.$el.find('.attr label').text(this.model.get('title'));
			this.$el.find('.attr span').text(this.model.year());
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