/**
 * Created by nickbabenko on 29/01/15.
 */

var Prowl = require('node-prowl');

module.exports = function(app) {

    var services = [ 'prowl'],
        handlers = {
            prowl: {
                handlerStore: null,
                handler: function() {
                    if (!handlers.prowl.handlerStore) {
                        handlers.prowl.handlerStore = new Prowl(
                            app.settings.get(app.model.Setting.Key.Notification.prowl.ApiKey)
                        );
                    }

                    return handlers.prowl.handlerStore;
                },
                downloadStart: function(media) {
                    var prowl = handlers.prowl.handler();

                    prowl.push('Download started ' + media.get('title'), 'Playback', function() { });
                },
                downloadMoved: function(media) {
                    var prowl = handlers.prowl.handler();

                    prowl.push('Download complete ' + media.get('title'), 'Playback', function() { });
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

    this.notifyOnDownladMoved = function(media) {
        for (var s in services) {
            var identifier = services[s];

            if (!app.settings.get(app.model.Setting.Key.Notification[identifier].Enabled) ||
                !app.settings.get(app.model.Setting.Key.Notification[identifier].DownloadMoved) ||
                typeof app.settings.get(app.model.Setting.Key.Notification[identifier].ApiKey) != 'string' ||
                typeof handlers[identifier] != 'object' ||
                typeof handlers[identifier].downloadMoved != 'function') {
                continue;
            }

            handlers[identifier].downloadMoved(media);
        }
    };

};