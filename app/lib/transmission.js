/**
 * Created by nickbabenko on 25/01/15.
 */
var Transmission = require('transmission');

module.exports = function(app) {

    // TODO: configure from settings
    return new Transmission({
        host: 'localhost',
        port: 9091,
        url: '/transmission/rpc'
    });

};