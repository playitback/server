module.exports = {

	'/': 										'default@index',
	'/media/search':							'media@search',
	'/media/:type/:mediaId':					'media@index',
	'/media/:type/:mediaId/season/:seasonId':	'media@season',
	'/media/:type':								'media@index',
	
};