const path = require('path');
const ExtensionReloader = require('webpack-extension-reloader');
const EnvironmentPlugin = require('webpack').EnvironmentPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');

module.exports = (env, argv) => {
  dotenv.config();
  const isDevelopment = argv.mode === 'development';
  return {
    entry: {
      background: './src/background.ts',
      popup: './src/popup.tsx'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: require.resolve('webextension-polyfill'),
          use: [{
            loader: 'expose-loader',
            options: 'browser'
          }]
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
        }
      ]
    },
    resolve: {
      extensions: [ '.ts', '.tsx', '.js', '.jsx' ]
    },
    output: {
      path: path.join(__dirname, 'extension'),
      filename: '[name].js'
    },
    plugins: [
      new EnvironmentPlugin(
        ['SERVER_URL', 'USE_RECAPTCHA', 'RECAPTCHA_SITEKEY', 'MAX_COMMENT_LENGTH', 'MAX_COMMENT_DEPTH_TO_INDENT']
      ),
      /* If we're in development, use the ExtensionReloader. 
       * The weird syntax is from here: http://2ality.com/2017/04/conditional-literal-entries.html */
      ...(isDevelopment ?
        [
          new ExtensionReloader({
            entries: {
              background: 'background',
              popup: 'popup'
            }
          }) 
        ] : []
      ),
      new HtmlWebpackPlugin({
        title: 'Tabchat',
        filename: 'popup.html',
        template: 'src/popup.html',
        inject: false
      })
    ],
    devtool: isDevelopment ? 'inline-source-map' : 'source-map'
  }
}
