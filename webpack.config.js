const path = require('path')
const webpack = require('webpack')
const package = require('./package')

module.exports = {
  entry: './web/index.js',
  output: {
    path: path.resolve(__dirname, 'web', 'public', 'dist'),
    filename: `${package.name}-${package.version}.js`
  },
  //devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
  ]
}
