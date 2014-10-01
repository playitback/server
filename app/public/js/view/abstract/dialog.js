define('view/abstract/dialog', ['view/abstract/root'], function(RootView) {
	
	return RootView.extend({
	
		id: 'dialog',
		
		show: function() {
			this.content = $('<div></div>', { 'class': 'content' });
		
			this.$el.append(this.content);
		
			this.render();
			
			this.$el.hide();
			$('body').append(this.$el);
			
			// Put content below viewport
			this.content.slideDown(0);
			
			this.$el.fadeIn(30);
			this.content.slideUp(30);
		}
		
	});
	
});