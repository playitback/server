module.exports = {

	/**
	 * GET media. Returns media from the users library.
	 *
	 * @param	mediaId		Return a specific item from the users library.
	 * @param	type		The type of media to return.
	 */
	getIndex: function() {
		var mediaId		    = this.req.params.mediaId,
			type		    = this.req.params.type,
			response 	    = {},
			self		    = this,
            modelContainer  = this.get('model');
	
		if(typeof type != 'undefined') {
			var model = modelContainer.mediaModelWithType(type);

			if(typeof mediaId != 'undefined') {
				model.find({ where: { id: mediaId }, include: model.fullInclude() }).then(function(media) {
					media.indexInfo(function(media) {
						response[type] = media;
						
						self.response(response);
					});
				});
			}
			else {
				model.getMediaForIndex(function(media) {
					response[type] = media;
					
					self.response(response);
				});
			}
		}
		else {
			self.errorResponse('invalid_parameters');
		}
	},

	/**
	 * POST media. Used when adding a new media item to the users library.
	 *
	 * @input	type		The type of media being added; tvshow or movie.
	 * @input	remoteId	The id of the media being added from the remote source.
	 */
	postIndex: function() {
		var self 		= this,
			type 		= this.req.body.type,
			remoteId 	= this.req.body.remoteId;
						
		if(typeof type != 'string') {
			throw 'invalid or missing type';
		}
		
		if(typeof remoteId != 'number') {
			throw 'invalid or missing remoteId';
		}

		this.get('model').mediaUpdateWithTypeAndRemoteId(type, remoteId, function(error, media) {
			if (error || !media) {
				self.errorResponse(error);
			}
			else {
				media.indexInfo(function (response) {
					var responseObject = {};

					responseObject[type] = response;

					self.response(responseObject);
				});
			}
		});
	},

    /**
     *
     */
	putIndex: function() {
		var self 		= this,
			type 		= this.req.params.type,
			mediaId 	= parseInt(this.req.params.mediaId);

		if(typeof type != 'string') {
			throw 'invalid or missing type';
		}

		if(typeof mediaId != 'number') {
			throw 'invalid or missing mediaId';
		}

        var model = this.get('model'),
            mediaModel = model.mediaModelWithType(type);

        mediaModel.find({ where: { id: mediaId }, include: mediaModel.indexInclude() }).then(function(media) {
			if (media) {
                model.mediaUpdateWithTypeAndRemoteId(type, media.remoteId, function(error, media) {
					if (error || !media) {
						self.errorResponse(error);
					}
					else {
						media.indexInfo(function (response) {
							var responseObject = {};

							responseObject[type] = response;

							self.response(responseObject);
						});
					}
				});
			}
			else {
				self.errorResponse(404);
			}
		});
	},

	/**
	 * Searches the remote data sources for media.
	 *
	 * @input	query	The search query to use.
	 * @input	type	The type of media to search for; tv, movie or multi (for combined search).
	 */
	getSearch: function() {	
		var query,
			self = this,
            theMovieDb = this.get('themoviedb');
	
		if(!(query = this.input('query'))) {
			throw 'missing_required_param';
		}
		
		var type = this.input('type'),
			searchFunction;
				
		if(!type) {
			searchFunction = theMovieDb.searchMulti;
		}
		else {
			if(type == 'tv') {
				searchFunction = theMovieDb.searchTv;
			}
			else if(type == 'movie') {
				searchFunction = theMovieDb.searchMovie;
			}
			else {
				throw 'Invalid type specified';
			}
		}
								
		this.addSubHttpRequest(searchFunction.call(theMovieDb, query, function(err, remoteResults) {
			var results = [];
						
			if(err) {
				self.errorResponse(err);
				
				return;
			}
			
			if(remoteResults.length === 0) {
				self.response({ results: results });
				
				return;
			}
			
			var targetSize = remoteResults.length;
		
			remoteResults.forEach(function(remoteResult, i) {
				if(typeof remoteResult.media_type == 'undefined' && type) {
					remoteResult.media_type = type;
				}
			
				if(remoteResult.media_type === 'person') {
					targetSize--;
				}
				else {
					var result = self.get('model').mediaModelWithType(remoteResult.media_type)
						.mapWithRemoteResult(remoteResult);
					result.type = type;

					results.push(result);
																															
					if(results.length === targetSize) {
						self.response({ results: results });
					}
				}
			});
		}));
	}
	
};