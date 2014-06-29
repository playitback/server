define('view/media/item', ['backbone', 'jquery.unveil', 'spinner'], function(Backbone, jqUnveil, Spinner) {
	
	return Backbone.View.extend({
		
		tagName: 'div',
		className: 'item col-md-2 col-sm-3 col-xs-4',
		
		inititialize: function() {
			var self = this;
			
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
		
			$('section#content #media .row.items').append(this.$el);
			
			this.updateUI();
			this.createEvents();
		},
		
		createEvents: function() {
			var self = this;
		
			this.model
				.on('sync', this.modelSync.bind(this));
			
			this.model
				.on('request', this.modelRequest.bind(this));
				
			this.$el
				.off('click')
				.on('click', function() {
					self.model.dialog().render();
				});
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
			if(this.model.has('poster')) {
				this.loadPoster();
				
			}
			
			this.$el.find('.overlay .status')
				.attr('class', 'status') // reset
				.addClass(this.model.watchedStatusClassName())
				.text(this.model.unWatchedCount());
			
			this.$el.find('.attr label').text(this.model.get('title'));
			this.$el.find('.attr span').text(this.model.year());
		},
		
		loadPoster: function() {
			var image 	= new Image(),
				self	= this;
			
			image.onload = function() {
				self.$el.find('.poster').css('background-image', 'url(' + this.src + ')');
			};
			
			image.src = this.model.get('poster').url;
		}
		
	});
	
});