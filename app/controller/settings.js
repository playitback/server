module.exports = {

	getIndex: function() {
		var self = this;
	
		this.model.Setting.findAll().then(function(settings) {
			self.response({ settings: settings });
		});
	},

	postIndex: function() {
		var type = this.req.params.type,
			self = this;

		this.model.Setting.find({ where: { key: type }}).then(function(setting) {
			if (!setting) {
				setting = self.model.Setting.build({ key: type });
			}

			setting.set('value', self.req.body.value);
			setting.save().then(function() {
				self.response(setting);
			});
		});
	}

};