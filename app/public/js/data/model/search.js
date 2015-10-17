var angular = require('angular'),
    moment = require('moment');

module.exports = angular.module('playback.data')
    .factory('SearchModel', ['NgBackboneModel', function(NgBackboneModel) {
        return NgBackboneModel.extend({

            parse: function(response) {
                if(typeof response.firstAired === 'string') {
                    response.firstAired = moment(response.firstAired);
                }
                else if(typeof response.availableDate === 'string') {
                    response.availableDate = moment(response.availableDate);
                }

                return response;
            },

            label: function() {
                return this.get('title');
            },

            year: function() {
                var year = '';

                if(this.has('year')) {
                    year = this.get('year');
                }
                else if(this.has('firstAired')) {
                    year = this.get('firstAired').format('YYYY');
                }
                else if(this.has('availableDate') && this.get('availableDate')) {
                    year = this.get('availableDate').format('YYYY');
                }

                return year;
            },

            mediaObject: function() {
                var type = this.get('type');

                if(type === Const.Type.TV) {
                    return new ShowModel(this.attributes);
                }
                else if(type === Const.Type.Movie) {
                    return new MovieModel(this.attributes);
                }
                else {
                    throw 'Invalid type';
                }
            }
        });
    }]);