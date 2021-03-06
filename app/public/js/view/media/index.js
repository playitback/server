define('view/media/index', [
	'view/abstract/root', 'collection/show', 'collection/movie',
	'view/media/item', 'const/index', 'view/media/dialog/search'], 
	function(RootView, ShowCollection, MovieCollection, ItemView, Const,
	SearchDialog) {
	
	return RootView.extend({
		
		id: 'media',
		fetched: false,
		
		initialize: function(options) {
			this.type 					= options && options.type || null;

			this.fetched				= false;
		
			this.collection 			= this.collection();
		},
		
		render: function() {
			$('div#content')
				.html('')
				.append(this.$el);
				
			window.setCurrentSection(this.type);

			this.$el
				.attr('class', this.type)
				.append(
					$('<div></div>', { 'class': 'row controls' })
						.append(
							$('<div></div>', { 'class': 'col-md-10 left filter' })
						)
						.append(
							$('<div></div>', { 'class': 'col-md-2 right' })
								.append(
									$('<a></a>', { 'class': 'add button' })
								)
						)
				)
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
				.off('add', this.mediaAdded, this)
				.on('add', this.mediaAdded, this);
				
			this.collection
				.off('remove', this.mediaRemoved, this)
				.on('remove', this.mediaRemoved, this);
				
			this.$el.find('.controls a.add').click($.proxy(this.addMediaClicked, this));
		},
		
		fetchMedia: function() {
			var self = this;
					
			this.collection.fetch({
				success: function() {
					self.fetched = true;

					self.showNoMedia();
				}
			});
		},
		
		showNoMedia: function() {
			this.$el.find('.no-items').toggle(this.collection.length == 0 && this.fetched);
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
			media.itemView.off('click').on('click', function() {
				var type = this.model.type || 'tv';

				window.location = '/#media/' + type + '/' + this.model.get('id');
			});
		},
		
		mediaRemoved: function(media) {
			if(typeof media.itemView != 'undefined') {
				media.itemView.remove();
			}
		},
		
		addMediaClicked: function() {
			new SearchDialog({ type: this.type, mediaView: this }).show();
		}
		
	});
	
});