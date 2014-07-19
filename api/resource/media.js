exports.index = function(req, res) {
	
	this.model.Media.getMediaForIndex(function(media) {
		res.json({ media: media });
	});
	
};

exports.create = function(req, res) {

	var remoteId = req.params.remote_id || null;
	
	if(!remoteId) {
		
	}
	
};