var Sequelize = require('sequelize');

module.exports = function(sequelize) {

	return sequelize.define('Poster', {
		url: {
			type: Sequelize.STRING
		}
	});

};