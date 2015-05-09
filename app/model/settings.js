var Sequelize = require('sequelize');

module.exports = function() {

    var sequelize = this.get('sequelize');

	return sequelize.define('Setting', {
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
			Key: require(__dirname + '/../const/settings'),
			Defaults: require(__dirname + '/../const/settings.defaults'),
			
			valueForKey: function(key, callback) {
				if(typeof key != 'string') {
					throw 'Invalid key specified';
				}
				
				if(typeof callback != 'function') {
					throw 'Invalid callback specified';
				}
				
				this.find({ where: { key: key }}).then(function(setting) {
					callback(setting ? setting.value : null);
				});
			},
			
			setValueWithKey: function(value, key, callback) {
				var self = this;
			
				this.find({ where: { key: key }}).then(function(setting) {
					if(setting) {
						setting.value = value;
						
						setting.save().then(function() {
							callback(setting);
						});
					}
					else {
						self.create({
							key: key,
							value: value
						})
						.then(function(setting) {
							callback(setting);
						});
					}
				});
			}
		}
	});
	
};