module.exports = {
	
	indexAction: function() {
		this.view('media/index');
	},
	
	getSearch: function() {
		if(typeof this.req.param.query === 'undefined' || typeof this.req.param.type === 'undefined') {
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