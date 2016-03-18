var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var del = require('del');

var fileList = require('./ngen_files.json');

var sourceFolder = './src';
var buildFolder = './build';
var distFolder = './dist';

/**
 * Default task, executed if the user does not specify an explicit one.
 */
gulp.task('default', [
    'babel'
]);


/**
 * Deletes all files inside the build folder.
 */
gulp.task('clean:build', function() {
    return del.sync([buildFolder + '/**/*'])
});


/**
 * Compiles all ES6 .js files using babel.js, which generates -compiled ES5 files.
 **/
gulp.task('babel', function() {
    return gulp.src(sourceFolder + '/**/*!(-compiled).js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(buildFolder));
});


gulp.task('concat', function() {
    // This is really horrible, will look up the right way to do it
    // in the future, some files need to be placed in a certain order
    // the ngen_files.json specifies that order.
    var concatList = fileList.map( e => {
        return buildFolder + '/' + e + '.js';
    });

    return gulp.src(concatList)
        .pipe(concat('ngen.js'))
        .pipe(gulp.dest(distFolder));
});
