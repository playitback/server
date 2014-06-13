define('view/home', ['backbone'], function(Backbone) {
	
	return Backbone.View.extend({
		
		id: 'home',
		
		render: function() {
			$('section#content')
				.html('')
				.append(this.$el);
		}
		
	});
	
});