module.exports = {

	getIndex: function() {
		var self = this;
	
		this.model.Setting.findAll()
			.success(function(settings) {
				self.response({ settings: settings });
			});
	}

};