define('view/media/item', ['backbone', 'jquery.unveil'], function(Backbone, jqUnveil) {
	
	return Backbone.View.extend({
		
		tagName: 'div',
		className: 'item col-md-2 col-sm-3 col-xs-4',
		
		inititialize: function() {
			var self = this;
			
			this.bindedModelSync = this.modelSync.bind(this);
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
			);
		
			$('section#content #media .row.items').append(this.$el);
			
			this.updateUI();
			this.createEvents();
		},
		
		createEvents: function() {
			this.model
				.off('sync', this.modelSync)
				.on('sync', this.modelSync);
		},
		
		modelSync: function() {
			this.itemView.updateUI();
		},
		
		updateUI: function() {
			if(this.model.has('poster')) {
				this.$el.find('.poster').css('background-image', 'url(' + this.model.get('poster').url + ')');
			}
			
			this.$el.find('.overlay .status')
				.attr('class', 'status') // reset
				.addClass(this.model.watchedStatusClassName())
				.text(this.model.unWatchedCount());
			
			this.$el.find('.attr label').text(this.model.get('title'));
			this.$el.find('.attr span').text(this.model.has('firstAired') ? this.model.get('firstAired').format('YYYY') : '');
		}
		
	});
	
});