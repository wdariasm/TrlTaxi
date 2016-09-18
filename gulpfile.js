var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util');
  

/*
* Configuración de la tarea 'demo'
*/
gulp.task('controllers', function () {
    gulp.src(["trl/js/session.js", "trl/js/services/*.js", "trl/js/controllers/*.js", "trl/js/libs/funciones.js"])
        .pipe(concat('vendors.js'))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('trl/dist/'));        
});

gulp.task('watch', function () {
    gulp.watch('trl/js/controllers/*.js', ['controllers']);    
});

gulp.task('ctrlCliente', function () {
    gulp.src(["trl/js/session.js", "trl/js/libs/funciones.js", "cliente/js/services/*.js", "cliente/js/controllers/*.js"])
    .pipe(concat('vendors.js'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('cliente/dist/'));
});

gulp.task('watch1', function () {
    gulp.watch('cliente/js/controllers/*.js', ['ctrlCliente']);    
});

gulp.task('ctrlConductor', function () {
    gulp.src(["trl/js/libs/funciones.js", "conductor/js/services/*.js", "conductor/js/controllers/*.js", "trl/js/session.js"])
    .pipe(concat('vendors.js'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('conductor/dist/'));
});

gulp.task('watch2', function () {
    gulp.watch('conductor/js/controllers/*.js', ['ctrlConductor']);    
});

gulp.task('default', ['controllers', 'watch']);

gulp.task('cliente', ['ctrlCliente', 'watch1']);

gulp.task('conductor', ['ctrlConductor', 'watch2']);