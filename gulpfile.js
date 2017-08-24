var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require("gulp-sourcemaps");
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var nodemon = require('gulp-nodemon');
var path = require('path');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('js', function() {
  return gulp.src('./app/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      stage: 0
    }))
    .pipe(concat('script_dist.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/dist/'))
    .pipe(reload({stream:true}));
});

gulp.task('sass', function() {
  return gulp.src('./app/sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({browsers: ['last 4 version']}),
      cssnano(),
    ]))
    .pipe(gulp.dest('./public/dist/'))
    .pipe(reload({stream:true}));
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: './bin/www',
    ext: '.js .pug',
    ignore: [
      'public/**/*.js',
      'node_modules/**/*.js'
    ],
    env: {
      'NODE_ENV': 'development',
    },
  }).on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  }).on('restart', function () {
    console.log('Nodemon restarted!');
  });
});

// gulp.task('browser-sync', ['nodemon'], function() {
  
//   browserSync.init({
//     proxy: process.env.IP,
//     port: process.env.PORT,
//   });
// });

gulp.task('build', ['js', 'sass']);

gulp.task('default', ['build', 'nodemon'], function () {
  gulp.watch('./app/sass/**/*.scss', ['sass']);
  gulp.watch('./app/js/**/*.js', ['js']);
  gulp.watch('./app/views/**/*.pug', reload);
});