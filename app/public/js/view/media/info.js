define('view/media/info', [
	'underscore', 'backbone', 'model/movie', 'model/show', 'model/season', 'model/media', 'view/media/item'
], function(_, Backbone, MovieModel, ShowModel, SeasonModel, MediaModel, MediaItemView) {
	
	return Backbone.View.extend({

		template: 	_.template($('script#media-info').html()),
		id:			'info',

		type: 		null,
		mediaId: 	null,
		seasonId: 	null,
		episodeId: 	null,

		initialize: function(options) {
			this.type 		= options && options.type || null;
			this.mediaId 	= options && parseInt(options.mediaId) || null;
			this.seasonId 	= options && options.seasonId || null;
			this.episodeId 	= options && options.episodeId || null;

			// Check for minimum required params. Send back to media{/type} if either missing.
			if(typeof this.type != 'string' || typeof this.mediaId != 'number') {
				window.location = '/#media' + (typeof this.type == 'string' ? '/' + this.type : '');

				return;
			}

			this.model = this.mediaModel();
		},

		render: function() {
			this.createEvents();

			this.model.fetch();

			$('#content').append(this.$el);
		},

		createEvents: function() {
			this.model
				.off('change')
				.on('change', this.updateUI, this);

			var controls = this.$el.find('.info .controls');

			controls.find('a.quality')
				.off('click')
				.on('click', this.handleQualityClick.bind(this));

			controls.find('a.refresh')
				.off('click')
				.on('click', this.handleRefreshClick.bind(this));
		},

		updateUI: function() {
			var displayAttributes = this.model.attributes;

			displayAttributes.status = function() {};
			displayAttributes.statusText = function() {};

			if (typeof this.model.__proto__.status == 'function') {
				displayAttributes.status = this.model.__proto__.status.bind(this.model);
			}
			if (typeof this.model.__proto__.unWatchedCount == 'function') {
				displayAttributes.statusText = this.model.__proto__.unWatchedCount.bind(this.model);
			}
			if (typeof displayAttributes.first_aired != 'undefined') {
				displayAttributes.availableDate = displayAttributes.first_aired;
			}

			this.$el.html('');
			this.$el.append(this.template(displayAttributes));

			this.loadPoster();
			this.createEvents();
			this.loadSeasons();
		},

		loadPoster: function() {
			var image 	= new Image(),
				self	= this;

			image.onload = function() {
				self.$el.find('.poster .img').css('background-image', 'url(' + this.src + ')');
			};

			var poster = this.model.get('poster');

			if(poster && typeof poster.url === 'string') {
				image.src = '/asset/image?url=' + encodeURIComponent(poster.url) + '&profile=info';
			}
		},

		loadSeasons: function() {
			var seasonContainer = this.$el.find('.info .seasons');

			seasonContainer.html('');

			if (this.model.has('seasons')) {
				this.model.get('seasons').forEach(function (season) {
					new MediaItemView({
						model: season,
						container: seasonContainer,
						className: 'item col-md-3 col-sm-3 col-xs-6'
					}).render();
				});
			}
		},

		mediaModel: function() {
			if(this.episodeId) {
				return new MediaModel({ id: this.episodeId, type: this.type, mediaId: this.mediaId, seasonId: this.seasonId });
			}
			else if(this.seasonId) {
				return new SeasonModel({ id: this.seasonId, type: this.type, mediaId: this.mediaId });
			}
			else {
				if(this.type == 'tv') {
					return new ShowModel({ id: this.mediaId, type: this.type });
				}
				else if(this.type == 'movie') {
					return new MovieModel({ id: this.mediaId, type: this.type });
				}
			}

			throw 'Unable to load media';
		},


		// UI Event Handlers

		handleQualityClick: function() {

		},

		handleRefreshClick: function() {
			// Re-save, will do the same as add, which updates if exists
			this.model.save();
		}

	});
	
});