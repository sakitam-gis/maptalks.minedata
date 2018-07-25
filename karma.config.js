const pkg = require('./package.json');

module.exports = function (config) {
    config.set({
        basePath: '.',
        frameworks: ['mocha', 'expect', 'expect-maptalks', 'happen'],
        client: {
            mocha: {
                timeout : 6000 * 10
            }
        },
        files: [
            'node_modules/maptalks/dist/maptalks.js',
            'lib/minemap.js',
            'dist/' + pkg.name + '.js',
            'test/**/*.js',
            {
                pattern: 'lib/*.css',
                included: true
            }, {
                pattern: 'lib/*.png',
                included: false
            }
        ],
        preprocessors: {},
        browsers: ['Chrome'],
        reporters: ['mocha'],
        customLaunchers: {
            IE10: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE10'
            },
            IE9: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE9'
            }
        },
        logLevel: config.LOG_INFO,
        singleRun: true
    });
};
