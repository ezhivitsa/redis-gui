const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');
const postcssCustomProperties = require('postcss-custom-properties');

const cssnano = require('cssnano');

const mediaQueries = require('./src/renderer/mq.json');

module.exports = {
  plugins: [
    postcssImport({
      path: [
        './src/renderer/styles'
      ]
    }),
    postcssNested,
    postcssCustomProperties({preserve: false}),
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
