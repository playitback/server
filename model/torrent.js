var Sequelize = require('sequelize');

module.exports = function() {

	return this.sequelize.define('Torrent', {
		
	}, {
		instanceMethods: {
			download: function() {
				
			}
		}
	});
	
};