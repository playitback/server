define('view/abstract/dialog', ['view/abstract/root'], function(RootView) {
	
	return RootView.extend({
	
		id: 'dialog',
		
		initialize: function(options) {
			this.options = options || {};
		},
		
		show: function() {
			this.content = $('<div></div>', { 'class': 'content' });
		
			this.$el.append(this.content);
		
			this.render();
			
			this.$el.hide();
			$('body').append(this.$el);
			
			// Put content below viewport
			//this.content.slideDown(0);
			
			this.$el.fadeIn(30);
			//this.content.slideUp(30);
			
			this.center();
		},
		
		center: function() {
			this.content.css({
				left: (($(window).width() / 2) - (this.content.width() / 2)),
				top: (($(window).height() / 2) - (this.content.height() / 2))
			});
		},
		
		close: function() {
			this.$el.fadeOut();
		}
		
	});
	
});