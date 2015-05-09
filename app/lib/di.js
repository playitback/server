/**
 * Created by nickbabenko on 08/05/15.
 */

module.exports = function(appRoot) {

    var container = {},
        config = {},
        self = this;

    this.accessor = {
        get: function (reference) {
            if (typeof container[reference] == 'undefined') {
                container[reference] = loadWithReference(reference);
            }

            return container[reference] || null;
        },
        set: function (reference, instance) {
            if (typeof reference == 'object') {
                for (var ref in reference) {
                    self.accessor.set(ref, reference[ref]);
                }
            } else if (typeof reference == 'string' && typeof instance != 'undefined') {
                container[reference] = instance;

                self.extend(instance);
            } else {
                throw 'Incorrect usage of DI.set';
            }
        },
        container: function() {
            return self;
        }
    };

    this.extend = function(object) {
        for (var method in this.accessor) {
            object[method] = this.accessor[method];
        }
    };

    var loadWithReference = function(reference) {
        if (typeof config[reference] != 'undefined') {
            var instance = require(appRoot + '/' + config[reference]);

            // Instantiate, if required. Pass an app reference
            if (typeof instance == 'function') {
                // Extend proto, so they're instantly available
                instance.prototype = self.accessor;

                instance = new instance();
            }

            return instance;
        }

        return null;
    };

    var loadConfig = function() {
        config = require('../config/services');
    };

    loadConfig();

    this.extend(this);

};