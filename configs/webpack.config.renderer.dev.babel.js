import path from 'path';
import fs from 'fs';

import { spawn, execSync } from 'child_process';

import webpack from 'webpack';
import chalk from 'chalk';
import { merge } from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../scripts/CheckNodeEnv';

function getEntries(name) {
  return [
    'core-js',
    'regenerator-runtime/runtime',
    require.resolve(`../src/windows/${name}/index.tsx`),
  ];
}

// When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's
// at the dev webpack config is not accidentally run in a production environment
if (process.env.NODE_ENV === 'production') {
  CheckNodeEnv('development');
}

const port = process.env.PORT || 1212;
const publicPath = `http://localhost:${port}/dist`;
const dllDir = path.join(__dirname, '../dll');
const manifest = path.resolve(dllDir, 'renderer.json');
const requiredByDLLConfig = module.parent.filename.includes(
  'webpack.config.renderer.dev.dll'
);

/**
 * Warn if the DLL is not built
 */
if (!requiredByDLLConfig && !(fs.existsSync(dllDir) && fs.existsSync(manifest))) {
  console.log(
    chalk.black.bgYellow.bold(
      'The DLL files are missing. Sit back while we build them for you with "yarn build-dll"'
    )
  );
  execSync('yarn postinstall');
}

export default merge(baseConfig, {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'electron-renderer',

  entry: {
    main: getEntries('main'),
  },

  output: {
    publicPath: `http://localhost:${port}/dist/`,
    filename: '[name].renderer.dev.js',
  },

  resolve: {
    alias: {
      // External aliases
      'react-dom': '@hot-loader/react-dom',
    }
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
          },
        ],
      },
      // css support
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false
            }
          }
        ]
      },
      // PCSS support
      {
        test: /\.pcss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: '@teamsupercell/typings-for-css-modules-loader',
            options: {
              disableLocalsExport: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                mode: 'local',
                localIdentName: '[local]--[hash:base64:5]',
                exportLocalsConvention: 'dashesOnly',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                config: path.resolve(__dirname, '../.postcssrc.js'),
              },
            },
          },
        ],
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/inline'
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/inline'
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        type: 'asset/inline'
      },
    ],
  },
  plugins: [

    requiredByDLLConfig
      ? null
      : new webpack.DllReferencePlugin({
          context: path.join(__dirname, '../dll'),
          manifest: require(manifest),
          sourceType: 'var',
        }),

    new webpack.NoEmitOnErrorsPlugin(),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     *
     * By default, use 'development' as NODE_ENV. This can be overriden with
     * 'staging', for example, by changing the ENV variables in the npm scripts
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),

    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: './tsconfig.json',
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },

  devServer: {
    host: 'localhost',
    port,
    compress: true,
    devMiddleware: {
      publicPath,
      stats: 'errors-only',
    },
    hot: true,
    allowedHosts: 'all',
    // headers: { 'Access-Control-Allow-Origin': '*' },
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 100,
      },
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    onBeforeSetupMiddleware() {
      console.log('Starting Main Process...');
        spawn('make', ['start-main'], {
          shell: true,
          env: process.env,
          stdio: 'inherit',
        })
          .on('close', (code) => process.exit(code))
          .on('error', (spawnError) => console.error(spawnError));
    },
  },
});
