var Sequelize = require('sequelize');

module.exports = function() {

	var Key = {
		General: {
			MediaDirectory:			'General.MediaDirectory',
			Username: 					'General.Username',
			Password: 					'General.Password',
			Port: 						'General.Port',
			CheckForUpdates: 			'General.CheckForUpdates'
		},
		Sync: {
			Dropbox: {
				Token: 					'Sync.Dropbox.Token'
			}
		}
	};

	return this.sequelize.define('Setting', {
		key: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		value: {
			type: Sequelize.STRING
		}
	}, {
		classMethods: {
			Key: Key,
			
			valueForKey: function(key, callback) {
				if(typeof key != 'string') {
					throw 'Invalid key specified';
				}
				
				if(typeof callback != 'function') {
					throw 'Invalid callback specified';
				}
				
				this.find({ where: { key: key }}).success(function(setting) {
					callback(setting ? setting.value : null);
				});
			},
			
			setValueWithKey: function(value, key, callback) {
				var self = this;
			
				this.find({ where: { key: key }}).success(function(setting) {
					if(setting) {
						setting.value = value;
						
						setting.save()
							.success(function() {
								callback(setting);
							});
					}
					else {
						self.create({
							key: key,
							value: value
						})
						.success(function(setting) {
							callback(setting);
						});
					}
				});
			}
		}
	});
	
};