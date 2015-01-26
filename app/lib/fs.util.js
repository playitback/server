/**
 * Created by nickbabenko on 26/01/15.
 */
var fs = require('fs'),
    path = require('path');

module.exports = {

    mkdirParent: function(dirPath, mode, callback) {
        var self = this;

        //Call the standard fs.mkdir
        fs.mkdir(dirPath, mode, function(error) {
            //When it fail in this way, do the custom steps
            if (error && error.errno === 34) {
                //Create all the parents recursively
                self.mkdirParent(path.dirname(dirPath), mode, function() {
                    //And then the directory
                    self.mkdirParent(dirPath, mode, callback);
                });
            }
            else {
                //Manually run the callback since we used our own callback to do all these
                callback && callback(error);
            }
        });
    }

};