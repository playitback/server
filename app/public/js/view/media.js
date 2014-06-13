define('view/media', ['backbone', 'view/media/header'], function(Backbone, HeaderView) {
	
	return Backbone.View.extend({
		
		id: 'media',
		
		initialize: function(options) {
			this.type = options && options.type || null;
		
			this.header = new HeaderView({ mediaView: this });
		},
		
		render: function() {
			$('section#content')
				.html('')
				.append(this.$el);
				
			this.header.render();
		},
		
		typeTitle: function(plural) {
			if(typeof plural == 'boolean' && plural) {
				plural = 's';
			}
			else {
				plural = '';
			}
		
			if(this.type == 'tvshows') {
				return 'TV Show' + plural;
			}
			else if(this.type == 'movies') {
				return 'Movie' + plural;
			}
		}
		
	});
	
});