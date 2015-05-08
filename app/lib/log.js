/**
 * Created by nickbabenko on 08/05/15.
 */

var log = require('winston');

module.exports = function() {

    var config = this.get('config').get('log');

    // Reset for our config
    log.clear();

    if (typeof config.transports == 'object' && typeof config.transports.length == 'number') {
        for (var key in config.transports) {
            var info = config.transports[key];

            log.add(info.transport, info.options);
        }
    }

    if (typeof config.levels == 'object') {
        log.setLevels(config.levels);
    }

    if (typeof config.colors == 'object') {
        log.addColors(config.colors);
    }

    return log;

};