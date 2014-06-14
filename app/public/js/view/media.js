define('view/media', ['backbone', 'view/media/header', 'collection/show', 'collection/movie'], function(Backbone, HeaderView, ShowCollection, MovieCollection) {
	
	return Backbone.View.extend({
		
		id: 'media',
		
		initialize: function(options) {
			this.type = options && options.type || null;
		
			this.header 		= new HeaderView({ mediaView: this });
			this.collection 	= this.collection();
		},
		
		render: function() {
			$('section#content')
				.html('')
				.append(this.$el);
				
			window.setCurrentSection(this.type);
				
			this.header.render();
			
			this.createEvents();
			this.fetchMedia();
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
		},
		
		collection: function() {
			if(this.type == 'tvshows') {
				return new ShowCollection();
			}
			else if(this.type == 'movies') {
				return new MovieCollection();
			}
		},
		
		createEvents: function() {
			this.bindedMediaAdded 		= this.mediaAdded.bind(this);
			this.bindedMediaRemoved 	= this.mediaRemoved.bind(this);
		},
		
		fetchMedia: funtion() {
			var self = this;
		
			this.collection.fetch({
				success: function() {
					self.showNoMedia();
				}
			});
		},
		
		showNoMedia: function() {
			this.$el.find('.no_results').toggle(this.collection.length > 0);
		},
		
		
		// !Event Handlers
		
		mediaAdded: function(media) {
			
		},
		
		mediaRemoved: function(media) {
			
		}
		
	});
	
});