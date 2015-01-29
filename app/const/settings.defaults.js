/**
 * Created by nickbabenko on 25/01/15.
 */

var keys = require('./settings');

var Defaults = {};

// General
Defaults[keys.General.MediaDirectory] = process.cwd() + '/media';

// Media
Defaults[keys.Media.DefaultQuality.movie] = '1080p';
Defaults[keys.Media.DefaultQuality.tv] = '720p';
Defaults[keys.Media.Renamer.MoveRemaining] = false;

// Notification
Defaults[keys.Notification.prowl.Enabled] = true;
Defaults[keys.Notification.prowl.DownloadStart] = true;
Defaults[keys.Notification.prowl.DownloadMoved] = true;
Defaults[keys.Notification.prowl.ApiKey] = 'e6ecf1075b79f637fb5cb7a0ffe9c9c904ff8b6c';

module.exports = Defaults;