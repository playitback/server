/**
 * Created by nickbabenko on 24/01/15.
 */

module.exports = {
    'bd50': {
        hd: true,
        allow3d: true,
        size: [ 20000, 60000 ],
        medianSize: 40000,
        label: 'BR-Disk',
        alternative: [
            'bd25',
            [ 'br', 'disk' ]
        ],
        allow: [
            '1080p'
        ],
        extensions: [ 'iso', 'img' ],
        tags: [ 'bdmv', 'certificate', [ 'complete', 'bluray' ], 'avc', 'mvc' ]
    },
    '1080p': {
        hd: true,
        allow3d: true,
        size: [ 4000, 20000 ],
        medianSize: 10000,
        label: '1080p',
        width: 1920,
        height: 1080,
        alternative: [],
        allow: [],
        extensions: [ 'mkv', 'm2ts', 'ts' ],
        tags: [ 'm2ts', 'x264', 'h264' ]
    },
    '720p': {
        hd: true,
        allow3d: true,
        size: [ 3000, 10000 ],
        medianSize: 5500,
        label: '720p',
        width: 1280,
        height: 720,
        alternative: [],
        allow: [],
        extensions: [ 'mkv', 'ts' ],
        tags: [ 'x264', 'h264' ]
    }
};
// TODO add SD qualities