const pkg = require('./package.json')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  target: 'web',

  entry: [
    './web/index.js',
    './web/stylesheets/app.scss'
  ],

  output: {
    path: __dirname + '/web/public',
    publicPath: '/',
    filename: `dist/${pkg.name}-${pkg.version}.min.js`
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: {
                  version: 3
                },
                targets: {
                  browsers: [
                    '> 1% in FR',
                    'ie >= 10'
                  ]
                }
              }
            ],
            '@babel/preset-react'
          ],
          plugins: [
            '@babel/plugin-transform-modules-commonjs'
          ]
        }
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  __dirname + '/web/stylesheets'
                ]
              }
            }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.jsx']
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `dist/${pkg.name}-${pkg.version}.min.css`
    })
    // new webpack.HotModuleReplacementPlugin()
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],

  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  },

  stats: {
    assets: true,
    children: false,
    chunks: false,
    cached: false,
    colors: true,
    hash: false,
    modules: false,
    version: false
  }
}
