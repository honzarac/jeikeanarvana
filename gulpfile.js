const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const css = () => {
  const postcss    = require('gulp-postcss')
    const sourcemaps = require('gulp-sourcemaps')
  
    return gulp.src('assets/*.css')
      .pipe( sourcemaps.init() )
      .pipe( postcss([require('autoprefixer'), require('tailwindcss')]) )
      .pipe( sourcemaps.write('.') )
      .pipe( gulp.dest('public/'))
      .pipe(browserSync.stream());
}

const refresh = () => {
  return () => {return browserSync.reload();};
}

gulp.task('css-watch', () => {
  browserSync.init({
    proxy: "localhost:3000"
  });
  gulp.watch('assets/*.css', css).on("change", browserSync.reload);
  gulp.watch('views/*.hbs').on("change", browserSync.reload);
});

gulp.task('css', css);