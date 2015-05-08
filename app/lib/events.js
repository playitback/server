/**
 * Created by nickbabenko on 08/05/15.
 */

var events = require('events');

var Events = module.exports = function() {

    // Extend event emitter functionality
    Events.prototype.__proto__ = events.EventEmitter.prototype;

    return this;

};