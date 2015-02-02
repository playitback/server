module.exports = {

	// Web
	'/': 											'default@index',
	'/media/search':								'media@search',
	'/media/:type':									'media@index',
	'/media/:type/:mediaId':						'media@index',
	'/media/:type/:mediaId/season/:seasonId':		'media@season',
	'/settings':									'settings@index',
	'/setting/:type':								'settings@index',

	// API
	'/api':											'api/index@index',
	'/api/media/:type':								'api/media@index',
	'/api/:type/:id':								'api/media@media',
	'/api/show/:id/seasons':						'api/show/index@seasons',
	'/api/show/:id/season/:id':						'api/show/season@index',
	'/api/show/:id/season/:id/episodes':			'api/show/season@episodes',
	'/api/show/:id/season/:id/episode/:id':			'api/show/season@episode'
	
};