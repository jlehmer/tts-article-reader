const path = require('path');

const { readdirSync } = require('fs');

const execSync = require('child_process').execSync;
const FileManagerPlugin = require('filemanager-webpack-plugin');

const entry = readdirSync('src/handler')
  .filter(item => /\.(j|t)s$/.test(item))
  .filter(item => !/\.d.(t|j)s$/.test(item))
  .reduce((acc, filename) => ({
    ...acc,
    [filename.replace(/\.(j|t)s$/, '')]: `./src/handler/${filename}`
  }), {});

  const buildDir = 'dist';

  module.exports = {
    context: __dirname,
    devtool: 'source-map',
    entry,
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.(tsx?)$/,
          loader: 'ts-loader',
          exclude: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
          options: {
            transpileOnly: true,
            experimentalWatchApi: true
          }
        }
      ]
    },
    resolve: {
      extensions: ['.mjs', '.json', '.js', '.ts'],
      symlinks: false,
      cacheWithContext: false
    },
    target: 'node',
    optimization: {
      concatenateModules:false
    },
    output: {
      library: {
        type: 'commonjs',
        // path: path.join(__dirname, buildDir),
        // filename: '[name].js'
      } 
    },
    plugins: [
      new FileManagerPlugin({
        events: {
          onEnd: [
            {
              archive: [
                { source: buildDir, destination: `${buildDir}/handler.zip` }
              ]
            }
          ]
        }
      })
    ]
  }