module.exports = {

	getIndex: function() {
		var mediaId		= this.req.params.mediaId,
			type		= this.req.params.type,
			response 	= {},
			self		= this;
	
		if(typeof type != 'undefined') {
			if(typeof mediaId != 'undefined') {
				this.model.modelWithType(type).find(mediaId).success(function(media) {
					media.indexInfo(function(media) {
						response[type] = media;
						
						self.response(response);
					});
				});
			}
			else {			
				this.model.modelWithType(type).getMediaForIndex(function(media) {
					response[type] = media;
					
					self.response(response);
				});
			}
		}
		else {
			self.errorResponse('invalid_parameters');
		}
	},
	
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
			
		this.model.sequelize.transaction(function(transaction) {
			try {
				self.model.modelWithType(type).createWithRemoteId(remoteId, function(show) {
					show.indexInfo(function(response) {
						transaction.commit();
						
						var responseObject = {};
						
						responseObject[type] = response;
					
						self.response(responseObject);
					});
				});
			}
			catch(e) {
				transaction.rollback();
				transaction.done();
				
				// Continue exception to request
				throw e;
			}
		});
	},

	getSearch: function() {	
		var query,
			self = this;
	
		if(!(query = this.input('query'))) {
			throw 'missing_required_param';
		}
		
		var type = this.input('type'),
			searchFunction;
				
		if(!type) {
			searchFunction = this.theMovieDb.searchMulti;
		}
		else {
			if(type == 'tv') {
				searchFunction = this.theMovieDb.searchTv;
			}
			else if(type == 'movie') {
				searchFunction = this.theMovieDb.searchMovie;
			}
			else {
				throw 'Invalid type specified';
			}
		}
								
		this.addSubHttpRequest(searchFunction.call(this.theMovieDb, query, function(err, remoteResults) {
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
					results.push(self.model.modelWithType(remoteResult.media_type)
						.mapWithRemoteResult(remoteResult));
																															
					if(results.length === targetSize) {
						self.response({ results: results });
					}
				}
			});
		}));
	}
	
};