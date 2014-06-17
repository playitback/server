define('view/media/item', ['backbone', 'jquery.unveil'], function(Backbone, jqUnveil) {
	
	return Backbone.View.extend({
		
		tagName: 'li',
		
		inititialize: function() {
			
		},
		
		render: function() {			
			this.$el.append(
				$('<img />', { src: '', 'data-src': this.model.get('poster').url })
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
			
			this.$el.find('img').unveil();
			this.$el.find('.attr label').text(this.model.get('title'));
			this.$el.find('.attr span').text(this.model.has('firstAired') ? this.model.get('firstAired').format('YYYY') : '');
		}
		
	});
	
});