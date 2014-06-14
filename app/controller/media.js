module.exports = {
	
	indexAction: function() {
		this.view('media/index');
	},
	
	getSearch: function() {	
		var query,
			type;
	
		if(!(query = this.input('query')) || !(type = this.input('type'))) {
			throw 'missing_required_param';
		}
	
		require(this.req.param.type).search.call(this, this.req.param.query, function(_results) {
			self.response({ results: results });
		});
	},
	
	postMedia: function() {
		//this.model.Media.create
	}
	
};