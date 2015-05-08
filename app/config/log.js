/**
 * Created by nickbabenko on 08/05/15.
 */

var winston = require('winston');

module.exports = {

    transports: [
        {
            transport: winston.transports.File,
            options: { filename: 'playback.log', level: 'debug' }
        },
        // TODO: Enable this for dev only
        {
            transport: winston.transports.Console,
            options: { level: 'debug', colorize: true }
        },
    ],
    colors: {
        debug: 'blue',
        info: 'green',
        warn: 'yellow',
        error: 'red'
    }

};