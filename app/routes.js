module.exports = {

	'/': 								'default@index',
	'/media/:showId':					'media@index',
	'/media/:showId/season/:seasonId':	'media@season'
	'/media/:type':						'media@index',
	'/media/:type/search':				'media@search'
	
}