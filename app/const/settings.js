/**
 * Created by nickbabenko on 25/01/15.
 */

module.exports = {
    General: {
        MediaDirectory:				'General.MediaDirectory',
        Username: 					'General.Username',
        Password: 					'General.Password',
        Port: 						'General.Port',
        CheckForUpdates: 			'General.CheckForUpdates'
    },
    Media: {
        DefaultQuality: {
            movie:                  'Media.DefaultQuality.Movie',
            tv:                     'Media.DefaultQuality.TV'
        },
        Renamer: {
            MoveRemaining:          'Media.Renamer.MoveRemaining'
        }
    },
    Notification: {
        prowl: {
            Enabled:                'Notification.Prowl.Enabled',
            DownloadStart:          'Notification.Prowl.DownloadStart',
            DownloadMoved:          'Notification.Prowl.DownloadMoved',
            ApiKey:                 'Notification.Prowl.ApiKey'
        }
    },
    Sync: {
        Dropbox: {
            Token: 					'Sync.Dropbox.Token'
        }
    }
};