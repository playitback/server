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
        ext: [ 'iso', 'img' ],
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
        ext: [ 'mkv', 'm2ts', 'ts' ],
        tags: [ 'm2ts', 'x264', 'h264' ]
    }
};