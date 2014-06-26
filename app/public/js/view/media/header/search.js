define('view/media/header/search', ['backbone', 'collection/search', 'backbone.autocomplete'], function(Backbone, SearchCollection, AutoCompleteView) {
	
	return Backbone.View.extend({
		
		tagName: 'form',
		className: 'search',
		
		initialize: function(options) {
			this.mediaView = options && options.mediaView || null;
						
			this.collection = new SearchCollection();
		},
		
		render: function() {
			var self = this;
		
			this.$el.append(
				$('<input />', { type: 'text', placeholder: 'Add TV Show\'s & Movies...' })
			);
					
			$('#media .row .header').append(this.$el);
			
			new AutoCompleteView({
				input: this.$el.find('input'),
				model: this.collection,
				onSelect: function(selected) {
					self.$el.find('input').val('');
					
					self.mediaView.addMedia(selected);
				},
				onShow: function() {
					$('section#content #media .header').addClass('search-visible');
				},
				onHide: function() {
					$('section#content #media .header').removeClass('search-visible');
				}
			}).render();
		}
		
	});
	
});