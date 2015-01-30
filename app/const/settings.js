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
    Downloader: {
        transmission: {
            Host:                   'Downloader.Transmission.Host',
            RpcUrl:                 'Downloader.Transmission.RpcUrl',
            Username:               'Downloader.Transmission.Username',
            Password:               'Downloader.Transmission.Password'
        }
    },
    Media: {
        DefaultQuality: {
            movie:                  'Media.DefaultQuality.Movie',
            tv:                     'Media.DefaultQuality.TV'
        },
        Renamer: {
            MoveRemaining:          'Media.Renamer.MoveRemaining',
            Cleanup:                'Media.Renamed.Cleanup'
        }
    },
    Notification: {
        prowl: {
            Enabled:                'Notification.Prowl.Enabled',
            DownloadStart:          'Notification.Prowl.DownloadStart',
            DownloadRenamed:        'Notification.Prowl.DownloadRenamed',
            ApiKey:                 'Notification.Prowl.ApiKey'
        }
    },
    Sync: {
        Dropbox: {
            Token: 					'Sync.Dropbox.Token'
        }
    }
};