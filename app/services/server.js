var express = require('express'),
    expressLess = require('express-less'),
    bodyParser = require('body-parser');

module.exports = function() {

    var server = express();

    server.use(express.static(__dirname + '/../public'));
    server.use('/css', expressLess(__dirname + '/../public/less'));
    server.set('view engine', 'jade');
    server.set('views', __dirname + '/../views');
    server.use(bodyParser.urlencoded());
    server.use(bodyParser.json());

    this.get('log').debug('Playback server started and running on port 3030');

    return server;

};