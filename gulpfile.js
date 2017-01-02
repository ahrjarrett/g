var gulp = require('gulp')
var browserSync = require('browser-sync').create()
var concat = require('gulp-concat')
var ghost = require('ghost')
var path = require('path')
var replace = require('gulp-replace')
var runSequence = require('run-sequence')
var sass = require('gulp-sass')
var symlink = require('gulp-sym')
var g


// this task should only be run ONCE for every `npm install`
// and BEFORE starting local ghost instance
gulp.task('init', ['symlink'], function(){
  return gulp.
    src('node_modules/ghost/core/server/data/schema/default-settings.json', { base: './' }).
    pipe(replace(/casper/g, 'throusse')).
    pipe(gulp.dest('./'))
})


gulp.task('browsersync', function(cb){
  browserSync.init({
    proxy: 'localhost:2368'
  })

  cb()
})


gulp.task('browsersync:reload', function(cb){
  browserSync.reload()

  cb()
})


gulp.task('ghost', ['ghost:start'], function(cb) {
  gulp.watch('app/**/*.hbs', ['browsersync:reload'])
  gulp.watch('app/assets/scss/**/*.scss', ['sass', 'browsersync:reload'])

  cb()
})


gulp.task('ghost:start', function(cb){
  runSequence('sass', function(){

    g = ghost({
      config: path.join(__dirname, './ghost-dev-config.js')
    })

    g.then(function(ghostServer){
      ghostServer.start().then(function(){
        runSequence('browsersync')
      })
    })

    cb()
  })
})


gulp.task('sass', function(){
  return gulp.
    src('app/assets/scss/**/*.scss').
    pipe(sass()).
    pipe(concat('screen.css')).
    pipe(gulp.dest('app/assets/css/'))
})


gulp.task('symlink', function() {
  return gulp.
    src('app').
    pipe(symlink('node_modules/ghost/content/themes/throusse', { force: true }))
})
