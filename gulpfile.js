const path = require('path');
const gulp = require('gulp');
const pkg = require('./package.json');
const BundleHelper = require('maptalks-build-helpers').BundleHelper;
const Server = require('karma').Server;
const bundleHelper = new BundleHelper(Object.assign(pkg, {
    name: 'maptalks.minedata'
}));

gulp.task('build', () => {
    return bundleHelper.bundle('index.js');
});

gulp.task('minify', ['build'], () => {
    bundleHelper.minify();
});

gulp.task('watch', ['build'], () => {
    gulp.watch(['index.js', './gulpfile.js'], ['build']);
});

/**
 * Run test once and exit
 */
gulp.task('test', ['build'], function (done) {
    const karmaConfig = {
        configFile: path.join(__dirname, 'karma.config.js')
    };
    new Server(karmaConfig, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    const karmaConfig = {
        configFile: path.join(__dirname, 'karma.config.js')
    };
    gulp.watch(['index.js'], ['test']);
    let started = false;
    if (!started) {
        const karmaServer = new Server(karmaConfig, done);
        karmaServer.start();
        started = true;
    }
});

gulp.task('default', ['watch']);
