module.exports = {

	getIndex: function() {
		var self = this;
	
		this.model.Setting.findAll()
			.done(function(settings) {
				self.response({ settings: settings });
			});
	},

	postIndex: function() {

	}

};