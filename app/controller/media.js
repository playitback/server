var MediaController;

module.exports = {

	getIndex: function() {
		var type 		= this.req.params.type,
			model 		= this.model[type == 'tvshow' ? 'Show' : 'Movie'];
			_response 	= {};
					
		_response[type] = [];
				
		this.response(_response);
	},
	
	postIndex: function() {
		//this.model.Media.create
	},

	getSearch: function() {	
		var query,
			type,
			self = this;
	
		if(!(query = this.input('query'))) {
			throw 'missing_required_param';
		}
			
		require('../lib/provider/data/' + this.req.params.type).search.call(this, query, function(results) {
			self.response({ results: results });
		});
	}
	
};