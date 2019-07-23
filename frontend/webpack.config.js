const path = require('path');
const ExtensionReloader = require('webpack-extension-reloader');
const DefinePlugin = require('webpack').DefinePlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
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
      new DefinePlugin({
        'SERVER_URL': `'${process.env.SERVER_URL || 'http://localhost:3000'}'`,
        'USE_RECAPTCHA': `${process.env.USE_RECAPTCHA !== undefined}`,
        "RECAPTCHA_SITEKEY": `'${process.env.RECAPTCHA_SITEKEY}'`
      }),
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
