'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.addColumn('Posters', 'StillId', Sequelize.INTEGER);
        queryInterface.addColumn('Posters', 'PosterId', Sequelize.INTEGER);
        queryInterface.addColumn('Posters', 'BackdropId', Sequelize.INTEGER);
        queryInterface.removeColumn('Posters', 'MediumId');
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.removeColumn('Posters', 'StillId');
        queryInterface.removeColumn('Posters', 'PosterId');
        queryInterface.removeColumn('Posters', 'BackdropId');
        queryInterface.addColumn('Posters', 'MediumId', Sequelize.INTEGER);
    }
};
