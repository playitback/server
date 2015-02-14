/**
 * Created by nickbabenko on 14/02/15.
 */

var BinaryServer = require('binaryjs').BinaryServer;
var Transcoder = require('stream-transcoder');
var fs = require('fs');

module.exports = function(app) {

    var TAG = 'StreamCoder: ';
    var port = 3031;

    var server = new BinaryServer({ port: port });

    server.on('connection', function(client) {
        app.log.debug(TAG + 'New stream connection');

        client.on('stream', function(stream, meta) {
            app.log.debug(TAG + 'New stream started for media with ID: ' + meta.mediaId);

            app.model.Media.find({ where: { id: meta.mediaId }}).then(function(media) {
                if (!media) {
                    app.log.debug(TAG + 'Media not found, can\'t stream');

                    stream.end();
                } else {
                    app.log.debug(TAG + 'Starting media stream for media with ID: ' + media.id);

                    var direct = true;

                    var mediaFile = '/Users/nickbabenko/Sites/Projects/MediaManager/Server/media/movie/Guardians of the Galaxy (2014)/Guardians of the Galaxy.mp4'; //media.mediaDirectory();
                    var fileStream = fs.createReadStream(mediaFile);

                    if (direct) {
                        stream.pipe(fileStream);
                    } else {
                        // TODO: Add device profile support
                        new Transcoder(fileStream)
                            .maxSize(320, 240)
                            .videoCodec('h264')
                            .videoBitrate(800 * 1000)
                            .fps(25)
                            .audioCodec('libfaac')
                            .sampleRate(44100)
                            .channels(2)
                            .audioBitrate(128 * 1000)
                            .format('mp4')
                            .on('finish', function() {
                                stream.end();
                            })
                            .stream().pipe(stream);
                    }
                }
            });

        });
    });

    app.log.debug(TAG + 'Streamcode running on port ' + port);

};