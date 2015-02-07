/**
 * Created by nickbabenko on 07/02/15.
 */

var lwip = require('lwip');
var md5 = require('MD5');
var fs = require('fs');
var http = require('http');
var request = require('request');

module.exports = {

    getImage: function() {
        var url = this.req.query.url;
        var profileRef = this.req.query.profile;
        var profile = this.app.config.get('images.' + profileRef);

        if (typeof url != 'string') {
            return this.errorResponse('Invalid image url');
        }
        if (!profile) {
            return this.errorResponse('Invalid or unsupported image profile');
        }

        var urlHash = md5(url);
        var extension = url.split('.').slice(-1)[0];
        var outputFile = __dirname + '/../../cache/assets/images/' + urlHash + '-' + profileRef + '.' + extension;
        var self = this;

        fs.exists(outputFile, function(exists) {
            if (exists) {
                self.res.attachment(outputFile);
            }
            else {
                request(url).pipe(fs.createWriteStream(outputFile)).on('close', function() {
                    lwip.open(outputFile, function(err, image) {
                        var ratio = (image.width() < image.height() ?
                            (image.height() / image.width()) :
                            (image.width() / image.height()));

                        if(typeof profile.height != 'number') {
                            profile.height = (ratio * profile.width);
                        }

                        image.batch()
                            .resize(profile.width, profile.height)
                            .writeFile(outputFile, function(err) {
                                self.res.attachment(outputFile);
                            });
                    });
                });
            }
        });
    }

};