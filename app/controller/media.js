var TheMovieDB = require('themoviedb');

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
		var self = this;
	
		if(typeof this.req.body.remoteId != 'undefined') {
			this.model.modelWithType(this.req.body.type).createWithRemoteId(this.req.body.remoteId, function(show) {
				show.getPoster().success(function(poster) {
					var response = show.values;
					
					response.poster = poster.values;
					
					self.response({ tvshow: response });
				});
			});
		}
	},

	getSearch: function() {	
		var query,
			self = this;
	
		if(!(query = this.input('query'))) {
			throw 'missing_required_param';
		}
						
		new TheMovieDB({ apiKey: 'fd8c8d9adabc2d072ef3d436396a87fb' }).searchMulti(query, function(err, remoteResults) {
			var results = [];
			
			if(err) {
				self.errorResponse(err);
				
				return;
			}
		
			remoteResults.forEach(function(remoteResult) {
				if(remoteResult.media_type === 'person') {
					remoteResults.splice(remoteResults.indexOf(remoteResult, 1));
				
					return;
				}
			
				results.push(self.model.modelWithType(remoteResult.media_type).mapWithRemoteResult(remoteResult));
								
				if(results.length === remoteResults.length) {
					self.response({ results: results });
				}
			});
		});
	}
	
};