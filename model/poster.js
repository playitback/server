var Sequelize = require('sequelize');

module.exports = function() {

	return this.sequelize.define('Poster', {
		url: {
			type: Sequelize.STRING
		}
	});

};