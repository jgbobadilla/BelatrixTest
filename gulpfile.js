//variables con los plugins que usaremos
var gulp = require('gulp'),
    sass = require('gulp-sass');

//tarea sass
gulp.task('sass', function(){

  //fuente de los archivos
  gulp.src('src/scss/**/*.scss')
    .pipe(
    sass({
      outputStyle: 'compact',
      sourceComments: true
    })
  ).pipe( gulp.dest('src/css/') );
});

//tarea default
gulp.task('default', function(){

  //accion que ejecuta y vigila el directorio con la tarea asociada
    gulp.watch('src/scss/**/*.scss', ['sass']);
});