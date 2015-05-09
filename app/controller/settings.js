module.exports = {

	getIndex: function() {
		var self = this,
            settingsModel = this.get('model.settings');

        settingsModel.findAll().then(function(settings) {
			self.response({ settings: settings });
		});
	},

	postIndex: function() {
		var type = this.req.params.type,
			self = this,
            settingsModel = this.get('model.settings');

        settingsModel.find({ where: { key: type }}).then(function(setting) {
			if (!setting) {
				setting = settingsModel.build({ key: type });
			}

			setting.set('value', self.req.body.value);
			setting.save().then(function() {
				self.response(setting);
			});
		});
	}

};