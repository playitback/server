/**
 * Created by nickbabenko on 08/05/15.
 */

module.exports = function() {

    var container = {},
        config = {},
        self = this.

    self.accessor = {
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
        }
    };

    this.extend = function(object) {
        for (var method in this.accessor) {
            object[method] = this.accessor[method];
        }
    };

    var loadWithReference = function(reference) {
        if (typeof config[reference] != 'undefined') {
            var instance = require(config[reference]);

            // Instantiate, if required. Pass an app reference
            if (typeof instance == 'function') {
                instance = new instance();
            }

            // If we have a valid object, make it accessible
            if (typeof instance == 'object') {
                self.extend(instance);
            }

            return instance;
        }

        return null;
    };

    var loadConfig = function() {
        config = require('../config/services');
    };

    loadConfig();

};