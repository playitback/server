/**
 * Created by nickbabenko on 08/05/15.
 */

module.exports = function() {

    return new TheMovieDB({
        apiKey: this.get('config').get('networks.theMovieDb.apiKey')
    });

};