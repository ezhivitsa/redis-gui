const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');
const postcssImportJson = require('@daltontan/postcss-import-json');
const cssnano = require('cssnano');
const path = require('path');

module.exports = {
  plugins: [
    postcssImport({
      path: [
        path.join(__dirname, './src/renderer/styles')
      ]
    }),
    postcssNested,
    postcssImportJson(),
    postcssPresetEnv({
      stage: 2,
      features: {
        'custom-media-queries': true,
        'custom-properties': {
          preserve: false,
        }
      }
    }),
    cssnano({
      preset: ['default', {
        mergeRules: false
      }]
    })
  ]
};
