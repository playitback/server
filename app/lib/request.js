/**
 * Created by nickbabenko on 08/02/15.
 */

module.exports = function(app, req, res, rootKey) {

    this.app = app;
    this.req = req;
    this.res = res;

    var ensureKeyCase = function(data) {
        if (!data || typeof data != 'object') {
            return data;
        }

        if (typeof data.length == 'number') {
            for (var key in data) {
                data[key] = ensureKeyCase(data[key]);
            }
        } else {
            for (var key in data) {
                var val = data[key];

                if (typeof val == 'object') {
                    val = ensureKeyCase(val);
                }

                var newKey = key
                    .replace(/\W+/g, '_')
                    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
                    .toLowerCase();

                delete data[key];

                data[newKey] = val;
            }
        }

        return data;
    };

    this.view = function(name, data) {
        res.render(name, data);
    };

    this.response = function(data, status) {
        if(typeof status === 'undefined') {
            status = 200;
        }

        if (typeof data == 'object' && this.rootKey) {
            var prefixedData = {};
            prefixedData[this.rootKey] = data;
            data = prefixedData;
        }

        data = ensureKeyCase(data);

        res.status(status).json(data);
    };

    this.errorResponse = function(error, status) {
        if(typeof status === 'undefined') {
            status = 400;
        }

        if(req.header('Accept').indexOf('text/html') > -1) {
            this.view('400', { error: error });
        }
        else {
            this.response({ error: error }, status);
        }
    };

    this.input = function(key) {
        var query = this.req.query;

        if(typeof query[key] != 'undefined') {
            return query[key];
        }

        return null;
    };

    this.addSubHttpRequest = function(request) {
        var removeRequest = function() {
            app.router.subHttpRequests.splice(app.router.subHttpRequests.indexOf(this), 1);
        };

        request.on('abort', function() {
            removeRequest();
        });
        request.on('complete', function() {
            removeRequest();
        });
        request.on('error', function() {
            removeRequest();
        });

        app.router.subHttpRequests.push(request);
    };

    this.outputImage = function(file) {
        res.sendFile(file, function(err) {
            if (err) {
                res.status(404).end();
            }
        });
    };

    return this;

};