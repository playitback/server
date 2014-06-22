define('view/media/dialog/media', ['backbone'], function(Backbone) {
	
	var template = $('<div></div>', { 'class': 'inner' })
		.append(
			$('<div></div>', { 'class': 'head' })
				.append(
					$('<div></div>', { 'class': 'photo' })
						.append(
							$('<img />')
						)
				)
				.append(
					$('<div></div>', { 'class': 'meta' })
						.append(
							$('<div></div>', { 'class': 'main' })
								.append(
									$('<h2></h2>')
								)
								.append(
									$('<div></div>', { 'class': 'field' })
										.append(
											$('<label></label>')
										)
										.append(
											$('<span></span>')
										)
								)
						)
						.append(
							$('<div></div>', { 'class': 'attr' })
								.append(
									$('<div></div>', { 'class': 'status' })
										.append(
											$('<span></span>', { 'class': 'watched' })
										)
										.append(
											$('<span></span>', { 'class': 'quality' })
										)
								)
								.append(
									$('<div></div>', { 'class': 'rating' })
								)
						)
				)
		);
	
	return Backbone.View.extend({
		
		id: 'media-dialog',
		
		preRender: function() {},
		postRender: function() {},
		
		render: function() {
			this.preRender();
			
			this.$el.append(template.clone());
				
			$('body').append(this.$el);
			
			this.postRender();
		}
		
	});
	
});