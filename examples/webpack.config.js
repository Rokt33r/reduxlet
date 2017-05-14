const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [
    './examples/index.js'
  ],
  output: {
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx|\.js?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', {'modules': false}],
              'react',
              'stage-0'
            ],
            plugins: [
              ['transform-runtime', {
                'polyfill': false,
                'regenerator': true
              }]
            ]
          }
        }],
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin()
  ]
}
