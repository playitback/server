var Sequelize = require('sequelize');

module.exports = function(sequelize) {
	
	return sequelize.define('Season', {
		number: {
			type: Sequelize.INTEGER
		},
		year: {
			type: Sequelize.INTEGER
		}
	});
	
}