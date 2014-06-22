module.exports = {

	getIndex: function() {
		var type 		= this.req.params.type,
			model 		= this.model[type === 'tvshow' ? 'Show' : 'Movie'],
			self		= this;
							
		model.findAll().success(function(medias) {
			var response 		= {},
				checkedShows 	= 0;
			
			response[type] = [];
			
			if(medias.length === 0) {
				self.response(response);
				
				return;
			}
			
			medias.forEach(function(media) {
				var _response = media.values;
				
				checkedShows++;
			
				media.getPoster().success(function(poster) {
					_response.poster = poster.values;
					
					if(type === 'movie') {
						response[type].push(_response);
											
						if(response[type].length === medias.length) {
							self.response(response);
						}
					}
					else if(type === 'tvshow') {
						_response.stats = {
							watchedCount: 0,
							episodeCount: 0
						};
						
						var statsQueryCount = 0;
						
						self.model.sequelize
							.query('SELECT COUNT(m.id) AS count FROM Seasons s JOIN Media m ON m.SeasonId = s.Id WHERE s.ShowId = \'' + media.id + '\'', null, { plain: true, raw: true })
							.success(function(rows) {
								_response.stats.episodeCount = rows.count;
								
								statsQueryCount++;
								
								if(statsQueryCount === 2) {
									response[type].push(_response);
											
									if(response[type].length === medias.length) {
										self.response(response);
									}
								}
							});
							
						self.model.sequelize
							.query('SELECT COUNT(m.id) AS count FROM Seasons s JOIN Media m ON m.SeasonId = s.Id WHERE s.ShowId = \'' + media.id + '\' AND m.watchStatus = \'' + self.model.Media.WatchStatus.Watched + '\'', null, { plain: true, raw: true })
							.success(function(rows) {
								_response.stats.watchedCount = rows.count;
								
								statsQueryCount++;
								
								if(statsQueryCount === 2) {
									response[type].push(_response);
											
									if(response[type].length === medias.length) {
										self.response(response);
									}
								}
							});
					}
				});
			});
		});
	},
	
	postIndex: function() {
		var self = this;
	
		if(typeof this.req.body.tvDbId != 'undefined') {
			this.model.Show.createWithTvDbId(this.req.body.tvDbId, function(show) {
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
			type,
			self = this;
	
		if(!(query = this.input('query'))) {
			throw 'missing_required_param';
		}
			
		require('../lib/provider/data/' + this.req.params.type).search.call(this, query, function(media) {		
			self.response({ results: media });
		});
	}
	
};