var Sequelize = require('sequelize');

module.exports = function() {
	
	return this.sequelize.define('Season', {
		number: {
			type: Sequelize.INTEGER
		},
		year: {
			type: Sequelize.INTEGER
		}
	});
	
}