define('util', [
	'const/type', 'collection/media', 'collection/movie'], 
	function(Type, MediaCollection, MovieCollection) {
	
	return {
		collectionForType: function(type) {
			if(type == Type.TV) {
				return MediaCollection;
			}
			else if(type == Type.Movie) {
				return MovieCollection;
			}
		},
		
		modelForType: function(type) {
			return this.collectionForType(type).model;
		}
	};
	
});