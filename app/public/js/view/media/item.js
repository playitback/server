define('view/media/item', ['backbone', 'jquery.unveil'], function(Backbone, jqUnveil) {
	
	return Backbone.View.extend({
		
		tagName: 'li',
		
		inititialize: function() {
			var self = this;
			
			this.bindedModelSync = this.modelSync.bind(this);
		},
		
		render: function() {
			this.$el.append(
				$('<img />')
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
		
			$('section#content #media ul.items').append(this.$el);
			
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
				this.$el.find('img').attr('data-src', this.model.get('poster').url).unveil();
			}
			
			this.$el.find('.attr label').text(this.model.get('title'));
			this.$el.find('.attr span').text(this.model.has('firstAired') ? this.model.get('firstAired').format('YYYY') : '');
		}
		
	});
	
});