const path = require('path');
const ExtensionReloader = require('webpack-extension-reloader');
const DefinePlugin = require('webpack').DefinePlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const frontendConfig = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  return {
    entry: {
      background: './frontend/src/background.ts',
      popup: './frontend/src/popup.tsx'
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
      path: path.join(__dirname, 'frontend', 'extension'),
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
        template: './frontend/src/popup.html',
        inject: false
      })
    ],
    devtool: isDevelopment ? 'inline-source-map' : 'source-map'
  }
}

// Shoutout https://medium.com/code-oil/webpack-javascript-bundling-for-both-front-end-and-back-end-b95f1b429810
const backendConfig = (env, argv) => {
  return {
    entry: './backend/src/app.ts',
    target: 'node',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.ts', '.tsx', '.js', '.jsx' ]
    },
    output: {
      path: path.join(__dirname, 'backend', 'out'),
      filename: '[name].js'
    },
    externals: [nodeExternals()]
  }
}

module.exports = [
  frontendConfig,
  backendConfig
]
