'use strict';

var Const = require('../../data/const');

var MediaInfoController = function($scope, $stateParams, MovieModel, ShowModel) {

    $scope.type = $stateParams.type;

    if ($scope.type == Const.Type.Movie) {
        $scope.media = new MovieModel({ id: $stateParams.mediaId });
    } else if ($scope.type == Const.Type.TV) {
        $scope.media = new ShowModel({ id: $stateParams.mediaId });
    }

    $scope.media.fetch();

};

MediaInfoController.$inject = ['$scope', '$stateParams', 'MovieModel', 'ShowModel'];

module.exports = MediaInfoController;