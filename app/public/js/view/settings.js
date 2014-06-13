define('view/settings', ['backbone'], function(Backbone) {
	
	return Backbone.View.extend({
		
		id: 'settings',
		
		render: function() {
			$('section#content')
				.html('')
				.append(this.$el);
		}
		
	});
	
});