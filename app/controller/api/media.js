/**
 * Created by nickbabenko on 02/02/15.
 */

module.exports = {

    /**
     * Returns an array of all media in the library
     *
     * @route /api/media/:type
     * @param {string} type The type of media to return
     * @returns {*}
     */
    indexAction: function() {
        var self = this,
            model = this.get('model'),
            posterModel = this.get('model.poster'),
            mediaModel;

        try {
            mediaModel = model.mediaModelWithType(this.req.params.type);
        } catch (e) {
            return this.errorResponse('Invalid type');
        }

        mediaModel.findAll({ include: [
            {
                model: posterModel,
                as: 'poster'
            }
        ] }).then(function(media) {
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

        var self = this,
            model = this.get('model'),
            mediaModel;

        try {
            mediaModel = model.mediaModelWithType(this.req.params.type);
        } catch (e) {
            return this.errorResponse('Invalid type');
        }

        mediaModel.findById(this.req.params.id, { include: [
            {
                model: this.get('model.poster'),
                as: 'poster'
            }
        ] }).then(function(media) {
            if (media) {
               self.response(media);
            }
            else {
                self.errorResponse('Media not found', 404);
            }
        });

    }

};