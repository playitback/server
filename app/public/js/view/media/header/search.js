define('view/media/header/search', ['backbone', 'collection/show', 'collection/movie', 'backbone.autocomplete'], function(Backbone, ShowCollection, MovieCollection, AutoCompleteView) {
	
	return Backbone.View.extend({
		
		tagName: 'form',
		className: 'search',
		
		initialize: function(options) {
			this.mediaView = options && options.mediaView || null;
						
			if(this.mediaView.type == 'tvshows') {
				this.collection = new ShowCollection({ search: true });
			}
			else if(this.mediaView.type == 'movies') {
				this.collection = new MovieCollection({ search: true });
			}
			else {
				throw 'invalid_mediaView_type';
			}
		},
		
		render: function() {
			this.$el.append(
				$('<input />', { type: 'text', placeholder: 'Add ' + this.mediaView.typeTitle() + '...' })
			);
					
			$('section#content #media .header').append(this.$el);
			
			new AutoCompleteView({
				input: this.$el.find('input'),
				model: this.collection,
				onSelect: function(selected) {
					
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