'use strict';

require('../../data/collection/movie');
require('../../data/collection/show');

var Const = require('../../data/const');

var MediaController = function($scope, $stateParams, MovieCollection, ShowCollection) {

    $scope.type = $stateParams.type;

    // Load collection based on type
    if($scope.type === Const.Type.TV) {
        $scope.media = new ShowCollection();
    } else if($scope.type === Const.Type.Movie) {
        $scope.media = new MovieCollection();
    }

    // Perform initial media fetch
    $scope.media.fetch();

};

MediaController.$inject = ['$scope', '$stateParams', 'MovieCollection', 'ShowCollection'];

module.exports = MediaController;