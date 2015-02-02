/**
 * Created by nickbabenko on 02/02/15.
 */

module.exports = {

    /**
     * Returns an array of all media in the library
     *
     * @route /api/media/:type
     * @param type The type of media to return
     * @returns {*}
     */
    indexAction: function() {

        var self = this,
            model = this.app.model.modelForType(this.req.params.type);

        // Check for a valid model
        if (!model) {
            return this.errorResponse('Invalid type');
        }

        model.findAll().then(function(media) {
            self.response(media);
        });

    },

    /**
     * Returns a single media object
     *
     * @route /api/:type/:id
     * @param {string} type The type of media to return
     * @param {int} id the unique identifier of the media to return
     * @returns {*}
     */
    mediaAction: function() {

        var self = this;
        var model = this.app.model.modelForType(this.req.params.type);

        // Check for a valid model
        if (!model) {
            return this.errorResponse('Invalid type');
        }

        model.find(this.req.params.id).then(function(media) {
            if (media) {
               self.response(media);
            }
            else {
                self.errorResponse('Media not found', 404);
            }
        });
    }

};