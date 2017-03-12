const gulp = require('gulp')
const webpack = require('webpack')
const gulpWebpack = require('webpack-stream')
const gulpConcat = require('gulp-concat')
const gulpSass = require('gulp-sass')
const package = require('./package')


const webpackConfig = {
  output: {
    filename: `${package.name}-${package.version}.js`
  },
  // devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}

gulp.task('jsx', function () {
  return gulp.src('./web/index.js')
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest('./web/public/dist/'))
})

gulp.task('jsx-watch', function () {
  webpackConfig.watch = true
  return gulp.src('./web/index.js')
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest('./web/public/dist/'))
})

gulp.task('sass', function () {
  return gulp.src('./web/**/*.scss')
    .pipe(gulpSass.sync().on('error', gulpSass.logError))
    .pipe(gulpConcat(`${package.name}-${package.version}.css`))
    .pipe(gulp.dest('./web/public/dist/'))
})
