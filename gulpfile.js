var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util');
  

/*
* Configuración de la tarea 'demo'
*/
gulp.task('controllers', function () {
    gulp.src(["trl/js/services/*.js", "trl/js/controllers/*.js"])
        .pipe(concat('vendors.js'))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('trl/dist/'))        
});

gulp.task('watch', function () {
    gulp.watch('trl/js/controllers/*.js', ['controllers']);
    gulp.watch('trl/js/services/*.js', ['services']);
});

gulp.task('default', ['controllers', 'watch']);