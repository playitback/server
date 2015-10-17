var angular = require('angular');

module.exports = angular.module('playback.data')
    .factory('SettingModel', ['NgBackboneModel', function(NgBackboneModel) {
        return NgBackboneModel.extend({
            url: function() {
                if(!this.has('key')) {
                    throw 'Setting key not set. Cannot fetch without it.';
                }

                return '/setting/' + this.get('key');
            }
        });
    }]);