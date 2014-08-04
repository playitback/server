define('const/settings', [], {
	
	general: {
		title: 'General',
		schema: {
			general_auth_username: {
				title: 'Username',
				type: 'Text',
				help: 'Username used during authentication'
			},
			general_auth_password: {
				title: 'Password',
				type: 'Password',
				help: 'Password used during authentication'
			},
			general_port: {
				title: 'Port',
				type: 'Number',
				help: 'The port Playback runs on'
			},
			general_check_for_updates: {
				title: 'Check for updates',
				type: 'Checkbox',
				help: 'Check for updates every 12 hours'
			},
			
		}
	},
	searcher: {
		title: 'Searcher',
		schema: {
			searcher_proxy_server: {
				title: 'Proxy Server',
				type: 'Text',
				help: 'The PiratePay Proxy to be used'
			},
			searcher_seed_ratio: {
				title: 'Seed Ratio',
				type: 'Number',
				help: 'Will not remove the torrent until it reaches this ratio'
			},
			searcher_seed_time: {
				title: 'Seed Time',
				type: 'Number',
				help: 'The amount of time, in days, before a torrent is removed'
			},
			searcher_only_verified: {
				title: 'Only Verified',
				type: 'Checkbox',
				help: 'Only download from verified sources'
			}
		}
	},
	downloader: {
		title: 'Downloader',
		schema: {
			downloader_directory: {
				title: 'Directory',
				type: 'Text',
				help: 'Where to download media to. Supports type replacement e.g. /downloads/{type} will create /downloads/tv or /media/movies'
			},
			downloader_host: {
				title: 'IP',
				type: 'Text',
				help: 'IP of the machine running Transmission'
			},
			downloader_port: {
				title: 'Port',
				type: 'Number',
				help: 'Port used by Transmission'
			},
			downloader_rpc_url: {
				title: 'Rpc Url',
				type: 'Text',
				help: 'Rpc path used by Transmission. Defaults to transmission.'
			},
			downloader_username: {
				title: 'Username',
				type: 'Text',
				help: 'Username you gave to authenticate Transmission'
			},
			downloader_password: {
				title: 'Password',
				type: 'Password',
				help: 'Password you gave to authenticate Transmission'
			},
			downloader_remove_torrent: {
				title: 'Remove Torrent',
				type: 'Checkbox',
				help: 'When a torrent has finished seeding. Remove it from your download list.'
			}
		}
	},
	renamer: {
		title: 'Renamer',
		schema: {
			renamer_directory: {
				title: 'Directory',
				type: 'Text',
				help: 'Where to move the media to. Supports type replacement e.g. /media/{type} will create /media/tv or /media/movies'
			},
			renamer_movie_file_naming: {
				title: 'Movie File Naming',
				type: 'Text',
				help: 'Name of movie files'
			},
			renamer_tv_file_naming: {
				title: 'TV File Naming',
				type: 'Text',
				help: 'Name of TV files'
			}
		}
	},
	sync: {
		title: 'Sync',
		schema: {
			sync_enabled: {
				title: 'Status',
				type: 'Checkbox',
				help: 'If enabled, will sync all your media library with Dropbox. Will allow other applications access your library',
				key: '',
				value: function() {
					
				}
			}
		}
	}
	
});