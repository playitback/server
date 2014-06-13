define('view/media/header/search', ['backbone'], function(Backbone) {
	
	return Backbone.View.extend({
		
		tagName: 'form',
		className: 'search',
		
		initialize: function(options) {
			this.mediaView = options && options.mediaView || null;
		},
		
		render: function() {
			this.$el.append(
				$('<input />', { type: 'text', placeholder: 'Add ' + this.mediaView.typeTitle() + '...' })
			);
					
			$('section#content #media .header').append(this.$el);
		}
		
	});
	
});