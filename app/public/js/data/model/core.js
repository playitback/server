var angular = require('angular'),
    Const = require('../const');

module.exports = angular.module('playback.data')
    .factory('CoreModel', ['NgBackboneModel', function(NgBackboneModel) {
        return NgBackboneModel.extend({

            /**
             *
             * @returns {string}
             */
            watchedStatusClassName: function() {
                var className = 'unwatched',
                    state = this.get('state');

                if(state == Const.State.Downloaded || this.has('stats')) {
                    // TV Shows - episode watched count
                    if(this.has('stats')) {
                        var stats = this.get('stats');

                        if(stats.episode_count == 0) {
                            className = 'wanted';
                        }
                        else if(stats.episode_count === stats.watched_count) {
                            className = 'watched';
                        }
                    }
                    else if(this.has('watch_status')) {
                        var watchStatus = this.get('watch_status'),
                            state = this.get('state');

                        if(watchStatus === Const.WatchStatus.Watched) {
                            className = 'watched';
                        }
                    }
                }
                else {
                    className = state;
                }

                return className;
            },

            /**
             *
             * @returns {*}
             */
            unWatchedCount: function() {
                if (this.has('download_progress')) {
                    return parseFloat(this.get('download_progress')).toFixed(2) + '%';
                }

                if(this.has('stats')) {
                    var stats = this.get('stats');

                    return (stats.episode_count - stats.watched_count);
                }

                return '';
            },

            /**
             *
             * @returns {*}
             */
            year: function() {
                if(this.has('first_aired')) {
                    return this.get('first_aired').format('YYYY');
                } else if(this.has('year')) {
                    return this.get('year');
                } else if (this.has('available_date')) {
                    return this.get('available_date').format('YYYY');
                }
            }

        });
    }]);