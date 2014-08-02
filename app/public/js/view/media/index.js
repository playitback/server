define('view/media/index', ['backbone', 'view/media/header', 'collection/show', 'collection/movie', 'view/media/item', 'const/index'], function(Backbone, HeaderView, ShowCollection, MovieCollection, ItemView, Const) {
	
	return Backbone.View.extend({
		
		id: 'media',
		
		initialize: function(options) {
			this.type 					= options && options.type || null;
		
			this.header 				= new HeaderView({ mediaView: this });
			this.collection 			= this.collection();
			
			this.bindedMediaAdded 		= this.mediaAdded.bind(this);
			this.bindedMediaRemoved 	= this.mediaRemoved.bind(this);
		},
		
		render: function() {
			$('section#content')
				.html('')
				.append(this.$el);
				
			window.setCurrentSection(this.type);
				
			this.header.render();
			
			this.$el
				.attr('class', this.type)
				.append(
					$('<div></div>', { 'class': 'row items' })
				)
				.append(
					$('<div></div>', { 'class': 'no-items', html: 'You have no ' + this.typeTitle(true) + '.<br />Add one by searching above.' })
				);
			
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
		
			if(this.type === Const.Type.TV) {
				return 'TV Show' + plural;
			}
			else if(this.type === Const.Type.Movie) {
				return 'Movie' + plural;
			}
		},
		
		collection: function() {
			if(this.type === Const.Type.TV) {
				return new ShowCollection();
			}
			else if(this.type === Const.Type.Movie) {
				return new MovieCollection();
			}
		},
		
		createEvents: function() {
			this.collection
				.off('add', this.bindedMediaAdded)
				.on('add', this.bindedMediaAdded);
				
			this.collection
				.off('remove', this.bindedMediaRemoved)
				.on('remove', this.bindedMediaRemoved);
		},
		
		fetchMedia: function() {
			var self = this;
					
			this.collection.fetch({
				success: function() {
					self.showNoMedia();
				}
			});
		},
		
		showNoMedia: function() {
			this.$el.find('.no-items').toggle(this.collection.length == 0);
		},
		
		addMedia: function(media) {
			this.collection.add(media);
						
			this.showNoMedia();
			
			media.itemView.createEvents();
			media.save();
		},
		
		
		// !Event Handlers
		
		mediaAdded: function(media) {
			media.itemView = new ItemView({ model: media });
			
			media.itemView.render();
		},
		
		mediaRemoved: function(media) {
			if(typeof media.itemView != 'undefined') {
				media.itemView.remove();
			}
		}
		
	});
	
});