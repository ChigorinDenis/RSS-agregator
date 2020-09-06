const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry:`${__dirname}/src/index.js`,
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'template.html',
    }),
  ],
  devServer: {
    contentBase: './src',
    port: 8000,
  },
};

