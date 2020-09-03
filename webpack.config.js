const HtmlWebpackPlugin = require('html-webpack-plugin');
//const fileURLToPath = require('url');
//const dirname = require('path');


//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

module.exports = {
  entry: `${__dirname}/src/index.js`,
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
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
  devServer: {  // configuration for webpack-dev-server
    contentBase: './src',  //source of static assets
    port: 8000, // port to run dev-server
  }, 
};