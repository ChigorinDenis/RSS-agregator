import HtmlWebpackPlugin from 'html-webpack-plugin'; //// eslint-disable-line no-use-before-define
export const entry = `${__dirname}/src/index.js`;
export const output = {
  path: `${__dirname}/dist`,
  filename: 'bundle.js',
};
export const mode = process.env.NODE_ENV || 'development';
export const module = {
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
};
export const plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'template.html',
  }),
];
export const devServer = {
  contentBase: './src',
  port: 8000,
};