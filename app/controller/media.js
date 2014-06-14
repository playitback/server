module.exports = {
	
	indexAction: function() {
		this.view('media/index');
	},
	
	getSearch: function() {	
		var query,
			type,
			self = this;
	
		if(!(query = this.input('query')) || !(type = this.input('type'))) {
			throw 'missing_required_param';
		}
			
		require('../lib/searcher/' + type).search.call(this, query, function(results) {
			self.response({ results: results });
		});
	},
	
	postMedia: function() {
		//this.model.Media.create
	}
	
};