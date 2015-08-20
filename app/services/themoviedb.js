/**
 * Created by nickbabenko on 08/05/15.
 */

var TheMovieDb = require('themoviedb');

module.exports = function() {

    return new TheMovieDb({
        apiKey: this.get('config').get('networks.theMovieDb.apiKey')
    });

};