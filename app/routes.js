module.exports = {

	'/': 												'default@index',
	'/media/search':									'media@search',
	'/media/:type':									'media@index',
	'/media/:type/:mediaId':							'media@index',
	'/media/:type/:mediaId/season/:seasonId':		'media@season'
	
};