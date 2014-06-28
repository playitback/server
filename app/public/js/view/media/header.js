define('view/media/header', ['backbone', 'view/media/header/search'], function(Backbone, SearchView) {
	
	return Backbone.View.extend({
		
		className: 'header',
		
		initialize: function(options) {
			this.mediaView = options && options.mediaView || null;
			
			this.search = new SearchView({ mediaView: this.mediaView });
		},
		
		render: function() {
			$('#media .row').prepend(this.$el);
			
			this.search.render();
		},
		
	});
	
});