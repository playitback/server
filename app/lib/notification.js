/**
 * Created by nickbabenko on 29/01/15.
 */

var Prowl = require('node-prowl');

module.exports = function(app) {

    var services = [ 'prowl'],
        handlers = {
            prowl: {
                downloadStart: function(media) {
                    var prowl = new Prowl(app.settings.get(app.model.Setting.Key.Notification.prowl.ApiKey));

                    prowl.push('Download started ' + media.get('title'), 'Playback', function() {

                    });
                },
                downloadMoved: function() {

                }
            }
        };

    this.notifyOnDownloadStart = function(media) {
        for (var s in services) {
            var identifier = services[s];

            if (!app.settings.get(app.model.Setting.Key.Notification[identifier].Enabled) ||
                !app.settings.get(app.model.Setting.Key.Notification[identifier].DownloadStart) ||
                typeof app.settings.get(app.model.Setting.Key.Notification[identifier].ApiKey) != 'string' ||
                typeof handlers[identifier] != 'object' ||
                typeof handlers[identifier].downloadStart != 'function') {
                continue;
            }

            handlers[identifier].downloadStart(media);
        }
    };

};