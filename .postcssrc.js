const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');
const cssVariables = require('postcss-css-variables');

const cssnano = require('cssnano');

const mediaQueries = require('./src/mq.json');

module.exports = {
  plugins: [
    postcssImport({
      path: [
        './src/styles'
      ]
    }),
    postcssNested,
    cssVariables({preserve: 'computed'}),
    postcssPresetEnv({
      stage: 2,
      features: {
        'custom-media-queries': {
          importFrom: [
            {
              customMedia: mediaQueries
            }
          ]
        },
        'custom-properties': false
      }
    }),
    cssnano({
      preset: ['default', {
        mergeRules: false
      }]
    })
  ]
};
